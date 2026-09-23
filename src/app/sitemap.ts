import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travally.app";

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
    "/categories/events",
    "/categories/city-exploration",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const destinationRoutes = [
    "/destinations/tokyo",
    "/destinations/barcelona",
    "/destinations/interlaken",
    "/destinations/san-francisco",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...destinationRoutes];
}
