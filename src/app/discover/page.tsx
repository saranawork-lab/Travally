import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DiscoverClient } from "./DiscoverClient";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const user = await getCurrentUser();

  // If user is not authenticated, never render Discover page — redirect to landing page
  if (!user) {
    redirect("/");
  }

  return <DiscoverClient initialUser={user} />;
}
