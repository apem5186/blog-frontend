# frontend/Dockerfile

# Use Node.js as the base image for building
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project source
COPY . .

# Build the Vue.js app
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine

# Copy the build output to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the frontend port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]