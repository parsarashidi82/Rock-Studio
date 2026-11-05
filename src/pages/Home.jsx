import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/features/Hero/Hero";
import Statement from "@/components/features/Statement/Statement";
import Work from "@/components/features/Work/Work";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statement />
      <Work />
    </>
  );
}
