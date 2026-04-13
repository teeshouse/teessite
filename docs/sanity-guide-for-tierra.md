# Tee's House Website Management Guide

**For:** Tierra Smith and the Tee's House team
**Studio URL:** [teeshouse-inc.sanity.studio](https://teeshouse-inc.sanity.studio)
**Last updated:** April 2026

---

## Getting Started

### Logging In
1. Go to **teeshouse-inc.sanity.studio**
2. Sign in with your GitHub or Google account
3. You'll see the content sidebar on the left

### How It Works
Think of Sanity Studio like WordPress, but faster:
- The **left sidebar** is your menu of content types (pages, news, events, etc.)
- Click any item to see all entries, or click **+ Create** to add a new one
- Make your edits, then click the green **Publish** button
- Changes go live on the website within about 60 seconds

### Key Differences from WordPress
| WordPress | Sanity Studio |
|-----------|---------------|
| Posts & Pages | Each content type has its own section |
| Media Library | Upload images/files directly inside each entry |
| Appearance > Menus | Site Settings > Page Labels (renames nav links) |
| Settings > General | Site Settings (top of sidebar) |
| Plugins | Not needed - everything is built in |

---

## The Sidebar (Your Content Menu)

Here's every section in the sidebar and what it controls on the website:

| Sidebar Section | What It Controls |
|----------------|-----------------|
| **Site Settings** | Global stuff: hero text, contact info, social links, donate page, about page, home page sections |
| **Pages** | Custom standalone pages (like a generic WordPress page) |
| **Community Impact** | Your programs/initiatives shown on the Community Impact page |
| **Products & Services** | Kits and services (shown on the Products & Services page) |
| **Events** | Upcoming, ongoing, and past events |
| **News and Updates** | Blog-style news articles |
| **Photo Gallery** | Photo albums with multiple images |
| **Team Members** | Staff, board, volunteers shown on the About page |
| **Testimonials** | Quotes from community members, parents, partners |
| **Partners and Sponsors** | Partner logos and info shown on the Partners page |
| **FAQs** | Questions and answers shown on the FAQ page |
| **Annual Reports** | Yearly reports with PDF uploads for the Transparency page |
| **Documents & Downloads** | Upload any PDF/flyer and link it on the site |
| **Volunteer Roles** | Role definitions (used internally) |
| **Impact Stats** | The numbers shown on the home page and about page (e.g. "150+ Youth Served") |

---

## Common Tasks

### Updating Contact Info (Phone, Email, Address)
1. Click **Site Settings**
2. Scroll to **Phone Number**, **Email Address**, and **Address**
3. Edit the values
4. Click **Publish**

This updates the contact info everywhere on the site: footer, contact page, about page, home page, and structured data for Google.

---

### Changing the Home Page

#### Hero Section (Big Banner at Top)
1. Click **Site Settings**
2. Edit **Hero Headline** and **Hero Subtext**
3. Optional: paste a video URL in **Hero Background Video URL** for a background video
4. Click **Publish**

#### Hero Image (when no video is set)
1. Click **Site Settings** > expand **Home page sections**
2. Upload a new **Hero Background Image**
3. Click **Publish**

#### The Inspirational Band (Parallax Section)
1. Click **Site Settings** > expand **Home page sections**
2. Edit **Parallax Heading** and **Parallax Text**
3. Optionally upload a new **Parallax Background Image**
4. Click **Publish**

#### The "Ready to Make a Difference?" Banner
1. Click **Site Settings** > expand **Home page sections**
2. Edit **CTA Banner Heading** and **CTA Banner Text**
3. Click **Publish**

#### Mission Tagline
1. Click **Site Settings**
2. Edit **Mission Tagline** (the italic quote shown below the hero)
3. Click **Publish**

#### Impact Stats (the numbers like "150+ Youth Served")
1. Click **Impact Stats** in the sidebar
2. Edit existing stats or create new ones
3. Each stat has a **Label** (e.g. "Youth Served") and a **Value** (e.g. "150+")
4. Use the **Display Order** number to control the order (lower = first)
5. Click **Publish**

#### Before & After Slider
1. Click **Site Settings** > find **Before / After Slider**
2. Upload **Before Image** and **After Image**
3. Optionally change labels and add a caption
4. Click **Publish**

---

### Managing the Donate Page

1. Click **Site Settings** > expand **Donate page**

#### Fundraising Thermometer
- **Fundraising Goal ($)** - Your target (e.g. 25000)
- **Amount Raised ($)** - How much you've raised so far
- **Number of Donors** - Donor count shown on the thermometer
- **Campaign Name** - e.g. "2026 STEAM Future Leaders Fund"
- **Campaign Deadline** - e.g. "August 31, 2026"

Update the "Amount Raised" and "Number of Donors" whenever you receive new donations.

#### Giving Options (PayPal, Venmo, etc.)
- Click the **Giving Options** array to add/remove/reorder payment methods
- Each option has: **Title**, **Description**, **Button Label**, **URL**, and **Opens in new tab?**
- To add a new payment method, click **Add item**

#### Monthly Giving Impact Tiers
- These show donors what their monthly gift does
- Each tier has an **Amount** (e.g. "$10/mo") and **Impact Description** (e.g. "provides snacks for 2 students")

---

### Editing the About Page

1. Click **Site Settings** > expand **About page content**

- **Mission Heading** - The big heading next to the photo (e.g. "Cultivating Growth in Every Child")
- **Mission Text** - Rich text editor for the mission paragraphs. You can use bold, italic, links, and multiple paragraphs here. This works just like a WordPress text editor.
- **Mission Photo** - The image shown next to the mission text
- **Core Values** - Add/edit/remove values. Each has a **name** and **description**.
- **Contact Section Quote** - The italic quote at the bottom of the page
- **Contact Section Photo** - The image in the contact section

#### Team Members
1. Click **Team Members** in the sidebar
2. Edit existing members or click **+ Create** to add a new one
3. Fill in: **Name**, **Role/Title**, **Bio** (rich text), **Photo**
4. Optional: **Email**, **LinkedIn URL**
5. Set **Category** (Staff, Board, Volunteer, or Advisor)
6. Set **Active** to show/hide without deleting
7. Use **Display Order** to control position (lower = first)

---

### Adding News Articles

1. Click **News and Updates** > **+ Create**
2. Fill in:
   - **Title** - Article headline
   - **Slug** - Auto-generated from title (this becomes the URL, e.g. `/news/my-article`)
   - **Published At** - Date picker
   - **Excerpt** - Short summary shown on the news listing (keep under 160 characters)
   - **Body** - Full article content with rich text, images, links
   - **Featured Image** - Main image shown at the top of the article and on cards
   - **Tags** - Add tags like "agriculture", "events", "community"
3. Toggle **Featured** to highlight it on the home page
4. Click **Publish**

---

### Managing Events

1. Click **Events** > **+ Create**
2. Fill in:
   - **Title** and **Slug**
   - **Date and Time** / **End Date**
   - **Location** (or toggle **Virtual Event** and add a link)
   - **Description** - Rich text
   - **Image**
   - **Registration Link** - External URL for sign-ups
   - **Free Event?** toggle, or enter a **Cost**
   - **Status**: Upcoming, Ongoing, Past, or Cancelled
   - **Tags**
3. Toggle **Featured** to show on the home page
4. Click **Publish**

---

### Managing the Photo Gallery

1. Click **Photo Gallery** > **+ Create**
2. Fill in:
   - **Album Title** and **Date**
   - **Cover Image** - The main photo shown on the gallery page
   - **Description**
   - **Photos** - Click **Add item** to upload multiple photos, each with an optional caption
3. Toggle **Featured** to highlight on the gallery page
4. Click **Publish**

**Tip:** You can drag and drop to reorder photos within an album.

---

### Adding Community Impact Initiatives

1. Click **Community Impact** > **+ Create**
2. Fill in:
   - **Initiative Title** and **Slug**
   - **Status**: Current, Past, or Upcoming
   - **Year**
   - **Category**: Agriculture, Arts, STEAM, Nutrition, Wellness, or Other
   - **Description** - Rich text
   - **Initiative Image** (include alt text for accessibility)
3. Toggle **Featured on Homepage** to show on the home page
4. Click **Publish**

---

### Adding Products & Services (Kits)

While the 3 service tiers and 4 kits are built into the page design, you can add more items:

1. Click **Products & Services** > **+ Create**
2. Fill in:
   - **Title** and **Description**
   - **Category**: Kit or Service
   - **Image** (optional, with alt text)
   - **Price** (optional, e.g. "$15", "Starting at $25", "Free")
3. Click **Publish**

---

### Uploading PDFs and Flyers

This is how you share documents (like the Kit Showcase or services flyer) on the website:

1. Click **Documents & Downloads** > **+ Create**
2. Fill in:
   - **Title** (e.g. "Kit Showcase Flyer")
   - **Description** (optional, shown under the title)
   - **PDF / Document** - Click to upload your file
   - **Thumbnail** - Upload a preview image (like a screenshot of the first page)
   - **Category**: Flyer, Report, Form, Menu/Price List, or Other
3. Toggle where it appears:
   - **Show on Products & Services page?** - for kits/services flyers
   - **Show on Transparency page?** - for financial reports, audits
4. Click **Publish**

The document gets its own download link automatically. If you need the direct URL to share (like in an email), click the uploaded file and copy the URL.

---

### Updating Partners

1. Click **Partners and Sponsors** > **+ Create**
2. Fill in:
   - **Organization Name**
   - **Logo** (upload their logo)
   - **Website URL**
   - **Description**
   - **Tier**: Platinum, Gold, Silver, or Community
3. Click **Publish**

Partners are grouped by tier on the Partners page.

---

### Managing FAQs

1. Click **FAQs** > **+ Create**
2. Fill in:
   - **Question** - The question visitors see
   - **Answer** - Rich text answer (can include links, bold, etc.)
   - **Category**: Volunteer, Donation, Community Impact, or General
   - **Display Order** - Lower numbers appear first
3. Toggle **Active** on/off to show/hide without deleting
4. Click **Publish**

---

### Uploading Annual Reports

1. Click **Annual Reports** > **+ Create**
2. Fill in:
   - **Year** (e.g. 2025)
   - **Report Title** (e.g. "2025 Annual Impact Report")
   - **Summary** - Brief text description
   - **File** - Upload the PDF
   - **Cover Image** - Upload a cover/thumbnail image
   - **Key Highlights** - Add bullet-point highlights
3. Toggle **Published** to make it live
4. Click **Publish**

---

### Renaming Pages Site-Wide

Want to rename "Community Impact" to something else, or change what "About" says in the nav? You can do this without touching code:

1. Click **Site Settings**
2. Expand **Community Impact page labels** or **Page labels (About / Events / News / Gallery)**
3. Change the **Nav / footer link label** to rename it everywhere (navigation, footer, breadcrumbs)
4. Change other fields to update the hero title, SEO title, etc.
5. Click **Publish**

**Example:** To rename "News" to "Blog":
- Set Nav label to "Blog"
- Set Page title to "Our Blog"
- Set Browser tab title to "Blog | Tee's House Inc."

---

### Updating Social Media Links

1. Click **Site Settings**
2. Scroll to **Facebook URL**, **Instagram URL**, **LinkedIn URL**
3. Paste the full URL (e.g. `https://www.facebook.com/teeshouseinc`)
4. Leave blank to hide that icon from the footer
5. Click **Publish**

---

## Tips & Tricks

### Images
- **Hotspot cropping**: When uploading images, click the image to set a hotspot (the focal point). This ensures the important part of the photo stays visible even when it's cropped for different screen sizes.
- **Alt text**: Always fill in alt text when available. This helps with accessibility and Google SEO.
- **Size**: Sanity automatically optimizes images, so you don't need to resize before uploading. Higher resolution is better.

### Rich Text Fields
Any field labeled "rich text" or that shows a formatting toolbar works like a mini word processor:
- **Bold** and *Italic* work as expected
- You can add **links** by highlighting text and clicking the link icon
- You can add **images** inline within the text
- Use headings (H2, H3) to structure longer content

### Publishing vs. Drafts
- **Draft** (yellow dot): Your changes are saved but NOT live on the website
- **Published** (green dot): Live and visible to everyone
- You can make changes to a published document - it stays live with the old content until you click Publish again

### Deleting vs. Hiding
- Most content types have an **Active** or **Published** toggle
- Use this to hide content instead of deleting it - you can always bring it back later
- Only delete content you're sure you'll never need again

### Display Order
- Many sections use a **Display Order** number
- Lower numbers appear first (1, 2, 3...)
- If you leave it at 0 or the default, items appear in the order they were created

---

## What Goes Where (Quick Reference)

| I want to change... | Go to... |
|---------------------|----------|
| Phone / email / address | Site Settings |
| Home page hero text | Site Settings > Hero Headline / Subtext |
| Home page banner image | Site Settings > Home page sections > Hero Image |
| Donate thermometer numbers | Site Settings > Donate page |
| About page mission text | Site Settings > About page content |
| Navigation link names | Site Settings > Page labels |
| Social media links | Site Settings > Facebook/Instagram/LinkedIn URL |
| Team members | Team Members |
| News articles | News and Updates |
| Events | Events |
| Programs/initiatives | Community Impact |
| FAQ answers | FAQs |
| Partner logos | Partners and Sponsors |
| Photo albums | Photo Gallery |
| Impact numbers | Impact Stats |
| Upload a PDF/flyer | Documents & Downloads |
| Annual reports | Annual Reports |
| Kits (if adding to Sanity) | Products & Services |

---

## Need Help?

- **Website issues**: Contact Mike
- **Sanity Studio questions**: This guide should cover most things, but reach out to Mike for anything not covered here
- **Sanity documentation**: [sanity.io/docs](https://www.sanity.io/docs)
