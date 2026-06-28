import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export function usePrintDocument(documentTitle: string = 'Document') {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: documentTitle,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  return { componentRef, handlePrint };
}
