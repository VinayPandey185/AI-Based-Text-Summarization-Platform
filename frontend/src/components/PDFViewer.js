// frontend/src/components/PDFViewer.js

import React, { useState } from "react";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {

  const [numPages, setNumPages] =
    useState(null);

  function onDocumentLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        textAlign: "center",
      }}
    >

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >

        {Array.from(
          new Array(numPages),
          (el, index) => (
            <div
              key={`page_${index + 1}`}
              style={{
                marginBottom: "25px",
              }}
            >

              <Page
                pageNumber={index + 1}
                width={600}
              />

              <p
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Page {index + 1} of {numPages}
              </p>

            </div>
          )
        )}

      </Document>
    </div>
  );
}

export default PDFViewer;