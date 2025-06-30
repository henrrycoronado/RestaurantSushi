# RestaurantSushi
Este proyecto es una aplicación web full-stack diseñada para un restaurante de sushi, enfocada en ofrecer una experiencia de usuario dinámica e interactiva que va más allá de una simple página informativa.

La aplicación permite a los usuarios explorar un menú interactivo, gestionar un carrito de compras, realizar reservas y participar en una comunidad a través de un sistema de blog integrado, todo dentro de una interfaz rápida y fluida construida como una Single Page Application (SPA).

 ##  Características Principales

Navegación Fluida (Single Page Application): La aplicación utiliza un router del lado del cliente para ofrecer transiciones instantáneas entre secciones sin necesidad de recargar la página, mejorando significativamente la experiencia de usuario.

Sistema de Blog con Autenticación (CRUD):

Registro e inicio de sesión de usuarios mediante autenticación basada en JWT.

Los usuarios autenticados pueden crear, leer, actualizar y eliminar (CRUD) sus propias publicaciones.

Funcionalidad para dar "like" a las publicaciones de otros autores.

Capacidad para filtrar artículos por "Todos", "Favoritos" y "Mis Artículos".

Gestión de Menú y Carrito:

El menú y sus categorías se cargan dinámicamente desde la base de datos.

Los usuarios pueden añadir productos a un carrito de compras, cuya gestión de estado se maneja en el frontend.

Sistema de Reservas: Un formulario intuitivo permite a los clientes reservar una mesa, y la información es procesada y almacenada por el backend.

- Arquitectura del Proyecto
La aplicación está desplegada en un entorno de nube moderno, combinando la flexibilidad de AWS para el backend y la simplicidad de Render para la base de datos gestionada.

Flujo de trabajo: Nginx actúa como el punto de entrada, recibiendo todas las peticiones públicas. Luego, las redirige de forma segura a la aplicación Node.js, que se mantiene en ejecución constante gracias al gestor de procesos PM2. La aplicación Node.js se comunica con la base de datos PostgreSQL alojada en Render a través de una conexión segura.

- Stack Tecnológico
Frontend
JavaScript (ES6+ Modules): Se utiliza JavaScript moderno para toda la lógica del cliente.

Web Components Nativos: Para crear componentes de UI encapsulados y reutilizables, manteniendo el frontend ligero y sin dependencias de frameworks.

HTML5 / CSS3: Estructura semántica y diseño responsivo.

Metodología BEM: Para una arquitectura CSS organizada, predecible y fácil de mantener.

Backend
Node.js / Express.js: Un entorno de ejecución y un framework robustos para construir la API RESTful del servidor.

Prisma: Se utiliza como ORM (Object-Relational Mapper) para interactuar con la base de datos de una manera segura y tipada, simplificando las consultas y las migraciones de esquema.

JSON Web Tokens (JWT): Para gestionar la autenticación de usuarios y proteger las rutas de la API.

Base de Datos
PostgreSQL: Un sistema de gestión de bases de datos relacionales potente y de código abierto.

Despliegue (DevOps)
AWS EC2: La aplicación se aloja en una instancia de servidor virtual de Amazon Web Services.

Nginx: Actúa como reverse proxy para mejorar el rendimiento, la seguridad y la gestión del tráfico.

PM2: Un gestor de procesos avanzado que mantiene la aplicación de Node.js en línea y facilita su administración.

Render.com: Provee el servicio de hosting gestionado para la base de datos PostgreSQL.

- Instalación y Configuración Local
Para ejecutar este proyecto en un entorno de desarrollo local, sigue estos pasos:

Clonar el Repositorio

Instalar Dependencias

Configurar Variables de Entorno
Copia el archivo .env.example a un nuevo archivo llamado .env y complétalo con tus propias credenciales y configuraciones.

Necesitarás configurar principalmente DATABASE_URL y JWT_SECRET.

Aplicar Migraciones de la Base de Datos
Este comando creará la estructura de tablas en tu base de datos según el schema.prisma.

Generar el Cliente de Prisma

Iniciar el Servidor

La aplicación estará disponible en http://localhost:3000 (o el puerto que hayas configurado).