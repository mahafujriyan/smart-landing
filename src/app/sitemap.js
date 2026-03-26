export default function sitemap() {
  const baseUrl = "https://ordernex.example";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
    },
  ];
}
