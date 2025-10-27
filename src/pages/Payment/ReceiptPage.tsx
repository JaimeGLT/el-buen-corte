import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Receipt } from "./Receipt";

const ReceiptPage = () => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef, // ✅ forma nueva para react-to-print v3+
    documentTitle: "Recibo de Pago",
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generar Recibo</h1>

      {/* Componente que se imprimirá */}
      {/* <Receipt
        ref={receiptRef}
        customerName="Juan Pérez"
        amount={120.5}
        date="26 de octubre de 2025"
      /> */}

      <button
        onClick={handlePrint}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Imprimir Recibo
      </button>
    </div>
  );
};

export default ReceiptPage;
