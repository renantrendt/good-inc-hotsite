import { LanguageProvider } from "../contexts/LanguageContext"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { Metadata } from "next"
import { metadata as siteMetadata } from "./metadata"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  // Você pode adicionar lógica aqui para determinar o idioma baseado no path ou outros fatores
  const language = "pt" // Por padrão, usar português
  const meta = siteMetadata[language]

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: meta.openGraph,
    twitter: meta.twitter,
    alternates: meta.alternates,
    metadataBase: new URL('https://www.good.inc'),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <Script src="/judge-me-translations.js" strategy="beforeInteractive" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.good.inc" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

