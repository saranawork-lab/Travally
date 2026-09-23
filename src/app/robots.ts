import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travally.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/discover",
          "/safety",
          "/categories/*",
          "/destinations/*",
          "/login",
          "/register",
        ],
        disallow: [
          "/chats/*",
          "/requests/*",
          "/profile/*",
          "/admin/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
