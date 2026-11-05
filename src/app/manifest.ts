import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    short_name: "Meg Dev",
    description:
      "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiren Kayseri merkezli yazılım şirketi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#10130e",
    theme_color: "#10130e",
    lang: "tr",
    icons: [
      { src: "/favicon.png", sizes: "96x96", type: "image/png" },
      { src: "/megdevicon.png", sizes: "1254x1254", type: "image/png" },
    ],
  }
}
