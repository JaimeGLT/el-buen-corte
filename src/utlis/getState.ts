export const getStateName = (state: string) => {

    switch(state) {
        case "CONFIRMADO":
            return "Confirmada";
        case "PENDIENTE":
            return "Pendiente"
        case "COMPLETADO":
            return "Completada"
        default:
            return "Cancelada"
    }
};

export const getStateColor = (state: string) => {
    switch(state) {
        case "CONFIRMADO":
            return "bg-green-100 px-3 py-1 text-green-500 text-xs font-semibold rounded-xl";
        case "PENDIENTE":
            return "bg-yellow-100 px-3 py-1 text-yellow-500 text-xs font-semibold rounded-xl"
        case "COMPLETADO":
            return "bg-blue-100 px-3 py-1 text-blue-500 text-xs font-semibold rounded-xl"
        default:
            return "bg-red-100 px-3 py-1 text-red-500 text-xs font-semibold rounded-xl"
    }
}

export const getStockColor = (stock: number, minStock: number) => {
    if(stock <= minStock)
        return "bg-red-100 text-red-500 font-semibold px-3 py-1 text-xs rounded-xl"
    else if (stock >= minStock * 3) 
        return "bg-green-100 text-green-500 font-semibold px-3 py-1 text-xs rounded-xl"
    else 
        "bg-yellow-100 text-yellow-500 font-semibold px-3 py-1 text-xs rounded-xl"
}


export const getStockName = (stock: number, minStock: number) => {
    if(stock <= minStock)
        return "Stock bajo"
    else if (stock >= minStock * 3) 
        return "Stock alto"
    else 
        "Stock medio"
}