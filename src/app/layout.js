import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL("https://smart-landing.example"),
  title: {
    default: "Smart Product Order Landing System",
    template: "%s | Smart Landing",
  },
  description:
    "Premium dark product landing page with custom order flow, checkout experience, and admin dashboard.",
  keywords: [
    "smart product landing page",
    "custom order system",
    "premium ecommerce landing",
    "admin dashboard",
  ],
  openGraph: {
    title: "Smart Product Order Landing System",
    description:
      "Convert visitors into buyers with a polished product showcase, fast order capture, and a clear checkout path.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Product Order Landing System",
    description:
      "Premium landing page, custom order workflow, checkout, and admin dashboard in one system.",
  },
};

export const viewport = {
  themeColor: "#000f08",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${monoFont.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
