FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && SHOPIFY_API_KEY=126e1037042d74504dee7d065053cf82 npm run build
CMD ["npm", "run", "serve"]
