import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import heroPhoto from "@/assets/hero-photo.jpg";
import { LoadingScreen } from "@/components/portfolio/loading-screen";
import { backendUri, portfolioId } from "./backend-endpoint";

export type PortfolioContent = {
  hero: {
    name: string;
    tagline: string;
    description: string;
    roles: string[];
    availability: string;
    resumeUrl: string;
    photo: string;
    socials: { label: string; href: string; icon: "github" | "linkedin" | "mail" }[];
  };
  about: {
    title: string;
    description: string;
    pillars: { icon: "server" | "layers" | "brain" | "sparkles"; title: string; text: string }[];
    timeline: { year: string; label: string }[];
  };
  stack: { title: string; items: string[] }[];
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
    tags: string[];
  }[];
  projects: {
    name: string;
    tagline: string;
    description: string;
    tags: string[];
    highlights: string[];
    accent: string;
    github?: string;
    live?: string;
    previewImage?: string;
    caseStudy?: {
      images?: string[];
      sections?: { heading: string; body: string }[];
    };
  }[];
  services: {
    name: string;
    tagline: string;
    features: string[];
    highlighted: boolean;
  }[];
  whyHire: { icon: string; title: string; text: string }[];
  skills: { name: string; level: number }[];
  coding: { name: string; handle: string; icon: string; stat: string; meta: string; href?: string }[];
  contact: {
    email: string;
    location: string;
    calendarUrl: string;
  };
}| null;

