import upperCapeDentistry from "@/assets/projects/uppercapedentistry.webp";
import upperCapeDentistryFull from "@/assets/projects/uppercapedentistry-full.png";
import artamed from "@/assets/projects/artamed.webp";
import artamedFull from "@/assets/projects/artamed-full.png";
import carCareEvolution from "@/assets/projects/carcareevolution.webp";
import carCareEvolutionFull from "@/assets/projects/carcareevolution-full.png";
import devConnect from "@/assets/projects/DevConnect.webp";
import devConnectFull from "@/assets/projects/DevConnect-full.png";
import nikMarketing from "@/assets/projects/nik-marketing-thumb.png";
import nikMarketingFull from "@/assets/projects/nik.marketing.png";

// موشن‌ها و ویدیوها
import babamFitVideo from "@/assets/projects/Babam-Fit.mp4";
import babamFitCover from "@/assets/projects/babam-fit-cover.png";
import nationalCampVideo from "@/assets/projects/national-camp-australia.mp4";
import nationalCampThumb from "@/assets/projects/national-camp-australia-thumb.png";
import festivalStartVideo from "@/assets/projects/festival-start-logomotion.mp4";
import festivalStartThumb from "@/assets/projects/festival-start-thumb.png";
import motoralityVideo from "@/assets/projects/motorality-logomotion.mp4";
import motoralityThumb from "@/assets/projects/motorality-thumb.png";
import jam42Video from "@/assets/projects/kinetic-motion-2025.mp4";
import jam42Thumb from "@/assets/projects/jam-42-thumb.png";

