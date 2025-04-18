# ✅ 1단계: 빌드 스테이지
FROM node:22-alpine AS builder

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# Prisma schema & 코드 복사 + generate
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
RUN npx prisma generate
RUN npx prisma migrate dev --name init
RUN npm run build

# ✅ 2단계: 실행 스테이지
FROM node:22-alpine

WORKDIR /app

# 실행에 필요한 것만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 포트 설정 (필요한 경우)
EXPOSE 3000

CMD ["npm", "run", "start"]
