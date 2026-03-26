# Photo Culler — 3-Pass Method

A local React + Node.js application for culling photos using the industry-standard 3-Pass method.

## Setup

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install Dependencies

```bash
# From the project root
npm run install:all
```

This installs root, server, and client dependencies in one command.

### Run Development Servers

```bash
npm run dev
```

This starts:
- **Server** on `http://localhost:3001` (Express API)
- **Client** on `http://localhost:3000` (React app — open this in your browser)

---

## How It Works

### Folder Selection
Enter an **absolute path** to a folder on your machine containing images.

**Examples:**
- macOS/Linux: `/Users/yourname/Photos/shoot-2024`
- Windows: `C:\Users\yourname\Photos\shoot-2024`

Supported formats: JPG, JPEG, PNG, WEBP, GIF, TIFF, BMP

---

## The 3-Pass Method

### Pass 1 — Gut Reaction Cull
*(Skipped if fewer than 13 images)*

- One image at a time. No deliberating.
- **Thumbs Down / ←** — Reject: out of focus, bad expression, distracting elements
- **Thumbs Up / →** — Keep: anything that "could be good"
- Repeats until ≤ 12 images remain

**Keyboard:** `←` reject · `→` keep

### Pass 2 — Side-by-Side Duel
- Images compete head-to-head in pairs
- **Click Left / ←** — Pick the left image
- **Click Right / →** — Pick the right image  
- **Keep Both / B** — Can't decide? Keep both (use sparingly)
- Repeats until ≤ 6 images remain

**Keyboard:** `←` left · `→` right · `B` both

### Pass 3 — The Final Four
- All remaining images displayed simultaneously
- Click to select up to 4 images
- Choose for **variety** — avoid near-duplicates
- When 4 selected, **SAVE** button appears
- Clicking SAVE **copies** your 4 picks into a `BEST/` subfolder

---

## Output

Selected images are **copied** (not moved) into:
```
[your-folder]/BEST/
```

Your originals are untouched.

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Express, TypeScript, tsx
