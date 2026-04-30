# CarePulse 💙

CarePulse is a modern, AI-powered healthcare companion application designed to provide users with an accessible, intelligent, and comprehensive health management experience. By bridging the gap between advanced artificial intelligence and everyday user needs, CarePulse offers a suite of dynamic medical tools right at your fingertips.

## 🚀 Key Features & Functionalities

### 1. Dual-Language Support (English & Hindi) 🇮🇳🇬🇧
- Fully localized interface using a custom `LanguageContext`.
- Seamlessly toggle between English and Hindi across the entire application—from the landing page to complex diagnostic tools.
- All hardcoded text is mapped to dynamic translation keys for maximum accessibility.

### 2. Intelligent Authentication System 🔐
- Secure Login and Signup flows connected to a local Node.js/Express backend and MongoDB.
- **Protected Routes:** Critical user data and features (like profile details and medical reports) are gated behind an authentication layer, showing a "Login Required" lock screen for unauthorized users.

### 3. AI Symptom Checker 🤖 (Available without Login)
- An advanced diagnostic tool where users can select body parts and input their symptoms.
- Uses AI to map symptoms to potential conditions, providing a preliminary health analysis before consulting a doctor.

### 4. AI Medical Report Analyzer 📄
- Users can securely drag-and-drop or upload complex medical reports (PDF, JPG, PNG).
- Powered by the **Gemini AI API**, the analyzer breaks down complex medical jargon from lab results, X-rays, or MRIs into simple, actionable insights.

### 5. Global Medicine Encyclopedia 💊
- Integrated with the **OpenFDA Database API**.
- Allows users to search for thousands of real-world medications, drugs, and brands.
- Provides immediate access to official clinical information, active ingredients, dosages, and warnings.

### 6. Dynamic Facility Locator 🏥
- Real-time location tracking using the browser's Geolocation API.
- Integrated with **React Leaflet** and the **Overpass API** to dynamically find and display nearby hospitals, clinics, and pharmacies on an interactive map.

### 7. Smart Medicine Reminders ⏰
- A personalized scheduling tool that allows users to set daily dosages for pills, capsules, and tablets.
- Reminders are synchronized with the backend database to track what has been taken and what is pending.
- Fallback mock data ensures the UI works flawlessly even if the backend is temporarily offline.

### 8. Find a Doctor (Appointments) 🩺
- A clean interface to search for top-rated medical specialists by name or specialty.
- Features intuitive UI components displaying doctor ratings, distance, and availability.

### 9. Personalized Health Dashboard (Profile) 👤
- A dedicated space for users to manage their personal health data.
- Stores information like Blood Group, Height, Weight (with BMI calculation), Allergies, Chronic Conditions, and Emergency Contacts.

### 10. Modern, Premium UI/UX ✨
- Built with **React** and **Tailwind CSS**.
- Features a beautiful glassmorphism design, vibrant medical-themed gradients (teal and blue), and smooth micro-animations powered by **Framer Motion**.
- Fully responsive across desktop, tablet, and mobile devices.
- Built-in Dark Mode / Light Mode toggle.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- React Router DOM (Routing)
- React Leaflet (Maps)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Google Gemini AI SDK (Report Analysis)
- Cors & Dotenv

## ⚙️ Getting Started

1. **Install Dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Environment Variables:**
   Ensure your `backend/.env` file has your valid `GEMINI_API_KEY`.

3. **Run the Application:**
   ```bash
   # Terminal 1: Start the backend server (Ensure MongoDB is running)
   cd backend
   npm run dev

   # Terminal 2: Start the Vite frontend
   npm run dev
   ```
