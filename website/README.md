# Sorleed documentation website

A static, dependency-free documentation site. No build step, no tracking and no
external runtime.

## Pages

| Page | Content |
|---|---|
| `index.html` | Product overview and quick install. |
| `getting-started.html` | React package, CLI, plain CSS and requirements. |
| `components.html` | Button, Input, PasswordInput and PhoneInput with live demos. |
| `tokens.html` | Token layers, naming, families and customisation. |
| `cli.html` | CLI commands, copied files, conflicts and limitations. |
| `customisation.html` | Token overrides and source edits. |
| `accessibility.html` | Implemented semantics, keyboard behaviour and limits. |
| `ai.html` | AI context files and rules. |
| `limitations.html` | What is not implemented and how to get support. |

## Run locally

From the repository root:

```sh
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/website/`.

Serving from the repository root keeps the relative token and component CSS
paths valid. Opening the HTML files directly from disk will also work in most
browsers, but a local server is closer to production.

## Deploy

The site is plain static files. Any static host works.

### GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the branch (`main`) and the folder `/website`.
4. Save. GitHub serves the site at the Pages URL.

The `.nojekyll` file disables Jekyll processing, so files are served as-is.

### Netlify, Cloudflare Pages or Vercel

- Build command: none.
- Output directory: `website`.

### Any static server

Copy the `website/` directory and the paths it references:

```text
website/
tokens/dist/tokens.css
components/button/button.css
components/input/input.css
components/password-input/password-input.css
components/phone-input/phone-input.css
```

If you deploy only `website/`, either copy those stylesheets into the site or
update the relative `<link>` paths. The current paths assume the repository
root is the server root.

## Validation

- All internal HTML links are checked by the repository test suite.
- The site uses the real token and component stylesheets, so it reflects the
  shipped implementation.
- No analytics, cookies, fonts or third-party scripts are loaded.

## Known limits

- No search index.
- No versioned docs switcher.
- No server-side rendering; this is static HTML.
- Figma delivery notes live in `figma/README.md`, not on the site.
