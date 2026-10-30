"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { createClient } from "@supabase/supabase-js";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  media_type: "ebook" | "photo" | "video";
  mime_type: string;
  file_size: number;
  is_published: boolean;
  created_at: string;
  signed_url: string | null;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);


  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load media.");
      setItems(data.items || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || "");
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    } catch {
      setMessage("Configure your Supabase environment variables before signing in.");
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (signedIn) void loadItems();
  }, [signedIn, loadItems]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = `${item.title} ${item.category} ${item.description}`
        .toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "published" && item.is_published) ||
        (filter === "drafts" && !item.is_published) ||
        item.media_type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSigningIn(true);
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await checkSession();
      setMessage("Signed in. Checking administrator permissions…");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setSigningIn(false);
    }
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setSignedIn(false);
    setUserEmail("");
    setItems([]);
    setMessage("You have signed out.");
  }

  async function updateItem(item: MediaItem, changes: Record<string, unknown>) {
    setBusyId(item.id);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed.");
      setItems((old) => old.map((entry) => entry.id === item.id ? { ...entry, ...data.item } : entry));
      setEditing(null);
      setMessage("Media updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteItem(item: MediaItem) {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;
    setBusyId(item.id);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setItems((old) => old.filter((entry) => entry.id !== item.id));
      setMessage("Media deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusyId("");
    }
  }


  async function uploadMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setMessage("Choose a file to upload.");
      return;
    }

    const mediaType = String(form.get("media_type") || "");
    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "").trim();
    const description = String(form.get("description") || "").trim();

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const fallbackTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      mp4: "video/mp4",
      webm: "video/webm",
    };
    const mimeType = file.type || fallbackTypes[extension] || "";

    const allowedTypes: Record<string, string[]> = {
      ebook: ["application/pdf"],
      photo: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      video: ["video/mp4", "video/webm"],
    };

    if (!title || !category) {
      setMessage("Enter a title and category.");
      return;
    }

    if (!allowedTypes[mediaType]?.includes(mimeType)) {
      setMessage("That file type does not match the selected media type.");
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setMessage("The file exceeds the 500 MB limit.");
      return;
    }

    setUploading(true);
    setMessage("Preparing secure upload…");

    try {
      const permissionResponse = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          file_size: file.size,
          mime_type: mimeType,
          media_type: mediaType,
        }),
      });

      const permission = await permissionResponse.json();

      if (!permissionResponse.ok) {
        throw new Error(permission.error || "Could not prepare upload.");
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) {
        throw new Error("Supabase browser configuration is missing.");
      }

      setMessage("Uploading file…");
      const browserClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: uploadError } = await browserClient.storage
        .from("media")
        .uploadToSignedUrl(permission.path, permission.token, file, {
          contentType: mimeType,
        });
      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      setMessage("Saving media details…");

      const saveResponse = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          object_path: permission.path,
          media_type: mediaType,
          mime_type: mimeType,
          file_size: file.size,
        }),
      });

      const saved = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saved.error || "File uploaded, but its details could not be saved.");
      }

      formElement.reset();
      setMessage("Upload successful. Your new media is saved as a draft.");
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const published = items.filter((item) => item.is_published).length;
  const drafts = items.length - published;
  const photos = items.filter((item) => item.media_type === "photo").length;
  const ebooks = items.filter((item) => item.media_type === "ebook").length;
  const videos = items.filter((item) => item.media_type === "video").length;

  if (!signedIn) {
    return (
      <main className="login-screen">
        <form className="login-card" onSubmit={signIn}>
          <div className="brand-mark">AU</div>
          <p className="eyebrow">AFRICA UNITED FOR DISCIPLESHIP & MISSIONS</p>
          <h1>Admin portal</h1>
          <p className="muted">Sign in with your AUDMissions administrator account.</p>
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          <button className="primary full" disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in securely"}
          </button>
          {message && <p className="notice">{message}</p>}
          <p className="login-foot">Authorized administrators only</p>
        </form>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand-row"><span className="brand-mark small">AU</span><div><strong>AUDMISSIONS</strong><small>ADMIN CONSOLE</small></div></div>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav-active">▦ &nbsp; Overview</div>
        <div className="nav-item">▤ &nbsp; Media library</div>
        <div className="nav-item">◉ &nbsp; Publishing</div>
        <div className="sidebar-bottom"><span className="status-dot" /> Media service<br /><small>Protected workspace</small></div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div><span className="muted">Workspace / </span><strong>Overview</strong></div>
          <div className="account"><span className="avatar">{userEmail.slice(0, 1).toUpperCase() || "A"}</span><span>{userEmail}</span><button className="quiet" onClick={signOut}>Sign out</button></div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div><p className="eyebrow">MEDIA MANAGEMENT</p><h1>Dashboard overview</h1><p className="muted">Manage the digital resources shared with your community.</p></div>
            <button className="primary" onClick={() => void loadItems()}>↻ &nbsp; Refresh data</button>
          </div>

          {message && <div className="notice">{message}</div>}

          <div className="stats-grid">
            <article className="stat-card"><span className="stat-icon purple">▤</span><p>Total media</p><strong>{items.length}</strong><small>All resource items</small></article>
            <article className="stat-card"><span className="stat-icon green">✓</span><p>Published</p><strong>{published}</strong><small>Visible to visitors</small></article>
            <article className="stat-card"><span className="stat-icon amber">◷</span><p>Drafts</p><strong>{drafts}</strong><small>Not yet published</small></article>
            <article className="stat-card"><span className="stat-icon blue">▧</span><p>Photos</p><strong>{photos}</strong><small>{ebooks} eBooks · {videos} videos</small></article>
          </div>

          <section className="library-card upload-card">
            <div className="library-heading">
              <div>
                <h2>Upload new media</h2>
                <p className="muted">Add a photo, video, or PDF e-book. New uploads start as drafts.</p>
              </div>
            </div>

            <form className="upload-form" onSubmit={uploadMedia}>
              <div className="upload-grid">
                <div>
                  <label>Media type</label>
                  <select name="media_type" defaultValue="photo" required>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="ebook">PDF e-book</option>
                  </select>
                </div>
                <div>
                  <label>Title</label>
                  <input name="title" required maxLength={160} placeholder="Resource title" />
                </div>
                <div>
                  <label>Category</label>
                  <input name="category" required maxLength={80} placeholder="e.g. Youth conferences" />
                </div>
                <div>
                  <label>Select file</label>
                  <input
                    name="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.mp4,.webm"
                    required
                  />
                  <small>Maximum 500 MB. Large videos may need a resumable upload.</small>
                </div>
              </div>
              <div>
                <label>Description (optional)</label>
                <textarea name="description" maxLength={2000} rows={3} placeholder="Describe this resource…" />
              </div>
              <button className="primary" type="submit" disabled={uploading}>
                {uploading ? "Uploading…" : "Upload media"}
              </button>
            </form>
          </section>

          <section className="library-card">
            <div className="library-heading"><div><h2>Media library</h2><p className="muted">Review, publish, edit or remove resources.</p></div><span className="count-pill">{visibleItems.length} items</span></div>
            <div className="toolbar">
              <input className="search-input" placeholder="Search by title or category…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All media</option><option value="published">Published</option><option value="drafts">Drafts</option><option value="ebook">eBooks</option><option value="photo">Photos</option><option value="video">Videos</option>
              </select>
            </div>

            {loading ? <div className="empty-state">Loading media library…</div> : visibleItems.length === 0 ? <div className="empty-state"><span>▤</span><h3>No media found</h3><p>There are no matching items, or no media has been added yet.</p></div> :
              <div className="media-list">{visibleItems.map((item) => (
                <article className="media-row" key={item.id}>
                  <div className={`file-icon ${item.media_type}`}>{item.media_type === "ebook" ? "PDF" : item.media_type === "photo" ? "IMG" : "VID"}</div>
                  <div className="media-info"><strong>{item.title}</strong><span>{item.category} · {formatSize(item.file_size)}</span><small>{new Date(item.created_at).toLocaleDateString()}</small></div>
                  <span className={`status-pill ${item.is_published ? "published" : "draft"}`}>{item.is_published ? "Published" : "Draft"}</span>
                  <div className="row-actions">
                    {item.signed_url && <a className="action-link" href={item.signed_url} target="_blank" rel="noreferrer">Preview</a>}
                    <button className="quiet" disabled={busyId === item.id} onClick={() => setEditing(item)}>Edit</button>
                    <button className="quiet" disabled={busyId === item.id} onClick={() => void updateItem(item, { is_published: !item.is_published })}>{item.is_published ? "Unpublish" : "Publish"}</button>
                    <button className="danger" disabled={busyId === item.id} onClick={() => void deleteItem(item)}>Delete</button>
                  </div>
                </article>
              ))}</div>
            }
          </section>
          <footer>AUDMissions Admin Console · Secure media management</footer>
        </div>
      </section>

      {editing && <div className="modal-backdrop"><form className="edit-modal" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void updateItem(editing, { title: form.get("title"), description: form.get("description"), category: form.get("category") }); }}>
        <h2>Edit media</h2><p className="muted">Update the resource details.</p>
        <label>Title</label><input name="title" defaultValue={editing.title} maxLength={160} required />
        <label>Category</label><input name="category" defaultValue={editing.category} maxLength={80} required />
        <label>Description</label><textarea name="description" defaultValue={editing.description} maxLength={2000} rows={4} />
        <div className="modal-actions"><button type="button" className="quiet" onClick={() => setEditing(null)}>Cancel</button><button className="primary" disabled={busyId === editing.id}>Save changes</button></div>
      </form></div>}
    </main>
  );
}
