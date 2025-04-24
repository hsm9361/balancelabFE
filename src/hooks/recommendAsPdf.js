import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useSaveAsPDF = (targetId, pdfFileName) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveAsPDF = useCallback(async () => {
    console.log('saveAsPDF function called');
    setIsSaving(true);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element #${targetId} not found`);
        setIsSaving(false);
        return;
      }

      const title = element.querySelector('h1');
      const sections = Array.from(element.querySelectorAll('.analysis-section > *'));
      const allSections = title ? [title, ...sections] : sections;
      console.log('Found sections (including title):', allSections.length);

      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.animation = 'none';
        card.style.background = '#FFFFFF';
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      let currentY = margin;

      for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        console.log(`Processing section ${i + 1}:`, section.tagName, section.className);

        // 섹션 높이 계산
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.width = `${pageWidth - 2 * margin}mm`;
        tempContainer.appendChild(section.cloneNode(true));
        document.body.appendChild(tempContainer);

        const sectionHeightPx = tempContainer.scrollHeight;
        const sectionHeightMm = (sectionHeightPx * 25.4) / 96;
        document.body.removeChild(tempContainer);

        console.log(`Section ${i + 1} height: ${sectionHeightMm}mm`);

        if (currentY + sectionHeightMm > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        // 섹션 캡처
        const canvas = await html2canvas(section, {
          scale: 1.5,
          useCORS: true,
          logging: true,
          backgroundColor: '#FFFFFF',
          width: section.scrollWidth,
          height: section.scrollHeight,
          onclone: (doc, clonedElement) => {
            console.log('Cloned section:', clonedElement.innerHTML.substring(0, 200) + '...');
            // <h1> 스타일 동기화
            if (clonedElement.tagName === 'H1') {
              clonedElement.style.fontFamily = 'Arial, sans-serif'; // 웹에서 사용하는 폰트로 변경 가능
              clonedElement.style.fontSize = '40px'; // 2.5rem ≈ 40px (1rem = 16px)
              clonedElement.style.color = '#2C3E50';
              clonedElement.style.textAlign = 'center';
              clonedElement.style.marginBottom = '32px'; // 2rem ≈ 32px
              clonedElement.style.opacity = '1';
            }
            // 기존 스타일
            const cardClass = Array.from(clonedElement.querySelectorAll('div[class*="DietAnalysis_card__"]'));
            const tdClass = Array.from(clonedElement.querySelectorAll('td[class*="DietAnalysis_nutritionTable__"]'));
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
            clonedElement.querySelectorAll('th[class*="DietAnalysis_nutritionTable__"]').forEach((th) => {
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

        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight + (i === 0 ? 10 : 5); // <h1> 후 더 큰 간격
      }

      pdf.save(`${pdfFileName}.pdf`);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '';
        card.style.animation = '';
        card.style.background = '';
      });
      setIsSaving(false);
    }
  }, [targetId, pdfFileName]);

  return { saveAsPDF, isSaving };
};

export default useSaveAsPDF;