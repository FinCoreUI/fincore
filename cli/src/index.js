import { addCommand } from './commands/add.js';

export async function run(argv) {
  if (argv.length === 0) {
    console.log('Weft CLI');
    console.log('Usage: weft add <component> [--dir <path>] [--dry-run]');
    console.log('Components: button, checkbox, currency, cvv, date-picker, input, otp, password-input, phone-input, radio-group, select, textarea');
    console.log('');
    console.log('Notes:');
    console.log('  - Button, Checkbox, Currency, CVV, DatePicker, Input, OTP, PasswordInput, RadioGroup, Select and Textarea: no extra runtime dependencies');
    console.log('  - PhoneInput: requires libphonenumber-js (peer/runtime dependency)');
    return 0;
  }
  
  const command = argv[0];
  
  if (command === 'add') {
    try {
      return await addCommand(argv.slice(1));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return 1;
    }
  }
  
  console.error(`Error: Unknown command "${command}"`);
  console.error('Usage: weft add <component> [--dir <path>] [--dry-run]');
  return 1;
}
