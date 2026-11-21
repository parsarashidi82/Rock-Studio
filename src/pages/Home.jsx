import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/features/Hero/Hero";
import Statement from "@/components/features/Statement/Statement";
import OurStory from "@/components/features/Story/OurStory";
import Work from "@/components/features/Work/Work";
import Contact from "@/components/features/Contact/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statement />
      <OurStory />
      <Work />
      <Contact />
    </>
  );
}
