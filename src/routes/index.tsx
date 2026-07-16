import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Stack } from "@/components/portfolio/stack";
import { Experience } from "@/components/portfolio/experience";
import { Projects } from "@/components/portfolio/projects";
import { Services } from "@/components/portfolio/services";
import { WhyHire } from "@/components/portfolio/why-hire";
import { Skills } from "@/components/portfolio/skills";
import { Coding } from "@/components/portfolio/coding";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";
import { LoadingScreen } from "@/components/portfolio/loading-screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akash Kumar Parida — Software Engineer" },
      {
        name: "description",
        content:
          "Backend Software Engineer specializing in Java, Spring Boot, Spring AI, REST APIs and microservices. Available for full-time roles and freelance projects.",
      },
      { property: "og:title", content: "Akash Kumar Parida — Backend Software Engineer" },
      {
        property: "og:description",
        content:
          "Scalable backend systems with Java, Spring Boot & Spring AI. Full-time, freelance and contract opportunities.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const onReady = () => setTimeout(() => setLoading(false), 400);
    if (document.readyState === "complete") onReady();
    else {
      window.addEventListener("load", onReady, { once: true });
      // safety fallback
      const t = setTimeout(() => setLoading(false), 2500);
      return () => {
        window.removeEventListener("load", onReady);
        clearTimeout(t);
      };
    }
  }, []);
  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      <LoadingScreen show={loading} />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Services />
        <WhyHire />
        <Skills />
        <Coding />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
