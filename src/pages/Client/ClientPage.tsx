import ListPageComponent from '../../components/ListPageComponent'
import PageComponent from '../../components/PageComponent'

const ClientPage = () => {

    const clientReports = [
        {
            title: "Total Clientes",
            quantity: "248",
            detail: "+18 este mes"
        },
        {
            title: "Clientes VIP",
            quantity: "42",
            detail: "17% del total"
        },
        {
            title: "Nuevos (mes)",
            quantity: "18",
            detail: "+25% vs mes anterior"
        },
        {
            title: "Retención",
            quantity: "87%",
            detail: "Clientes recurrentes"
        }
    ]

    const clientFilter = [
        {
            name: "Todos los clientes",
            value: "todos"
        },
        {
            name: "VIP",
            value: "VIP"
        },
        {
            name: "Regulares",
            value: "Regulares"
        },
        {
            name: "Nuevos",
            value: "Nuevos"
        },
    ]

    return (
        <PageComponent title='Gestión de Clientes' description='Administra la información de tus clientes' reports={clientReports}>
            <ListPageComponent 
                searcher={true} 
                placeholder='Buscar por nombre, email o teléfono...'
                select={true}
                selectOpt={clientFilter}    
            />
        </PageComponent>
    )
}

export default ClientPage