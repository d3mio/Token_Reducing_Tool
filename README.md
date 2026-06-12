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
