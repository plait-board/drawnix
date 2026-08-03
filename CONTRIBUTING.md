# Contributing to Drawnix

Thank you for contributing. Bug fixes, tests, documentation, translations, performance improvements, and focused features are welcome.

## Community Language

Drawnix uses English for issues, pull requests, discussions, reviews, commit messages, and contributor documentation. Localized product content is welcome, but contribution discussions should remain in English.

## Before You Start

- Search existing issues and discussions first.
- Reproduce bugs on the latest `develop` branch.
- Keep each issue or pull request focused on one problem.
- Discuss large features, architecture changes, or `.drawnix` format changes before implementation.
- Verify AI-assisted findings. Do not publish raw AI audit output or batches of unverified issues.

## Local Development

Use the Node.js version in `.nvmrc`.

```bash
npm ci
npm run start
```

Before opening a pull request, run the checks that apply to your change:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

For interaction changes, install the Playwright browsers and run the E2E tests:

```bash
npx playwright install
npx nx e2e web-e2e
```

## Pull Requests

- Target the `develop` branch.
- Use an English title, description, and clear commit messages.
- Explain what changed and why; link the related issue when available.
- Add or update tests for behavior changes.
- Include screenshots or a recording for visible UI changes.
- Update documentation and translations when needed.
- Preserve compatibility with existing `.drawnix` files when changing import, export, clipboard, or serialization behavior.
- Avoid unrelated formatting, refactoring, or dependency changes.

## AI-Assisted Contributions

AI tools are welcome, but contributors remain responsible for their work. If AI generated or substantially modified code, tests, or documentation, disclose:

- The tool and model, if known
- What the AI helped with
- Your human review and testing

You must understand, explain, and maintain the submitted changes. Raw or unverified AI output is not acceptable. Trivial autocomplete, spelling, and formatting assistance do not require disclosure.

Do not provide secrets, private vulnerability details, personal data, or unauthorized content to external AI services.

## License

By contributing, you agree that your contribution will be licensed under the repository's MIT License.
