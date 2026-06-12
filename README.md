# Prompt Compressor ⚡️

A developer-grade, AI-powered tool designed to drastically reduce the token count of large language model (LLM) prompts without losing their core intent or constraints. By utilizing the **Google Gemini API**, this tool intelligently prunes filler words, restructures syntax, and extracts key entities based on your desired compression strategy.

![Clean UI](https://img.shields.io/badge/UI-Minimalist-black?style=flat-square) ![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black?style=flat-square&logo=next.js) ![AI](https://img.shields.io/badge/AI-Gemini%203.5%20Flash-blue?style=flat-square)

## ✨ Features

*   **Intelligent AI Compression**: Uses `gemini-3.5-flash` to understand the context of your prompt and compress it intelligently.
*   **Three Strategies**:
    *   *Gentle*: Removes filler and pleasantries while keeping natural sentence structure.
    *   *Moderate*: Aggressively removes stop words and transition words for a dense but readable output.
    *   *Aggressive*: Extracts only core keywords, prioritizing extreme token reduction over human readability.
*   **Built-in Token Estimation**: Live tracking of original tokens, compressed tokens, and the total percentage saved.
*   **Developer Aesthetic**: A sleek, terminal-inspired minimalistic UI with dynamic **Light and Dark mode** toggling (saves preference to `localStorage`).
*   **Live Support System**: Integrated with the **Resend API** to allow users to send support requests directly to the developer's email via a clean in-app modal.

## 🛠 Tech Stack

*   **Frontend**: Next.js (App Router), React, Tailwind CSS v4
*   **Backend**: Next.js Route Handlers (Serverless APIs)
*   **AI Engine**: Google Gemini API (`@google/generative-ai` / REST)
*   **Email Service**: Resend API (`resend` Node SDK)

---

## 🚀 Local Development Setup

Follow these steps to run the Prompt Compressor on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/d3mio/Token-reducing-tool-.git
cd "Token-reducing-tool-/prompt-compressor"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a new file named `.env.local` inside the `prompt-compressor` directory and add your API keys:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
RESEND_API_KEY="your_resend_api_key_here"
```
*(Get a Gemini API key from Google AI Studio, and a Resend API key from Resend.com).*

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Vercel Deployment

Deploying this application to Vercel requires one specific configuration tweak because the Next.js app is nested inside a subfolder.

1.  Push your code to GitHub.
2.  Log in to Vercel and click **Add New... > Project**.
3.  Import this repository.
4.  **CRITICAL**: On the configuration screen, click Edit next to **Root Directory** and select the `prompt-compressor` folder.
5.  Set your **Framework Preset** to **Next.js**.
6.  Open the **Environment Variables** tab and add `GEMINI_API_KEY` and `RESEND_API_KEY` with their respective values.
7.  Click **Deploy**.

*(If you get a 404 error after deploying, double check that your Framework Preset is set to Next.js in your project settings and trigger a redeploy).*
