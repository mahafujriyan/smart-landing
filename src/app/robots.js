export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://ordernex.example/sitemap.xml",
  };
}
