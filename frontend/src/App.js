import React, { useState } from "react";
import PDFViewer from "./components/PDFViewer";
import Chat from "./components/Chat";
import jsPDF from "jspdf";

function App() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [summary, setSummary] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfName, setPdfName] = useState("");

  //const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL =
    "https://ai-based-text-summarization-platform-2.onrender.com";

  // PDF UPLOAD

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      setTextInput("");
      setSummary("");

      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log(data);

      if (data.filePath) {
        setPdfUrl(`${BACKEND_URL}${data.filePath}`);
        setPdfName(file.name);
      }

      setSummary(
        data.summary || data.error || "Summary could not be generated.",
      );
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  // TEXT SUMMARIZATION

  const handleSummarizeText = async () => {
    if (!textInput.trim()) return;

    setPdfName("");

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
        }),
      });

      const data = await res.json();

      setSummary(data.summary || "Summary could not be generated.");
    } catch (error) {
      console.error("Summary error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* LEFT PANEL */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: window.innerWidth < 768 ? "16px" : "24px",
          background: "rgba(255,255,255,0.92)",
          borderRight: "1px solid #dbe4ff",
          overflowY: "auto",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* TITLE */}

        <h1
          style={{
            fontSize: window.innerWidth < 768 ? "24px" : "32px",
            fontWeight: "700",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#111827",
          }}
        >
          <span style={{ fontSize: "34px" }}>📘</span>
          AI PDF & Text Summarizer
        </h1>
        {/* SUBTITLE */}

        <p
          style={{
            color: "#6b7280",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          Upload PDFs or enter text to generate AI-powered summaries instantly.
        </p>

        {/* TEXTAREA */}

        <textarea
          placeholder="Enter text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid #dbe4ff",
            marginBottom: "15px",
            fontSize: "15px",
            resize: "vertical",
            outline: "none",
            lineHeight: "1.6",
            background: "#ffffff",
            boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
          }}
        />

        {/* BUTTON */}

        <button
          onClick={handleSummarizeText}
          style={{
            padding: "14px",
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            marginBottom: "20px",
            boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
            transition: "0.2s",
          }}
        >
          Summarize Text
        </button>

        {/* LOADING */}

        {loading && (
          <p style={{ color: "#2563eb" }}>⏳ Generating AI Summary...</p>
        )}

        {/* SUMMARY */}

        {summary && (
          <div
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              padding: "22px",
              borderRadius: "18px",
              marginTop: "20px",
              boxShadow: "0 6px 24px rgba(37,99,235,0.08)",
              lineHeight: "1.8",
              color: "#374151",
              border: "1px solid #e5edff",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              Summary
            </h3>

            <p>{summary.replace(/\*/g, "")}</p>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}

        {summary && (
          <button
            onClick={() => {
              const doc = new jsPDF();

              // ===== TITLE =====

              const title = pdfName
                ? pdfName
                    .replace(".pdf", "")
                    .replace(/_/g, " ")
                    .replace(/\breport\b/i, "")
                    .trim() + " Report Summary"
                : "Text Summarizer Report";
              // ===== CLEAN SUMMARY =====

              let cleanSummary = summary
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .trim();

              // ===== PDF Upload Summary =====
              if (pdfName) {
                const summaryLines = cleanSummary.split("\n");

                if (summaryLines.length > 1) {
                  summaryLines.shift();
                }

                cleanSummary =
                  "Project Overview:\n\n" + summaryLines.join("\n");
              }

              // ===== DYNAMIC TITLE REMOVAL =====
              const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

              const titleRegex = new RegExp(`^${escapedTitle}\\s*`, "i");

              cleanSummary = cleanSummary.replace(titleRegex, "");

              // ===== PDF TITLE =====

              doc.setFont("helvetica", "bold");

              doc.setFontSize(16);

              doc.text(title, 105, 20, { align: "center" });

              // Dynamic underline
              const titleWidth = doc.getTextWidth(title);

              const startX = 105 - titleWidth / 2;

              const endX = 105 + titleWidth / 2;

              doc.line(startX, 24, endX, 24);

              // ===== CONTENT =====

              const lines = doc.splitTextToSize(cleanSummary, 265);

              let y = 35;

              lines.forEach((line) => {
                // New page handling
                if (y > 270) {
                  doc.addPage();

                  y = 20;
                }

                // ===== DYNAMIC HEADING DETECTION =====

                const isHeading =
                  line.trim().endsWith(":") ||
                  // Standalone headings
                  (line.length < 35 &&
                    !line.startsWith("1.") &&
                    !line.startsWith("2.") &&
                    !line.startsWith("3.") &&
                    !line.startsWith("4.") &&
                    !line.startsWith("5.") &&
                    !line.startsWith("6.") &&
                    !line.startsWith("7.") &&
                    !line.startsWith("8.") &&
                    !line.startsWith("*") &&
                    // avoid wrapped lines
                    !line.includes(".") &&
                    // avoid lowercase continuation
                    line[0] === line[0]?.toUpperCase());

                if (isHeading) {
                  doc.setFont("helvetica", "bold");

                  doc.setFontSize(12);
                } else {
                  doc.setFont("helvetica", "normal");

                  doc.setFontSize(11);
                }

                doc.text(line, 20, y);

                y += 5;
              });

              // ===== FILE NAME =====

              const fileName = pdfName
                ? pdfName.replace(".pdf", "") + "-Summary.pdf"
                : "AI_Summary.pdf";

              doc.save(fileName);
            }}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              marginBottom: "20px",
              boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
              transition: "0.2s",
            }}
          >
            Download Summary PDF
          </button>
        )}

        {/* CHAT */}

        {pdfUrl && <Chat />}
      </div>

      {/* RIGHT PANEL */}

      <div
        style={{
          flex: 1,
          padding: window.innerWidth < 768 ? "16px" : "24px",
          overflowY: "auto",
          background: "linear-gradient(180deg, #f9fbff 0%, #eef5ff 100%)",
        }}
      >
        {/* PDF CARD */}

        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
            padding: "22px",
            borderRadius: "18px",
            boxShadow: "0 6px 24px rgba(37,99,235,0.08)",
            border: "1px solid #e5edff",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              color: "#111827",
            }}
          >
            📄 PDF Viewer
          </h2>

          {/* FILE INPUT */}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #dbe4ff",
              background: "white",
              width: "100%",
            }}
          />

          {/* PDF */}

          {pdfUrl && <PDFViewer fileUrl={pdfUrl} />}
        </div>

        {/* FOOTER */}

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#666",
            marginTop: "20px",
          }}
        >
          Built with React.js, Node.js and Groq AI
        </p>
      </div>
    </div>
  );
}

export default App;
