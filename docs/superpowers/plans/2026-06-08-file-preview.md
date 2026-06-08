# File Preview Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add file preview capability (images, video, audio, PDF, text/code) via a modal overlay toggled by an eye icon on each file item.

**Architecture:** Hybrid approach — binary files (images, video, audio, PDF) are previewed via the existing static route `/files/{path}`. Text/code files are fetched via `/api/download` and displayed with syntax highlighting via highlight.js. No backend changes needed; all changes are in `src/client/index.html`.

**Tech Stack:** Vanilla HTML/CSS/JS (single-file SPA), highlight.js via CDN

**Spec:** `docs/superpowers/specs/2026-06-08-file-preview-design.md`

---

### Task 1: Add highlight.js CDN

**Files:**
- Modify: `src/client/index.html:11` (after Phosphor Icons script tag)

- [ ] **Step 1: Add highlight.js CSS and JS CDN links**

After line 11 (`<script src="https://unpkg.com/@phosphor-icons/web"></script>`), add:

```html
    <!-- Highlight.js for code preview -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add highlight.js CDN for code preview"
```

---

### Task 2: Add Preview Modal CSS Styles

**Files:**
- Modify: `src/client/index.html` (inside `<style>` block, before closing `</style>` at line 364)

- [ ] **Step 1: Add preview modal CSS**

Before the closing `</style>` tag, add these styles:

```css
        /* Preview Modal */
        .preview-modal {
            max-width: 80vw;
            width: 80vw;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
        }

        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .preview-filename {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-main);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: calc(80vw - 8rem);
        }

        .preview-close-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 1.5rem;
            padding: 0.4rem;
            border-radius: 6px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .preview-close-btn:hover {
            color: var(--danger);
            background: rgba(239, 68, 68, 0.1);
        }

        .preview-body {
            flex: 1;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 0;
        }

        .preview-body img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 8px;
        }

        .preview-body video {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 8px;
        }

        .preview-body audio {
            width: 100%;
            max-width: 500px;
        }

        .preview-body iframe {
            width: 100%;
            height: 70vh;
            border: none;
            border-radius: 8px;
            background: white;
        }

        .preview-body pre {
            width: 100%;
            max-height: 70vh;
            overflow: auto;
            margin: 0;
            border-radius: 8px;
            font-size: 0.85rem;
            line-height: 1.5;
        }

        .preview-body pre code {
            display: block;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .preview-unsupported {
            text-align: center;
            color: var(--text-muted);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 2rem;
        }

        .preview-unsupported i {
            font-size: 3rem;
            opacity: 0.5;
        }

        .icon-btn.preview-active {
            color: var(--accent);
            background: rgba(59, 130, 246, 0.1);
        }
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add preview modal CSS styles"
```

---

### Task 3: Add Preview Modal HTML

**Files:**
- Modify: `src/client/index.html` (after the existing Create/Edit Modal, before `<script>` tag)

- [ ] **Step 1: Add preview modal HTML**

After the closing `</div>` of the Create/Edit Modal (the `modalOverlay` div), add:

```html
    <!-- Preview Modal -->
    <div class="modal-overlay" id="previewOverlay">
        <div class="modal preview-modal">
            <div class="preview-header">
                <span class="preview-filename" id="previewFilename"></span>
                <button class="preview-close-btn" onclick="closePreviewModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>
            <div class="preview-body" id="previewBody">
            </div>
        </div>
    </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add preview modal HTML structure"
```

---

### Task 4: Add File Type Detection Function

**Files:**
- Modify: `src/client/index.html` (inside `<script>` block, after variable declarations around line 421)

- [ ] **Step 1: Add `getFileType()` function**

After the line `let isEditing = false;`, add:

```javascript
        const FILE_TYPES = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
            video: ['mp4', 'webm', 'ogg', 'mov'],
            audio: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
            pdf: ['pdf']
        };

        function getFileType(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            for (const [type, exts] of Object.entries(FILE_TYPES)) {
                if (exts.includes(ext)) return type;
            }
            return 'text';
        }
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add getFileType() detection function"
```

---

### Task 5: Add Preview Toggle Logic

**Files:**
- Modify: `src/client/index.html` (inside `<script>` block, after the `getFileType` function from Task 4)

- [ ] **Step 1: Add preview state and toggle functions**

After the `getFileType()` function, add:

