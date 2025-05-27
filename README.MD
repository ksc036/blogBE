# 📘 log404-server

이 프로젝트는 LOG404프로젝트의 백엔드 서버이며, TypeScript와 Prisma를 사용하여 개발되었습니다.

## 🛠️ 기술 스택

- **언어**: TypeScript
- **런타임**: Node.js
- **ORM**: Prisma
- **데이터베이스**: PostgreSQL
- **컨테이너화**: Docker
- **기타**: GitHub Actions를 통한 CI/CD 설정

## 📂 프로젝트 구조

```
log404-server/
├── .github/workflows/   # CI/CD 워크플로우 정의
├── prisma/              # Prisma 스키마 및 마이그레이션 파일
├── src/                 # 애플리케이션 소스 코드
src/
|    ├── comments/       # 댓글 기능 관련 컨트롤러, 서비스, 라우터, 모델, DTO 등
|    ├── di/             # 의존성 주입 설정 (컨테이너, 타입 정의 등)
|    ├── middlewares/    # 공통 미들웨어 (인증, 토큰 설정 등)
|    ├── posts/          # 게시글 관련 로직 (CRUD, 모델, 라우터 등)
|    ├── prisma/         # Prisma 클라이언트 초기화
|    ├── routes/         # 공통 라우터 엔트리포인트 설정
|    ├── s3/             # AWS S3 관련 설정 및 클라이언트
|    ├── types/          # 커스텀 타입 정의 (특히 express 타입 확장)
|    ├── usecases/       # 비즈니스 유즈케이스 단위의 로직 분리
|    ├── users/          # 사용자 기능 관련 모듈 (CRUD, 인증 등)
|    └── utils/          # 공통 유틸 함수 (JWT 처리, 태그 헬퍼 등)
├── dockerfile.dev       # 개발용 Dockerfile
├── dockerfile.prod      # 프로덕션용 Dockerfile
├── package.json         # 프로젝트 메타데이터 및 의존성
└── tsconfig.json        # TypeScript 컴파일러 설정
```

## 🚀 시작하기

### 1. 레포지토리 클론

```
git clone https://github.com/ksc036/log404-server.git
cd log404-server
```

### 2. 의존성 설치

```
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```
DATABASE_URL=
S3_URL=https://minio.ksc036.store
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=nGT2wVFozX1EHvD3nZbt
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
JWT_SECRET=
DOMAIN_NAME=
```

### 4. prisma client생성

```
npx prisma generate
```

### 5. 로컬 개발 서버 실행

```
npm run dev
```

## 🐳 k8s 자동 배포

### 개발 환경

```
git tag dev-vx.x.x
git push origin dev-vx.x.x
```

### 프로덕션 환경

```
git tag prod-vx.x.x
git push origin prod-vx.x.x
```

## 📬 API 엔드포인트

https://www.notion.so/API-1d85bcc0d681804a83a4ed231071da5d

## 🧪 테스트

```
npm test
```

## 📄 라이선스

[MIT](LICENSE)

---
