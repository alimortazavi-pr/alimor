// Facts about Ali. Everything here is checked against alimor.ir, GitHub or the Paradise Code site:
// never add a number or a claim that cannot be verified.
export const SITE = {
  url: "https://alimor.ir",
  email: "alimortazavi.pr@gmail.com",
  phone: "+989125519818",
  startedYear: 2016,
  paradise: "https://paradisecode.ir",
  socials: {
    github: "https://github.com/alimortazavi-pr",
    linkedin: "https://www.linkedin.com/in/ali-mortazavi",
    telegram: "https://t.me/alimortazavi_dev",
    instagram: "https://www.instagram.com/alimortazavi.dev",
    npm: "https://www.npmjs.com/~alimortazavi",
  },
  stack: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "NestJS",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Redux",
    "GraphQL",
    "Docker",
    "Git",
    "Framer Motion",
    "gRPC",
    "PWA",
  ],
} as const;

export type SocialKey = keyof typeof SITE.socials;
