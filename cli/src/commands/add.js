import fs from 'node:fs';
import path from 'node:path';
import { buttonRegistry } from '../registry/button.js';
import { checkboxRegistry } from '../registry/checkbox.js';
import { currencyRegistry } from '../registry/currency.js';
import { cvvRegistry } from '../registry/cvv.js';
import { datePickerRegistry } from '../registry/date-picker.js';
import { cardRegistry } from '../registry/card.js';
import { alertRegistry } from '../registry/alert.js';
import { tabsRegistry } from '../registry/tabs.js';
import { tableRegistry } from '../registry/table.js';
import { badgeRegistry } from '../registry/badge.js';
import { switchRegistry } from '../registry/switch.js';
import { tooltipRegistry } from '../registry/tooltip.js';
import { popoverRegistry } from '../registry/popover.js';
import { drawerRegistry } from '../registry/drawer.js';
import { dividerRegistry } from '../registry/divider.js';
import { transactionItemRegistry } from '../registry/transaction-item.js';
import { balanceCardRegistry } from '../registry/balance-card.js';
import { amountDisplayRegistry } from '../registry/amount-display.js';
import { statusIndicatorRegistry } from '../registry/status-indicator.js';
import { stackRegistry } from '../registry/stack.js';
import { inlineRegistry } from '../registry/inline.js';
import { containerRegistry } from '../registry/container.js';
import { inputRegistry } from '../registry/input.js';
import { otpRegistry } from '../registry/otp.js';
import { passwordInputRegistry } from '../registry/password-input.js';
import { phoneInputRegistry } from '../registry/phone-input.js';
import { radioGroupRegistry } from '../registry/radio-group.js';
import { selectRegistry } from '../registry/select.js';
import { textareaRegistry } from '../registry/textarea.js';
import { resolveConsumerPath, isPathInside } from '../utils/paths.js';

function getRegistry(component) {
  if (component === 'button') return buttonRegistry;
  if (component === 'checkbox') return checkboxRegistry;
  if (component === 'currency') return currencyRegistry;
  if (component === 'cvv') return cvvRegistry;
  if (component === 'date-picker' || component === 'datepicker') return datePickerRegistry;
  if (component === 'card') return cardRegistry;
  if (component === 'alert') return alertRegistry;
  if (component === 'tabs') return tabsRegistry;
  if (component === 'table') return tableRegistry;
  if (component === 'badge') return badgeRegistry;
  if (component === 'switch') return switchRegistry;
  if (component === 'tooltip') return tooltipRegistry;
  if (component === 'popover') return popoverRegistry;
  if (component === 'drawer') return drawerRegistry;
  if (component === 'divider') return dividerRegistry;
  if (component === 'transaction-item' || component === 'transactionitem') return transactionItemRegistry;
  if (component === 'balance-card' || component === 'balancecard') return balanceCardRegistry;
  if (component === 'amount-display' || component === 'amountdisplay') return amountDisplayRegistry;
  if (component === 'status-indicator' || component === 'statusindicator') return statusIndicatorRegistry;
  if (component === 'stack') return stackRegistry;
  if (component === 'inline') return inlineRegistry;
  if (component === 'container') return containerRegistry;
  if (component === 'input') return inputRegistry;
  if (component === 'otp') return otpRegistry;
  if (component === 'password-input' || component === 'passwordinput') return passwordInputRegistry;
  if (component === 'phone-input' || component === 'phoneinput') return phoneInputRegistry;
  if (component === 'radio-group' || component === 'radiogroup') return radioGroupRegistry;
  if (component === 'select') return selectRegistry;
  if (component === 'textarea') return textareaRegistry;
  return null;
}

function filesEqual(a, b) {
  try {
    const bufA = fs.readFileSync(a);
    const bufB = fs.readFileSync(b);
    return bufA.equals(bufB);
  } catch {
    return false;
  }
}

