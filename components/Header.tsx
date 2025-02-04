"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "../contexts/LanguageContext"
import LanguageSelector from "./LanguageSelector"

const getMenuItems = (language: "en" | "pt") => [
  {
    title: language === "en" ? "Quick Links" : "Links Rápidos",
    items: [
      { title: language === "en" ? "Home" : "Início", href: "/" },
      { title: language === "en" ? "Buy Now" : "Comprar agora", href: "https://www.good.inc/#ofertas" },
      { title: language === "en" ? "How to Use" : "Modo de uso", href: "https://eu.visto.bio/modousovideo1" },
      {
        title: language === "en" ? "Manage Subscription" : "Gerir compra programada",
        href: "https://portal.good.inc/",
      },
      {
        title: language === "en" ? "Manage One-time Purchase" : "Gerir compra avulsa",
        href: "https://www.visto.bio/entrar",
      },
    ],
  },
  {
    title: language === "en" ? "Information" : "Informações",
    items: [
      { title: language === "en" ? "Company" : "Empresa", href: "https://www.visto.bio/p/sobre-nos" },
      { title: language === "en" ? "Reviews" : "Avaliações", href: "https://www.visto.bio/p/opinioes" },
      { title: language === "en" ? "Warranty" : "Garantia", href: "https://www.visto.bio/p/faq" },
      { title: language === "en" ? "Terms of Service" : "Termos de serviço", href: "https://www.visto.bio/p/termos" },
      {
        title: language === "en" ? "Privacy Policy" : "Política de privacidade",
        href: "https://www.visto.bio/p/privacidade",
      },
    ],
  },
  {
    title: language === "en" ? "Contact" : "Contato",
    items: [
      {
        title: language === "en" ? "Instagram (self-service)" : "Instagram (auto serviço)",
        href: "https://instagram.com/visto.bio",
      },
      {
        title: language === "en" ? "WhatsApp (self-service)" : "WhatsApp (auto serviço)",
        href: "https://eu.visto.bio/whatsapp-ai",
      },
      { title: language === "en" ? "Support Email" : "E-mail Suporte", href: "mailto:support@vistobio.zendesk.com" },
      { title: language === "en" ? "Founder's Email" : "E-mail do fundador", href: "mailto:renan@good.inc" },
    ],
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const menuItems = getMenuItems(language)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="https://portal.good.inc/static/images/logo_good.2d89a98eab4e.png"
              alt="GOOD.INC Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center">
            <LanguageSelector />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[540px] bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <Image
                      src="https://portal.good.inc/static/images/logo_good.2d89a98eab4e.png"
                      alt="GOOD.INC Logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-8">
                      {menuItems.map((section) => (
                        <div key={section.title}>
                          <h2 className="font-semibold text-lg mb-3 px-4">{section.title}</h2>
                          <ul className="space-y-2">
                            {section.items.map((item) => (
                              <li key={item.title}>
                                <Link
                                  href={item.href}
                                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

