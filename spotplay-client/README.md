# SpotPlay 🎵

![SpotPlay Banner](./assets/overview.jpg)

**SpotPlay** is a premium, cross-platform music streaming desktop application built with React and Electron. It leverages APIs from **SoundCloud** and **YouTube** to provide users with an infinite library of tracks without requiring local storage.

The project features a custom audio engine, comprehensive library management, and a robust Node.js/PostgreSQL backend hosted on Render and NeonDB.

## ✨ Key Features

- 🎧 **Seamless Streaming:** Pulls and plays audio dynamically from SoundCloud and YouTube.
- 📊 **Advanced Analytics:** A dedicated "Overview" dashboard tracks daily listening time, streaks, and library statistics.
- 📁 **Library Management (My Vault):** Create playlists, group them into folders, and pin favorite collections for quick access.
- 🎨 **Deep Customization:** Fully personalized UI with Light/Dark/System themes and customizable accent colors.
- 🔒 **Secure Authentication:** JWT-based auth system with automatic token refreshing.
- 💻 **Native Desktop Experience:** Packaged with Electron featuring a frameless, modern window design (`titleBarStyle: 'hidden'`).

## 📸 App Screenshots

### My Vault & Library Management

![My Vault](./assets/vault.jpg)

### Customization & Settings

![Settings Modal](./assets/settings.jpg)

## 🛠️ Tech Stack

**Frontend & Desktop:**

- **React 19** & **TypeScript**
- **Vite** (Bundler) & **Tailwind CSS** (Styling)
- **React Router** (HashRouter for desktop navigation)
- **Electron** & **Electron-Builder** (Desktop compilation)

**Backend & Database:**

- **Node.js** & **Express**
- **PostgreSQL** (hosted on NeonDB)
- **pg-pool** (Database connections)
- **Render** (Cloud hosting)

## 🚀 Getting Started

### For Users

Download the latest release for your operating system:

- [Download for macOS (.dmg)](https://drive.google.com/file/d/1dsyePbSNUCueC0oF9dJr1fa15BncUP1_/view?usp=sharing)
- [Download for Windows (.exe)](https://drive.google.com/file/d/1muysSbAlk-Vhl0IeUVrLk3heopJggCMl/view?usp=drive_link)

### For Developers

To run this project locally, ensure you have Node.js installed, then follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/spotplay-front.git](https://github.com/YOUR_USERNAME/spotplay-front.git)
   cd spotplay-front
   ```
2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Run the application in development mode:**

   ```bash
   npm run electron:dev
   ```

4. **Build the executable for your OS:**
   ```bash
   npm run electron:build
   ```

(To build for Windows from macOS, use npm run electron:build:win)

Designed and developed by [Artem Sapotnitskyi]
