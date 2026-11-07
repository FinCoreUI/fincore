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
  // card
  {
    source: path.resolve(repoRoot, "react/card/index.tsx"),
    dest: path.resolve(templatesDir, "components/card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/card/card.css"),
    dest: path.resolve(templatesDir, "styles/card.css")
  },
  // alert
  {
    source: path.resolve(repoRoot, "react/alert/index.tsx"),
    dest: path.resolve(templatesDir, "components/alert/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/alert/alert.css"),
    dest: path.resolve(templatesDir, "styles/alert.css")
  },
  // tabs
  {
    source: path.resolve(repoRoot, "react/tabs/index.tsx"),
    dest: path.resolve(templatesDir, "components/tabs/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/tabs/tabs.css"),
    dest: path.resolve(templatesDir, "styles/tabs.css")
  },
  // table
  {
    source: path.resolve(repoRoot, "react/table/index.tsx"),
    dest: path.resolve(templatesDir, "components/table/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/table/table.css"),
    dest: path.resolve(templatesDir, "styles/table.css")
  },
  // badge
  {
    source: path.resolve(repoRoot, "react/badge/index.tsx"),
    dest: path.resolve(templatesDir, "components/badge/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/badge/badge.css"),
    dest: path.resolve(templatesDir, "styles/badge.css")
  },
  // switch
  {
    source: path.resolve(repoRoot, "react/switch/index.tsx"),
    dest: path.resolve(templatesDir, "components/switch/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/switch/switch.css"),
    dest: path.resolve(templatesDir, "styles/switch.css")
  },
  // tooltip
  {
    source: path.resolve(repoRoot, "react/tooltip/index.tsx"),
    dest: path.resolve(templatesDir, "components/tooltip/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/tooltip/tooltip.css"),
    dest: path.resolve(templatesDir, "styles/tooltip.css")
  },
  // popover
  {
    source: path.resolve(repoRoot, "react/popover/index.tsx"),
    dest: path.resolve(templatesDir, "components/popover/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/popover/popover.css"),
    dest: path.resolve(templatesDir, "styles/popover.css")
  },
  // drawer
  {
    source: path.resolve(repoRoot, "react/drawer/index.tsx"),
    dest: path.resolve(templatesDir, "components/drawer/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/drawer/drawer.css"),
    dest: path.resolve(templatesDir, "styles/drawer.css")
  },
  // divider
  {
    source: path.resolve(repoRoot, "react/divider/index.tsx"),
    dest: path.resolve(templatesDir, "components/divider/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/divider/divider.css"),
    dest: path.resolve(templatesDir, "styles/divider.css")
  },
  // transaction-item
  {
    source: path.resolve(repoRoot, "react/transaction-item/index.tsx"),
    dest: path.resolve(templatesDir, "components/transaction-item/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/transaction-item/transaction-item.css"),
    dest: path.resolve(templatesDir, "styles/transaction-item.css")
  },
  // balance-card
  {
    source: path.resolve(repoRoot, "react/balance-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/balance-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/balance-card/balance-card.css"),
    dest: path.resolve(templatesDir, "styles/balance-card.css")
  },
  // amount-display
  {
    source: path.resolve(repoRoot, "react/amount-display/index.tsx"),
    dest: path.resolve(templatesDir, "components/amount-display/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/amount-display/amount-display.css"),
    dest: path.resolve(templatesDir, "styles/amount-display.css")
  },
  // status-indicator
  {
    source: path.resolve(repoRoot, "react/status-indicator/index.tsx"),
    dest: path.resolve(templatesDir, "components/status-indicator/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/status-indicator/status-indicator.css"),
    dest: path.resolve(templatesDir, "styles/status-indicator.css")
  },
  // stack
  {
    source: path.resolve(repoRoot, "react/stack/index.tsx"),
    dest: path.resolve(templatesDir, "components/stack/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/stack/stack.css"),
    dest: path.resolve(templatesDir, "styles/stack.css")
  },
  // inline
  {
    source: path.resolve(repoRoot, "react/inline/index.tsx"),
    dest: path.resolve(templatesDir, "components/inline/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/inline/inline.css"),
    dest: path.resolve(templatesDir, "styles/inline.css")
  },
  // container
  {
    source: path.resolve(repoRoot, "react/container/index.tsx"),
    dest: path.resolve(templatesDir, "components/container/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/container/container.css"),
    dest: path.resolve(templatesDir, "styles/container.css")
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
