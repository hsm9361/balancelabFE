import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useExportPDF = () => {
  const exportToPDF = useCallback(async (elementId, fileName) => {
    try {
      const content = document.getElementById(elementId);
      if (!content) throw new Error('Content element not found');
      const canvas = await html2canvas(content, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    }
  }, []);

  return { exportToPDF };
};

export default useExportPDF;