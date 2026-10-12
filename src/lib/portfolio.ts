import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

// Replace these placeholder details with your real information.
export const profile = {
  name: "Jainam Golechha",
  firstName: "Jainam",
  lastName: "Golechha",
  tagline: "AI Engineer · Full Stack Developer · ML Enthusiast",
  email: "hello@jainamgolechha.dev",
  phone: "+91 00000 00000",
  location: "India",
  resume: "#",
  quote: "We are all made of star stuff.",
  about:
    "I build intelligent systems that feel effortless to use. My work lives where machine learning meets thoughtful product engineering — from training models to shipping the interfaces people actually touch. I care about craft, speed and clarity, and I love turning ambitious ideas into reliable software.",
  titles: ["AI Engineer", "Full Stack Developer", "ML Engineer", "Backend Developer", "Creator", "Builder"],
  socials: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    twitter: "https://x.com/",
    instagram: "https://instagram.com/",
    medium: "https://medium.com/",
  },
};

export const stats = [
  { value: 12, suffix: "+", label: "Projects shipped" },
  { value: 3, suffix: "+", label: "Years building" },
  { value: 25, suffix: "+", label: "Technologies" },
  { value: 5, suffix: "", label: "Certifications" },
];

export const education = {
  college: "Your College Name",
  degree: "B.Tech in Computer Science",
  year: "2022 — 2026",
  cgpa: "9.0 / 10",
};

export const timeline = [
  { year: "2022", title: "Launch sequence", text: "Began Computer Science and wrote my first neural network from scratch." },
  { year: "2023", title: "First orbit", text: "Shipped full-stack apps and joined hackathons across the country." },
  { year: "2024", title: "Deep space", text: "Focused on ML engineering, LLM tooling and production backends." },
  { year: "2025", title: "Beyond", text: "Building AI products end to end — models, APIs and interfaces." },
];

export const achievements = [
  "Hackathon winner — national level",
  "Top 5% in competitive programming contest",
  "Open source contributor",
];

export type Skill = {
  name: string;
  description: string;
  experience: string;
  projects: string;
  stack: string[];
  planet: string;
  size: number;
};

export const skills: Skill[] = [
  { name: "AI / ML", description: "Model design, training and evaluation.", experience: "3 years", projects: "6 projects", stack: ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face"], planet: "radial-gradient(circle at 40% 40%, oklch(0.75 0.15 230), oklch(0.4 0.2 265))", size: 132 },
  { name: "Frontend", description: "Fast, accessible and animated interfaces.", experience: "3 years", projects: "8 projects", stack: ["React", "TypeScript", "Tailwind", "Three.js"], planet: "radial-gradient(circle at 40% 40%, oklch(0.88 0.08 200), oklch(0.5 0.14 220))", size: 112 },
  { name: "Backend", description: "Scalable APIs and data pipelines.", experience: "2 years", projects: "7 projects", stack: ["Node.js", "Python", "FastAPI", "PostgreSQL"], planet: "radial-gradient(circle at 40% 40%, oklch(0.82 0.1 280), oklch(0.38 0.15 285))", size: 120 },
  { name: "LLMs", description: "RAG systems, agents and prompt engineering.", experience: "2 years", projects: "4 projects", stack: ["LangChain", "OpenAI", "Vector DBs", "Agents"], planet: "radial-gradient(circle at 40% 40%, oklch(0.9 0.07 85), oklch(0.6 0.13 55))", size: 104 },
  { name: "Cloud", description: "Deploying and scaling in production.", experience: "2 years", projects: "5 projects", stack: ["AWS", "Docker", "Vercel", "CI/CD"], planet: "radial-gradient(circle at 40% 40%, oklch(0.85 0.09 170), oklch(0.45 0.1 190))", size: 96 },
  { name: "Data", description: "Analysis, visualisation and storytelling.", experience: "3 years", projects: "6 projects", stack: ["Pandas", "NumPy", "SQL", "Matplotlib"], planet: "radial-gradient(circle at 40% 40%, oklch(0.85 0.06 20), oklch(0.5 0.12 15))", size: 100 },
];

export const projects = [
  { name: "Nebula Analytics", description: "An AI-powered analytics platform that turns raw business data into forecasts and plain-language insights.", stack: ["Next.js", "Python", "PyTorch", "PostgreSQL"], github: "#", live: "#", image: p1 },
  { name: "Synapse", description: "A retrieval-augmented assistant that answers questions over private documents with cited sources.", stack: ["LangChain", "FastAPI", "Vector DB"], github: "#", live: "#", image: p2 },
  { name: "Orbit Mobile", description: "A calm, minimal habit companion with on-device ML for personalised nudges.", stack: ["React Native", "TypeScript", "TFLite"], github: "#", live: "#", image: p3 },
];

export const experience = [
  { company: "Company Name", role: "AI Engineering Intern", duration: "May 2025 — Present", description: "Built and deployed ML pipelines and internal LLM tools used across teams." },
  { company: "Startup Name", role: "Full Stack Developer", duration: "Jan 2024 — Apr 2025", description: "Shipped customer-facing features end to end with React, Node.js and PostgreSQL." },
  { company: "Freelance", role: "Developer", duration: "2023", description: "Designed and built websites and dashboards for small businesses." },
];

export const certifications = [
  { name: "Machine Learning Specialization", issuer: "Stanford · Coursera", year: "2024" },
  { name: "Deep Learning Specialization", issuer: "DeepLearning.AI", year: "2024" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
  { name: "Meta Front-End Developer", issuer: "Meta", year: "2023" },
];

export const sections = [
  { id: "hero", label: "Home", zone: 0 },
  { id: "about", label: "About", zone: 1 },
  { id: "skills", label: "Skills", zone: 2 },
  { id: "projects", label: "Projects", zone: 3 },
  { id: "experience", label: "Experience", zone: 4 },
  { id: "certifications", label: "Certs", zone: 5 },
  { id: "contact", label: "Contact", zone: 5 },
] as const;
