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
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
    },
    appleWebApp: {
      title: 'Good.inc'
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://www.good.inc" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script async src="https://cdn.streamform.io/streamform.js" data-token="adY1dF7oW9tmhOoQKc7nXjlYVeKA49DLiSCrBVdgFQA"></script>
      </head>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

