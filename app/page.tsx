import Header from "../components/Header"
import Hero from "../components/Hero"
import Benefits from "../components/Benefits"
import ProductShowcase from "../components/ProductShowcase"
import JudgeMeReviews from "../components/JudgeMeReviews"
import HealthyClean from "../components/HealthyClean"
import FAQ from "../components/FAQ"
import Footer from "../components/Footer"
import RedeemSection from "../components/RedeemSection"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        <Hero />
        <JudgeMeReviews />
        <Benefits />
        <ProductShowcase />
        <HealthyClean />
        <FAQ />
        <Footer />
      </main>
      <RedeemSection />
    </>
  )
}

