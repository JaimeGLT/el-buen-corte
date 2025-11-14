# Estructura del Proyecto Frontend

## Estructura General
```
el-buen-corte/
├── src/
│   ├── App.css
│   ├── App.tsx                 # Componente principal con rutas
│   ├── index.css               # Estilos globales
│   ├── main.tsx                # Punto de entrada
│   ├── assets/                 # Imágenes, iconos
│   ├── components/             # Componentes reutilizables
│   │   ├── BarChart.tsx
│   │   ├── Button.tsx
│   │   ├── DaysChart.tsx
│   │   ├── IncomeExpensesChart.tsx
│   │   ├── Input.tsx
│   │   ├── LineChart.tsx
│   │   ├── ListPageComponent.tsx
│   │   ├── Modal.tsx
│   │   ├── PageComponent.tsx
│   │   ├── PieChart.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Select.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TextArea.tsx
│   ├── context/                # Estado global
│   │   └── AuthContext.tsx
│   ├── hooks/                  # Hooks personalizados
│   │   └── getHook.ts
│   ├── pages/                  # Páginas por módulo
│   │   ├── Login.tsx
│   │   ├── Appointment/
│   │   │   ├── AppointmentPage.tsx
│   │   │   ├── AppointmentSchema.ts
│   │   │   ├── AppointmentType.ts
│   │   │   ├── CreateAppointmentModal.tsx
│   │   │   ├── EditAppointmentModal.tsx
│   │   ├── Client/
│   │   │   ├── ClientEditModal.tsx
│   │   │   ├── ClientPage.tsx
│   │   │   ├── ClientSchema.ts
│   │   │   ├── ClientType.ts
│   │   │   ├── CreateClientModal.tsx
│   │   │   ├── DetailClientModal.tsx
│   │   ├── Inventory/
│   │   │   ├── CreateMovementModa.tsx
│   │   │   ├── CreateProductModal.tsx
│   │   │   ├── EditProductModal.tsx
│   │   │   ├── InventoryPage.tsx
│   │   │   ├── InventoryType.ts
│   │   │   ├── movementSchema.ts
│   │   │   ├── MovementType.ts
│   │   │   ├── productSchema.ts
│   │   ├── Payment/
│   │   │   ├── CreatePaymentModal.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── paymentSchema.ts
│   │   │   ├── PaymentType.ts
│   │   │   ├── Receipt.tsx
│   │   │   ├── ReceiptPage.tsx
│   │   ├── Personal/
│   │   │   ├── PersonalCreateModal.tsx
│   │   │   ├── PersonalPage.tsx
│   │   │   ├── personalSchema.ts
│   │   │   ├── PersonalType.ts
│   │   ├── Report/
│   │   │   └── ReportPage.tsx
│   │   ├── Service/
│   │   │   ├── CreateServiceModal.tsx
│   │   │   ├── createServiceSchema.ts
│   │   │   ├── CreateServiceType.tsx
│   │   │   ├── EditServiceModal.tsx
│   │   │   ├── ServicePage.tsx
│   ├── types/                  # Tipos TypeScript
│   │   ├── Client.ts
│   │   │   └── Service.ts
│   └── utlis/                  # Utilidades
│       ├── auth.ts
│       ├── axiosApi.ts
│       ├── getState.ts
│       └── parseDuration.ts
├── public/                     # Archivos estáticos
├── package.json                # Dependencias
├── vite.config.ts              # Config Vite
├── tsconfig.json               # Config TypeScript
└── README.md
```

## Descripción de Directorios
- **components/**: UI reutilizable (botones, modales, gráficos).
- **pages/**: Lógica de negocio por feature, con subcarpetas para modales y tipos.
- **context/**: Estado global (auth).
- **hooks/**: Lógica compartida (fetches).
- **types/**: Definiciones TypeScript.
- **utlis/**: Helpers (axios, auth).

Esta estructura es clara, con separación por responsabilidades, facilitando mantenimiento.
