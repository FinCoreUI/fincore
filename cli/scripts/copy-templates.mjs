import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '..');
const templatesDir = path.resolve(cliRoot, 'templates');

// Source -> Template destination map
const templateManifest = [
  // button
  {
    source: path.resolve(repoRoot, "react/button/index.tsx"),
    dest: path.resolve(templatesDir, "components/button/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/button/button.css"),
    dest: path.resolve(templatesDir, "styles/button.css")
  },
  // input
  {
    source: path.resolve(repoRoot, "react/input/index.tsx"),
    dest: path.resolve(templatesDir, "components/input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/input/input.css"),
    dest: path.resolve(templatesDir, "styles/input.css")
  },
  // password-input
  {
    source: path.resolve(repoRoot, "react/password-input/index.tsx"),
    dest: path.resolve(templatesDir, "components/password-input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/password-input/password-input.css"),
    dest: path.resolve(templatesDir, "styles/password-input.css")
  },
  // phone-input
  {
    source: path.resolve(repoRoot, "react/phone-input/index.tsx"),
    dest: path.resolve(templatesDir, "components/phone-input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/phone-input/phone-input.css"),
    dest: path.resolve(templatesDir, "styles/phone-input.css")
  },
  // select
  {
    source: path.resolve(repoRoot, "react/select/index.tsx"),
    dest: path.resolve(templatesDir, "components/select/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/select/select.css"),
    dest: path.resolve(templatesDir, "styles/select.css")
  },
  // checkbox
  {
    source: path.resolve(repoRoot, "react/checkbox/index.tsx"),
    dest: path.resolve(templatesDir, "components/checkbox/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/checkbox/checkbox.css"),
    dest: path.resolve(templatesDir, "styles/checkbox.css")
  },
  // radio-group
  {
    source: path.resolve(repoRoot, "react/radio-group/index.tsx"),
    dest: path.resolve(templatesDir, "components/radio-group/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/radio-group/radio-group.css"),
    dest: path.resolve(templatesDir, "styles/radio-group.css")
  },
  // textarea
  {
    source: path.resolve(repoRoot, "react/textarea/index.tsx"),
    dest: path.resolve(templatesDir, "components/textarea/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/textarea/textarea.css"),
    dest: path.resolve(templatesDir, "styles/textarea.css")
  },
  // otp
  {
    source: path.resolve(repoRoot, "react/otp/index.tsx"),
    dest: path.resolve(templatesDir, "components/otp/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/otp/otp.css"),
    dest: path.resolve(templatesDir, "styles/otp.css")
  },
  // currency
  {
    source: path.resolve(repoRoot, "react/currency/index.tsx"),
    dest: path.resolve(templatesDir, "components/currency/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/currency/currency.css"),
    dest: path.resolve(templatesDir, "styles/currency.css")
  },
  // cvv
  {
    source: path.resolve(repoRoot, "react/cvv/index.tsx"),
    dest: path.resolve(templatesDir, "components/cvv/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/cvv/cvv.css"),
    dest: path.resolve(templatesDir, "styles/cvv.css")
  },
  // date-picker
  {
    source: path.resolve(repoRoot, "react/date-picker/index.tsx"),
    dest: path.resolve(templatesDir, "components/date-picker/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/date-picker/date-picker.css"),
    dest: path.resolve(templatesDir, "styles/date-picker.css")
  },
  // Shared types
  {
    source: path.resolve(repoRoot, "react/types/index.ts"),
    dest: path.resolve(templatesDir, "components/types/index.ts")
  },
  // Shared tokens CSS
  {
    source: path.resolve(repoRoot, "tokens/dist/tokens.css"),
    dest: path.resolve(templatesDir, "styles/tokens.css")
  }
];

export function copyTemplates() {
  console.log('Copying canonical sources into cli/templates/...');
  for (const item of templateManifest) {
    if (!fs.existsSync(item.source)) {
      throw new Error(`Canonical source missing: ${item.source}`);
    }
    const destDir = path.dirname(item.dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(item.source, item.dest);
    console.log(`  ✓ ${path.relative(repoRoot, item.source)} -> ${path.relative(cliRoot, item.dest)}`);
  }
  console.log('Templates packaging complete.');
}

// When executed directly as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  copyTemplates();
}
