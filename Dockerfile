# CI: CONTINUOUS INTEGRATION

# Imagen de node 24 (LTS) basada en Linux Alpine
# La nombramos como builder para que el siguiente paso pueda hacer referencia a esta
FROM node:24-alpine AS builder

# Cambiar de directorio actual dentro del contenedor a /app
WORKDIR /app

# Herramientas posiblemente necesarias para algunos build de node
# RUN apk add --no-cache python3 make g++

# Copiar los ficheros al directorio /app del contenedor
COPY package*.json ./

# Generación de node_modules (clean install)
RUN npm ci

# Copia del resto del proyecto de la carpeta del equipo al contenedor
COPY . .

# Construcción del proyecto para producción
RUN npm run build

# CD: CONTINUOUS DEPLOYMENT

# Use the official Nginx image as the base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy the static files from the local workspace to the container
COPY public/ .

# Expose port 80 to make the application accessible
EXPOSE 80