FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
ARG VITE_APP_BACKEND_ADDRESS
ENV VITE_APP_BACKEND_ADDRESS=$VITE_APP_BACKEND_ADDRESS
RUN npm install
RUN npm run build

FROM nginx:1.25.4-alpine-slim AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
