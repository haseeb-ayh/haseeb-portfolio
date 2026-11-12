# Dynamic Portfolio Management Guide

Your portfolio is now **fully dynamic**! You can manage your projects, upload or update your CV / Resume, and edit all profile details **without ever touching the code or opening VS Code**.

---

## 🚀 How to Access Your Admin CMS

You can open your Admin CMS at any time using any of these 3 methods:

1. **Floating Button**: Click the **"Admin CMS"** pill button at the bottom-right corner of your screen.
2. **Keyboard Shortcut**: Press **`Ctrl + Shift + A`** (or `Alt + A`) anywhere on the page.
3. **Quick Links**:
   - In the **Projects** section: Click **"+ Manage Projects"** beside the filter pills.
   - In the **Footer**: Click the **"Admin"** link beside the copyright text.

### Default Passcode
- **Default PIN**: `haseeb2026` (or `admin123`)
- *You can change this PIN anytime in the **Security / PIN** tab of the CMS.*

---

## 💼 1. Managing Projects Without Editing Code

Inside the **Projects** tab in the Admin CMS:
- **Add New Project**: Click **"+ Add Project"**, fill in the title, stack summary, category (`Full-Stack`, `Front-End`, `Back-End`), description, bullet points, tech chips, GitHub link, and Live Demo link. Click **"Save Project"**.
- **Edit Projects**: Click the pencil icon on any project to modify any detail in seconds.
- **Reorder Projects**: Use the **Up (↑)** and **Down (↓)** arrows to change which project appears first.
- **Delete Projects**: Click the trash icon to remove a project.

---

## 📄 2. Updating Your CV / Resume

Inside the **CV / Resume** tab in the Admin CMS:
- **Direct PDF Upload**: Click the dropzone to upload your latest `CV.pdf` file directly.
- **External URL**: Alternatively, paste a direct link from Google Drive, Dropbox, or Cloudinary.
- **Custom File Name**: Customize the name downloaded by recruiters (e.g. `Abdul_Haseeb_MERN_Resume.pdf`).

### Where the CV Button Appears:
1. **Hero Section**: Prominent **"Download CV"** button right next to *"View Projects"* and *"Experience"*.
2. **Navigation Bar**: Dedicated **"Resume"** button with an icon in the top header (and in the mobile drawer).

---

## 👤 3. Updating Profile Photos, Bio & Role

Inside the **Bio & Profile** tab:
- **Change Avatar Photo**: Click **"Upload Photo"** to select any picture from your device. It is automatically optimized and instantly updates your photo across the Hero section, Navbar, and social previews!
- **Change About Portrait**: Click **"Upload Portrait"** to update your larger portrait photo in the About Me section.
- **Or Paste Image URL**: If your photo is hosted online (LinkedIn, GitHub, Cloudinary), paste the direct URL.
- **Update Details**: Change your headline, current role at CorePro Techno, availability badge, bio, and social links.

---

## ☁️ 4. Firebase Live Cloud Sync Setup (Optional)

By default, the CMS works immediately in **Local Browser Mode**. To broadcast changes **live to all visitors on Vercel** in real-time:

1. Go to your [Firebase Console](https://console.firebase.google.com/) and create/open your project.
2. Enable:
   - **Cloud Firestore** (Start in test mode or production with open read / admin write).
   - **Firebase Storage** (For hosting your uploaded CV PDF and screenshots).
3. Copy your Web App config credentials.
4. In your portfolio, open **Admin CMS → Firebase & Sync** tab.
5. Paste your `apiKey`, `projectId`, `storageBucket`, etc., and click **"Connect Firebase"**.
6. Click **"Push Current Portfolio Data to Firestore"** to seed all your existing projects into the cloud database with one click!

*Alternatively, you can add these to your `.env.local` or Vercel Environment Variables (`VITE_FIREBASE_API_KEY`, etc.).*

