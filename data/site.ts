/**
 * Everything personal about the site lives here.
 * Edit this file, not the pages.
 *
 * Any link left as an empty string is simply not rendered, so it is safe to
 * ship with blanks and fill them in later.
 */

export const site = {
  name: "Dhruv Ranjan",
  role: "Final-year Computer Engineering student",

  /** One line, under the name. Shown in the hero and in page metadata. */
  tagline: "I build software products and run them in production.",

  /** Shown next to the name in the hero. Leave "" to hide. */
  location: "India",

  /** Status pill in the hero. Leave "" to hide. */
  availability: "Open to work",

  /** Used for canonical URLs and social cards. Update after the first deploy. */
  url: "https://example.vercel.app",

  email: "irldhruv196@gmail.com",

  links: {
    github: "https://github.com/dhruv-ship-it",
    linkedin: "https://linkedin.com/in/dhruv-ranjan",
    leetcode: "https://leetcode.com/u/Dhruvcoded",
    twitter: "",
    /** Save the PDF as public/<name>.pdf, then put "/<name>.pdf" here. */
    resume: "/dhruv-ranjan-resume.pdf",
  },

  /**
   * Fill all three and the Education block appears on the home page.
   * Leave `school` empty and the whole block is skipped.
   */
  education: {
    school: "Thapar Institute of Engineering and Technology",
    degree: "B.Tech, Computer Engineering",
    dates: "2023 – 2027",
    note: "CGPA 8.3/10 · Patiala, Punjab",
    /** Short, recruiter-relevant extras. Leave the array empty to hide. */
    highlights: [
      "NVIDIA Deep Learning Institute — Accelerating End-to-End Data Science Workflows (2025)",
      "700+ data structures and algorithms problems across LeetCode, GeeksforGeeks and Codeforces",
    ],
  },

  /** Most recent first. */
  experience: [
    {
      role: "Full Stack Intern",
      org: "Enerbuff Solutions",
      dates: "Aug 2026 – present",
      stack: ["React Native", "Node.js", "MySQL", "AWS"],
      points: [
        "Working on India Energy Stack integration: reading the IES documentation and the Beckn BAP–BPP request and response flow, then running sandbox calls and checking each payload against what the spec says should come back.",
      ],
      href: "",
    },
    {
      role: "Software Engineer (Freelance)",
      org: "Entrance UG",
      dates: "Jun – Sep 2026",
      stack: ["React", "Node.js", "PostgreSQL", "AWS"],
      points: [
        "Built a four-product exam-prep platform on my own and ran it in production through launch. It serves 500+ students and takes live payments.",
      ],
      href: "/work/entrance-ug",
    },
    {
      role: "Project Intern",
      org: "IIT Kanpur",
      dates: "May 2025 – Jan 2026",
      stack: ["Redis", "SQL", "Backend"],
      points: [
        "Cut bulk catalog API latency to under 50ms by rewriting query plans, adding Redis caching and fixing index coverage.",
        "Made orders concurrency-safe with row-level locking and idempotency keys, which stopped duplicate orders and overselling.",
      ],
      href: "",
    },
  ],

  /** Two short paragraphs for the About section. */
  about: [
    "I am a final-year Computer Engineering student at Thapar, and I build backend systems end to end: the database schema, the API, the interface, the deploy pipeline, and the running system afterwards. Most of what I know about that last part I learned by being the person who got the message when something broke.",
    "My main work so far is Entrance UG, an exam-prep platform I built as paid client work. I built all of it on my own, took it to launch and ran it in production. It serves 500+ students and takes live payments.",
  ],

  /**
   * Honest groupings. Keep this a record of what you can be questioned on,
   * not a keyword list.
   */
  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C/C++", "SQL"] },
    {
      group: "Frontend",
      items: ["React", "React Native", "Vite", "React Router", "TanStack Query", "Tailwind CSS", "Recharts"],
    },
    {
      group: "Backend",
      items: ["Node.js", "Express", "Prisma", "Mongoose", "FastAPI", "REST APIs", "JWT auth", "RBAC"],
    },
    {
      group: "Data",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Schema design", "Migrations against live data"],
    },
    {
      group: "Cloud and delivery",
      items: ["AWS (EC2, RDS, S3, CloudFront, ECR, SSM, Secrets Manager, Amplify)", "Docker", "Kubernetes", "GitHub Actions", "Caddy", "Linux"],
    },
    {
      group: "Core CS",
      items: ["Data structures and algorithms", "DBMS", "Operating systems", "Computer networks", "OOP", "System design"],
    },
    {
      group: "Practices",
      items: [
        "Payment integration (Razorpay)",
        "Idempotency and reconciliation",
        "Automated verification suites",
        "Production incident response",
      ],
    },
  ],
} as const;
