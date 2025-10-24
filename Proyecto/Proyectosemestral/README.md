# Proyecto Finanzas Personales - Ionic Angular

Aplicación móvil de gestión financiera personal desarrollada con Ionic Framework y Angular.

## Características

### Avance 1 ✅
- ✅ Creación de Proyecto con múltiples páginas
- ✅ Diseño con componentes reutilizables
- ✅ Navegación entre páginas con tabs

### Avance 2 ✅
- ✅ Animaciones avanzadas con Ionic Animation Controller
- ✅ Sistema de Login con validaciones
- ✅ Autenticación y registro de usuarios

### Avance 3 - APIs y Base de Datos ✅
- ✅ API REST con json-server
- ✅ Base de datos SQLite local
- ✅ Servicios para gestión de transacciones
- ✅ Sincronización entre API y almacenamiento local
- ✅ Autenticación integrada con API

## Tecnologías Utilizadas

- **Framework**: Ionic 8 + Angular 20
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite (Cordova) + JSON Server (API REST)
- **Estilos**: SCSS con Ionic Components
- **Animaciones**: Ionic Animation Controller
- **Formularios**: Reactive Forms con validaciones

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18+)
- npm o yarn
- Ionic CLI: `npm install -g @ionic/cli`
- JSON Server: `npm install -g json-server`

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd proyectosemestral

# Instalar dependencias
npm install

# Instalar dependencias adicionales (opcional)
npm install @awesome-cordova-plugins/sqlite cordova-sqlite-storage @capacitor/camera @capacitor/geolocation jspdf xlsx
```

### Configuración de la API
```bash
# Iniciar el servidor JSON (puerto 3000)
npx json-server db.json --port 3000
```

### Ejecutar la aplicación
```bash
# Desarrollo
ionic serve

# O con Angular CLI
ng serve

# Build para producción
ionic build

# Build para plataformas móviles
ionic capacitor build android
ionic capacitor build ios
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── app-header/      # Header de la aplicación
│   │   └── movement-item/   # Item de movimiento financiero
│   ├── guards/              # Guards de autenticación
│   │   └── auth.guard.ts    # Protección de rutas
│   ├── pages/               # Páginas de la aplicación
│   │   ├── tabs/            # Página principal con tabs
│   │   ├── login/           # Página de login/registro
│   │   ├── inicio/          # Dashboard principal
│   │   ├── movimientos/     # Gestión de transacciones
│   │   ├── reportes/        # Reportes y estadísticas
│   │   └── animaciones/     # Página de demostración de animaciones
│   ├── services/            # Servicios de la aplicación
│   │   ├── api.service.ts   # Servicio de API REST
│   │   ├── auth.service.ts  # Servicio de autenticación
│   │   ├── transaction.service.ts # Servicio de transacciones
│   │   └── database.service.ts    # Servicio de base de datos SQLite
│   └── app-routing.module.ts # Configuración de rutas
├── assets/                  # Recursos estáticos
├── environments/            # Configuraciones de entorno
└── theme/                   # Tema y variables SCSS
```

## API Endpoints

La aplicación utiliza JSON Server para simular una API REST. Los endpoints disponibles son:

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear nuevo usuario
- `GET /users?email=<email>&password=<password>` - Login

### Transacciones
- `GET /transactions` - Obtener todas las transacciones
- `POST /transactions` - Crear nueva transacción
- `PATCH /transactions/:id` - Actualizar transacción
- `DELETE /transactions/:id` - Eliminar transacción

### Categorías
- `GET /categories` - Obtener todas las categorías
- `POST /categories` - Crear nueva categoría

## Credenciales de Prueba

- **Email**: admin@finanzas.com
- **Contraseña**: 123456

## Funcionalidades

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Validaciones de formulario
- Guards para protección de rutas
- Persistencia de sesión

### Gestión Financiera
- Agregar ingresos y gastos
- Categorización de transacciones
- Cálculo de balance
- Reportes por categoría
- Historial de transacciones

### Animaciones
- Animaciones con Ionic Animation Controller
- Keyframes personalizados
- Animaciones infinitas
- Transiciones suaves

### Base de Datos
- SQLite para almacenamiento local
- JSON Server para API REST
- Sincronización automática
- Fallback a almacenamiento local

## Desarrollo

### Scripts Disponibles
```bash
npm start          # Inicia el servidor de desarrollo
npm run build      # Construye la aplicación
npm run test       # Ejecuta las pruebas
npm run lint       # Ejecuta el linter
```

### Arquitectura
La aplicación sigue los principios de Clean Architecture:
- **Servicios**: Lógica de negocio y comunicación con APIs
- **Guards**: Protección de rutas y autenticación
- **Components**: Componentes reutilizables
- **Pages**: Páginas de la aplicación

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
