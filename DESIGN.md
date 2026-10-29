---
name: Austin Spraggins portfolio
description: Dark cyan engineering portfolio with a scoped warm editorial faith section.
colors:
  primary: "hsl(187 100% 68%)"
  background: "hsl(0 0% 7%)"
  foreground: "hsl(0 0% 100%)"
  card: "hsl(0 0% 12%)"
  muted-foreground: "hsl(0 0% 70%)"
  border: "hsl(0 0% 20%)"
  input: "hsl(0 0% 14.9%)"
  faith-background: "#0b0b0a"
  faith-foreground: "#f4eee3"
  faith-body: "#d0cbc3"
  faith-gold: "#ddb77b"
  faith-rule: "#8b7045"
  faith-hover: "#edcf9c"
  faith-active: "#cca46a"
typography:
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  heading:
    fontFamily: "Poppins, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.111111
  signature:
    fontFamily: "Dancing Script, cursive"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.555556
  faith-display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(76px, 10.1vw, 132px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  faith-title:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(35px, 4.7vw, 60px)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.04em"
  faith-body:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(18px, 2vw, 23px)"
    fontWeight: 400
    lineHeight: 1.65
  faith-scripture:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(29px, 3.5vw, 45px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.025em"
rounded:
  portfolio-control: "calc(0.75rem - 2px)"
  portfolio-field: "0.75rem"
  portfolio-card: "12px"
  faith-control: "3px"
spacing:
  control-gap: "8px"
  card-padding: "24px"
  faith-container-inset: "clamp(40px, 12vw, 160px)"
  faith-story-gap: "clamp(45px, 6vw, 90px)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.portfolio-control}"
    padding: "8px 16px"
    height: "36px"
  portfolio-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.portfolio-card}"
    padding: "{spacing.card-padding}"
  contact-field:
    backgroundColor: "hsl(0 0% 12% / 0.5)"
    textColor: "{colors.foreground}"
    rounded: "{rounded.portfolio-field}"
    padding: "12px"
  faith-primary:
    backgroundColor: "{colors.faith-gold}"
    textColor: "{colors.faith-background}"
    rounded: "{rounded.faith-control}"
    padding: "20px 24px"
  faith-primary-hover:
    backgroundColor: "{colors.faith-hover}"
  faith-primary-active:
    backgroundColor: "{colors.faith-active}"
  faith-anchor:
    textColor: "{colors.faith-gold}"
---

# Design System: Austin Spraggins portfolio

## Overview

**Creative North Star: "Engineering clarity, personal conviction"**

The established portfolio uses dark surfaces, cyan accents, Inter body text and Poppins headings. Its project cards and navigation support scanning professional work. The faith section is an approved local editorial treatment: warm charcoal, gold, large serif statements and illuminated cross imagery.

The faith treatment stays inside its section. Its open composition gives readable testimony and Scripture room beside each other, then closes with a SureWord invitation. Source extraction records the implemented styles; refreshed browser acceptance belongs to the finish review.

**Key Characteristics:**

- Dark cyan portfolio with a scoped warm faith palette.
- Clear sans-serif interface paired locally with expressive serif typography.
- Responsive editorial spacing, native links and visible keyboard focus.

## Colors

The portfolio's electric cyan and cool dark neutrals remain the global identity. Warm gold and parchment tones belong to faith.

### Primary

- **Electric Cyan** (`primary`): navigation, primary portfolio controls and global focus ring.
- **Warm Gold** (`faith-gold`): faith emphasis, Scripture attribution, testimony link and SureWord action. Lighter and darker state colors are `faith-hover` and `faith-active`.

### Neutral

- **Portfolio Charcoal** (`background`), **Raised Charcoal** (`card`), **White** (`foreground`), **Muted Gray** (`muted-foreground`): global reading and interface surfaces.
- **Warm Charcoal** (`faith-background`), **Parchment** (`faith-foreground`), **Warm Gray** (`faith-body`): faith background, display text and prose.
- **Bronze Rule** (`faith-rule`): faith separators, underlines and testimony focus outline.

**The Scoped Warmth Rule.** Keep faith colors and serif typography local; preserve the surrounding portfolio identity.

## Typography

**Portfolio Display Font:** Poppins through `--font-poppins`, loaded at 400, 500 and 700.
**Body Font:** Inter through `--font-inter`.
**Faith Display Font:** DM Serif Display through `--font-testimony`, loaded at 400 in normal and italic, followed by Georgia and serif.

### Hierarchy

- **Portfolio heading:** the documented heading token is the contact section's established heading treatment.
- **Faith display:** use the `faith-display` token for the two-line opening. Its second line is italic and gold. At 767px and below it uses `clamp(44px, 10.3vw, 76px)` with line-height 1.08.
- **Faith title:** the `faith-title` token serves story and SureWord headings. Mobile size is `clamp(33px, 7.8vw, 48px)`.
- **Faith body:** the `faith-body` token serves testimony and SureWord copy. Introduction uses the same size with line-height 1.6 and a 500px maximum width.
- **Scripture:** the `faith-scripture` token is italic. Mobile size is `clamp(30px, 6.7vw, 38px)`, with a 540px maximum width.
- **Declaration:** medium Inter, `clamp(22px, 2.8vw, 34px)`, line-height 1.45, maximum width 670px. Mobile uses 22px.

## Layout

Portfolio navigation uses a 56px fixed header, a padded container and desktop links from 1024px. Section anchors reserve 4.5rem above their targets.

Faith uses a centered 1280px maximum container. Its width subtracts the full `faith-container-inset` token, leaving half that amount on each side. The hero minimum height is `clamp(780px, 85vw, 1080px)`, with content top padding `clamp(180px, 22vw, 280px)` and bottom padding 150px.

Testimony and Scripture use a 1.35fr/1fr grid with the documented gap token; the SureWord row uses 1.5fr/1fr and a 60px gap. At 767px and below both become single columns. The hero loses its minimum height, artwork is 480px high and content begins at 385px, then ends with 48px bottom padding. Testimony gap becomes 44px and SureWord gap 28px.

The decorative cross covers its image box at center top. Mobile moves it to 85% top, keeping the cross above the text. The artwork fades into the background; from 1600px it also fades at both horizontal edges. Section bottom padding is `clamp(72px, 8vw, 112px)`.

## Elevation & Depth

The portfolio retains raised card surfaces, subtle shadows and a blurred header after scrolling. Faith has no card shadows or enclosing panels. Depth comes from the cross photograph, its fade into charcoal and the contrast between gold, parchment and body copy. Fine bronze rules divide Scripture and the final invitation.

## Shapes

Portfolio primitives use rounded controls and cards; header action chips are pill shaped. Faith uses square editorial regions, one-pixel rules and a narrowly rounded SureWord control. Preserve that local contrast without turning the rest of the site into the faith layout.

## Components

### Buttons

Portfolio primary buttons use cyan, dark text, a 36px default height and a one-pixel cyan focus ring. Disabled primitives suppress pointer events and reduce opacity to 0.5.

The faith SureWord action is a native link styled as a filled gold control. Desktop minimum height is 72px, with a 30px icon gap and 19px semibold text. Mobile minimum height is 60px, horizontal padding 26px and font size 17px. Hover and active colors use the documented state tokens.

Faith links show a two-pixel gold focus outline offset by 7px. Color and arrow transitions last 180ms with ease-out; hover moves arrows 4px right. Under reduced motion, transitions and arrow movement stop.

### Cards / Containers

The existing portfolio card primitive uses a dark surface, border, shadow and 24px content padding. Faith story and Scripture are open editorial regions. Scripture has a left rule and responsive inner padding; the SureWord row has a top rule.

### Inputs / Fields

Contact fields use a half-opacity card surface, half-opacity border, muted placeholders and 12px padding. Focus changes the border to cyan. These remain portfolio components; the faith section adds no fields.

### Navigation

Existing portfolio navigation retains muted links with cyan hover and a mobile menu below 1024px. Faith's underlined "Read my testimony" link uses the native `#my-testimony` anchor. Its visible target is always present, has `tabIndex={-1}`, reserves 96px above it and has a one-pixel bronze focus outline offset by 12px.

Faith is a labelled section with a heading hierarchy, decorative hidden artwork and semantic figure, blockquote and attribution. SureWord opens through an ordinary same-tab external link. Global reduced-motion styles disable smooth scrolling as well as CSS animation.

## Do's and Don'ts

### Do:

- **Do** preserve the global cyan, Inter and Poppins identity outside faith.
- **Do** use DM Serif Display at weight 400 for faith display text and Scripture.
- **Do** preserve native anchor behavior, visible focus and reduced-motion support.
- **Do** keep testimony readable and visible without opening a modal or disclosure.

### Don't:

- **Don't** promote faith tokens into global replacements.
- **Don't** place faith testimony into a stack of generic cards.
- **Don't** add animation that bypasses reduced-motion preferences.
