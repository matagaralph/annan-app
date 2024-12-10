FROM oven/bun:1 AS dependencies-env
WORKDIR /app
COPY . .

EXPOSE 3000

ENV NODE_ENV=production

FROM dependencies-env AS development-dependencies-env
RUN bun install --frozen-lockfile

FROM dependencies-env AS production-dependencies-env
RUN bun install --production --frozen-lockfile

FROM dependencies-env AS build-env
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
RUN bun run build

FROM dependencies-env
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build

CMD ["bun", "run", "docker-start"]