export async function addCommand(args) {
  const flags = parseFlags(args);
  const component = args[0];
  
  if (!component) {
    console.error('Error: Component name required');
    console.error('Usage: weft add <component> [--dir <path>] [--dry-run]');
    console.error('Components: alert, badge, button, card, checkbox, currency, cvv, date-picker, input, otp, password-input, phone-input, radio-group, select, switch, table, tabs, textarea');
    process.exit(1);
  }
  
  const registry = getRegistry(component);
  if (!registry) {
    console.error(`Error: Unknown component "${component}". Only "alert", "badge", "button", "card", "checkbox", "currency", "cvv", "date-picker", "input", "otp", "password-input", "phone-input", "radio-group", "select", "switch", "table", "tabs", and "textarea" are supported in this version.`);
    process.exit(1);
  }
  
  const isDryRun = flags['--dry-run'] || flags.dryRun;
  const consumerDir = flags['--dir'] || flags.dir || process.cwd();
  const consumerResolved = path.resolve(consumerDir);
  
  console.log(isDryRun ? 'Weft CLI (dry-run)' : 'Weft CLI');
  console.log('=====================');
  console.log(`Consumer directory: ${consumerResolved}`);
  console.log(`Component: ${registry.displayName}`);
  console.log('');
  
  const filesToCopy = [];
  const conflicts = [];
  const reused = [];
  
  // Preflight
  for (const file of registry.files) {
    const source = file.source;
    const destSegments = Array.isArray(file.dest) ? file.dest : [file.dest];
    const destPath = resolveConsumerPath(consumerResolved, ...destSegments);
    
    if (!isPathInside(consumerResolved, destPath)) {
      console.error(`Error: Destination path escapes consumer directory: ${destPath}`);
      process.exit(1);
    }
    
    if (!fs.existsSync(source)) {
      console.error(`Error: Missing required source file: ${source}`);
      process.exit(1);
    }
    const sourceStat = fs.statSync(source);
    if (!sourceStat.isFile()) {
      console.error(`Error: Source is not a regular file: ${source}`);
      process.exit(1);
    }
    
    const exists = fs.existsSync(destPath);
    if (exists) {
      if (file.shared) {
        if (filesEqual(source, destPath)) {
          reused.push({ file: destPath, sharedKey: file.sharedKey });
        } else {
          conflicts.push({ file: destPath, shared: file.shared, reason: 'different' });
        }
      } else {
        conflicts.push({ file: destPath, shared: file.shared });
      }
    }
    
    filesToCopy.push({
      ...file,
      source,
      destPath,
      exists
    });
  }
  
  // Report
  console.log('Files that would be copied:');
  console.log('');
  for (const file of filesToCopy) {
    const relDest = path.relative(consumerResolved, file.destPath);
    console.log(`  [${file.required ? 'REQ' : 'OPT'}] ${relDest}`);
    console.log(`      Source: ${file.source}`);
    console.log(`      Type: ${file.type}${file.shared ? ` (shared: ${file.sharedKey})` : ''}`);
    if (file.exists && file.shared) {
      const isReused = reused.find(r => r.file === file.destPath);
      if (isReused) {
        console.log(`      Status: REUSE - identical shared file exists`);
      } else {
        console.log(`      Status: CONFLICT - different shared file exists`);
      }
    } else if (file.exists) {
      console.log(`      Status: CONFLICT - destination already exists`);
    } else if (file.shared) {
      console.log(`      Status: ${isDryRun ? 'Would be created (shared - copied once)' : 'Would be created (shared)'}`);
    } else {
      console.log(`      Status: ${isDryRun ? 'Would be created' : 'Would be created'}`);
    }
    console.log('');
  }
  
  console.log('Dependencies:');
  console.log(`  Peer: ${registry.dependencies.peer.join(', ')}`);
  console.log(`  Runtime: ${registry.dependencies.runtime.length ? registry.dependencies.runtime.join(', ') : 'none'}`);
  console.log('');
  
  if (component === 'phone-input' || component === 'phoneinput') {
    console.log('Important: PhoneInput requires the "libphonenumber-js" package at runtime.');
    console.log('  Install it in your consumer project: npm install libphonenumber-js');
    console.log('  Button and Input do not require this dependency.');
    console.log('');
  }
  
  console.log('Required CSS imports (order matters):');
  console.log(`  1. import "./styles/fincore/tokens.css";`);
  console.log(`  2. import "./styles/fincore/${component === 'phone-input' || component === 'phoneinput' ? 'phone-input' : component}.css";`);
  console.log('');
  console.log('  Note: CSS imports require a bundler that supports CSS imports.');
  console.log('  Tokens must be loaded before component CSS.');
  console.log('');
  
  if (conflicts.length > 0) {
    console.log('Conflicts:');
    for (const c of conflicts) {
      console.log(`  - ${c.file} already exists${c.reason === 'different' ? ' (different content)' : ''}`);
    }
    console.log('');
    console.log('Note: Conflict resolution will be implemented in a later step.');
    if (isDryRun) {
      console.log('No files were written (dry-run).');
      return 0;
    } else {
      console.log('Installation aborted. No files were copied.');
      return 1;
    }
  }
  
  if (isDryRun) {
    console.log('No conflicts detected.');
    if (reused.length > 0) {
      console.log(`Reusing ${reused.length} identical shared file(s).`);
    }
    console.log('No files were written (dry-run).');
    return 0;
  }
  
  // Copy (skip reused shared files)
  const createdFiles = [];
  try {
    for (const file of filesToCopy) {
      if (file.exists && file.shared) {
        const isReused = reused.find(r => r.file === file.destPath);
        if (isReused) {
          continue; // skip
        }
      }
      if (file.exists) continue;
      const dir = path.dirname(file.destPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(file.source, file.destPath);
      createdFiles.push(file.destPath);
    }
    console.log('Installation complete.');
    console.log('Copied files:');
    if (createdFiles.length === 0) {
      console.log('  (none - all files reused or already present)');
    } else {
      for (const f of createdFiles) {
        console.log(`  - ${path.relative(consumerResolved, f)}`);
      }
    }
    if (reused.length > 0) {
      console.log('Reused shared files:');
      for (const r of reused) {
        console.log(`  - ${path.relative(consumerResolved, r.file)} (${r.sharedKey})`);
      }
    }
    return 0;
  } catch (error) {
    // Rollback
    for (const f of createdFiles) {
      try {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
        }
      } catch {}
    }
    console.error(`Error during installation: ${error.message}`);
    console.error('Rollback attempted. No pre-existing files were modified.');
    return 1;
  }
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i];
      const next = args[i + 1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        flags[key.replace('--', '')] = next;
        i++;
      } else {
        flags[key] = true;
        flags[key.replace('--', '')] = true;
      }
    }
  }
  return flags;
}
