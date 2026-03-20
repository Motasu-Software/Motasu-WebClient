FROM node:20-alpine AS build

WORKDIR /app

COPY motasu-webclient/package.json motasu-webclient/package-lock.json ./

RUN npm ci

COPY motasu-webclient/. .
RUN npm run build 


FROM nginx:alpine

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf


COPY --from=build /app/dist/motasu-webclient/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]