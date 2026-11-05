// Builds the five pages from src/ into the repo root. No dependencies: run `node build.js`.
// Each page in src/pages starts with: <!-- title: ... | description: ... -->
const fs = require("fs");
const path = require("path");

const src = (...parts) => path.join(__dirname, "src", ...parts);
const partial = (name) => fs.readFileSync(src("partials", `${name}.html`), "utf8");
const parts = { header: partial("header"), footer: partial("footer"), form: partial("form"), plans: partial("plan-cards"), faq: partial("faq") };

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400..700&family=Archivo:wght@700;800&family=Zilla+Slab:wght@600;700&family=DM+Serif+Display&display=swap";
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230F0F12'/%3E%3Cpath d='M16 5l2.6 8.4L27 16l-8.4 2.6L16 27l-2.6-8.4L5 16l8.4-2.6z' fill='%23FF3D7F'/%3E%3C/svg%3E";

for (const file of fs.readdirSync(src("pages"))) {
  const raw = fs.readFileSync(src("pages", file), "utf8");
  const meta = raw.match(/^<!-- title: (.*?) \| description: (.*?) -->\r?\n/);
  if (!meta) throw new Error(`${file} needs a title and description comment on its first line`);
  const page = path.basename(file, ".html");
  const body = raw.slice(meta[0].length)
    .replace("{{form}}", parts.form)
    .replace("{{plans}}", parts.plans)
    .replace("{{faq}}", parts.faq);
  const header = parts.header.split(`data-nav="${page}"`).join('aria-current="page"');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta[1]}</title>
<meta name="description" content="${meta[2]}">
<link rel="icon" href="${ICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="sample.css?v=11">
<link rel="stylesheet" href="styles.css?v=11">
</head>
<body data-page="${page}">
${header}
<main id="main">
${body}
</main>
${parts.footer}
<script src="sample.js?v=11"></script>
<script src="app.js?v=11"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(__dirname, `${page}.html`), html);
  console.log(`built ${page}.html`);
}
