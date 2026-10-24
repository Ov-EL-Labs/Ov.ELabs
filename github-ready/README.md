# Ov.EL Labs website

## Run locally

Install the dependencies, then start the local server:

```powershell
npm install
npm run dev
```

Open http://localhost:8000. The site includes the main page (index.html) and the standalone Connect with Us page (connect-with-us.html). It uses local CSS, JavaScript, logo artwork, favicon, and the MacBook GLB model. Tailwind and fonts load from external CDNs.

## Push to GitHub

This folder contains the website files intended for the repository. Open a terminal in this folder and run:

```powershell
git init
git add .
git commit -m "Add Ov.EL Labs website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your GitHub repository URL. `node_modules` is excluded; dependencies are recorded in `package.json` and `package-lock.json`.

