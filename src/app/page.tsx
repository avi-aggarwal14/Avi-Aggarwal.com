import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Cursor } from "@/components/layout/cursor";
import { Hero } from "@/components/sections/hero";
import { Ticker } from "@/components/sections/ticker";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Capabilities } from "@/components/sections/capabilities";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";
import { PersonSchema } from "@/components/seo/person-schema";

/**
 * The page.
 *
 * Section order follows the "storytelling-driven" structure the ui-ux-pro-max
 * product table recommends for a personal portfolio — establish the person,
 * show the work, then explain the depth behind it:
 *
 *   Hero          who this is
 *   Ticker        a beat of motion, breaking the stack of static blocks
 *   About         the context for everything below
 *   Work          the actual point of the site
 *   Capabilities  what that work is made of
 *   Timeline      how it accumulated
 *   Contact       the ask
 *
 * Work sits above Capabilities on purpose. Evidence first, claims second — a
 * portfolio that leads with a list of skills is asking to be believed, while
 * one that leads with work has already proved the point.
 */
export default function Home() {
  return (
    <>
      <PersonSchema />
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Work />
        <Capabilities />
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
