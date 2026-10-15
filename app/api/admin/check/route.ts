import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json(
        { authenticated: false, isAdmin: false },
        { status: 401 },
      );
    }

    const isAdmin = data.user.app_metadata?.role === "admin";

    return NextResponse.json({
      authenticated: true,
      isAdmin,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to check admin access." },
      { status: 500 },
    );
  }
}
