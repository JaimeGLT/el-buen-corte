import React, { forwardRef } from "react";

interface ReceiptProps {
  customerName: string;
  amount: number;
  date: string;
  time: string;
  service: string;
  paymentMethod: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ customerName, amount, date, time, service, paymentMethod }, ref) => (
    <div
      ref={ref}
      className=" bg-white rounded-lg text-center text-gray-800"
    >
        <h3 className="text-lg font-semibold mb-2 text-start">Recibo de Pago</h3>
        <div className="flex flex-col items-center w-full gap-2 mb-3">
            <h1 className="text-center text-primary-bg font-bold text-2xl">Peluquería el buen corte</h1>
            <p className="text-center text-sm text-paragraph">Tu estilo, nuestra pasión</p>
        </div>
        <hr />
        <div className="flex flex-col gap-3 my-4">
            <div className="flex items-center justify-between text-paragraph text-sm">
                <p>Fecha</p>
                <span className="font-semibold">{date}</span>
            </div>
            <div className="flex items-center justify-between text-paragraph text-sm">
                <p>Hora</p>
                <span className="font-semibold">{time}</span>
            </div>
            <div className="flex items-center justify-between text-paragraph text-sm">
                <p>Cliente</p>
                <span className="font-semibold">{customerName}</span>
            </div>

        </div>
        <hr />
      <div className="py-1 my-3 text-left flex flex-col gap-3">
        <div className="flex items-center justify-between text-paragraph text-sm">
            <p className="font-semibold text-base">Servicio</p>
            <span className="font-semibold">{service}</span>
        </div>
        <div className="flex items-center justify-between text-paragraph text-sm">
            <p className="">Método de Pago</p>
            <span className="font-semibold">{paymentMethod}</span>
        </div>
      </div>
        <hr />
      <div className=" bg-pink-50 my-4 flex rounded-xl items-center justify-between p-2">
        <p className="font-bold text-base ">Total Pagado</p>
        <p className="text-xl font-bold text-primary-bg">Bs {amount.toFixed(2)}</p>
      </div>
        <hr />
      <div className="mt-5 pt-3 text-sm text-paragraph">
        <p>¡Gracias por tu visita!</p>
        <p className="">Te esperamos pronto</p>
      </div>
    </div>
  )
);

Receipt.displayName = "Receipt";
