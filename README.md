# Playwright on Firefox: responses become slower to store

This repository is a minimal reproduction of a Playwright bug. On Firefox, after a page receives 100 MiB of response bodies, each new response takes longer to store than the one before it.

## Steps

You need Node.js 24 or later.

```sh
npm install
npx playwright install firefox chromium
node repro.mjs           # Firefox
node repro.mjs chromium  # Chromium, for comparison
```

The script fetches a 40 KB response 120,000 times. It prints the seconds for each group of 5,000 fetches.

- On Firefox, the time for each group grows during the run, from about 15 s to 32 s. The run takes about 9 minutes.
- On Chromium, the time stays at about 7 s.

These numbers are from Playwright 1.65.0 on a Linux VM with 16 vCPUs.
