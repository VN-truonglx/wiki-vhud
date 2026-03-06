FROM node:22-bookworm-slim
WORKDIR /wiki-vhud

RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# IMPORTANT: xoá engine cũ rồi generate lại trong image
RUN rm -rf node_modules/.prisma && npx prisma generate

RUN npm run build

EXPOSE 5555
CMD ["npx", "next", "start", "-p", "5555"]