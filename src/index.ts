import "dotenv/config";
import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import {fileURLToPath} from "url";


const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ambil path dari .env, jika tidak ada gunakan folder 'storage' di root project
const storagePathConfig = process.env.STORAGE_PATH as string;
const PUBLIC_DIR = path.resolve(storagePathConfig);

// Pastikan direktori penyimpanan ada
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, {recursive: true});
}

console.log(`📂 Storage Path: ${PUBLIC_DIR}`);

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/files", express.static(PUBLIC_DIR));

// Serve Frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

/* =========================
   🔹 FILE CRUD API
========================= */

// READ all files
app.get("/api/files", async (req, res) => {
    const queryPath = (req.query.path as string) || "";
    const targetPath = path.resolve(PUBLIC_DIR, queryPath);

    // Keamanan: Pastikan targetPath berada di dalam PUBLIC_DIR
    const relative = path.relative(PUBLIC_DIR, targetPath);
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);

    if (isOutside || !fs.existsSync(targetPath)) {
        return res.status(403).send("Forbidden or Not Found");
    }

    try {
        // Menggunakan async readdir agar tidak memblokir event loop
        const files = await fs.promises.readdir(targetPath, {withFileTypes: true});
        const result = files.map(dirent => ({
            name: dirent.name,
            isDirectory: dirent.isDirectory()
        }));
        res.json(result);
    } catch (err) {
        res.status(500).send("Error reading directory");
    }
});

// CREATE file
app.post("/api/file", (req, res) => {
    const {name, content, currentPath} = req.body;
    const targetPath = path.resolve(PUBLIC_DIR, currentPath || "", name);

    const relative = path.relative(PUBLIC_DIR, targetPath);
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
    if (isOutside) return res.status(403).send("Forbidden");

    fs.writeFileSync(targetPath, content || "");
    res.send("File created");
});

// UPDATE file
app.put("/api/file", (req, res) => {
    const {name, content, currentPath} = req.body;
    const targetPath = path.resolve(PUBLIC_DIR, currentPath || "", name);

    const relative = path.relative(PUBLIC_DIR, targetPath);
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
    if (isOutside || !fs.existsSync(targetPath)) return res.status(404).send("Not found");

    fs.writeFileSync(targetPath, content);
    res.send("File updated");
});

// DELETE file
app.delete("/api/file", (req, res) => {
    const {name, currentPath} = req.body;
    const targetPath = path.resolve(PUBLIC_DIR, currentPath || "", name);

    const relative = path.relative(PUBLIC_DIR, targetPath);
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
    if (isOutside || !fs.existsSync(targetPath)) return res.status(404).send("Not found");

    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
        fs.rmSync(targetPath, {recursive: true, force: true});
    } else {
        fs.unlinkSync(targetPath);
    }
    res.send("File deleted");
});

// DOWNLOAD file
app.get("/api/download", (req, res) => {
    const queryPath = req.query.path as string;

    if (!queryPath) {
        return res.status(400).send("File path required");
    }

    console.log(`📥 Download request: ${queryPath}`);
    const targetPath = path.resolve(PUBLIC_DIR, queryPath);
    console.log(`📍 Absolute path: ${targetPath}`);

    const relative = path.relative(PUBLIC_DIR, targetPath);
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
    if (isOutside || !fs.existsSync(targetPath)) {
        console.error(`❌ File not found or forbidden: ${targetPath}`);
        return res.status(404).send("File not found");
    }

    if (fs.statSync(targetPath).isDirectory()) {
        return res.status(400).send("Cannot download directory");
    }

    res.download(targetPath, (err) => {
        if (err) {
            console.error(`🔥 Error sending file: ${err.message}`);
            if (!res.headersSent) {
                res.status(500).send("Error downloading file");
            }
        }
    });
});

/* =========================
   🔹 START SERVER
========================= */

server.listen(PORT, async () => {
    console.log(`🚀 Local Server running: http://localhost:${PORT}`);
});
