import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader } from "@/components/portfolio/Loader";
import { Cursor } from "@/components/portfolio/Cursor";
import { Nav } from "@/components/portfolio/Nav";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { About, Certifications, Contact, Experience, Footer, Hero, Projects, Skills } from "@/components/portfolio/Sections";
import { profile } from "@/lib/portfolio";

const SpaceScene = lazy(() => import("@/components/space/SpaceScene"));

const title = `${profile.name} — AI Engineer & Full Stack Developer`;
const description = `Portfolio of ${profile.name}: AI engineering, machine learning and full-stack products, presented as a journey through deep space.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: "AI Engineer",
          email: profile.email,
          sameAs: Object.values(profile.socials),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative isolate">
      <SmoothScroll />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      </ClientOnly>
      <ClientOnly fallback={null}>
        <Loader />
        <Cursor />
      </ClientOnly>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
