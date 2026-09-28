import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPageClient from "@/components/landing/LandingPageClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/discover");
  }

  return <LandingPageClient />;
}
