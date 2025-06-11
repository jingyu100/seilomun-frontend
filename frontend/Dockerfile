# Multi-stage build
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built app (Vite uses dist/ not build/)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config for React Router
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
