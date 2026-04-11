# Domain migration checklist: teeshouse.org -> Vercel

Goal: point the apex `teeshouse.org` and `www.teeshouse.org` at the Vercel
deployment currently serving `teeshousepensacola.org`, then turn on Resend
email sending from `noreply@teeshouse.org`.

This is a one-shot migration. Do each step in order. Most steps are
reversible for ~24h while DNS is in flight.

## 0. Pre-flight (do once, stays true forever)

- [ ] Confirm you still control the `teeshouse.org` registrar account. Log in
      and make sure MFA is on.
- [ ] Save a screenshot of the CURRENT DNS records on `teeshouse.org`. If
      anything breaks, you need to be able to roll back by hand.
- [ ] Confirm there is no existing email service attached to `teeshouse.org`
      (e.g. Google Workspace MX records). If there IS, skip the Resend email
      step below and stop to coordinate - you do NOT want to blow away
      production MX records.
- [ ] Confirm `teeshousepensacola.org` is still live on Vercel. Keep it live
      through the migration as a fallback.

## 1. Add the domain to the Vercel project

- [ ] Vercel dashboard -> `teessite` project -> Settings -> Domains.
- [ ] Add `teeshouse.org`. Vercel will ask you to add either:
      - an `A` record pointing `@` to `76.76.21.21`, or
      - `CNAME` `@` -> `cname.vercel-dns.com` (only supported on registrars
        that allow CNAME at apex, e.g. Cloudflare, DNSimple).
- [ ] Also add `www.teeshouse.org`. Use `CNAME` `www` -> `cname.vercel-dns.com`.
- [ ] Decide which one is canonical. Recommended: apex (`teeshouse.org`) as
      canonical, `www` redirects to apex. Configure the redirect in Vercel's
      Domains UI.

## 2. Update DNS at the registrar

- [ ] Add the records Vercel gave you. TTL 300 (5 min) while migrating so
      mistakes are cheap.
- [ ] Remove or comment out any old `A`/`CNAME` records for `@` and `www`
      that point somewhere else.
- [ ] DO NOT touch `MX`, `TXT`, `SPF`, `DKIM`, `DMARC` records unless you
      are replacing them in Step 4.

## 3. Wait for DNS + Vercel SSL

- [ ] `nslookup teeshouse.org` from your machine should resolve to Vercel.
- [ ] Vercel will auto-issue a Let's Encrypt cert once DNS resolves. The
      domain row in the Vercel UI should turn green ("Valid Configuration").
- [ ] Visit `https://teeshouse.org` in a private window. You should see the
      site. If you see a Vercel error page, check the domain config before
      proceeding.
- [ ] Update `NEXT_PUBLIC_SITE_URL` (if used) in Vercel env vars to
      `https://www.teeshouse.org` and redeploy.

## 4. Resend email on teeshouse.org

Only do this section AFTER step 3 is green.

- [ ] Sign up / log in at https://resend.com. Create API key. Copy it once -
      Resend won't show it again.
- [ ] Add `teeshouse.org` as a sending domain in Resend. Resend will give
      you a set of records to add at the registrar:
      - `MX` for `send.teeshouse.org`
      - `TXT` SPF (`v=spf1 include:amazonses.com ~all` style)
      - `TXT` DKIM (long key, usually 2-3 records)
      - `TXT` DMARC (`v=DMARC1; p=none; ...` to start; tighten later)
- [ ] Add those records at the registrar, same place you edited A/CNAME.
- [ ] Click "Verify" in Resend. Propagation can take 10-60 min.
- [ ] In Vercel project env vars (Production + Preview), add:
      - `RESEND_API_KEY` = the key from Resend
      - Optionally `PING_SECRET` = a long random string for `/api/ping`
- [ ] Redeploy the project so the new env vars are picked up. (Vercel will
      do this automatically on next push, or trigger a manual redeploy.)
- [ ] Submit a test message via the `/contact` form. Confirm:
      1. Row appears in Supabase `contact_submissions`
      2. Email arrives at `info@teeshouse.org` (check spam first time)
      3. "Reply to" on the email is the sender's address, not noreply

## 5. Flip canonical URL everywhere

- [ ] Vercel: set `teeshouse.org` as the Production Domain (primary).
- [ ] Keep `teeshousepensacola.org` as an alias for ~2 weeks so any old
      bookmarks / printed flyers keep working. After that, either remove or
      leave it as a permanent 308 redirect to `teeshouse.org`.
- [ ] Update external links:
      - PayPal Giving Fund org profile
      - Instagram / Facebook bios
      - Any Google Business listing
      - Email signatures for Tierra and volunteers
      - Sanity `siteSettings` if we ever start pulling the URL from CMS

## 6. Post-migration verification

- [ ] `curl -I https://teeshouse.org` returns 200 and serves a Vercel header.
- [ ] `curl -I https://www.teeshouse.org` returns a 308 redirect to apex
      (or vice-versa, whichever you picked as canonical).
- [ ] Contact form end-to-end test succeeds (DB row + email).
- [ ] Volunteer form end-to-end test succeeds (DB row + email).
- [ ] `/api/ping?secret=<PING_SECRET>` returns `{ ok: true }`.
- [ ] Set up the weekly cron that hits `/api/ping` (Vercel Cron, GitHub
      Actions, or cron-job.org) so Supabase never pauses.

## Rollback plan

If anything in step 1-3 goes sideways:

1. At the registrar, restore the DNS records from the screenshot in step 0.
2. In Vercel, remove `teeshouse.org` from the project Domains.
3. The site stays live on `teeshousepensacola.org` the entire time - that is
   why we don't touch it until step 5.
