# Darshan's Astrology World — local run and deployment

## Run locally (Windows PowerShell)

Requires Node.js 20+. This project uses Node.js built-ins only; no `npm install` is required.

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

If `.env` already exists, edit it instead of overwriting it. Then open `http://127.0.0.1:4173`. The integration status endpoint is `http://127.0.0.1:4173/api/health`. Alternatively, run `./start.ps1` from PowerShell.

## Provider configuration

- `GOOGLE_TRANSLATE_API_KEY` enables live translation through Google Cloud Translation. Enable the API and set up billing/restrictions in Google Cloud Console first.
- `PROKERALA_CLIENT_ID` and `PROKERALA_CLIENT_SECRET` enable OAuth-authenticated birth-chart calculations. Users must select an exact birthplace and consent to sending their birth date, time, time zone, and coordinates to Prokerala.
- Obtain keys from the provider accounts; the project cannot generate valid credentials on the user's behalf. Never place real keys in the ZIP or source control. Add them to `.env` locally or as environment secrets on the hosting platform.
- Restart the server after changing `.env`.

## Functionality and limitations

The app includes a live translation route, a Prokerala kundli route, place search, and an `/api/health` diagnostics route. The calculated Prokerala response is shown for inspection; the decorative North Indian SVG is still illustrative and its placements are not yet automatically mapped from the provider response. Astrology, tarot, and numerology are reflective traditions, not scientific predictions.

Saved profiles/readings use browser-local storage/IndexedDB. There is no hosted account database, server-side user storage, or cross-device sync in this package.

## Deploy publicly with Render (GitHub required)

This package is ready to deploy, but creating a public URL requires your hosting account and a Git repository. Render does not deploy a ZIP by itself; upload/extract these files into a GitHub repository first.

1. Extract the ZIP and create a **private** GitHub repository (recommended because this app is still under development).
2. Upload the project files to the repository. Do not upload `.env` or real API credentials.
3. In Render, choose **New → Blueprint** and connect that repository. Render will read `render.yaml` and create the Node web service.
4. In the Render service's **Environment** settings, add `GOOGLE_TRANSLATE_API_KEY`, `PROKERALA_CLIENT_ID`, and `PROKERALA_CLIENT_SECRET` using the real values from your provider accounts. Keep secrets in Render, not in GitHub.
5. Wait for the deployment to finish, then open the `onrender.com` URL shown by Render. Test `/api/health` and check that the integrations you configured show `true`.
6. Test city search, timezone lookup, translation, and a birth chart with explicit consent. Confirm provider plan/quota and billing first.

`render.yaml` sets the start command and health-check path. Render supplies `PORT`; the server listens on it and on `0.0.0.0`. If you use a different host, configure its Node 20+ runtime, start command `npm start`, health check `/api/health`, and the same environment secrets.

## Production checklist

Use HTTPS; configure provider secrets through the host's environment-variable facility; confirm provider plan/quota; and ensure the privacy notice describes third-party translation and ephemeris processing. Never expose `.env` or include credentials in source archives. Browser-local profiles/readings are not backed up to a server and do not sync across devices.

## Birthplace city selector

The Kundali birthplace field provides an autocomplete dropdown. Type a city name and select a result formatted as `City, State, Country`; this selection supplies the coordinates needed by the optional Prokerala calculation. The app then automatically looks up the location’s IANA time zone using those coordinates and fills the time-zone field. The user can still edit it when needed. This lookup requires an internet connection and uses Open-Meteo.


## One-click Windows startup

Double-click `Launch-Astrology-App.bat`. It checks for Node.js 20+, creates `.env` from `.env.example` if needed, starts the app in a separate terminal window, and opens `http://127.0.0.1:4173` in the default browser. Keep the server terminal open while using the app.
