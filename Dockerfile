FROM node:22-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG FARM_API_URL
ENV FARM_API_URL=$FARM_API_URL

RUN pnpm build

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "pnpm dlx serve -s dist -l $PORT"]
