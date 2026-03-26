import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Marquee />
        <About />
        <CaseStudies />
        <Testimonials />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
