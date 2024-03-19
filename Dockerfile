# Stage 1: Build the React app with Vite
FROM node:latest AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:latest

# Copy the built static files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the desired port
EXPOSE 1776

# Update Nginx configuration to listen on the desired port
RUN sed -i -e 's/80;/1776;/g' /etc/nginx/conf.d/default.conf

# The default command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
