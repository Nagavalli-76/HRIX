import { NextResponse, type NextRequest } from "next/server";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import { listCreators } from "@/lib/api/creators";
import type { Category, City } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const access = await getBrandDirectoryAccessStatus();

  if (!access.allowed) {
    if (access.reason === "unauthenticated") {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to access the creator directory." },
        { status: 401 }
      );
    }

    let message = "Forbidden: Creator directory is available exclusively to eligible HRIX brands.";
    if (access.reason === "creator_role") {
      message = "Forbidden: Creator directory is available exclusively to verified partner brands.";
    } else if (access.reason === "verification_pending") {
      message = "Forbidden: Brand verification is pending approval.";
    } else if (access.reason === "no_subscription" || access.reason === "subscription_expired") {
      message = "Forbidden: An active Brand Directory Access subscription is required.";
    }

    return NextResponse.json(
      { error: message, reason: access.reason },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") ?? undefined) as Category | undefined;
  const city = (searchParams.get("city") ?? undefined) as City | undefined;
  const query = searchParams.get("query") ?? undefined;

  const creators = await listCreators({ category, city, query }, { bypassAuth: true });

  return NextResponse.json({
    data: creators,
    count: creators.length,
  });
}
