# Startup Node.js TypeScript

A modern, high-performance Node.js startup template using **TypeScript**, **ESM**, and **Fast Tooling**.

## 🚀 Quick Setup

You can quickly install all necessary dependencies using the provided batch script:

- Double-click **`install-module.bat`** 

Or run manually:
```bash
npm install
```

## 🛠 Features

- **TypeScript ESM**: Configured for modern ECMAScript Modules.
- **Fast Development**: Powered by `tsx` for near-instant execution.
- **Path Aliases**: Use `@/` to import from the `src` directory.
- **Clean Imports**: Extensionless imports configured (no need for `.js` at the end of imports).
- **Ready to Build**: Pre-configured `tsup` for lightning-fast bundling.

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run development server with auto-reload (watch mode). |
| `npm run test` | Run the application once for testing. |
| `npm run typecheck` | Validate TypeScript types without emitting files. |
| `npm run build` | Bundle the project for production into the `build/` folder. |
| `npm start` | Run the compiled production bundle. |

## 📁 Project Structure

```text
├── src/
│   ├── index.ts      # Entry point
│   └── utils.ts      # Utility functions (example)
├── build/            # Production output (after build)
├── tsconfig.json     # TypeScript configuration
├── package.json      # Dependencies and scripts
└── .env              # Environment variables
```

## ⚙️ Configuration Notes

- **Module Resolution**: Set to `bundler` to allow extensionless imports while maintaining ESM compatibility.
- **Node Types**: Explicitly included via `types: ["node"]` in `tsconfig.json`.

---
Happy Coding! 🚀
