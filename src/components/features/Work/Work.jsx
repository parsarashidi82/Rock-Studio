import { useState } from "react";

import { projects } from "../../../data/projects";
import DriftWall from "../../ui/DriftWall";

const items = projects.map((p) => ({
  image: p.image,
  title: p.title,
  category: p.category,
  href: p.externalUrl || `/projects/${p.slug}`,
}));

export default function Work() {
  const [active, setActive] = useState(null);
  const [last, setLast] = useState(null); // برای fade-out بدون پریدن متن

  const handleActive = (item) => {
    setActive(item);
    if (item) setLast(item);
  };

  return (
    <section
      id="work"
      className="relative h-screen w-full overflow-hidden bg-[#050508]"
    >
      <DriftWall
        items={items}
        columns={5}
        tileWidth={200}
        tileHeight={132}
        gap={18}
        tilt={16}
        turn={-14}
        perspective={1200}
        depth={120}
        speed={42}
        variance={0.45}
        parallax={0.6}
        lift={64}
        fade={0.6}
        dim={0.55}
        radius={14}
        overlayColor="#050508"
        newTab={false}
        onActiveChange={handleActive}
      />

      {/* عنوان سکشن */}
      <div className="pointer-events-none absolute left-6 top-24 z-20 md:left-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#67E8F9]">
          Selected Work
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Things we&apos;ve made.
        </h2>
      </div>

      {/* اسم پروژه‌ی زیر موس */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-12 z-20 text-center transition-all duration-500 ${
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#67E8F9]">
          {last?.category}
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {last?.title}
        </p>
      </div>
    </section>
  );
}
