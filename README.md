# Práctica 5: Sistema de Registro de Usuarios en Angular (Parte 2)
Este repositorio contiene el código fuente desarrollado para la Práctica 5, la cual representa la segunda parte del sistema de registro de usuarios construido con Angular. En esta etapa se implementa el flujo completo de captura de datos mediante formularios reactivos, internacionalización (multilenguaje) y gestión de estado mediante servicios y librerías reactivas.
---
## 📋 Tabla de Contenidos
> Descripción del Proyecto
> Características Principales
> Objetivos
> Arquitectura y Estructura
> Componentes y Servicios Implementados
> Requisitos Previos
> Instalación y Ejecución
> Flujo de Pruebas y Validación
---
## 📄 Descripción del Proyecto
La aplicación amplía la primera parte del sistema (que incluía los componentes bienvenido y principal), agregando un flujo modular de registro compuesto por cuatro etapas:
1. Datos Personales
2. Datos de Cuenta
3. Dirección / Domicilio
4. Fotografía de Perfil
El sistema utiliza un servicio de progreso para mantener en tiempo real el estado de los pasos completados y el paso activo en una barra de progreso visual, permitiendo navegar de manera interactiva entre las distintas secciones. Además, se evita el hardcodeo mediante la abstracción de campos en servicios dedicated y soporte multilenguaje mediante @ngx-translate/core.
---
## ✨ Características Principales
> Formularios Reactivos (ReactiveFormsModule): Manejo dinámico de validaciones (campos requeridos, expresiones regulares para correos, etc.).
> Gestión de Estado con RxJS: Utilización de BehaviorSubject y Observables para coordinar el avance entre componentes independientes de forma desacoplada.
> Cero Hardcodeo: Definición de campos e itinerarios de formularios mediante servicios centralizados.Internacionalización (i18n): Cambio dinámico de idioma (Español / Inglés) en tiempo de ejecución.
> Componentes Standalone: Arquitectura modular siguiendo las mejores prácticas de Angular.
---
## 🎯 Objetivos
### Objetivo General
Implementar el proceso completo de registro de usuarios mediante formularios reactivos y un servicio centralizado que gestione el avance del proceso, manteniendo una arquitectura mantenible y escalable.
### Objetivos Particulares
1. Crear los componentes registro, personal, cuenta, direccion y fotografia.
2. Implementar ProgresoService con BehaviorSubject para llevar el control de la barra de progreso.
3. Abstraer la configuración de formularios en servicios dedicados (PersonalService, CuentaService, DireccionService, RegistroService).
4. Configurar la navegación completa de rutas en app.routes.ts.
---
## 🏗️ Arquitectura y Estructurasrc/
```texto
└── app/
    ├── componentes/
    │   ├── registro/    # Vista principal del flujo con barra de progreso
    │   ├── personal/    # Formulario de datos personales
    │   ├── cuenta/      # Formulario de datos de cuenta y credenciales
    │   ├── direccion/   # Formulario de datos de domicilio
    │   └── fotografia/  # Vista de requisitos y carga de imagen
    ├── services/
    │   ├── progreso.ts  # Manejo del estado global de pasos (RxJS)
    │   ├── registro.ts  # Configuración e íconos del flujo de registro
    │   ├── personal.ts  # Configuración del formulario personal
    │   ├── cuenta.ts    # Configuración del formulario cuenta
    │   └── direccion.ts # Configuración del formulario dirección
    └── app.routes.ts    # Mapeo de rutas de la aplicación
```
---
## ⚙️ Componentes y Servicios Implementados
| Módulo / Servicio | Descripción / Responsabilidad |
| --- | --- |
| ProgresoService  | Mantiene pasoActual y pasosCompletados usando BehaviorSubject. |
| RegistroService | Provee los metadatos (rutas, íconos, traducciones) de los 4 pasos del registro. |
| Personal | Formulario para: Nombre, Primer Apellido, Segundo Apellido, Fecha de Nacimiento, Género, Nacionalidad. |
| Cuenta | Formulario para: Teléfono, Correo Electrónico (con regex pattern), Usuario, Contraseña, Ocupación, Rol. |
| Direccion | Formulario para: Código Postal, Estado, Ciudad, Colonia, Calle, Núm. Ext, Núm. Int (Opcional), Referencia (Opcional). |
| Fotografia | Instrucciones para la toma/subida de fotografía y cierre del ciclo de registro. |
---
## 🛠️ Requisitos Previos
Antes de ejecutar este proyecto, asegúrate de contar con:
> Node.js (Versión LTS recomendada)
> Angular CLI (v17+)
> Haber ejecutado e integrado los componentes previos de la Parte 1 (bienvenido y principal).
--- 
## 🚀 Instalación y Ejecución
1. Clonar el repositorio o situarse en el directorio del proyecto:
```
cd primeraAplicacion
```
2. Instalar dependencias (si aplica):
```
npm install
```
3. Iniciar el servidor de desarrollo:
```
ng serve
```
4. Navegar a la aplicación:
Abre tu navegador e ingresa a http://localhost:4200/.
---
## 🧪 Flujo de Pruebas y Validación
1. Inicio: Accede a la ruta /registro desde la tarjeta Registro de la pantalla principal.
2. Paso 1 - Personal: Selecciona el ícono Personal, completa los campos y da clic en Enviar. Se marcará el paso como completado y serás redirigido a Cuenta.
3. Paso 2 - Cuenta: Ingresa un correo electrónico válido (validado por patrón) y llena los demás campos requeridos.
4. Paso 3 - Dirección: Completa los datos requeridos. Nota que Número Interior y Referencia son opcionales.
5. Paso 4 - Fotografía: Revisa las especificaciones visuales y da clic en Continuar.
6. Resultado: Al finalizar, el sistema redirige a la pantalla /registro, donde se mostrarán los 4 pasos con su estado completado (palomita verde/ícono de confirmación).
    Nota: La aplicación no cuenta actualmente con persistencia en base de datos o comunicación backend; la información capturada se valida únicamente en el cliente y el avance se mantiene en memoria durante la sesión actual.