# File Preview Feature Design

## Overview

Add file preview capability to the Eszuri Storage file manager. Users can preview images, videos, audio, PDFs, and text/code files via a modal overlay, toggled by an eye icon on each file item.

## Approach: Hybrid (Static for binary, API for text)

- **Binary files** (images, video, audio, PDF): served via existing static route `/files/{path}`
- **Text/code files**: fetched via `/api/download?path=...` for syntax highlighting

No backend changes required.

## File Type Detection

By file extension:

| Category | Extensions |
|----------|-----------|
| Image | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico` |
| Video | `.mp4`, `.webm`, `.ogg`, `.mov` |
| Audio | `.mp3`, `.wav`, `.ogg`, `.flac`, `.aac` |
| PDF | `.pdf` |
| Text/Code | `.txt`, `.js`, `.ts`, `.html`, `.css`, `.json`, `.md`, `.py`, `.java`, `.c`, `.cpp`, `.go`, `.rs`, `.sh`, `.yaml`, `.yml`, `.xml`, `.sql`, `.bat`, `.ps1`, `.env`, `.log`, and all others not in binary categories |
| Unsupported | Fallback — show "Preview not available" + download button |

## UI Components

### Eye Toggle (File Item)

- Icon `ph-eye` in `file-actions` (alongside edit & delete), only for files (not folders)
- When preview is active → icon changes to `ph-eye-closed` (toggle to close)
- Active state: accent blue highlight

### Preview Modal

- Overlay: dark with blur (matches existing modal style)
- Size: `max-width: 80vw`, `max-height: 85vh`
- Header: filename + close button (X) at right
- Body renders based on file type:
  - **Image**: `<img>` with `max-width: 100%`, `max-height: 70vh`, `object-fit: contain`
  - **Video**: `<video controls>` with `max-width: 100%`, `max-height: 70vh`
  - **Audio**: `<audio controls>` (compact)
  - **PDF**: `<iframe>` full width/height
  - **Text/Code**: `<pre><code>` with highlight.js syntax highlighting, scrollable, `max-height: 70vh`
  - **Unsupported**: message + download button
- Animation: scale + fade (matches existing modal)

## Implementation Details

### Frontend (`src/client/index.html`)

1. **CDN additions** in `<head>`:
   - highlight.js CSS (github-dark theme)
   - highlight.js JS

2. **State management**:
   - `previewModal` — modal element reference
   - `activePreviewFile` — track which file is being previewed
   - `togglePreview(filename)` — open if closed, close if open
   - `closePreviewModal()` — close modal & reset state

3. **File type detection**:
   - `getFileType(filename)` → returns category string

4. **Preview modal HTML** — added after existing create/edit modal

5. **Render logic in `togglePreview()`**:
   - Detect file type
   - Generate appropriate HTML (img/video/audio/iframe/pre-code)
   - For text: fetch `/api/download`, then `hljs.highlightElement()`
   - Insert into modal body, show modal

6. **Eye icon** — added to `file-actions` for each file item

### Backend

No changes. Uses existing endpoints:
- `GET /files/*` — static file serving
- `GET /api/download?path=...` — file content download

## Constraints

- Single-file frontend (no build step for HTML)
- All styling via inline `<style>` block
- External libraries only via CDN
- Must maintain existing dark theme aesthetic
