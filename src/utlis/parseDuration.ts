export function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;

  // Expresión regular para capturar horas y minutos
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);

  return hours * 60 + minutes;
}


export function convertDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day); 
  const monthName = dateObj.toLocaleDateString("es-ES", { month: "long" });
  return `${day} ${monthName}`; 
}


export const getPaymentDate = (date: string) => {
  const paymentDate = new Date(date);
  const timeString = paymentDate.toLocaleTimeString();
  return timeString;
}

export const getPaymentDateYMD = (date: string) => {
  const paymentDate = new Date(date);

  const formattedDate = paymentDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  return formattedDate;
};

