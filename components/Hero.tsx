"use client"

import Image from "next/image"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

const mediaItems = [
  {
    title: "Shark Tank Brasil",
    logo: "https://cdn.vnda.com.br/200x/vistobio/2022/09/05/18_9_9_940_SharkTank.png?v=1700682967",
    link: "https://www.visto.bio/m/blog/635fc78a047e333fba0b9d12/shark-tank-veja-react-completo-casimiro-e-renan-serrano",
  },
  {
    title: "Fantástico",
    logo: "https://cdn.vnda.com.br/200x/vistobio/2022/09/05/18_9_6_615_Globo.png?v=1700682967",
    link: "https://www.visto.bio/m/blog/6340a5d071dc3323d0535c38/globo-doutor-suvaco-estuda-odores-corporais-e-desenvolve-produto-amigo-das-bacterias-boas",
  },
  {
    title: "Uol",
    logo: "https://cdn.vnda.com.br/200x/vistobio/2022/09/05/18_9_8_807_uol.png?v=1700682967",
    link: "https://www.visto.bio/m/blog/635fcb418457657222400ba9/desodorante-sem-aluminio-vale-a-pena-entrar-nessa-onda",
  },
  {
    title: "Capricho",
    link: "https://www.visto.bio/m/blog/635fc92ee7a9b063bc7dd001/devemos-abandonar-os-desodorantes-veja-dicas-sobre-esse-assunto",
  },
  {
    title: "Forbes",
    link: "https://www.visto.bio/m/blog/635fce2b79c0387ba50f15e0/pedro-scooby-e-o-novo-socio-da-visto-bio-startup-que-criou-um-super-desodorante",
  },
]

export default function Hero() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="bg-[rgb(255,244,240)] text-black py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">{t.hero.title}</h1>
        </div>
        <div className="aspect-video w-full max-w-4xl mx-auto mb-12">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/i5E3VC_hGB0"
            title="Modo uso Good.inc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between w-full max-w-[calc(100%+2rem)] mx-auto px-4 sm:px-8">
          {mediaItems.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
              {item.logo ? (
                <div className="relative h-8 sm:h-10 md:h-12 lg:h-14">
                  <Image
                    src={item.logo || "/placeholder.svg"}
                    alt={item.title}
                    width={200}
                    height={48}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800">
                    {item.title}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

