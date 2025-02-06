"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

const getFooterLinks = (language: "en" | "pt") => [
  { title: language === "en" ? "Home" : "Início", href: "/" },
  { title: language === "en" ? "Buy Now" : "Comprar agora", href: "https://www.good.inc/#ofertas" },
  { title: language === "en" ? "How to Use" : "Modo de uso", href: "https://eu.visto.bio/modousovideo1" },
  { title: language === "en" ? "Manage Subscription" : "Gerir compra programada", href: "https://portal.good.inc/" },
  {
    title: language === "en" ? "Manage One-time Purchase" : "Gerir compra avulsa",
    href: "https://www.visto.bio/entrar",
  },
  { title: language === "en" ? "Company" : "Empresa", href: "https://www.visto.bio/p/sobre-nos" },
  { title: language === "en" ? "Reviews" : "Avaliações", href: "https://www.visto.bio/p/opinioes" },
  { title: language === "en" ? "Warranty" : "Garantia", href: "https://www.visto.bio/p/faq" },
  { title: language === "en" ? "Terms of Service" : "Termos de serviço", href: "https://www.visto.bio/p/termos" },
  {
    title: language === "en" ? "Privacy Policy" : "Política de privacidade",
    href: "https://www.visto.bio/p/privacidade",
  },
]

const paymentLogos = [
  { src: "/images/payment/payment-icon-visa.png", alt: "Visa" },
  { src: "/images/payment/payment-icon-master.png", alt: "Mastercard" },
  { src: "/images/payment/payment-icon-american-express.png", alt: "American Express" },
  { src: "/images/payment/payment-icon-pix.png", alt: "Pix" },
  {
    src: "/images/badges/anvisa.png",
    alt: "Pagarme",
  },
]

const certificationLogos = [
  {
    src: "/images/badges/reclame-aqui.png",
    alt: "Reclame Aqui",
    href: "https://www.reclameaqui.com.br/empresa/visto-bio/",
  },
  {
    src: "/images/badges/fda.png",
    alt: "Google Safe Browsing",
    href: "https://transparencyreport.google.com/safe-browsing/search?url=good.inc",
  },
]

export default function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const footerLinks = getFooterLinks(language)

  return (
    <footer className="bg-white pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.information}</h3>
            <ul className="space-y-2">
              {footerLinks.slice(5).map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://instagram.com/visto.bio" className="text-gray-600 hover:text-gray-900">
                  {language === "en" ? "Instagram (self-service)" : "Instagram (auto serviço)"}
                </a>
              </li>
              <li>
                <a href="https://eu.visto.bio/whatsapp-ai" className="text-gray-600 hover:text-gray-900">
                  {language === "en" ? "WhatsApp (self-service)" : "WhatsApp (auto serviço)"}
                </a>
              </li>
              <li>
                <a href="mailto:support@vistobio.zendesk.com" className="text-gray-600 hover:text-gray-900">
                  {language === "en" ? "Support Email" : "E-mail Suporte"}
                </a>
              </li>
              <li>
                <a href="mailto:renan@good.inc" className="text-gray-600 hover:text-gray-900">
                  {language === "en" ? "Founder's Email" : "E-mail do fundador"}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.paymentMethods}</h3>
            <div className="flex flex-wrap gap-2">
              {paymentLogos.map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-8 mt-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-gray-600">{t.footer.copyright}</p>
              <p className="text-sm text-gray-600">{t.footer.address}</p>
            </div>
            <div className="flex gap-4">
              {certificationLogos.map((logo) => (
                <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.alt}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

