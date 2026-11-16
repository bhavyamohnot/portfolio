# Bhavya Mohnot · Portfolio

An interactive portfolio built around one idea: **I debug products like machines.**
The site starts as an engineering blueprint; the **Render** switch turns the drawing into the finished product.

- **Spec sheets:** 5 projects (AI Feedback Analyst, TradeLens, Olist, Starbucks, WhatsApp Pay), each with a live demo built on the project's real data
- **Assembly line:** experience as stations on a conveyor
- **Bill of materials:** every skill links to where it was used
- **AI twin:** a chatbot that answers only from my résumé (Gemini, via a Vercel function)
- **Ctrl/⌘ + K** command menu, blueprint ⇄ render theme, deep links (`/#spec-olist`, `?view=render`)

Plain HTML, CSS and JavaScript. No framework, no build step.

## Edit
| What | Where |
|---|---|
| All text (projects, experience, skills) | `js/content.js` |
| Chart data (generated from the project outputs) | `js/data.js` |
| Chatbot knowledge | `FACTS` in `api/chat.js` |
| Résumé PDF | `assets/Bhavya_Mohnot_Resume.pdf` |

## Deploy (Vercel)
1. Import this GitHub repo in Vercel (framework preset: **Other**, no build command).
2. Settings → Environment Variables → add `GEMINI_API_KEY`.
3. Every push to `main` redeploys.
