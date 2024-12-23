

FROM oven/bun:alpine AS frontend-builder

ARG VITE_API_BASE_URL

WORKDIR /usr/src/app/frontend

COPY mystery-frontend/package.json .
COPY mystery-frontend/bun.lockb .

RUN bun install --frozen-lockfile

COPY ./common/ ../common/
COPY ./mystery-frontend/ ./

RUN bun run build

FROM oven/bun:alpine AS production
ARG FRONTEND_DIST_PATH
ARG VITE_API_BASE_URL

ENV FRONTEND_DIST_PATH=${FRONTEND_DIST_PATH}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /usr/src/app

COPY mystery-backend/package.json ./
COPY mystery-backend/bun.lockb ./
RUN bun install --frozen-lockfile --production

COPY ./common/ ../common/
COPY mystery-backend/ ./
COPY --from=frontend-builder /usr/src/app/frontend/dist /usr/src/mystery-frontend/dist

CMD ["bun", "run", "prod"]