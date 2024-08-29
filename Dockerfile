# Usa una imagen base de Node.js
FROM node:20.15.1

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Instala los navegadores de Playwright
RUN npx playwright install --with-deps

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila el código TypeScript
RUN npm run compile

# Copia la carpeta views al directorio dist
COPY ./src/views ./dist/views

# Copia el archivo de configuración de PM2
COPY ecosystem.config.cjs ./

# Instala PM2 globalmente
RUN npm install -g pm2

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar la aplicación con PM2 usando el archivo de configuración
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]

# # Usa una imagen base de Node.js
# FROM node:20.15.1

# # Establece el directorio de trabajo en el contenedor
# WORKDIR /usr/src/app

# # Copia el package.json y el package-lock.json (si existe)
# COPY package*.json ./

# # Instala las dependencias de la aplicación
# RUN npm install

# # Instala los navegadores de Playwright
# RUN npx playwright install --with-deps

# # Copia el resto de los archivos de la aplicación
# COPY . .

# # Compila el código TypeScript
# RUN npm run compile

# # Copia la carpeta views al directorio dist
# COPY ./src/views ./dist/views

# # Instala PM2 globalmente
# RUN npm install -g pm2

# # Expone el puerto en el que la aplicación se ejecutará
# EXPOSE 3000

# # Comando para ejecutar la aplicación con PM2
# CMD ["pm2-runtime", "dist/server.js"]