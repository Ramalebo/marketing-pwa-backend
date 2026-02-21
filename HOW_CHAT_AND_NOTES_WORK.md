# How Chat (Chatbot), Notes, and Related Features Work

This doc explains how the chatbot, notes, and other data features work with the **static SQLite database** – where data lives, who sees what, and what happens on redeploy.

---

## 1. Notes

### Where notes live

- **Table:** `notes` in SQLite (`backend/data/database.sqlite`).
- **Fields:** title, content, clientId (optional), category, priority, aiRelevant, createdBy, timestamps.

### How they’re used

- **Create:** You create a note; backend sets `createdBy: req.user.id` and saves it in SQLite.
- **List / view / edit / delete:** All queries filter by `createdBy: req.user.id`, so you only see and change **your own** notes.
- **Link to client:** If you set `clientId`, the note is linked to that client. The Notes page and client detail can show this.
- **Chatbot:** Notes with **“AI relevant”** checked are used as **context** when you chat about a client (see below). Notes are **not** chat messages; they’re separate data the AI can read.

### Summary

- Notes are **stored in SQLite**, **per user** (`createdBy`).
- They can be **linked to a client** (`clientId`).
- **AI-relevant** notes are passed to the chatbot when you select that client.

---

## 2. Chat (Chatbot)

### What the chatbot does

- **No chat history in the database.** Each request is independent: you send a message (and optionally a client), the backend builds context, calls OpenRouter, and returns one reply. The app does **not** save your messages or the AI’s replies in SQLite.

### How one “chat” request works

1. **Frontend:** Sends `POST /api/chatbot/chat` with `{ message, clientId? }` and the auth token.
2. **Backend:**
   - If **clientId** is sent: loads that **client** from SQLite (only if `createdBy: req.user.id`), then loads **AI-relevant notes** for that client (`Note.findAll({ clientId, createdBy: req.user.id, aiRelevant: true })`).
   - Builds a text **context** from: client name, business, email, phone, location + those notes.
   - Sends to OpenRouter: system prompt (marketing assistant) + your message + that context.
   - Returns the AI reply in the response body.
3. **Frontend:** Displays the reply in the chat UI. Nothing is written to the database for that message or reply.

### So “how we deal with” chat

- **Chat messages:** Not stored. Each turn is stateless. If you want “chat history” later, we’d add a new table (e.g. `chat_messages`) and save each message/reply there – that would be a new feature.
- **Context for chat:** We **do** use existing data:
  - **Clients** (from SQLite, your clients only).
  - **Notes** (from SQLite, your notes only, and only those marked AI-relevant for the selected client).
- So chat is “deal with” by: **using notes and clients from SQLite as context**, and **not** persisting the conversation itself.

---

## 3. Other features (clients, ads, templates, etc.)

Same pattern as notes:

- **Clients:** Table `clients` in SQLite, filtered by `createdBy: req.user.id`. Create/edit/delete from the app; all stored in SQLite.
- **Ads:** Table `ads`, same idea – `createdBy: req.user.id`, optional `clientId`.
- **Templates:** Table `templates`, per user.
- **Customer contacts:** Table `customer_contacts`, per user, optional `clientId`.
- **Post history:** Table `post_history`, per user; logs when you post (or attempt to post) to social/email/SMS.

All of these are **stored in SQLite** and **scoped to the logged-in user** via `createdBy`. No separate “chat store” – only the chatbot uses notes/clients as **read-only context**.

---

## 4. Data lifecycle on Render (static SQLite)

- The SQLite file lives on the server (e.g. Render) at `backend/data/database.sqlite`.
- On Render’s **free tier**, the filesystem is **ephemeral**: when the service **restarts** or **redeploys**, that file is recreated empty (or from a fresh sync). So:
  - **Users, clients, notes, ads, templates, contacts, post history** – all of this **can be lost on each redeploy**.
  - **Chat** – not stored anyway; only the context (notes/clients) comes from SQLite, and that’s lost with the rest of the DB on redeploy.

### How to “deal with” that

1. **Accept reset:** For demos or light use, you can accept that after each deploy you start with an empty DB (re-register, re-add clients/notes). Chat still works; you just have no prior notes/clients until you add them again.
2. **Backup (advanced):** If you want to keep data across deploys, you’d need to:
   - Periodically copy `database.sqlite` to external storage (e.g. S3, or a backup job), and/or
   - Use Render’s **persistent disk** (paid) so the same SQLite file survives restarts.
3. **Switch back to MySQL:** If you need durable data and don’t want to manage backups, you could point the app back at FreeSQLDatabase (or another MySQL) and remove `USE_SQLITE`; then notes, clients, and everything else persist like before.

---

## 5. Quick reference

| Feature        | Stored in SQLite? | Key table(s)   | Scoped by     | Chat uses it?        |
|----------------|-------------------|----------------|---------------|----------------------|
| Users          | Yes               | users          | -             | No                   |
| Clients        | Yes               | clients        | createdBy     | Yes (context)        |
| Notes          | Yes               | notes          | createdBy     | Yes (AI-relevant)    |
| Ads            | Yes               | ads            | createdBy     | No                   |
| Templates      | Yes               | templates      | createdBy     | No                   |
| Contacts       | Yes               | customer_contacts | createdBy  | No                   |
| Post history   | Yes               | post_history   | createdBy     | No                   |
| Chat messages  | No                | -              | -             | N/A (stateless)      |

So: **we “deal with” chat and notes by (1) storing notes and clients in SQLite and using them as chatbot context, and (2) not storing chat messages. All other features (notes, clients, ads, etc.) are stored in SQLite and tied to the logged-in user; on Render free tier, that data can be lost on redeploy unless you add backups or persistent disk.**

If you want, we can add a small “Chat history” feature (new table + save each message/reply) so conversations persist in SQLite too.