export const projects = [
  {
    slug: "babam-fit",
    title: "Babam Fit",
    category: "Motion",
    image: babamFitCover,
    video: babamFitVideo,
    hoverClip: {
      start: 2,
      end: 4.5,
    },
    client: "Babam Fit",
    year: "2024",
    services: [
      "Motion Design",
      "3D Animation",
      "Kinetic Typography",
      "Sound Design",
    ],
    description:
      "A high-octane 3D motion graphic campaign created for Babam Fit. Designed to communicate athletic drive, rhythmic movement, and brand power through fluid character animation, kinetic typography, and punchy audio-visual transitions.",
    tags: [
      "3D Animation",
      "Motion Graphic",
      "Commercial",
      "Brand Identity",
      "Sound Design",
    ],
  },
  {
    slug: "upper-cape-dentistry",
    title: "Upper Cape Dentistry",
    category: "Web",
    image: upperCapeDentistry,
    fullImage: upperCapeDentistryFull,
    externalUrl: "https://uppercapedentistry.com/",
    client: "Upper Cape Dental Group",
    year: "2024",
    services: [
      "Web Design",
      "Frontend Engineering",
      "UI/UX",
      "Brand Digital Experience",
    ],
    description:
      "A clean, patient-centric digital presence crafted for Upper Cape Dentistry. Features seamless appointment workflows, responsive performance, calming aesthetics, and intuitive medical service exploration.",
    tags: ["Web Design", "React", "Healthcare", "Responsive Design"],
  },
  {
    slug: "national-camp-australia",
    title: "National Camp Australia",
    category: "Motion",
    image: nationalCampThumb,
    video: nationalCampVideo,
    hoverClip: {
      start: 0,
      end: 5.2,
    },
    client: "National Camp Australia",
    year: "2025",
    services: [
      "Logo Motion",
      "Brand Identity Animation",
      "Sound Design",
      "Kinetic Typography",
    ],
    description:
      "A vibrant and energetic logo motion identity crafted for National Camp Australia. Built to capture outdoor spirit, youthful curiosity, and educational warmth through snappy transitions and organic motion design.",
    tags: [
      "Logo Motion",
      "Motion Graphic",
      "Brand Identity",
      "Sound Design",
      "Animation",
    ],
  },
  {
    slug: "nik-marketing",
    title: "Nik Marketing",
    category: "Web",
    image: nikMarketing,
    fullImage: nikMarketingFull,
    externalUrl: "https://nik.marketing/",
    client: "Nik Marketing Agency",
    year: "2024",
    services: [
      "Web Architecture",
      "UI/UX Design",
      "Performance Engineering",
      "SEO Platform",
    ],
    description:
      "A high-converting, modern digital presence crafted for Nik Marketing — a premier performance SEO & Google Ads agency. Designed with bold yellow-accented aesthetics, high-velocity responsive layouts, and intuitive lead funnels.",
    tags: ["Web Design", "React", "SEO Agency", "Performance UI"],
  },
  {
    slug: "artamed",
    title: "Artamed",
    category: "Web",
    image: artamed,
    fullImage: artamedFull,
    externalUrl: "https://artamed.at/",
    client: "Artamed Aesthetic & Clinic",
    year: "2024",
    services: ["Web Experience", "Creative Development", "Interactive Design"],
    description:
      "An elegant Austrian medical and aesthetic platform crafted with surgical precision. Delivers high-end typography, minimalist layouts, and smooth micro-interactions that mirror the clinic's premium philosophy.",
    tags: ["Web Experience", "Minimalist", "Aesthetics", "Creative Dev"],
  },
  {
    slug: "festival-start",
    title: "Festival Start",
    category: "Motion",
    image: festivalStartThumb,
    video: festivalStartVideo,
    hoverClip: {
      start: 0.8,
      end: 5.5,
    },
    client: "Festival Start",
    year: "2025",
    services: [
      "CGI / 3D Animation",
      "Logo Reveal",
      "Audio-Visual Sync",
      "Atmospheric FX",
    ],
    description:
      "A cinematic, high-impact festival opener and logo reveal. Combines dramatic lighting shifts, tactile geometry, and intense sonic pacing to build suspense and excitement for stage events.",
    tags: [
      "3D Motion",
      "CGI",
      "Logo Reveal",
      "Festival Opener",
      "Sound FX",
    ],
  },
  {
    slug: "car-care-evolution",
    title: "Car Care Evolution",
    category: "Web",
    image: carCareEvolution,
    fullImage: carCareEvolutionFull,
    externalUrl: "https://carcareevolution.com.au/",
    client: "Car Care Evolution Australia",
    year: "2023",
    services: ["Web Architecture", "Modern E-Commerce & Booking", "Motion UI"],
    description:
      "An automotive detailing and ceramic protection website built for a top-tier Australian auto studio. Features sleek dark mode aesthetics, interactive service packages, and rapid booking funnels.",
    tags: ["Web", "Automotive", "Performance", "Motion UI"],
  },
  {
    slug: "motorality",
    title: "Motorality",
    category: "Motion",
    image: motoralityThumb,
    video: motoralityVideo,
    hoverClip: {
      start: 0,
      end: 3.2,
    },
    client: "Motorality Channel",
    year: "2025",
    services: [
      "YouTube Intro & Sting",
      "Automotive Motion",
      "Logo Animation",
      "Sound Design",
    ],
    description:
      "An aggressive, high-velocity motion branding intro engineered for Motorality's YouTube platform. Tailored with revving sound effects, metallic reflections, and high-octane automotive dynamics.",
    tags: [
      "Automotive",
      "YouTube Branding",
      "Logo Motion",
      "Sound Design",
    ],
  },
  {
    slug: "devconnect",
    title: "DevConnect",
    category: "Web",
    image: devConnect,
    fullImage: devConnectFull,
    client: "DevConnect Platform",
    year: "2023",
    services: ["Full-Stack App", "Product Design", "Interactive UI"],
    description:
      "A community and collaboration platform for software engineers to share code snippets, showcase open-source work, and connect across tech stacks with real-time features and developer-focused tooling.",
    tags: ["Product Design", "Developer Tools", "Web Application", "Community"],
  },
  {
    slug: "jam-42",
    title: "Jam 42",
    category: "Motion",
    image: jam42Thumb,
    video: jam42Video,
    hoverClip: {
      start: 0,
      end: 4.3,
    },
    client: "Jam 42",
    year: "2025",
    services: [
      "Logo Motion",
      "Visual Effects",
      "Kinetic Identity",
      "Sound Design",
    ],
    description:
      "A dynamic and sleek logo animation created for Jam 42. Features precision easing curves, bold shape morphing, and immersive audio effects that define a striking brand entrance.",
    tags: [
      "Motion Graphics",
      "Logo Motion",
      "Kinetic Art",
      "Creative Direction",
    ],
  },
  {
    slug: "nova-brand",
    title: "Nova Rebrand",
    category: "Visual",
    image: "https://picsum.photos/seed/rok1/800/1000",
    client: "Nova Corp",
    year: "2024",
    services: [
      "Brand Strategy",
      "Visual Identity",
      "Art Direction",
      "Print & Packaging",
    ],
    description:
      "A comprehensive brand identity overhaul for Nova. Combining avant-garde typography with bold chromatic palettes, creating an instantly recognizable global identity across physical and digital mediums.",
    tags: ["Visual Identity", "Art Direction", "Branding", "Typography"],
  },
  {
    slug: "echo-campaign",
    title: "Echo Campaign",
    category: "Digital",
    image: "https://picsum.photos/seed/rok4/800/700",
    client: "Echo Soundworks",
    year: "2023",
    services: ["Digital Campaign", "Interactive Experience", "Sound Design"],
    description:
      "A multi-sensory marketing campaign celebrating acoustic innovation and spatial audio. Features kinetic audio visualizers and responsive storytelling.",
    tags: ["Digital", "Audio", "Interactive", "Campaign"],
  },
  {
    slug: "luma-identity",
    title: "Luma Identity",
    category: "Visual",
    image: "https://picsum.photos/seed/rok7/800/1000",
    client: "Luma Architecture",
    year: "2023",
    services: ["Identity System", "Editorial Design", "Signage"],
    description:
      "A refined architectural branding system reflecting light, shadow, and structural geometry. Designed for a luxury residential design studio.",
    tags: ["Architecture", "Visual", "Editorial", "Monochrome"],
  },
  {
    slug: "drift-store",
    title: "Drift Store",
    category: "Digital",
    image: "https://picsum.photos/seed/rok8/800/700",
    client: "Drift Apparel",
    year: "2024",
    services: ["Digital Storefront", "E-Commerce", "3D Product Viewer"],
    description:
      "A next-generation streetwear e-commerce experience integrating real-time 3D clothing previews, frictionless checkout, and editorial lookbooks.",
    tags: ["E-Commerce", "Digital", "Fashion", "3D Product"],
  },
];
