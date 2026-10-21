import { NextResponse, type NextRequest } from "next/server";
import { getCreator } from "@/lib/api/creators";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in to view creator profiles." },
      { status: 401 }
    );
  }

  // First try authorized getCreator (checks brand access or owner match)
  const creator = await getCreator(slug);
  if (creator) {
    return NextResponse.json({ data: creator });
  }

  // Check if profile exists at all to return 404 vs 403
  const exists = await getCreator(slug, { bypassAuth: true });
  if (!exists) {
    return NextResponse.json({ error: "Creator profile not found." }, { status: 404 });
  }

  return NextResponse.json(
    {
      error: "Forbidden: Creator profile access is restricted to verified paying brands and administrators.",
    },
    { status: 403 }
  );
}
