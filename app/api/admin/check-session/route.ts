import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (error || !user) {
      return NextResponse.json({
        sessionRecognized: false,
      });
    }

    return NextResponse.json({
      sessionRecognized: true,
      isAdmin: user.app_metadata?.role === "admin",
      rolePresent: Boolean(user.app_metadata?.role),
    });
  } catch {
    return NextResponse.json(
      { diagnosticFailed: true },
      { status: 500 }
    );
  }
}
