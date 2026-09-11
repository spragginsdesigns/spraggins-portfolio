# Google Business Profile: Spraggins Designs

Reference for anyone (human or agent) touching the Spraggins Designs Google
Business Profile (GBP). The profile is the second thing a Fresno business owner
sees after a pitch, right after spragginsdesigns.xyz, so it has to match the
site and the pitch exactly. Last verified: 2026-09-11.

## The profile

| Field | Value |
|-------|-------|
| Business name | Spraggins Designs |
| Type | Service-area business, no storefront address |
| Primary category | Website designer |
| Additional category | Graphic designer |
| Phone | (559) 818-0467 (call and SMS) |
| Website | https://www.spragginsdesigns.xyz/local-websites |
| Service area | Fresno, Clovis, Madera, Sanger (CA) |
| Main hours | Monday to Friday, 9:00 AM to 5:00 PM (matches the online service hours) |
| Opening date | January 12, 2020 (see "Known inconsistencies") |
| Public share link | https://share.google/4dXY6UKSVBh3YUIvT |
| Social profiles | LinkedIn, YouTube (shadowgaming99), X (Shadow_Gaming99) |
| Managed by | Austin's Google account (the one signed into Chrome on the dev PC) |

The share link is also stored as `googleProfileUrl` in `src/lib/local-websites.ts`
and rendered as a chip in `src/components/local-websites/CredibilityStrip.tsx`,
plus listed as `sameAs` in the ProfessionalService JSON-LD on `/local-websites`.

### Description (live)

> Spraggins Designs builds websites for local businesses in Fresno, Clovis, and
> the surrounding area: auto shops, dental offices, landscapers, law offices,
> contractors, and other small businesses. Every site is built from the listings
> and photos you already have, so there is nothing to write from scratch. Sites
> are designed for the phone first, set up to show up on Google, and include
> your own domain, hosting, SSL, and a contact form that emails you. Most sites
> are ready to review the same day and live within a day, with no contract. Led
> by Austin Spraggins, a Fresno software engineer who has been building websites
> for local businesses for almost 10 years. Call or text to get started.

691 of 750 characters. It deliberately has no prices, no URL, and no phone
number, because Google's description policy forbids all three.

### Services (under Website designer)

Google-suggested services that were already on the profile: Application
development, Mobile app development, Website Design, Website Development,
Branding, Marketing, Social Media, Web Designer And Web Developer.

Custom services added 2026-09-11 (prices are allowed here):

| Service | Price | Description |
|---------|-------|-------------|
| Small business website, live in a day | $379 fixed | A full website for your Fresno business, built from your Google listing, photos, hours, and services. Mobile first, set up for Google, with a contact form that emails you. Draft to review the same day, live within a day. Monthly hosting covers your domain, SSL, and the form. No contract. |
| Website hosting with domain, SSL, and contact form | $19 fixed | Monthly hosting for a site I built. Covers your domain name, hosting, SSL (the padlock in the address bar), the contact form that emails you, and keeping the site online. Month to month, no contract, cancel any time. |

## Single source of truth

The offer (price, phone, hosting, copy) lives in `src/lib/local-websites.ts`.
When any of it changes, update the site constants first, then bring the profile
in line in the same session. The two must never disagree, because the pitch,
the demo footer, the site, and the profile all quote the same numbers.

## Posting is currently disabled (as of 2026-09-11)

An Update post published 2026-09-11 was rejected for violating the posts
content policy (Google email, Routing ID DPNB), and Google turned off posting
for the profile. Cause: the post body contained the phone number and
"call or text," plus two dollar amounts. Phone numbers in post text are an
explicit violation; stacked with prices it reads as spam.

This was not the first strike. Before this session the profile already had
rejected category edits ("Engineer" as primary, "Software company") and a
services list that Google had rewritten. Each rejection lowers the profile's
trust, which is why the post got an automatic strike instead of a review.

**To restore posting:** Austin files an appeal at
https://support.google.com/business under "Appeal a decision," selects the
Spraggins Designs profile and the posts restriction, and states that the post
contained a phone number, has been removed, and future posts will follow the
policy. Do not file this from an agent; it needs his account and a human
explanation. Do not make further profile edits until the appeal clears.

## Rules for any future edit

Follow these or the profile gets another strike.

- **Posts:** no phone number, no email, no "call or text" in the body. The
  profile's Call button covers that. One link, through the post button, never
  pasted in the text. Prices only in Offer-type posts. Plain sentences, no all
  caps, no urgency, no stacked selling points.
- **Description:** no prices, no URLs, no phone numbers. Max 750 characters.
- **Categories:** keep Website designer primary. Do not add Engineer, Software
  company, or anything Google already rejected. Category churn is what put the
  profile under scrutiny in the first place.
- **Services:** prices belong here. Keep names under 120 characters and
  descriptions under 300.
- **Hours:** if main hours change, change the online service hours to match.
- **One change at a time.** Each edit goes into a review queue. Batching many
  edits in one day looks like an account takeover to Google's classifier.

## How to edit the profile

There is no API path. The Business Profile API requires Google approval per
project and this account does not have it. All edits are done in a signed-in
Chrome session.

1. Open `https://www.google.com/search?q=spraggins+designs` in Chrome while
   signed in as the managing account. The "Your business on Google" merchant
   panel appears above the results.
2. Use the panel buttons: Edit profile (name, category, description, contact,
   location, hours), Edit services, Posts, Photos, Read reviews.
3. Every edit dialog shows "Your edit is pending" after Save. Most fields
   publish in about 10 minutes; services can take a day.

### Notes for agents driving Chrome

- The edit dialogs render inside an iframe. Accessibility-tree tools
  (`find`, `read_page`, `form_input`) cannot see them. Drive them with
  coordinate clicks from screenshots and the `type` action.
- The Photos uploader's file input is inside that iframe too, so logo and cover
  uploads cannot be automated. Prepare the image and hand it to Austin.
- Category and service-area fields are autocomplete pickers. Type the value,
  wait a second, then click the first suggestion. Typing alone does not commit.
- The Services panel is locked ("Review changes" banner) while a category edit
  is pending. Resolve the category first.
- Claude Code's permission classifier intermittently blocks `type` calls on
  this page as "Real-World Transactions." A plain retry almost always goes
  through. Do not try to route around it with JavaScript.

## Known inconsistencies

- **Opening date** is January 12, 2020, but the pitch and the site say "almost
  10 years building sites for local businesses." Set the real start year once
  posting is restored and the profile is quiet.
- **No logo or cover photo.** A 720x720 logo built from
  `public/images/sd-logo-banner.png` on a #121212 background was prepared on
  2026-09-11 for Austin to upload by hand. `public/og-image.png` (1424x752)
  works as a cover.
- **Service area** stops at four cities. Selma, Fowler, Kerman, Reedley, and
  Kingsburg are reasonable additions once the profile is out of review.
- **No reviews yet.** The panel offers a "Get reviews" share link; use it with
  the first paying customers.

## History

- Before 2026-09-11: description was a generic 2020-era blurb mentioning
  e-commerce; website pointed at the homepage; hours "open with no main hours";
  service area Fresno only; one 2022 COVID "working remotely" post; rejected
  category edits sitting in the queue.
- 2026-09-11: description, website, categories, hours, service area, and two
  priced services updated; COVID post deleted; offer post published and then
  rejected, which disabled posting. Site commits 6224e22 and 691144a added the
  /local-websites page and the profile link.
