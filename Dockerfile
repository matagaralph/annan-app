FROM node:20-alpine 
RUN npm i -g pnpm

EXPOSE 3000

WORKDIR /app 

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml  ./

RUN pnpm i --prod --frozen-lockfile

COPY . .

RUN pnpm build

CMD ["pnpm", "docker-start"]
