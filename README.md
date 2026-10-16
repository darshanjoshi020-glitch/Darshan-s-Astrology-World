# Darshan's Astrology World — integration-ready package

This is the app source ZIP with server-side integrations for Google Cloud Translation and Prokerala birth-chart calculations. It uses Node.js built-ins only; **no `npm install` is needed**.

## 1. Requirements

- Node.js 20 or newer
- Internet access for place search and any enabled provider APIs
- A Google Cloud Translation API key for live translations (optional)
- Prokerala API client ID and client secret for real birth-chart calculations (optional)

## 2. Run on Windows PowerShell

Open PowerShell in the extracted folder and run:

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

If `.env` already exists, do not overwrite it; edit the existing file instead. Open <http://127.0.0.1:4173> in your browser. To check the server and integration setup, open <http://127.0.0.1:4173/api/health>.

For a one-click Windows launch, double-click `Launch-Astrology-App.bat`; it creates `.env` if needed, starts the server in a separate terminal, and opens the app in your browser. You can also run `./start.ps1`; it creates `.env` from `.env.example` only if needed, then starts the app.

## Birthplace city dropdown

On the Kundali form, type at least two letters of the city name. Choose a suggestion from the dropdown; each option is formatted as **City, State, Country**. Selecting a result fills the birthplace field and records coordinates for the optional Prokerala calculation. The app then detects the city’s IANA time zone from its coordinates and fills the birth-time-zone field automatically (for example, `Asia/Kolkata`). You can edit the time zone if the birth occurred under a different historical/local zone. Choose the exact city when multiple places share a name. City and time-zone lookup require an internet connection.

## 3. Enable live translation

In Google Cloud Console, enable **Cloud Translation API**, create an API key, and ensure billing/API restrictions are configured for your project. Put the key in `.env`:

```dotenv
GOOGLE_TRANSLATE_API_KEY=PASTE_YOUR_REAL_KEY_HERE
```

Restart `npm start` after changing `.env`. The key stays on the server and is not sent to browser JavaScript. Without it, the app opens, but live translations and the provider-backed language list show an unavailable message.

## 4. Enable real birth-chart calculations

Create/obtain API credentials from Prokerala and put both values in `.env`:

```dotenv
PROKERALA_CLIENT_ID=PASTE_YOUR_REAL_CLIENT_ID_HERE
PROKERALA_CLIENT_SECRET=PASTE_YOUR_REAL_CLIENT_SECRET_HERE
```

Restart the server. In the app, enter birth date and time, search for and select the exact birthplace result (needed for coordinates), verify the automatically detected time zone, and check the consent box to send those details to Prokerala. The server obtains an OAuth token and calls the Prokerala advanced kundli endpoint. Provider plan access, API quota, and endpoint/schema changes are controlled by Prokerala.

The app displays the returned provider payload for review. The North Indian SVG in this version remains an illustrative template; provider values are not yet mapped into each house of that SVG. Do not treat the decorative planet placements as calculated results.

## 5. Privacy and storage

- `.env` contains secrets and is excluded from the ZIP/repository by `.gitignore`.
- Birth-chart requests are sent to Prokerala only after the app's explicit consent checkbox is selected.
- Translation text is sent to Google Cloud Translation when live translation is used.
- Saved profiles and readings use browser-local storage/IndexedDB. This package does **not** include a hosted database, user accounts, or cross-device sync.
- Use HTTPS and your hosting provider's secret/environment-variable settings for public deployment. Do not expose `.env` or commit API keys.

## Troubleshooting

- `GET /api/health` reports whether each provider credential is present; it never returns secret values.
- `Set GOOGLE_TRANSLATE_API_KEY...`: check `.env`, confirm the API is enabled, and restart the server.
- `Real kundli calculations are not configured...`: add both Prokerala values and restart.
- Authentication, quota, billing, or plan errors must be resolved in the provider's own console/account.
- Place search requires internet access but no provider key.


### Public deployment
A Render Blueprint is included in `render.yaml`, and a `Dockerfile` is included for container hosts. Follow `DEPLOY.md` to publish. The ZIP itself does not create a public website: you must push the files to a Git repository, connect it to a hosting account, and configure real provider secrets in that host's environment settings. Never commit `.env` or API keys.
