"use client"

import Image from "next/image"
import { useLanguage } from "../contexts/LanguageContext"
import translations from "../utils/translations"

const mediaItems = [
  {
    title: "SHARK TANK BRASIL",
    link: "https://www.visto.bio/m/blog/635fc78a047e333fba0b9d12/shark-tank-veja-react-completo-casimiro-e-renan-serrano",
  },
  {
    title: "FANTÁSTICO",
    link: "https://www.visto.bio/m/blog/6340a5d071dc3323d0535c38/globo-doutor-suvaco-estuda-odores-corporais-e-desenvolve-produto-amigo-das-bacterias-boas",
  },
  {
    title: "UOL",
    link: "https://www.visto.bio/m/blog/635fcb418457657222400ba9/desodorante-sem-aluminio-vale-a-pena-entrar-nessa-onda",
  },
  {
    title: "CAPRICHO",
    link: "https://www.visto.bio/m/blog/635fc92ee7a9b063bc7dd001/devemos-abandonar-os-desodorantes-veja-dicas-sobre-esse-assunto",
  },
  {
    title: "FORBES",
    link: "https://www.visto.bio/m/blog/635fce2b79c0387ba50f15e0/pedro-scooby-e-o-novo-socio-da-visto-bio-startup-que-criou-um-super-desodorante",
  },
  {
    title: "VICE",
    link: "https://www.youtube.com/watch?v=OuR552j1gto&list=PL5Y8ABzJHPrsbLSwdG5j3TorCQH1z7r4U&index=9",
  },
  {
    title: "TEDX",
    link: "https://www.ted.com/talks/renan_serrano_open_innovation_for_fashion_and_a_new_relationship_with_clothes/up-next",
  },
  {
    title: "VOGUE",
    link: "https://vogue.globo.com/lifestyle/noticia/2016/11/conheca-empresas-vencedoras-do-premio-ecoera-que-aconteceu-na-casa-vogue-experience.html",
  },
  {
    title: "SXSW",
    link: "https://cnnespanol.cnn.com/video/cnnee-en-marcha-innovacion-sxsw-austin-texas/",
  },
  {
    title: "CNN",
    link: "https://cnnespanol.cnn.com/video/cnnee-en-marcha-innovacion-sxsw-austin-texas/",
  },
  {
    title: "SINGULARITY UNIVERSITY",
    link: "https://blog.singularityubrazil.com/blog/a-startup-brasileira-que-ficou-entre-as-cinco-melhores-solucoes-do-mundo-pelo-pandemic-challenge-da-singularity-university/",
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
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-2 sm:gap-x-3 w-full max-w-6xl mx-auto px-4">
          {mediaItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-[9px] leading-[2] sm:text-[11px] font-bold text-gray-800 whitespace-nowrap">
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

