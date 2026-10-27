import { en } from "@/i18n/en";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// A plain summary for AI assistants and answer engines, which increasingly decide who "Ali Mortazavi" is
export function GET() {
  const journey = en.journey.items
    .map((i) => `- ${i.year}: ${i.title} (${i.role}). ${i.body}`)
    .join("\n");
  const body = `# ${SITE.names.en} (${SITE.names.fa})

> ${en.meta.description}

${en.about.statement}

${en.about.body}

## Journey
${journey}

## Paradise Code
${en.paradise.body} ${SITE.paradise}

## Stack
${SITE.stack.join(", ")}

## Pages
- [فارسی](${SITE.url}/fa)
- [English](${SITE.url}/en)
- [العربية](${SITE.url}/ar)

## Contact
- Email: ${SITE.email}
${Object.entries(SITE.socials)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
