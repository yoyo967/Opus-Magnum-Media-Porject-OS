# Use Node.js for building the Vite project
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# Ensure the API URL is available during build
RUN npm run build

# Use Nginx to serve the built static files
FROM nginx:alpine

# Copy the constructed nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built dist folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
