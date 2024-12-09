FROM oven/bun:1 AS dependencies-env
COPY . /app

EXPOSE 3000

ENV NODE_ENV=production

FROM dependencies-env AS development-dependencies-env
COPY ./package.json bun.lockb /app/
WORKDIR /app
RUN bun install --frozen-lockfile

FROM dependencies-env AS production-dependencies-env
COPY ./package.json bun.lockb /app/
WORKDIR /app
RUN bun install --production --frozen-lockfile

# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN bun remove @shopify/cli

FROM dependencies-env AS build-env
COPY ./package.json bun.lockb /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

FROM oven/bun:1
COPY ./package.json bun.lockb /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app


CMD ["bun", "run", "docker-start"]
