# Stage 1: Base environment setup
FROM oven/bun:1 AS dependencies-env
COPY . /app

# Stage 2: Install development dependencies
FROM dependencies-env AS development-dependencies-env
COPY ./package.json bun.lockb /app/
WORKDIR /app
RUN bun install --frozen-lockfile

# Stage 3: Install production dependencies
FROM dependencies-env AS production-dependencies-env
COPY ./package.json bun.lockb /app/
WORKDIR /app
RUN bun install --production --frozen-lockfile

# Stage 4: Build the application
FROM dependencies-env AS build-env
COPY ./package.json bun.lockb /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

# Final Stage: Run the application
FROM oven/bun:1
COPY ./package.json bun.lockb /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

EXPOSE 3000

CMD ["bun", "run", "docker-start"]