// export const defaultContent: PortfolioContent = {
//   hero: {
//     name: "Akash Kumar Parida",
//     tagline: "Backend Software Engineer",
//     description:
//       "I build scalable backend applications using Java, Spring Boot, Spring Security, Spring AI, and modern software engineering principles. I enjoy designing robust APIs, solving complex DSA problems, and shipping production-ready software.",
//     roles: [
//       "Java Developer",
//       "Spring Boot Engineer",
//       "Backend Developer",
//       "Spring AI Developer",
//       "REST API Developer",
//       "Microservices Enthusiast",
//       "Problem Solver",
//     ],
//     availability: "Available for full-time & freelance opportunities",
//     resumeUrl: "/resume.pdf",
//     photo: heroPhoto,
//     socials: [
//       { label: "GitHub", href: "https://github.com/", icon: "github" },
//       { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
//       { label: "Email", href: "mailto:akash@example.com", icon: "mail" },
//     ],
//   },
//   about: {
//     title: "Engineer building production-ready systems.",
//     description:
//       "I'm a software engineer focused on backend systems — passionate about designing APIs that scale, writing clean maintainable code, and shipping software that solves real problems.",
//     pillars: [
//       { icon: "server", title: "Backend Focused", text: "Java, Spring Boot & scalable services" },
//       { icon: "layers", title: "Clean Architecture", text: "Modular, testable, maintainable code" },
//       { icon: "brain", title: "Problem Solver", text: "Strong DSA & algorithmic thinking" },
//       { icon: "sparkles", title: "AI-Powered Apps", text: "Building with Spring AI & LLMs" },
//     ],
//     timeline: [
//       { year: "2020", label: "Started programming with Java & C++" },
//       { year: "2022", label: "Deep-dived into Spring Boot & REST APIs" },
//       { year: "2024", label: "Graduated & began solving 500+ DSA problems" },
//       { year: "2025", label: "Joined EPAM Systems as Software Engineer" },
//       { year: "Now", label: "Building AI-powered backends with Spring AI" },
//     ],
//   },
//   stack: [
//     { title: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "C++"] },
//     { title: "Backend", items: ["Spring Boot", "Spring Security", "Spring AI", "REST APIs", "JWT", "Microservices", "Hibernate", "JPA", "Maven", "Gradle"] },
//     { title: "Frontend", items: ["React", "Tailwind CSS", "HTML", "CSS", "JavaScript"] },
//     { title: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
//     { title: "DevOps", items: ["Docker", "Git", "GitHub Actions", "Linux", "Nginx", "AWS"] },
//     { title: "Testing", items: ["JUnit", "Mockito", "Selenium", "TestNG", "Cucumber", "Rest Assured", "Postman"] },
//     { title: "CS Fundamentals", items: ["Data Structures", "Algorithms", "System Design", "OOP", "DBMS", "OS", "Networks"] },
//   ],
//   experience: [
//     {
//       company: "EPAM Systems",
//       role: "Software Engineer — Backend & Automation",
//       period: "January 2025 — Present",
//       location: "India",
//       bullets: [
//         "Building Spring Boot services and REST APIs for enterprise clients",
//         "Designing REST API automation frameworks with Selenium, TestNG & Rest Assured",
//         "Developing microservices, writing production Java code, and validating APIs",
//         "Collaborating with developers on architecture, code reviews and CI/CD",
//       ],
//       tags: ["Java", "Spring Boot", "Selenium", "TestNG", "Microservices", "REST"],
//     },
//   ],
//   projects: [
//     {
//       name: "RentFlow",
//       tagline: "House Rental Platform",
//       description:
//         "Full-stack rental platform with secure authentication, property management, booking system, and role-based access control. Built with a clean Spring Boot backend and React frontend.",
//       tags: ["Java", "Spring Boot", "React", "PostgreSQL", "JWT", "JPA"],
//       highlights: ["JWT Auth", "Booking System", "Property Mgmt", "REST APIs"],
//       accent: "from-primary/30 to-accent/30",
//       github: "#",
//       live: "#",
//     },
//     {
//       name: "SpringAI Chat",
//       tagline: "AI-Powered Assistant",
//       description:
//         "Backend-first AI chat application using Spring AI with streaming responses, prompt templates, and vector search over private knowledge bases.",
//       tags: ["Spring AI", "Java", "PostgreSQL", "pgvector", "REST"],
//       highlights: ["Streaming", "RAG", "Vector Search"],
//       accent: "from-accent/30 to-primary/30",
//       github: "#",
//       live: "#",
//     },
//     {
//       name: "API Gateway Kit",
//       tagline: "Microservices Toolkit",
//       description:
//         "Reusable Spring Boot starter with authentication, rate limiting, request tracing and metrics — designed to accelerate microservice bootstrapping.",
//       tags: ["Spring Boot", "Microservices", "Docker", "Redis"],
//       highlights: ["Rate Limiting", "Auth", "Observability"],
//       accent: "from-primary/40 to-accent/20",
//       github: "#",
//       live: "#",
//     },
//   ],
//   services: [
//     {
//       name: "Backend Development",
//       tagline: "Spring Boot APIs & services",
//       features: ["Spring Boot Applications", "REST API Development", "JWT Authentication", "Database Design", "Bug Fixing & Performance"],
//       highlighted: false,
//     },
//     {
//       name: "Full Stack MVP",
//       tagline: "Ship your product end-to-end",
//       features: ["Spring Boot + React", "Authentication System", "Database + APIs", "Deployment Ready", "1 Month Support"],
//       highlighted: true,
//     },
//     {
//       name: "AI Integration",
//       tagline: "Spring AI powered features",
//       features: ["AI Chatbots (Spring AI)", "RAG over your data", "LLM API Integration", "Streaming Responses", "Prompt Engineering"],
//       highlighted: false,
//     },
//   ],
//   whyHire: [
//     { icon: "rocket", title: "Scalable Architecture", text: "APIs and services designed to grow with your product." },
//     { icon: "code", title: "Clean Code", text: "Readable, maintainable, and reviewed against best practices." },
//     { icon: "sparkles", title: "Strong Problem Solving", text: "Deep DSA foundation applied to real business logic." },
//     { icon: "shield", title: "Production Ready", text: "Auth, validation, error handling, logging — done right." },
//     { icon: "timer", title: "Fast Delivery", text: "Predictable timelines with clear milestones and demos." },
//     { icon: "message", title: "Clear Communication", text: "Async-friendly updates, honest tradeoffs, no surprises." },
//     { icon: "test", title: "Testing Mindset", text: "Unit and integration coverage where it counts." },
//     { icon: "users", title: "Long-term Support", text: "Ongoing collaboration after launch when you need it." },
//     { icon: "award", title: "High Code Quality", text: "PRs your senior engineers will actually enjoy reviewing." },
//   ],
//   skills: [
//     { name: "Java", level: 92 },
//     { name: "Spring Boot", level: 90 },
//     { name: "Spring Security", level: 82 },
//     { name: "Spring AI", level: 78 },
//     { name: "REST APIs", level: 90 },
//     { name: "SQL / PostgreSQL", level: 85 },
//     { name: "Data Structures & Algorithms", level: 85 },
//     { name: "Testing (JUnit / Selenium)", level: 82 },
//     { name: "React", level: 75 },
//   ],
//   coding: [
//     { name: "GitHub", handle: "@Akash-akp", icon: "github", stat: "67 Repos", meta: "Open source contributor", href: "https://github.com/Akash-akp" },
//     { name: "LeetCode", handle: "@akash_kp", icon: "code", stat: "500+ Solved", meta: "Top 10% globally", href: "#" },
//     { name: "HackerRank", handle: "@akash_kp", icon: "terminal", stat: "5★ Java", meta: "Problem Solving Gold", href: "#" },
//     { name: "Codeforces", handle: "@akash_kp", icon: "sigma", stat: "Pupil", meta: "Consistent contest solver", href: "#" },
//     { name: "GeeksforGeeks", handle: "@akash_kp", icon: "trophy", stat: "300+ Problems", meta: "Java & DSA articles", href: "#" },
//   ],
//   contact: {
//     email: "akash.parida@example.com",
//     location: "India · Remote friendly",
//     calendarUrl: "#",
//   },
// };

