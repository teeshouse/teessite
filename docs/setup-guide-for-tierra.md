# Tee's House — Developer Setup Guide
## Getting the Project Running on a New Machine

---

## Step 1 — Install Prerequisites

On Tierra's machine, install these if not already there:

- **Node.js** (v18+): https://nodejs.org → download LTS
- **Git**: https://git-scm.com/download/win
- **VS Code** (optional but recommended): https://code.visualstudio.com

Verify they installed — open Terminal and run:

```
node -v
git -v
```

---

## Step 2 — Clone Both Repos

```
git clone https://github.com/teeshouse/teessite.git
git clone https://github.com/minher1/teeshouse-studio.git
```

---

## Step 3 — Set Up the Site (.env.local)

```
cd teessite
cp .env.example .env.local
```

Then open `.env.local` in VS Code and fill in every value. Copy them from Mike's `.env.local` at:

`C:\Users\MikeArbrouet\Documents\teessite\.env.local`

---

## Step 4 — Install Dependencies

```
# In teessite/
npm install

# In teeshouse-studio/
cd ../teeshouse-studio
npm install
```

---

## Step 5 — Test Locally (Optional)

```
# Run the site
cd teessite
npm run dev
# Opens at http://localhost:3000

# Run the studio
cd teeshouse-studio
npm run dev
# Opens at http://localhost:3333
```

---

## Step 6 — Connect Git to Her GitHub Account

```
git config --global user.name "Tierra Arbrouet"
git config --global user.email "tierra@teeshouse.org"
```

When she pushes for the first time, GitHub will ask her to log in — she uses her GitHub credentials.

---

## Step 7 — Verify Vercel Is Linked

1. Log into **vercel.com** with her account
2. Confirm the `teessite` project is there and auto-deploy is on for the `main` branch
3. Go to **Settings → Environment Variables** and make sure all the same variables from `.env.local` are added there too (Vercel needs its own copy)

---

## Step 8 — Set Up Sanity Webhook (One-Time)

So the site updates instantly when she publishes in Sanity:

1. Go to **sanity.io/manage** → project `zbeb0ctt` → **API → Webhooks**
2. Click **Add Webhook**
3. URL:
```
https://teeshouse.org/api/revalidate?secret=03b1e5cc82e515d76a8fb99ca238891e88932935275041e7a7b77b31f440d8f9
```
4. Trigger: **On publish**
5. Save

---

## Step 9 — Deploy the Studio (One-Time)

To push the latest sidebar changes (Community Impact, Products & Services, etc.) live:

```
cd teeshouse-studio
npx sanity deploy
```

When prompted for hostname, type: **teeshouse**

---

## Day-to-Day Workflow After Setup

### To update site content (no code needed):
Log into https://teeshouse.sanity.studio — make changes and publish.

### To make code changes:
```
# Make changes in VS Code, then:
git add .
git commit -m "describe what you changed"
git push origin main
# Vercel auto-deploys in about 2 minutes
```

### To update the Studio (schema/sidebar changes):
```
cd teeshouse-studio
git add .
git commit -m "describe schema change"
git push origin main
npx sanity deploy
```

---

## Quick Reference

| What | Where |
|---|---|
| Live site | https://teeshouse.org |
| Sanity Studio | https://teeshouse.sanity.studio |
| Vercel dashboard | https://vercel.com |
| Supabase dashboard | https://supabase.com |
| Site GitHub repo | https://github.com/teeshouse/teessite |
| Studio GitHub repo | https://github.com/minher1/teeshouse-studio |

---

## Key Contacts

- **Mike Arbrouet** — Developer
- **Tierra Arbrouet** — tierra@teeshouse.org
- **General inbox** — info@teeshouse.org
