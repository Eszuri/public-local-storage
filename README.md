# 📂 Eszuri Public Local Storage

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404d59?style=for-the-badge)
![ESM](https://img.shields.io/badge/ESM-Supported-blueviolet?style=for-the-badge)

A premium, high-performance local file management system with a modern web interface. Designed for seamless file operations over local networks or public tunnels.

## 🚀 Key Features

-   **✨ Modern UI**: Sleek, dark-themed interface with glassmorphism effects and Phosphor icons.
-   **📂 Full CRUD Operations**: Create, Read, Update, and Delete files and folders directly from your browser.
-   **⏳ Smart Loading**: Integrated loading overlays with blurred backgrounds to maintain UI integrity during slow connections.
-   **🔒 Secure by Design**: Built-in protection against Path Traversal attacks to keep your system safe.
-   **⚡ High Performance**: Powered by asynchronous I/O and `tsup` for lightning-fast bundling and execution.
-   **🌍 Public Ready**: Pre-configured scripts for Bore tunnel integration.

## 🛠 Tech Stack

-   **Core**: [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Bundler**: [tsup](https://tsup.egoist.dev/) (Fast, zero-config)
-   **Development**: [tsx](https://tsx.is/) (Instant TypeScript execution)
-   **Styling**: Vanilla CSS with Modern Variables & Glassmorphism

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    STORAGE_PATH=D:\MyFiles  # Path to manage
    PORT=4000
    ```

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch development server with **Hot Reload**. |
| `npm run online` | Dev server + **Bore tunnel** (public access on port 4000). |
| `npm run build` | Bundle the project for **Production** (Minified & Optimized). |
| `npm start` | Run the compiled production bundle. |
| `npm run typecheck` | Validate TypeScript integrity. |

## 🚀 Cara Menjalankan (How to Run)

### 💻 Di Desktop (Windows/Mac/Linux)
Anda dapat menjalankan server secara lokal atau mengeksposnya ke publik.

1.  **Server Lokal**:
    ```bash
    npm run dev
    ```
    Akses di: `http://localhost:4000`

2.  **Server Publik (Bore Tunnel)**:
    ```bash
    npm run online
    ```
    *Server lokal + tunnel publik otomatis via Bore (port 4000).*

3.  **Manual (Production Mode)**:
    ```bash
    npm run build
    npm start
    ```

---

### 📱 Di Android (via Termux)
Anda bisa menjadikan smartphone Anda sebagai server file storage yang bisa diakses dari mana saja menggunakan **Bore**.

1.  **Persiapan Termux**:
    Buka Termux dan instal dependensi yang diperlukan:
    ```bash
    pkg update && pkg upgrade
    pkg install nodejs git
    cargo install bore-cli
    ```

2.  **Jalankan Aplikasi**:
    ```bash
    git clone <url-repo-anda>
    cd project-name
    npm install
    npm run online
    ```
    *Bore akan memberikan URL publik yang bisa diakses secara global.*

---

## 🏗 Project Structure

```text
├── src/
│   ├── index.ts          # Backend logic & API Endpoints
│   └── client/
│       └── index.html    # Single Page Application (SPA) Frontend
├── storage/              # Default storage location
├── build/                # Optimized production build (after npm run build)
├── .env                  # Environment configuration
└── tsconfig.json         # Strict TypeScript configuration
```

## 🛡 Security Note

This application is designed to provide access to your local filesystem. **Always** use a secure `STORAGE_PATH` and avoid exposing sensitive system directories. The built-in security layer ensures that users cannot navigate outside the defined `STORAGE_PATH`.

---
Made with ❤️ by Eszuri
