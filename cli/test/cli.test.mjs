import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliBin = path.resolve(__dirname, '../bin/weft.mjs');
const legacyBin = path.resolve(__dirname, '../bin/fincore.mjs');
const repoRoot = path.resolve(__dirname, '../../');

function runCli(args, opts = {}) {
  const res = spawnSync(process.execPath, [cliBin, ...args], {
    encoding: 'utf8',
    timeout: 30000,
    ...opts
  });
  return { code: res.status ?? 0, stdout: res.stdout || '', stderr: res.stderr || '', error: res.error };
}

function mkTmp() {
  const dir = fs.mkdtempSync(path.join('/tmp', 'fincore-cli-test-'));
  return dir;
}

function filesEqual(a, b) {
  try {
    return fs.readFileSync(a).equals(fs.readFileSync(b));
  } catch {
    return false;
  }
}

test('help shows components', () => {
  const res = runCli([]);
  assert.match(res.stdout + res.stderr, /button|input|password-input|phone-input/i);
  assert.strictEqual(res.code, 0);
});

test('unknown component fails', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'unknown', '--dir', dir]);
  assert.notStrictEqual(res.code, 0);
  assert.match(res.stdout + res.stderr, /Unknown component/i);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install button into empty dir', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'button', '--dir', dir]);
  assert.strictEqual(res.code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/button/index.tsx')));
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/types/index.ts')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/button.css')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/tokens.css')));
  assert.ok(filesEqual(path.join(dir, 'components/fincore/button/index.tsx'), path.resolve(repoRoot, 'react/button/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'components/fincore/types/index.ts'), path.resolve(repoRoot, 'react/types/index.ts')));
  assert.ok(filesEqual(path.join(dir, 'styles/fincore/button.css'), path.resolve(repoRoot, 'components/button/button.css')));
  assert.ok(filesEqual(path.join(dir, 'styles/fincore/tokens.css'), path.resolve(repoRoot, 'tokens/dist/tokens.css')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install input into empty dir', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'input', '--dir', dir]);
  assert.strictEqual(res.code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/input/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'components/fincore/input/index.tsx'), path.resolve(repoRoot, 'react/input/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'styles/fincore/input.css'), path.resolve(repoRoot, 'components/input/input.css')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install password-input into empty dir', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'password-input', '--dir', dir]);
  assert.strictEqual(res.code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/password-input/index.tsx')));
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/types/index.ts')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/password-input.css')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/tokens.css')));
  assert.ok(filesEqual(path.join(dir, 'components/fincore/password-input/index.tsx'), path.resolve(repoRoot, 'react/password-input/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'styles/fincore/password-input.css'), path.resolve(repoRoot, 'components/password-input/password-input.css')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install phone-input into empty dir with deps notice', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'phone-input', '--dir', dir]);
  assert.strictEqual(res.code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/phone-input/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'components/fincore/phone-input/index.tsx'), path.resolve(repoRoot, 'react/phone-input/index.tsx')));
  assert.ok(filesEqual(path.join(dir, 'styles/fincore/phone-input.css'), path.resolve(repoRoot, 'components/phone-input/phone-input.css')));
  assert.match(res.stdout + res.stderr, /libphonenumber-js/i);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install all four in order button,input,password-input,phone-input reuses shared files', () => {
  const dir = mkTmp();
  assert.strictEqual(runCli(['add', 'button', '--dir', dir]).code, 0);
  assert.strictEqual(runCli(['add', 'input', '--dir', dir]).code, 0);
  assert.strictEqual(runCli(['add', 'password-input', '--dir', dir]).code, 0);
  assert.strictEqual(runCli(['add', 'phone-input', '--dir', dir]).code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/types/index.ts')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/tokens.css')));
  const res3 = runCli(['add', 'password-input', '--dir', dir]);
  assert.match(res3.stdout + res3.stderr, /REUSE|already exists|Conflicts/i);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('install all three in order phone-input,input,button reuses shared files', () => {
  const dir = mkTmp();
  assert.strictEqual(runCli(['add', 'phone-input', '--dir', dir]).code, 0);
  assert.strictEqual(runCli(['add', 'input', '--dir', dir]).code, 0);
  assert.strictEqual(runCli(['add', 'button', '--dir', dir]).code, 0);
  assert.ok(fs.existsSync(path.join(dir, 'components/fincore/types/index.ts')));
  assert.ok(fs.existsSync(path.join(dir, 'styles/fincore/tokens.css')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('repeated install detects conflicts and changes nothing', () => {
  const dir = mkTmp();
  assert.strictEqual(runCli(['add', 'button', '--dir', dir]).code, 0);
  const before = fs.readFileSync(path.join(dir, 'components/fincore/button/index.tsx'));
  const res = runCli(['add', 'button', '--dir', dir]);
  const after = fs.readFileSync(path.join(dir, 'components/fincore/button/index.tsx'));
  assert.deepStrictEqual(before, after);
  assert.match(res.stdout + res.stderr, /Conflicts|already exists/i);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('conflict on component file aborts before copying others', () => {
  const dir = mkTmp();
  fs.mkdirSync(path.join(dir, 'components/fincore/button'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'components/fincore/button/index.tsx'), 'DIFFERENT');
  const res = runCli(['add', 'button', '--dir', dir]);
  assert.notStrictEqual(res.code, 0);
  assert.match(res.stdout + res.stderr, /Conflicts/i);
  assert.ok(!fs.existsSync(path.join(dir, 'styles/fincore/button.css')));
  assert.ok(!fs.existsSync(path.join(dir, 'styles/fincore/tokens.css')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('conflict on different shared file aborts', () => {
  const dir = mkTmp();
  fs.mkdirSync(path.join(dir, 'components/fincore/types'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'components/fincore/types/index.ts'), 'DIFFERENT');
  const res = runCli(['add', 'button', '--dir', dir]);
  assert.notStrictEqual(res.code, 0);
  assert.match(res.stdout + res.stderr, /different|Conflicts/i);
  assert.ok(!fs.existsSync(path.join(dir, 'components/fincore/button/index.tsx')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('path traversal rejected', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'button', '--dir', path.join(dir, '../../..')]);
  // Should either fail or be rejected; ensure no files written outside expected area
  assert.ok(res.code !== 0 || res.stdout.includes('escapes') || res.stderr.includes('escapes'));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('dry-run creates nothing', () => {
  const dir = mkTmp();
  const res = runCli(['add', 'button', '--dir', dir, '--dry-run']);
  assert.strictEqual(res.code, 0);
  assert.ok(!fs.existsSync(path.join(dir, 'components')));
  assert.ok(!fs.existsSync(path.join(dir, 'styles')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('help mentions phone-input and libphonenumber', () => {
  const res = runCli([]);
  assert.match(res.stdout + res.stderr, /phone-input/i);
  assert.match(res.stdout + res.stderr, /libphonenumber/i);
});

test('rollback on mid-copy failure leaves no partial files', async () => {
  const dir = mkTmp();
  // Create a scenario where copy will fail mid-way by making destination dir read-only after first file?
  // Simpler: mock by replacing copyFileSync temporarily via wrapper - easier to test by pre-creating and failing
  // Use a file that can't be copied by making parent a file? Or just test rollback logic exists
  // Create dirs and make one file read-only in a way that breaks copy
  fs.mkdirSync(path.join(dir, 'components/fincore/button'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'styles/fincore'), { recursive: true });
  // Make styles dir a file to cause error
  const stylesPath = path.join(dir, 'styles');
  fs.rmSync(stylesPath, { recursive: true, force: true });
  fs.writeFileSync(stylesPath, 'BLOCK');
  const res = runCli(['add', 'button', '--dir', dir]);
  assert.notStrictEqual(res.code, 0);
  // Should not leave partial component files
  assert.ok(!fs.existsSync(path.join(dir, 'components/fincore/button/index.tsx')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('strict typescript consumer check with noUnusedLocals passes for button and input', () => {
  const dir = mkTmp();
  const reactNodeModules = path.resolve(repoRoot, 'react/node_modules');

  if (!fs.existsSync(reactNodeModules)) {
    // If react/node_modules is not present, clean up and skip safely
    fs.rmSync(dir, { recursive: true, force: true });
    return;
  }

  // Symlink existing dev dependencies (typescript, @types/react, etc.) into the consumer
  fs.symlinkSync(reactNodeModules, path.join(dir, 'node_modules'));

  // Install Button and Input through the actual FinCore CLI
  const resButton = runCli(['add', 'button', '--dir', dir]);
  assert.strictEqual(resButton.code, 0, 'CLI button installation should succeed');

  const resInput = runCli(['add', 'input', '--dir', dir]);
  assert.strictEqual(resInput.code, 0, 'CLI input installation should succeed');

  const resPassword = runCli(['add', 'password-input', '--dir', dir]);
  assert.strictEqual(resPassword.code, 0, 'CLI password-input installation should succeed');

  // Strict TypeScript configuration matching requirements
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true
    },
    include: ['components']
  }, null, 2));

  // Run TypeScript compiler on the consumer project
  const tscBin = path.join(dir, 'node_modules/typescript/bin/tsc');
  assert.ok(fs.existsSync(tscBin), 'TypeScript binary should be available in node_modules');

  const tscRes = spawnSync(process.execPath, [tscBin, '-p', dir], {
    encoding: 'utf8',
    timeout: 30000
  });

  const output = (tscRes.stdout || '') + (tscRes.stderr || '');
  assert.strictEqual(tscRes.status, 0, `tsc should exit with 0. Output: ${output}`);
  assert.ok(!output.includes('TS6133'), 'Output should not contain TS6133 unused variable errors');

  // Verify the test actually catches regressions:
  // Inject the old pattern into a copied file and assert it fails with TS6133
  const copiedButtonPath = path.join(dir, 'components/fincore/button/index.tsx');
  const originalCopiedContent = fs.readFileSync(copiedButtonPath, 'utf8');
  const regressionCode = originalCopiedContent.replace(
    'import React from "react";',
    'import React, { forwardRef } from "react";'
  ).replace(
    'React.forwardRef<HTMLButtonElement, ButtonProps>',
    'forwardRef<HTMLButtonElement, ButtonProps>'
  );

  fs.writeFileSync(copiedButtonPath, regressionCode);

  const tscRegressionRes = spawnSync(process.execPath, [tscBin, '-p', dir], {
    encoding: 'utf8',
    timeout: 30000
  });
  const regressionOutput = (tscRegressionRes.stdout || '') + (tscRegressionRes.stderr || '');

  assert.notStrictEqual(tscRegressionRes.status, 0, 'Regression code should fail tsc');
  assert.ok(regressionOutput.includes('TS6133'), 'Regression code should trigger TS6133');

  // Clean up temporary consumer directory
  fs.rmSync(dir, { recursive: true, force: true });
});

test('packed CLI tarball works in isolated consumer without repository access', () => {
  const tmpBase = mkTmp();
  const packDir = path.join(tmpBase, 'pack');
  const consumerDir = path.join(tmpBase, 'consumer');
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(consumerDir, { recursive: true });

  try {
    // 1. Pack the CLI into packDir
    const packRes = spawnSync('npm', ['pack', '--pack-destination', packDir], {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
      timeout: 30000
    });
    assert.strictEqual(packRes.status, 0, `npm pack failed: ${packRes.stderr || packRes.stdout}`);
    const tarballName = packRes.stdout.trim().split('\n').pop().trim();
    const tarballPath = path.join(packDir, tarballName);
    assert.ok(fs.existsSync(tarballPath), `Tarball not found at ${tarballPath}`);

    // 2. Unpack tarball inside an isolated directory simulating an npm install
    const installedCliDir = path.join(tmpBase, 'installed-cli');
    fs.mkdirSync(installedCliDir, { recursive: true });
    const tarRes = spawnSync('tar', ['-xzf', tarballPath, '-C', installedCliDir], {
      encoding: 'utf8',
      timeout: 30000
    });
    assert.strictEqual(tarRes.status, 0, `tar extraction failed: ${tarRes.stderr}`);
    const installedBin = path.join(installedCliDir, 'package/bin/weft.mjs');
    const installedLegacyBin = path.join(installedCliDir, 'package/bin/fincore.mjs');
    assert.ok(fs.existsSync(installedBin), 'Extracted weft.mjs binary exists');
    assert.ok(fs.existsSync(installedLegacyBin), 'Extracted fincore.mjs backwards-compatibility binary exists');

    // Helper to run the isolated installed CLI
    function runInstalledCli(args) {
      return spawnSync(process.execPath, [installedBin, ...args], {
        encoding: 'utf8',
        timeout: 30000
      });
    }

    // 3. Test dry-run on isolated consumer
    const dryRunRes = runInstalledCli(['add', 'button', '--dir', consumerDir, '--dry-run']);
    assert.strictEqual(dryRunRes.status, 0, `dry-run should succeed: ${dryRunRes.stderr}`);
    assert.ok(!fs.existsSync(path.join(consumerDir, 'components')));

    // 4. Test adding button
    const buttonRes = runInstalledCli(['add', 'button', '--dir', consumerDir]);
    assert.strictEqual(buttonRes.status, 0, `install button should succeed: ${buttonRes.stderr}`);
    assert.ok(fs.existsSync(path.join(consumerDir, 'components/fincore/button/index.tsx')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'components/fincore/types/index.ts')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'styles/fincore/button.css')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'styles/fincore/tokens.css')));

    // 5. Test adding input (reuses shared types and tokens)
    const inputRes = runInstalledCli(['add', 'input', '--dir', consumerDir]);
    assert.strictEqual(inputRes.status, 0, `install input should succeed: ${inputRes.stderr}`);
    assert.ok(fs.existsSync(path.join(consumerDir, 'components/fincore/input/index.tsx')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'styles/fincore/input.css')));
    assert.match(inputRes.stdout, /REUSE[\s\S]*fincore-shared-types/);
    assert.match(inputRes.stdout, /REUSE[\s\S]*fincore-tokens/);

    // 6. Test adding password-input
    const passRes = runInstalledCli(['add', 'password-input', '--dir', consumerDir]);
    assert.strictEqual(passRes.status, 0, `install password-input should succeed: ${passRes.stderr}`);
    assert.ok(fs.existsSync(path.join(consumerDir, 'components/fincore/password-input/index.tsx')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'styles/fincore/password-input.css')));
    assert.match(passRes.stdout, /REUSE[\s\S]*fincore-shared-types/);

    // 7. Test adding phone-input
    const phoneRes = runInstalledCli(['add', 'phone-input', '--dir', consumerDir]);
    assert.strictEqual(phoneRes.status, 0, `install phone-input should succeed: ${phoneRes.stderr}`);
    assert.ok(fs.existsSync(path.join(consumerDir, 'components/fincore/phone-input/index.tsx')));
    assert.ok(fs.existsSync(path.join(consumerDir, 'styles/fincore/phone-input.css')));
    assert.match(phoneRes.stdout, /libphonenumber-js/);

    // 8. Test conflict detection on re-install
    const conflictRes = runInstalledCli(['add', 'button', '--dir', consumerDir]);
    assert.strictEqual(conflictRes.status, 1, 're-install should exit with 1 due to conflicts');
    assert.match(conflictRes.stdout, /already exists/);

    // 8. Test rollback on failure
    const rollbackTargetDir = path.join(tmpBase, 'rollback-target');
    fs.mkdirSync(path.join(rollbackTargetDir, 'styles/fincore'), { recursive: true });
    // Replace styles with a blocking file to force copy failure midway
    fs.rmSync(path.join(rollbackTargetDir, 'styles'), { recursive: true, force: true });
    fs.writeFileSync(path.join(rollbackTargetDir, 'styles'), 'BLOCK');

    const rollbackRes = runInstalledCli(['add', 'button', '--dir', rollbackTargetDir]);
    assert.notStrictEqual(rollbackRes.status, 0, 'copy should fail when styles cannot be written');
    assert.ok(!fs.existsSync(path.join(rollbackTargetDir, 'components/fincore/button/index.tsx')), 'partially copied files should be rolled back');

    // 9. Path traversal protection
    const traversalRes = runInstalledCli(['add', 'button', '--dir', path.join(consumerDir, '../../..')]);
    assert.ok(traversalRes.status !== 0 || traversalRes.stdout.includes('escapes') || traversalRes.stderr.includes('escapes'));
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

