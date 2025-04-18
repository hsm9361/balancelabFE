import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useSaveAsPDF = (targetId = 'diet-analysis-content', defaultFileName = 'diet-analysis.pdf') => {
  const [isSaving, setIsSaving] = useState(false);

  const saveAsPDF = useCallback(async (fileName = defaultFileName) => {
    setIsSaving(true);

    let element;
    try {
      element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with ID "${targetId}" not found`);
        setIsSaving(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.animation = 'none';
        card.style.background = '#FFFFFF';
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (doc, clonedElement) => {
          const cardClass = Array.from(clonedElement.querySelectorAll('div[class*="card"]'));
          const tdClass = Array.from(clonedElement.querySelectorAll('td'));

          cardClass.forEach((el) => {
            el.style.background = '#FFFFFF';
            el.style.opacity = '1';
            el.style.animation = 'none';
            el.style.color = '#000000';
          });

          tdClass.forEach((el) => {
            el.style.background = 'rgba(255, 255, 255, 0.95)';
            el.style.opacity = '1';
            el.style.color = '#1F2937';
          });

          clonedElement.querySelectorAll('th').forEach((th) => {
            th.style.background = '#60A5FA';
            th.style.color = '#FFFFFF';
            th.style.opacity = '1';
          });

          clonedElement.querySelectorAll('h2, h3, li').forEach((el) => {
            el.style.opacity = '1';
            el.style.color = '#000000';
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      if (element) {
        element.style.backgroundColor = '';
        element.style.opacity = '';
      }
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '';
        card.style.animation = '';
        card.style.background = '';
      });
      setIsSaving(false);
    }
  }, [targetId, defaultFileName]);

  return { saveAsPDF, isSaving };
};

export default useSaveAsPDF;
