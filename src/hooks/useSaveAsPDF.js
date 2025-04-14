import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useSaveAsPDF = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveAsPDF = useCallback(async () => {
    console.log('saveAsPDF function called'); // 디버깅
    setIsSaving(true);

    let element; // try 밖에서 선언
    try {
      element = document.getElementById('diet-analysis-content');
      if (!element) {
        console.error('Element #diet-analysis-content not found');
        setIsSaving(false);
        return;
      }

      console.log('Element innerHTML:', element.innerHTML.substring(0, 200) + '...'); // 디버깅
      console.log('Element scrollHeight:', element.scrollHeight, 'scrollWidth:', element.scrollWidth); // 디버깅

      // PDF 캡처 전 스타일 조정
      const originalStyles = {
        background: element.style.background,
        opacity: element.style.opacity,
      };
      element.style.backgroundColor = '#FFFFFF';
      element.style.opacity = '1';

      // DOM 렌더링 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Starting html2canvas capture'); // 디버깅
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.scrollWidth,
        height: element.scrollHeight, // 전체 높이
        onclone: (doc, clonedElement) => {
          console.log('Cloned element:', clonedElement.innerHTML.substring(0, 200) + '...'); // 디버깅
          // 모든 .card에 불투명 스타일 적용
          clonedElement.querySelectorAll('.card').forEach((card) => {
            card.style.background = '#FFFFFF';
            card.style.opacity = '1';
            card.style.color = '#000000'; // 텍스트 선명도
          });
          // 텍스트 요소 선명도 보장
          clonedElement.querySelectorAll('h2, h3, td, li').forEach((el) => {
            el.style.color = '#000000';
            el.style.opacity = '1';
          });
        },
      });

      console.log('Canvas generated:', canvas.width, canvas.height); // 디버깅

      const imgData = canvas.toDataURL('image/png');
      console.log('Image data size:', imgData.length); // 디버깅

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 너비
      const pageHeight = 297; // A4 높이
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 추가 페이지
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
        // 스타일 복구
        element.style.backgroundColor = '';
        element.style.opacity = '';
      }
      setIsSaving(false);
    }
  }, []);

  return { saveAsPDF, isSaving };
};

export default useSaveAsPDF;
// import { useState, useCallback } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const useSaveAsPDF = () => {
//   const [isSaving, setIsSaving] = useState(false);

//   const saveAsPDF = useCallback(async () => {
//     console.log('saveAsPDF function called'); // 디버깅
//     setIsSaving(true);

//     try {
//       const element = document.getElementById('diet-analysis-content');
//       if (!element) {
//         console.error('Element #diet-analysis-content not found');
//         setIsSaving(false);
//         return;
//       }

//       console.log('Element innerHTML:', element.innerHTML.substring(0, 200) + '...'); // 디버깅
//       console.log('Element dimensions:', element.offsetWidth, element.offsetHeight); // 디버깅

//       // DOM 렌더링 대기
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       console.log('Starting html2canvas capture'); // 디버깅
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: true,
//         backgroundColor: '#FFFFFF',
//         scrollX: 0,
//         scrollY: -window.scrollY,
//         width: element.offsetWidth,
//         height: element.offsetHeight,
//         onclone: (doc, clonedElement) => {
//           console.log('Cloned element for canvas:', clonedElement.innerHTML.substring(0, 200) + '...'); // 디버깅
//         },
//       });

//       console.log('Canvas generated:', canvas.width, canvas.height); // 디버깅

//       const imgData = canvas.toDataURL('image/png');
//       console.log('Image data generated, size:', imgData.length); // 디버깅

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//       });

//       const imgWidth = 210; // A4 width
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//       pdf.save('diet-analysis.pdf');

//       console.log('PDF saved successfully');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   }, []);

//   return { saveAsPDF, isSaving };
// };

// export default useSaveAsPDF;