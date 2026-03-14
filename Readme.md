# playwright-qa-assignment

Playwright automation suite for the **Restful-Booker** Bed & Breakfast platform — covering API and UI testing with CI/CD via GitHub Actions.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Test framework (API + UI) |
| Node.js 20 | Runtime |
| dotenv | Environment variable management |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | HTML report hosting |

---

## Project Structure

```
playwright-qa-assignment/
├── .github/workflows/playwright.yml   # CI/CD pipeline
├── helpers/
│   ├── auth.helper.js                 # Token caching + cookie helper
│   └── booking.helper.js              # Booking payload builder + cleanup utils
├── pages/                             # Page Object Model classes
│   ├── HomePage.js
│   ├── ContactPage.js
│   ├── AdminLoginPage.js
│   └── AdminRoomsPage.js
├── tests/
│   ├── api/
│   │   ├── auth.spec.js
│   │   ├── booking-read.spec.js
│   │   ├── booking-crud.spec.js
│   │   ├── room.spec.js
│   │   ├── message.spec.js
│   │   └── branding.spec.js
│   └── ui/
│       ├── homepage.spec.js
│       ├── contact.spec.js
│       └── admin.spec.js
├── .env
├── package.json
└── playwright.config.js
```

---

## Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/playwright-qa-assignment.git
cd playwright-qa-assignment

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps chromium

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 5. Run all tests
npm test

# 6. Run only API tests
npm run test:api

# 7. Run only UI tests
npm run test:ui

# 8. View HTML report
npm run report
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | Web UI base URL | `https://automationintesting.online` |
| `BASE_API_URL` | API base URL | `https://automationintesting.online` |
| `ADMIN_USER` | Admin username | `admin` |
| `ADMIN_PASS` | Admin password | `password` |

Store these as **GitHub Secrets** (`ADMIN_USER`, `ADMIN_PASS`, `BASE_URL`, `BASE_API_URL`) — never commit credentials to the repo.

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) triggers on:
- Push to `main`
- Pull request to `main`
- Manual `workflow_dispatch`

It runs API tests first, then UI tests, and uploads the HTML report as a workflow artifact.

**Report:** Available under the **Actions** tab → select a workflow run → **Artifacts** → `playwright-report`.

**GitHub Pages Report:** Published automatically on every push to `main`. URL is shown in the `publish-report` job output and set as the environment URL.

## Report Link: ** https://kishand123.github.io/playwright-qa-assignment/

---

## Test Coverage Summary


---

## Known Issues / Notes


--