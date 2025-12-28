# 🛒 Market & Board API Service

PostgreSQL과 Express를 기반으로 한 중고마켓 및 자유게시판 통합 백엔드 서비스입니다. 데이터 모델 간의 관계를 고려한 설계와 다양한 페이지네이션 방식을 적용하였습니다.

---

## 🚀 기술 스택
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Middleware:** Multer (이미지 업로드), CORS, Error Handler
- **Deployment:** Render.com

---

## 🛠️ 주요 기능 및 구현 사항

### 1. 중고마켓 (Used Market)
- **데이터 모델:** `Product` (id, name, description, price, tags, createdAt, updatedAt)
- **기능:** 상품 등록, 상세 조회, 수정(PATCH), 삭제
- **목록 조회:** Offset 방식 페이지네이션, 최신순 정렬, 키워드 검색(이름, 설명)

### 2. 자유게시판 (Free Board)
- **데이터 모델:** `Article` (id, title, content, createdAt, updatedAt)
- **기능:** 게시글 등록, 상세 조회, 수정, 삭제
- **목록 조회:** Offset 방식 페이지네이션, 최신순 정렬, 키워드 검색(제목, 내용)

### 3. 댓글 시스템 (Comments)
- **분리 운영:** 중고마켓과 자유게시판 전용 댓글 API 별도 구현
- **기능:** 댓글 등록, 수정(PATCH), 삭제
- **조회:** **Cursor 방식 페이지네이션** 적용
- **무결성:** `onDelete: Cascade` 설정으로 원본 게시글 삭제 시 댓글 자동 삭제

### 4. 시스템 공통 및 최적화
- **유효성 검증:** 미들웨어를 통해 상품/게시물 등록 시 필수 필드 검증
- **이미지 업로드:** `multer`를 활용하여 서버에 이미지 저장 및 경로 반환
- **에러 핸들링:** 통합 에러 미들웨어(400, 404, 500 등) 구현
- **라우트 최적화:** `app.route()` 및 `express.Router()`를 이용한 중복 제거 및 모듈화

---

## 📍 API 명세

| 도메인 | 메서드 | 경로 | 설명 |
| :--- | :--- | :--- | :--- |
| **상품** | GET | `/api/products` | 상품 목록 조회 (Offset 페이징) |
| **상품** | POST | `/api/products` | 상품 등록 (Validation) |
| **상품** | PATCH | `/api/products/:id` | 상품 수정 |
| **게시판** | GET | `/api/articles` | 게시글 목록 조회 (Offset 페이징) |
| **게시판** | POST | `/api/articles` | 게시글 등록 (Validation) |
| **댓글** | POST | `/api/products/:id/comments` | 상품 댓글 등록 |
| **댓글** | GET | `/api/products/:id/comments` | 상품 댓글 조회 (Cursor 페이징) |
| **이미지** | POST | `/api/images/upload` | 이미지 업로드 및 경로 반환 |

---

## 🚦 설치 및 실행 (Installation & Execution)

### 1. 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
PORT=3000

### 2. 패키지 설치 및 실행

Bash
# 의존성 패키지 설치
$ npm install

# 데이터베이스 시딩 (초기 데이터 생성)
$ npm run seed

# 서버 실행 (Production 모드)
$ npm start
이해했습니다! 제가 계속 답변을 드리면서 마크다운 코드 블록(```) 안에 코드를 넣다 보니, 그 안에 또 다른 코드 블록(Bash 쉘 표현)이 들어가는 과정에서 문법이 충돌하여 일부가 깨져 보였을 수 있습니다.

이번에는 제목부터 배포 내용까지 단 하나의 마크다운 블록에 담았으며, 특히 설치 및 실행 부분에 Bash 쉘 기호($)를 명시하여 터미널 명령임을 확실히 알 수 있도록 작성했습니다.

아래 내용을 그대로 복사해서 README.md에 붙여넣으세요.

Markdown

# 🛒 Market & Board API Service

PostgreSQL과 Express를 기반으로 구축된 중고마켓 및 자유게시판 통합 백엔드 서비스입니다. 데이터 모델 간의 관계와 효율적인 페이지네이션(Offset/Cursor)을 고려하여 설계되었습니다.

---

## 🚀 기술 스택
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Middleware:** Multer (이미지 업로드), CORS, Error Handler
- **Deployment:** Render.com

---

## 🛠️ 주요 기능 및 구현 사항

### 1. 중고마켓 (Used Market)
- **Product 스키마:** id, name, description, price, tags, createdAt, updatedAt 필드 구성
- **기능:** 상품 등록, 상세 조회, 수정(PATCH), 삭제
- **조회 최적화:** Offset 방식 페이지네이션, 최신순 정렬, 키워드(이름/설명) 검색

### 2. 자유게시판 (Free Board)
- **Article 스키마:** id, title, content, createdAt, updatedAt 필드 구성
- **기능:** 게시글 등록, 상세 조회, 수정, 삭제
- **조회 최적화:** Offset 방식 페이지네이션, 최신순 정렬, 키워드(제목/내용) 검색

### 3. 댓글 시스템 (Comments)
- **구조:** 중고마켓과 자유게시판 각각의 독립적인 댓글 API 구현
- **기능:** 댓글 등록, 수정(PATCH), 삭제
- **조회 최적화:** **Cursor 방식 페이지네이션** 적용
- **데이터 무결성:** `onDelete: Cascade` 설정으로 부모 게시글 삭제 시 댓글 자동 삭제

### 4. 공통 모듈
- **유효성 검증:** 미들웨어를 통한 필수 데이터(이름, 가격, 제목 등) 검증
- **이미지 업로드:** `multer`를 활용한 서버 이미지 저장 및 경로 반환 API
- **에러 핸들링:** 통합 에러 미들웨어(400, 404, 500) 구현
- **라우트 최적화:** `app.route()` 및 `express.Router()`를 활용한 중복 제거 및 모듈화

---

## 📍 API 명세

| 도메인 | 메서드 | 경로 | 설명 |
| :--- | :--- | :--- | :--- |
| **상품** | GET | `/api/products` | 상품 목록 조회 (Offset) |
| **상품** | POST | `/api/products` | 상품 등록 (Validation) |
| **게시판** | GET | `/api/articles` | 게시글 목록 조회 (Offset) |
| **게시판** | POST | `/api/articles` | 게시글 등록 (Validation) |
| **댓글** | POST | `/api/products/:id/comments` | 상품 댓글 등록 |
| **댓글** | GET | `/api/products/:id/comments` | 상품 댓글 조회 (Cursor) |
| **이미지** | POST | `/api/images/upload` | 이미지 업로드 및 경로 반환 |

---

## 🚦 설치 및 실행 (Installation & Execution)

### 1. 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
2. 패키지 설치 및 실행 (Bash)
터미널(Bash)에서 아래 명령어를 순서대로 입력하세요.

Bash

# 의존성 패키지 설치
$ npm install

# 데이터베이스 시딩 (초기 데이터 생성)
$ npm run seed

# 서버 실행 (Production 모드)
$ npm start

## 🌐 배포 (Deployment)
### 본 프로젝트는 Render.com을 통해 배포되었습니다.

- 빌드 명령 (Build Command): npm install

- 시작 명령 (Start Command): npm start

- 환경 변수: Render Dashboard 내에 .env 설정값 등록 완료

- CORS 설정: 모든 오리진에 대한 접근 허용 미들웨어 적용
