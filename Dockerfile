FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev

# docker build -t com.multiwarehouse.app/frontend.service:1.0-SNAPSHOT .