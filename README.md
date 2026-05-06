# 📘 AI-Based PDF & Text Summarization Platform

An AI-powered full-stack web application that allows users to:

- Upload PDF documents
- Generate AI summaries from PDFs
- Summarize custom text input
- Chat with uploaded PDFs using AI
- View multi-page PDFs directly in the browser

Built using React.js, Node.js, Express.js, and Groq AI.

---

# 🚀 Features

## ✅ PDF Upload & Parsing
- Upload PDF files
- Extract text automatically from uploaded PDFs
- Support for multi-page PDF viewing

## ✅ AI PDF Summarization
- Generate concise summaries from uploaded PDFs
- Powered by Groq LLM API

## ✅ AI Text Summarization
- Paste custom text
- Generate instant AI summaries

## ✅ Chat With PDF
- Ask questions related to uploaded PDF documents
- AI responds based on PDF content

## ✅ Modern UI
- Clean and responsive user interface
- Professional dashboard-style layout
- Multi-panel PDF and chat experience

---

# 🛠️ Tech Stack

## Frontend
- React.js
- react-pdf

## Backend
- Node.js
- Express.js

## AI / NLP
- Groq API
- Llama 3.1 Model

## PDF Processing
- pdf-parse
- multer

---

# 📂 Project Structure

```bash
AI-Based-Text-Summarization-Platform/
│
├── frontend/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── texts/
│   └── server.js
│
├── Screenshots/
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/VinayPandey185/AI-Based-Text-Summarization-Platform.git
```

---

# 🔹 Backend Setup

```bash
cd backend
npm install
```

## Create `.env` file

```env
GROQ_API_KEY=your_api_key_here
```

## Run Backend

```bash
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🖼️ Application Screenshots

## Main UI

![UI](Screenshots/UI.png)

---

## PDF Uploaded & Summarized

![PDF Upload](Screenshots/file_uploaded_UI.png)

---

## Chat With PDF

![Chat With PDF](Screenshots/chatwithpdf.png)

---

# 💡 Example Use Cases

- Research paper summarization
- Academic PDF analysis
- AI-powered document assistant
- Notes summarization
- PDF-based question answering

---

# ✨ Future Improvements

- Real page citation support
- Semantic vector search
- Download summary as PDF
- Dark mode support
- User authentication
- Cloud deployment

---

# 👨‍💻 Author

Vinay Pandey

GitHub:
https://github.com/VinayPandey185

---

# 📌 Note

This project was developed as part of an AI/NLP-based assignment project and demonstrates:
- PDF text extraction
- NLP summarization
- AI integration
- Full-stack application development
- Interactive document chat system