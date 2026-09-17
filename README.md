# Executive Productivity Agent (Veridian Corp)
> **Assignment 1 — Take-Home Submission for AIONOS Interview**  
> **Built for:** Arjun Malhotra (VP Sales)  
> **Timeframe:** Week of Monday, 21 September 2026 – Friday, 25 September 2026  

---

## ⚡ Quick Start (Run in 1 Command)

```bash
# 1. Clone & enter the folder
git clone <your-repo-url>
cd executive-productivity-agent

# 2. Install dependencies
npm install
npm --prefix server install
npm --prefix client install

# 3. Build & start
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

> **For live development:**  
> Run `npm run dev` to start both Vite (client on `http://localhost:5173`) and Express (server on `http://localhost:5000`) simultaneously.

---

## 📖 How It Works (Beginner-Friendly Explanation)

This project is built using a clean, simple **Full-Stack architecture (React + Node.js/Express)** with **100% grounding** in the assignment data pack (zero hallucinations):

1. **`server/data/data.js`**: Contains structured JSON modeling all facts from the Data Pack:
   - Leadership Sync transcript (Monday 9:00 AM)
   - 4 Team Calendars (Arjun, Neha, Raghav, Divya)
   - 5 Email Threads (25 total emails)
   - 2 Voice Notes dictated by Arjun for himself
2. **`server/index.js`**: A lightweight Express server with two clean endpoints:
   - `GET /api/dashboard`: Sends tasks, meetings, and raw source summaries to the frontend.
   - `POST /api/ask`: Takes Arjun's question, identifies the topic (e.g. attention, overdue, waiting, conflict, lease), and returns the exact grounded answer with source citations.
3. **`client/src/App.jsx`**: A clean React dashboard showing:
   - **Urgent Priority Banners** (Overdue items, Unassigned risks, Calendar conflicts)
   - **Interactive AI Agent Q&A** with quick clickable question chips
   - **Action Items Grid** with status pills, deadlines, and source evidence
   - **Weekly Calendar** with visual conflict highlighting
   - **Data Pack Inspector** to view the raw transcript, emails, and voice memos

---

## 🎯 Key Domain Insights from the Assignment Data

When asked by the interviewer, here are the 4 critical findings derived from the data pack:

1. **🔴 Overdue Deliverable — Updated Vendor List for Raghav Sethi**
   - *Trail:* Arjun promised it at Monday sync (due Tue EOD) → postponed to Tue morning → postponed to Wed morning → Raghav checked in Wed 8:45 AM.
   - *Finding:* Deliverable was never sent. Raghav is actively waiting on Arjun.

2. **🔴 Unassigned Risk — Mumbai Office Lease Renewal**
   - *Trail:* Facilities sent company-wide reminders establishing a deadline of **Friday, 25 September EOD**. Raghav asked Arjun on Thursday 4:45 PM who is handling it.
   - *Finding:* Still unassigned. Arjun should delegate or sign this during his **Friday 10:00 AM Facilities Check-in**.

3. **🟡 Calendar Conflict — Thursday 9:30 AM Double-Booking**
   - *Trail:* Arjun has **Board Prep Session (9:00–10:00 AM)** on Thursday. Neha scheduled the **Q3 Campaign Deck Review for 9:30 AM**.
   - *Finding:* 30-minute double-booking. Recommended fix is moving the deck review to 10:00 AM Thursday.

4. **✅ Completed Deliverable — July Expense Variance Report**
   - *Trail:* Divya Rao delivered the report on Wednesday at 6:00 PM; Arjun confirmed receipt at 6:10 PM. Ready for board prep.

---

## 💬 Interview Cheatsheet: How to Explain Your Code

If the interviewer asks:
- **"How does the agent avoid hallucinations?"**  
  *"The agent only pulls from the structured data in `server/data/data.js`. If an answer isn't grounded in one of the 4 sources (Meeting transcript, calendars, email threads, voice notes), it is not included. Every answer also returns the exact source."*
- **"How is the project structured?"**  
  *"It's a monorepo with `server/` running Express and `client/` running React with Vite. In production, Express directly serves the built React frontend on port 5000 so anyone can run it with a single command."*
- **"What proactive intelligence did you add?"**  
  *"Beyond basic task listing, I detected the hidden Thursday 9:30 AM calendar conflict between Board Prep and Neha's Deck Review, and flagged the Friday EOD Mumbai lease deadline that was about to slip without an owner."*
