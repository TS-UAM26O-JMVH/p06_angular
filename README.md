# Práctica 6: Conexión con la API e Integración de Autenticación (Parte 3)

Este repositorio contiene el código fuente desarrollado para la **Práctica 6**, la cual representa la tercera parte y la integración final del sistema de registro e inicio de sesión en **Angular**. En esta etapa se conecta la interfaz de usuario desarrollada previamente con un servidor backend real a través de solicitudes HTTP REST, autenticación basada en tokens JWT, un interceptor HTTP y la configuración de un proxy para el control de errores CORS.

---

## 📋 Tabla de Contenidos

* [Descripción del Proyecto](#descripción-del-proyecto)
* [Características Principales](#características-principales)
* [Objetivos](#objetivos)
* [Endpoints de la API](#endpoints-de-la-api)
* [Arquitectura y Estructura](#arquitectura-y-estructura)
* [Componentes y Servicios Implementados](#componentes-y-servicios-implementados)
* [Requisitos Previos](#requisitos-previos)
* [Instalación y Ejecución](#instalación-y-ejecución)
* [Flujo de Pruebas y Validación](#flujo-de-pruebas-y-validación)

---

## 📄 Descripción del Proyecto

En esta tercera fase, la aplicación deja de trabajar con datos simulados y pasa a consumir servicios web reales de una API RESTful:

1. **Autenticación con Token:** La pantalla de bienvenida (`/bienvenido`) envía las credenciales mediante un método `POST` y almacena los tokens devueltos (`accessToken` y `refreshToken`) en el `localStorage` del navegador.
2. **Interceptor HTTP:** Intercepta cada solicitud saliente para adjuntar automáticamente la cabecera `Authorization: Bearer <token>` y maneja de forma transparente los errores de no autorización (HTTP 401) para renovar el token expirable sin interrumpir la sesión.
3. **Persistencia del Flujo de Registro:** Los formularios de *Personal*, *Cuenta* y *Dirección* respaldan de forma temporal sus datos en el `localStorage`, acumulando el objeto completo que se enviará al endpoint `/users` al confirmar el registro.

---

## ✨ Características Principales

* **Consumo de API RESTful:** Integración completa con `HttpClient` para inicio de sesión, registro de usuarios y renovación de tokens.
* **Manejo de CORS mediante Proxy (`proxy.conf.json`):** Redirección de peticiones locales desde `/api` hacia el servidor remoto de desarrollo para evitar restricciones de origen cruzado.
* **Interceptor de Autenticación (`HttpInterceptorFn`):** Inyección automática de tokens de acceso y estrategia de refresco de sesión con manejo de errores HTTP 401.
* **Persistencia Temporal Local:** Uso de `localStorage` para concatenar los datos recolectados a través del flujo mutipaso antes del envío final al servidor.
* **Limpieza de Sesión y Datos:** Eliminación de tokens y datos temporales al cerrar sesión o al completar un registro exitoso.

---

## 🎯 Objetivos

### Objetivo General

Integrar la aplicación frontend en Angular con una API REST real que permita la autenticación de usuarios mediante tokens JWT y la persistencia de los datos del registro en una base de datos.

### Objetivos Particulares

1. Implementar el servicio `ApiService` para centralizar las peticiones HTTP (`login`, `registrarUsuario`, `refrescarToken`).
2. Configurar el archivo `proxy.conf.json` para enrutar el tráfico de desarrollo sin bloqueos por CORS.
3. Crear y registrar un `AuthInterceptor` en `app.config.ts` para adjuntar la cabecera de autorización a las peticiones HTTP.
4. Conectar los formularios reactivos existentes (*Personal*, *Cuenta*, *Dirección*) con la API para almacenar la información de forma definitiva.

---

## 🌐 Endpoints de la API

La aplicación redirige las peticiones que inician con `/api` hacia la URL base del servidor objetivo: `http://developer.jquiroz.net:3005`.

| Método | Endpoint | Descripción | Requiere Auth |
| --- | --- | --- | --- |
| **POST** | `/api/users/login` | Autentica las credenciales (correo y contraseña) y retorna los tokens de acceso y refresco. | No |
| **POST** | `/api/users` | Registra un nuevo usuario en la base de datos con toda la información consolidada. | No |
| **POST** | `/api/users/refresh` | Genera un nuevo `accessToken` utilizando un `refreshToken` válido antes de que expire la sesión. | Sí |

---

## 🏗️ Arquitectura y Estructura
```texto
src/
├── app/
│   ├── componentes/
│   │   ├── bienvenido/    # Login conectado al endpoint /users/login
│   │   ├── principal/     # Menú principal con control de sesión
│   │   ├── registro/      # Envío final de datos consolidados a /users
│   │   ├── personal/      # Captura y guardado en localStorage
│   │   ├── cuenta/        # Captura y guardado en localStorage
│   │   ├── direccion/     # Captura y guardado en localStorage
│   │   └── fotografia/    # Instrucciones visuales de perfil
│   ├── interceptor/
│   │   └── auth-interceptor.ts  # Interceptor funcional para tokens y refresh
│   ├── services/
│   │   └── servAPI/
│   │       └── api.ts     # Servicio principal de llamadas HTTP a la API
│   ├── app.config.ts      # Registro global de withInterceptors([authInterceptor])
│   └── app.routes.ts      # Mapeo y protección de rutas del sistema
├── public/                # Recursos gráficos e idiomas (es.json, en.json)
└── proxy.conf.json        # Configuración del servidor proxy de desarrollo
```
---
## ⚙️ Componentes y Servicios Implementados

| Módulo / Elemento | Descripción / Responsabilidad |
| --- | --- |
| **`proxy.conf.json`** | Redirige las peticiones desde `/api` hacia `http://developer.jquiroz.net:3005`. |
| **`ApiService`** | Gestiona los métodos HTTP `login()`, `registrarUsuario()`, `refrescarToken()` y la persistencia de tokens en `localStorage`. |
| **`AuthInterceptor`** | Inyecta el encabezado `Authorization: Bearer <token>` en cada solicitud HTTP y gestiona la renovación mediante `401 Unauthorized`. |
| **`Bienvenido`** | Inicia sesión contra la API real, desplegando alertas con mensajes de error personalizados en caso de credenciales inválidas. |
| **`Registro`** | Valida que los tres formularios requeridos estén completos, unifica el payload y lo envía mediante solicitud `POST` a `/api/users`. |

---

## 🛠️ Requisitos Previos

Antes de ejecutar esta tercera parte del proyecto, asegúrate de contar con:

* **Node.js:** Versión 18 o superior.
* **Angular CLI:** Versión 17 o superior.
* Conexión a Internet para comunicarse con el servidor backend en `http://developer.jquiroz.net:3005`.

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio o situarse en el directorio del proyecto:**

```bash
cd primeraAplicacion
```
2. **Instalar las dependencias del proyecto:**

```bash
npm install
```

3. **Iniciar el servidor con la configuración del Proxy (IMPORTANTE):**

⚠️ Atención: Para que las peticiones hacia /api funcionen correctamente sin errores de CORS, es indispensable iniciar el servidor con el flag --proxy-config:
```bash
ng serve --proxy-config proxy.conf.json
```

4. **Navegar a la aplicación:**
Abre tu navegador e ingresa a http://localhost:4200/.
---
## 🧪 Flujo de Pruebas y Validación
1. Inicio de Sesión Real (/bienvenido):

    > Intenta ingresar un correo no registrado para validar el mensaje de error de credenciales devuelto por el servidor.

    > Ingresa un usuario registrado previamente para confirmar la autenticación exitosa y la redirección a /principal.

2. Proceso de Registro e Integración con la API:

    > Dirígete a la ruta /registro y completa sucesivamente los formularios de Personal, Cuenta y Dirección.

    > En la pantalla de Registro, presiona el botón Registrar. El sistema recopilará los datos temporales del localStorage, enviará la petición POST al endpoint /api/users y mostrará la alerta "Registro exitoso".

3. Validación de Token e Interceptor:

    > Revisa la pestaña Application > LocalStorage en las herramientas de desarrollo de tu navegador para comprobar la presencia de auth_access_token y auth_refresh_token.