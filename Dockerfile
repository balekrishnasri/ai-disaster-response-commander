FROM node:22

WORKDIR /app

COPY . .

RUN npm install --prefix frontend
RUN npm install --prefix backend

RUN npm run build --prefix frontend

EXPOSE 3000

CMD ["npm", "run", "start", "--prefix", "backend"]