const STORAGE_KEY = "portfolio-content-v1";

type Ctx = {
  content: PortfolioContent;
  setContent: (c: PortfolioContent) => void;
  updateSection: <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);


export function PortfolioContentProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [content, setContentState] = useState<PortfolioContent>();
  const [hydrated, setHydrated] = useState(false);

  function setContent(newContent: PortfolioContent) {
    newContent?.stack.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.experience.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.projects.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.services.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.whyHire.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.skills.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    newContent?.coding.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setContentState(newContent);
  }

  async function fetchPortfolioContent() {
    setLoading(true);
    setHydrated(false);
    const response = await fetch(`${backendUri}/api/portfolio/${portfolioId}`);
    const data = await response.json();
    console.log("Fetched portfolio content:", data);
    try {
      if (data) {
        setContent(data);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
    setLoading(false);
  }

  async function savePortfolioContent(newContent: PortfolioContent) {
    try {
      const response = await fetch(`${backendUri}/api/portfolio/${portfolioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+sessionStorage.getItem("portfolio-admin-auth")
        },
        body: JSON.stringify(newContent),
      });
      if (!response.ok) {
        throw new Error("Failed to save portfolio content");
      }
      const updatedContent = await response.json();
      setContent(updatedContent);
    } catch (error) {
      console.error("Error saving portfolio content:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchPortfolioContent();
  }, []);

  // useEffect(() => {
  //   if (!hydrated) return;
  //   fetchPortfolioContent();
  // }, [content, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      content,
      setContent: setContentState,
      updateSection: (key, val) => savePortfolioContent({ ...content, [key]: val }),
      reset: () => setContentState(defaultContent),
    }),
    [content],
  );

  return (
  <ContentContext.Provider value={value}>
    {loading ? (<LoadingScreen show={loading} />):(<>{children}</>)}
  </ContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("usePortfolioContent must be used within PortfolioContentProvider");
  return ctx;
}
