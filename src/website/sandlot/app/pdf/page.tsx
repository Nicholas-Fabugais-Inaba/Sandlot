"use client";

import { useState } from 'react';
import { PDFViewer, pdf, PDFDownloadLink } from '@react-pdf/renderer';
import MyPDF from './waiverPDF';

const PDFComponent = () => {
  const [data, setData] = useState('This is a sample PDF content.');

  const openInNewTab = async () => {
    const blob = await pdf(<MyPDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div>
      <button onClick={openInNewTab}>Open PDF in New Tab</button>
      <PDFDownloadLink document={<MyPDF data={data} />} fileName="document.pdf">
        {({ loading }) => (loading ? 'Loading...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFComponent;