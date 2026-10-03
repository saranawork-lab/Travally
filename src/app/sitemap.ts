import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travally.in";

  const staticRoutes = [
    "",
    "/discover",
    "/safety",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes = [
    "/categories/movies",
    "/categories/food-cafes",
    "/categories/walking",
    "/categories/studying",
    "/categories/events-pubs",
    "/categories/shopping",
    "/categories/city-exploration",
    "/categories/other",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const destinationRoutes = [
    "/destinations/goa",
    "/destinations/manali",
    "/destinations/kerala",
    "/destinations/rajasthan",
    "/destinations/bali",
    "/destinations/dubai",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...destinationRoutes];
}
