# Ad Automation PDF vs AppCode – Summary & Comparison

This document summarizes the **ad-automation.pdf** (AdFlow app) and compares it to your **AppCode** marketing PWA.

---

## 1. What’s in the PDF (AdFlow)

The PDF contains the full source of a **React single-page app** named **AdFlow**: an ad builder focused on **paid ads** across many platforms.

### 1.1 Tech stack (from PDF)

- **Frontend only**: React (useState, useEffect), inline CSS, single-file app
- **Data**: In-memory state + seed data (no backend, no DB)
- **Styling**: Dark theme (Syne font, accent `#c8ff00`)

### 1.2 Platforms (10)

Each has config: color, icon, formats, placements, **character limits** (headline / description / primaryText), `utmSource`, CTAs, ad types, optional note.

| Platform        | Notable limits / notes                                      |
|----------------|-------------------------------------------------------------|
| Meta Ads       | headline 40, description 125                                |
| Google Ads     | headline 30, description 90                                 |
| TikTok Ads     | 100/100; video-first, 9:16, sound-on                        |
| Pinterest Ads  | headline 100, description 500; vertical 2:3                 |
| Telegram Ads   | Text-only, max 160 chars, no images                         |
| Snapchat Ads   | headline 34, description 130; 9:16 vertical                 |
| X (Twitter)    | headline 70, description 280                                |
| LinkedIn Ads   | headline 70, description 150; B2B                           |
| YouTube Ads    | headline 100, description 35; first 5s critical            |
| Reddit Ads     | headline 300, description 500; “native” feel                |

### 1.3 Features (from PDF)

- **Overview**: Total ads, launched count, platforms used, “time saved”; per-platform counts; per-campaign list (platform badges, draft/active).
- **Ad Builder**: List of ads (filter by platform), create/edit/delete. Fields: **Campaign**, **Ad Set**, **Platform**, **Format**, **Placement**, **Objective**, **CTA**, **Headline**, **Description**, **Destination URL**. Character bars per platform limits; ad preview card.
- **Bulk Edit**: Select multiple ads → choose field (campaign, adset, cta, platform, placement, format, adType, url) → set one value → apply to all.
- **Platform Specs**: Read-only view of limits, formats, placements, CTAs, ad types per platform.
- **UTM + Naming**:
  - UTM: `utm_source`, `utm_medium=paid_social`, `utm_campaign`, `utm_content`, `utm_term` (from campaign, adset, headline).
  - Ad naming: e.g. `META_campaignname_adsetname_v01`.
  - Full URL with UTM; copy; **Export CSV** (ad name, campaign, ad set, platform, format, headline, CTA, base URL, full tracking URL).
- **Launch**: Select draft ads → validation (description, URL, char limits) → “Launch” (simulated: sets status to `launched`).

### 1.4 Data model (conceptual)

- **Ad**: id, campaign, adset, headline, description, url, platform, format, placement, adType, cta, status (`draft` | `launched`).

---

## 2. What AppCode Has (Ads)

- **Stack**: Vue 3 + Vuetify, Node/Express backend, MySQL/SQLite.
- **Ads module**: **AI Ad Generation** (OpenRouter), create/edit/delete ads; link to **Client**; fields: title, description, content (text/images/videos), status, type; **reach, engagement, spend, channel**; display tracking fields (displayType, location, size, period, etc.).
- **Publishing**: Publish to **Facebook, Instagram, WhatsApp** (social-media + scheduled-posts); post history.
- **No** campaign/adset hierarchy, **no** platform-specific character limits in UI, **no** UTM builder, **no** bulk edit, **no** “Platform Specs” reference, **no** CSV export for ads.

---

## 3. Comparison

| Aspect              | AdFlow (PDF)                          | AppCode (current)                                |
|---------------------|----------------------------------------|--------------------------------------------------|
| **Platforms**        | 10 paid ad platforms (Meta, Google, TikTok, etc.) | 3 social (Facebook, Instagram, WhatsApp)        |
| **Structure**       | Campaign → Ad Set → Ad                 | Ad (optional client link)                        |
| **Platform specs**  | Yes (limits, formats, placements, CTAs)| No                                               |
| **Character limits**| Yes, per platform, with bars           | No                                               |
| **UTM**             | Auto UTM + naming, copy, CSV export    | No                                               |
| **Bulk edit**       | Yes (one field → many ads)             | No                                               |
| **Launch workflow** | Validate → “launch” (simulated)        | Publish to social / schedule                     |
| **AI**              | No                                     | Yes (OpenRouter for ad generation)               |
| **Backend / DB**    | None (in-memory)                       | Yes (Express, Sequelize, MySQL/SQLite)           |
| **Persistence**     | No                                     | Yes                                              |

---

## 4. How you could use the PDF in AppCode

- **Adopt platform specs**: Reuse the PDF’s platform list and limits (and optionally formats/placements/CTAs) to add a “Platform Specs” reference and character-limit validation in Ads (and optionally in social publish).
- **Add UTM + naming**: Implement `generateUTM` and `generateAdName` (e.g. in backend or frontend), show UTM params and full URL in Ads, add “Copy” and optionally “Export CSV” for ads.
- **Add campaign/adset**: Extend your Ad model (or add Campaign/AdSet models) so ads belong to campaign + adset; filter/group in UI like AdFlow.
- **Bulk edit**: Add a “Bulk edit” view: select multiple ads, pick one field, set value, apply (backend endpoint to update many ads).
- **Launch/validation**: Before “Publish”, validate description, URL, and platform character limits (using the PDF’s limit set), and show errors like AdFlow’s Launch tab.

If you tell me which of these you want first (e.g. “UTM + CSV export” or “platform specs and character limits”), I can outline concrete changes in your `Ads.vue` and `backend/routes/ads.js` (and any new endpoints). The PDF is in the repo as **ad-automation.pdf** and this comparison is in **AD_AUTOMATION_PDF_COMPARISON.md**.
