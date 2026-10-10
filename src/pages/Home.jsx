import Hero from "../components/features/Hero/Hero";
import Statement from "../components/features/Statement/Statement";
import Work from "../components/features/Work/Work";
import Navbar from "../components/layouts/Navbar";

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
