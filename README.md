
#  Sistema de Encuestas - Angular + Node.js + SQL Server

Este proyecto es un sistema completo de encuestas, que permite crear, responder y visualizar encuestas con resultados en gráficas tipo pastel.

## Tecnologías utilizadas

- **Frontend:** Angular standalone (sin módulos)
- **Backend:** Node.js con Express
- **Base de datos:** SQL Server
- **Gráficas:** Chart.js
- **Autenticación:** JWT (JSON Web Tokens)

## 📦 Estructura del proyecto

```
luc-encuestas/
├── backend/       # Servidor API en Node.js
├── frontend/      # Aplicación Angular
└── README.md      # Manual de instalación y uso
```

## 🧾 Requisitos

| Herramienta | Recomendado |
|-------------|-------------|
| Node.js     | v18+        |
| Angular CLI | v17+        |
| SQL Server  | Express o superior |
| Git         | Última versión |

##  Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/pmynor/lucalza.git
cd lucalza
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env`:

```dotenv
PORT=3000
DB_SERVER=localhost\\SQLEXPRESS
DB_USER=admin
DB_PASSWORD=1234
DB_NAME=EncuestasDB
JWT_SECRET=miclaveultrasecreta123
```

Ejecutar el servidor:

```bash
node server.js
```

 El backend se inicia en `http://localhost:3000`

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
ng serve
```

 El frontend estará disponible en `http://localhost:4200`

##  Funcionalidades del sistema

### Personas
- Registrar nueva persona
- Ver listado de personas

###  Encuestas
- Crear encuestas con preguntas
- Editar o eliminar encuestas
- Asignar preguntas dinámicamente

###  Responder encuesta
- Persona responde valores del 1 al 10 por pregunta
- Guarda resultados por persona

###  Visualizar resultados
- Gráficas tipo pastel por pregunta
- Resultados agrupados y coloreados
- Uso directo de `Chart.js`



**Mynor P.**  
Desarrollado en Guatemala 🇬🇹  
Versión 1.0 – Mayo 2025