```javascript
        let activePreviewFile = null;
        const previewOverlay = document.getElementById("previewOverlay");

        async function togglePreview(name) {
            if (activePreviewFile === name) {
                closePreviewModal();
                return;
            }

            const targetPath = currentPath ? `${currentPath}/${name}` : name;
            const fileType = getFileType(name);
            const previewBody = document.getElementById("previewBody");
            const previewFilename = document.getElementById("previewFilename");

            previewFilename.textContent = name;
            previewBody.innerHTML = "";

            switch (fileType) {
                case 'image':
                    previewBody.innerHTML = `<img src="/files/${encodeURIComponent(targetPath)}" alt="${name}">`;
                    break;
                case 'video':
                    previewBody.innerHTML = `<video controls src="/files/${encodeURIComponent(targetPath)}"></video>`;
                    break;
                case 'audio':
                    previewBody.innerHTML = `<audio controls src="/files/${encodeURIComponent(targetPath)}"></audio>`;
                    break;
                case 'pdf':
                    previewBody.innerHTML = `<iframe src="/files/${encodeURIComponent(targetPath)}"></iframe>`;
                    break;
                case 'text':
                    try {
                        showLoading("Loading preview...");
                        const res = await fetch(`${API}/api/download?path=${encodeURIComponent(targetPath)}`);
                        if (!res.ok) throw new Error("Failed to load file");
                        const content = await res.text();
                        const ext = name.split('.').pop().toLowerCase();
                        const langMap = {
                            'js': 'javascript', 'ts': 'typescript', 'py': 'python',
                            'java': 'java', 'c': 'c', 'cpp': 'cpp', 'go': 'go',
                            'rs': 'rust', 'sh': 'bash', 'bat': 'dos', 'ps1': 'powershell',
                            'yaml': 'yaml', 'yml': 'yaml', 'xml': 'xml', 'sql': 'sql',
                            'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown'
                        };
                        const lang = langMap[ext] || 'plaintext';
                        const codeEl = document.createElement('code');
                        codeEl.className = `language-${lang}`;
                        codeEl.textContent = content;
                        const preEl = document.createElement('pre');
                        preEl.appendChild(codeEl);
                        previewBody.appendChild(preEl);
                        hljs.highlightElement(codeEl);
                    } catch (err) {
                        previewBody.innerHTML = `<div class="preview-unsupported"><i class="ph ph-warning"></i><div>Failed to load file</div></div>`;
                    } finally {
                        hideLoading();
                    }
                    break;
                default:
                    previewBody.innerHTML = `
                        <div class="preview-unsupported">
                            <i class="ph ph-file"></i>
                            <div>Preview not available</div>
                            <button class="btn btn-primary" onclick="window.open('${API}/api/download?path=${encodeURIComponent(targetPath)}')">
                                <i class="ph ph-download-simple"></i> Download
                            </button>
                        </div>`;
            }

            activePreviewFile = name;
            previewOverlay.style.display = "flex";
            setTimeout(() => previewOverlay.classList.add("show"), 10);
            updateEyeIcons();
        }

        function closePreviewModal() {
            previewOverlay.classList.remove("show");
            setTimeout(() => {
                previewOverlay.style.display = "none";
                document.getElementById("previewBody").innerHTML = "";
            }, 300);
            activePreviewFile = null;
            updateEyeIcons();
        }

        function updateEyeIcons() {
            document.querySelectorAll('[data-preview-name]').forEach(btn => {
                const name = btn.getAttribute('data-preview-name');
                const icon = btn.querySelector('i');
                if (activePreviewFile === name) {
                    btn.classList.add('preview-active');
                    icon.className = 'ph-fill ph-eye-closed';
                    btn.title = 'Close Preview';
                } else {
                    btn.classList.remove('preview-active');
                    icon.className = 'ph ph-eye';
                    btn.title = 'Preview';
                }
            });
        }
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add preview toggle logic with multi-type support"
```

---

### Task 6: Add Eye Icon to File Items

**Files:**
- Modify: `src/client/index.html` (inside the file item rendering loop, in the `fileActions` section)

- [ ] **Step 1: Add eye icon button in file item rendering**

In the `files.forEach(f => { ... })` block, find the section where `fileActions` is created. Inside the `if (!f.isDirectory)` block (where the edit button is created), add the preview button **before** the edit button:

Replace the existing block:
```javascript
                    if (!f.isDirectory) {
                        const editBtn = document.createElement("button");
                        editBtn.className = "icon-btn edit";
                        editBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
                        editBtn.title = "Edit File";
                        editBtn.onclick = () => openEditModal(f.name);
                        fileActions.appendChild(editBtn);
                    }
```

With:
```javascript
                    if (!f.isDirectory) {
                        const previewBtn = document.createElement("button");
                        previewBtn.className = "icon-btn";
                        previewBtn.setAttribute('data-preview-name', f.name);
                        previewBtn.innerHTML = '<i class="ph ph-eye"></i>';
                        previewBtn.title = "Preview";
                        previewBtn.onclick = () => togglePreview(f.name);
                        fileActions.appendChild(previewBtn);

                        const editBtn = document.createElement("button");
                        editBtn.className = "icon-btn edit";
                        editBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
                        editBtn.title = "Edit File";
                        editBtn.onclick = () => openEditModal(f.name);
                        fileActions.appendChild(editBtn);
                    }
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "feat: add eye icon toggle for file preview"
```

---

### Task 7: Verify & Final Commit

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: PASS (only deprecation warning about baseUrl is acceptable)

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: PASS — outputs to `build/`

- [ ] **Step 3: Manual verification**

Run: `npm run dev`

Open `http://localhost:4000` in browser. Verify:
- Eye icon appears on each file item (not on folders)
- Clicking eye icon opens preview modal
- Image files display correctly
- Text/code files display with syntax highlighting
- Video/audio files show working player controls
- PDF files render in iframe
- Clicking eye icon again (or X button) closes preview
- Eye icon toggles between `ph-eye` and `ph-eye-closed`

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: resolve preview issues found during verification"
```
