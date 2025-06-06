USE master;
GO

-- Crear la base de datos con configuración mínima (ubicación por defecto)
IF DB_ID('EncuestasDB') IS NULL
BEGIN
    CREATE DATABASE EncuestasDB;
END
GO

USE EncuestasDB;
GO

-- Crear tablas
CREATE TABLE Personas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    direccion NVARCHAR(200),
    telefono NVARCHAR(50),
    nacionalidad NVARCHAR(100),
    latitud FLOAT,
    longitud FLOAT,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE Encuestas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(200) NOT NULL,
    descripcion NVARCHAR(500),
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE Preguntas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    texto NVARCHAR(300) NOT NULL
);

CREATE TABLE EncuestaPregunta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    encuesta_id INT NOT NULL,
    pregunta_id INT NOT NULL,
    FOREIGN KEY (encuesta_id) REFERENCES Encuestas(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES Preguntas(id) ON DELETE CASCADE
);

CREATE TABLE Respuestas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    persona_id INT NOT NULL,
    encuesta_id INT NOT NULL,
    pregunta_id INT NOT NULL,
    valor INT NOT NULL,
    fecha_respuesta DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (persona_id) REFERENCES Personas(id) ON DELETE CASCADE,
    FOREIGN KEY (encuesta_id) REFERENCES Encuestas(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES Preguntas(id) ON DELETE CASCADE
);

CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);
GO

insert into Usuarios(usuario,password) values('admin','1234')

