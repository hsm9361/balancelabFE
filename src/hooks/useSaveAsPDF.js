import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useSaveAsPDF = (targetId) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveAsPDF = useCallback(async () => {
    console.log('saveAsPDF function called'); // 디버깅
    setIsSaving(true);

    let element;
    try {
      // element = document.getElementById('diet-analysis-content');
      element = document.getElementById(targetId);
      if (!element) {
        console.error('Element #diet-analysis-content not found');
        setIsSaving(false);
        return;
      }

      console.log('Element innerHTML:', element.innerHTML.substring(0, 200) + '...'); // 디버깅
      console.log('Element scrollHeight:', element.scrollHeight, 'scrollWidth:', element.scrollWidth); // 디버깅

      // 계산된 스타일 로그
      const cardEl = document.querySelector('.card');
      const tdEl = document.querySelector('.nutritionTable td');
      console.log('Initial computed styles:', {
        cardOpacity: cardEl ? window.getComputedStyle(cardEl).opacity : 'N/A',
        cardBackground: cardEl ? window.getComputedStyle(cardEl).background : 'N/A',
        tdBackground: tdEl ? window.getComputedStyle(tdEl).background : 'N/A',
      });

      // 애니메이션 완료 대기
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 캡처 전 스타일 강제
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.animation = 'none';
        card.style.background = '#FFFFFF';
      });

      console.log('Starting html2canvas capture'); // 디버깅
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (doc, clonedElement) => {
          console.log('Cloned element:', clonedElement.innerHTML.substring(0, 200) + '...'); // 디버깅
          // CSS 모듈 클래스 직접 타겟팅
          const cardClass = Array.from(clonedElement.querySelectorAll('div[class*="DietAnalysis_card__"]'));
          const tdClass = Array.from(clonedElement.querySelectorAll('td[class*="DietAnalysis_nutritionTable__"]'));
          console.log('Cloned card classes:', cardClass.map(el => el.className)); // 디버깅
          // 모든 .card와 유사 클래스
          cardClass.forEach((el) => {
            el.style.background = '#FFFFFF';
            el.style.opacity = '1';
            el.style.animation = 'none';
            el.style.color = '#000000';
          });
          // td 스타일
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
          // 기타 요소
          clonedElement.querySelectorAll('h2, h3, li').forEach((el) => {
            el.style.opacity = '1';
            el.style.color = '#000000';
          });
        },
      });

      console.log('Canvas generated:', canvas.width, canvas.height); // 디버깅
      console.log('Post-capture computed styles:', {
        cardOpacity: cardEl ? window.getComputedStyle(cardEl).opacity : 'N/A',
        cardBackground: cardEl ? window.getComputedStyle(cardEl).background : 'N/A',
      });

      const imgData = canvas.toDataURL('image/png');
      console.log('Image data size:', imgData.length); // 디버깅

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

      pdf.save('diet-analysis.pdf');
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      if (element) {
        element.style.backgroundColor = '';
        element.style.opacity = '';
      }
      // 원본 DOM 스타일 복구
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.style.opacity = '';
        card.style.animation = '';
        card.style.background = '';
      });
      setIsSaving(false);
    }
  }, []);

  return { saveAsPDF, isSaving };
};

export default useSaveAsPDF;