<div align="center">
  <img width="1200" height="475" alt="Kisan AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # 🌾 Kisan AI 🌾
  ### *Empowering Farmers with Advanced Gemini AI & Collaborative Agricultural Tools*

  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-E57373?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Overview

**Kisan AI** is a state-of-the-art agricultural web application designed to empower Indian farmers, experts, and agricultural merchants. By combining the power of **Google Gemini 2.5 Flash** with custom collaboration tools, Kisan AI helps farmers diagnose crop health issues, forecast yield predictions, track real-time crop market prices, discover government schemes, trade in a specialized agricultural marketplace, lease land, and communicate directly with a community of peers and experts.

---

## ⚡ Core Features

### 🤖 Gemini AI Assistants
*   **AI Crop Advisor:** Chat with a highly trained agricultural AI to receive guidance on soil prep, pest control, and watering schedules.
*   **Crop Health & Disease Diagnosis:** Upload a photo of an unhealthy crop, and the AI will analyze the image to identify pests, diseases, or deficiencies and recommend direct treatment options.
*   **Knowledge Bot (ChartBot):** Query structured data about crop cycles, livestock care, and optimal soil environments.
*   **Voice Assistant:** Hands-free voice commands to ask questions while active in the field.

### 🚜 Agricultural Marketplace & Leasing
*   **Products Marketplace:** Buy and sell seeds, organic fertilizers, eco-friendly pesticides, and farm equipment.
*   **Quote Request Management:** Farmers can post quote requests for large orders, allowing local merchants to submit bids.
*   **Land for Lease:** Browse or list agricultural land for lease with detailed parameters like soil type, pH levels, and irrigation availability.

### 👥 Community & Knowledge Sharing
*   **Community Feed & Chat:** Connect with neighboring farmers, post questions, share updates, and receive assistance.
*   **Blog Corner:** Read success stories, agricultural tutorials, and tips shared by experts and experienced guides.
*   **Localized Weather Alerts:** Get weather reports and severe weather advisories tailored to local farms.
*   **Government Schemes Finder:** Search and apply for agricultural subsidies, schemes, loans, and government support programs.

---

## ⚙️ Quick Start & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Navigate to the App Folder
```bash
# If you are in the workspace root, navigate into the project subdirectory
cd Kisan-AI-main
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Your Environment Variables
Create a file named `.env.local` inside this directory:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> Get your Gemini API key from the [Google AI Studio Console](https://aistudio.google.com/).

### 5. Run the App Locally
```bash
npm run dev
```
The application will start running locally. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
.
├── components/          # React Dashboard and Page components
│   ├── AIAssistant.tsx        # Crop advisory chat interface
│   ├── DiseaseDiagnosis.tsx   # Multimodal crop diagnosis
│   ├── LandForLease.tsx       # Land lease listings
│   ├── Products.tsx           # Agricultural marketplace
│   ├── Schemes.tsx            # Government Schemes finder
│   ├── VoiceAssistant.tsx     # Speech-to-text farm assistant
│   └── ...                    # Other functional pages
├── services/            # API integration layers
│   └── geminiService.ts       # Google GenAI SDK integration
├── utils/               # File and upload helpers
│   └── fileUtils.ts           # Base64 helper for image analysis
├── types.ts             # Shared TypeScript typings
├── App.tsx              # Main layout and view router
├── index.html           # HTML entry point (contains Tailwind CDN & importmaps)
├── index.tsx            # React entry point
├── package.json         # Node dependencies and scripts
└── vite.config.ts       # Vite bundler configuration
```

---

## 🛠️ Technology Stack

*   **Framework:** [React 19](https://react.dev/) & [Vite 6](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS CDN](https://tailwindcss.com/) (Extends custom brand colors: beige, green, and gold)
*   **AI Integration:** [@google/genai SDK](https://www.npmjs.com/package/@google/genai) calling the `gemini-2.5-flash` model
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 📝 License

This project is licensed under the MIT License.
