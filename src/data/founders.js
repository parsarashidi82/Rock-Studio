import nimaImg from "@/assets/nima.webp";
import parsaImg from "@/assets/parsa.webp";
import samanImg from "@/assets/saman.webp";

/**
 * @typedef {Object} FounderBox
 * @property {string} left - Percentage position from left
 * @property {string} top - Percentage position from top
 * @property {string} width - Percentage width
 * @property {string} height - Percentage height
 */

/**
 * @typedef {Object} Founder
 * @property {string} id - Unique identifier
 * @property {string} name - Founder display name
 * @property {string} role - Professional title / studio role
 * @property {string} tagline - Poetic identity / signature philosophy
 * @property {string} image - Path to founder portrait asset
 * @property {string} quote - Personal mission quote or manifesto statement
 * @property {string[]} skills - Core domain skills and specializations
 * @property {FounderBox} box - Spotlight overlay bounding box on team photo
 * @property {number[]} range - [inStart, inEnd, outStart, outEnd] scroll progress values
 */

/**
 * Co-founders roster & narrative scroll milestone coordinates.
 * Used by OurStory for cinematic scroll spotlight synchronization.
 * @type {Founder[]}
 */
export const FOUNDERS = [
  {
    id: "nima",
    name: "Nima",
    role: "Director & Creative Lead",
    tagline: "The Vision & Cinematic Soul",
    image: nimaImg,
    quote:
      "Every project starts as an emotion. My obsession is uncovering that emotion, crafting its narrative heartbeat, and directing every visual nuance so audiences don't just watch — they feel it.",
    skills: ["Film Directing", "Visual Storytelling", "Cinematography", "Creative Direction"],
    // Nima spotlight position (right side in beanie)
    box: {
      left: "60%",
      top: "2%",
      width: "39%",
      height: "94%",
    },
    range: [0.14, 0.2, 0.36, 0.41],
  },
  {
    id: "parsa",
    name: "Parsa",
    role: "Developer & Code Architect",
    tagline: "The Logic & Digital Engine",
    image: parsaImg,
    quote:
      "Code is the canvas where design impossibilities become fluid, living interactions. Clean engineering, reactive physics, and ultra-smooth performance turn digital spaces into unforgettable experiences.",
    skills: ["Creative Engineering", "Full-Stack Dev", "UI Physics & Motion", "Performance Architecture"],
    // Parsa spotlight position (center)
    box: {
      left: "37%",
      top: "16%",
      width: "26%",
      height: "78%",
    },
    range: [0.44, 0.5, 0.66, 0.71],
  },
  {
    id: "saman",
    name: "Saman",
    role: "Editor & Motion Artist",
    tagline: "The Rhythm & Kinetic Flow",
    image: samanImg,
    quote:
      "Motion without rhythm is just visual noise. In the edit suite, I shape the tempo, sculpt the soundscapes, and calibrate every cut to release pure kinetic energy.",
    skills: ["Video Editing", "Motion Graphics", "Sound Architecture", "Pacing & Tempo"],
    // Saman spotlight position (left side in brimmed hat)
    box: {
      left: "1%",
      top: "4%",
      width: "38%",
      height: "92%",
    },
    range: [0.74, 0.8, 0.91, 0.96],
  },
];
