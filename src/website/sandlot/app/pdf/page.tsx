"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import MyPDF from "./waiverPDF";

const PDFComponent = () => {
  const [data] = useState("This is a sample PDF content.");

  // Opens PDF in a new tab
  const openInNewTab = async () => {
    const blob = await pdf(<MyPDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Downloads the PDF manually
  const downloadPDF = async () => {
    const blob = await pdf(<MyPDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.pdf"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <button onClick={openInNewTab}>Open PDF in New Tab</button>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default PDFComponent;
