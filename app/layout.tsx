import { LanguageProvider } from "../contexts/LanguageContext"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="/judge-me-translations.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

