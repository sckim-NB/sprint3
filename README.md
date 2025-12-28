# 🛒 Market & Board API Service

PostgreSQL과 Express를 기반으로 구축된 중고마켓 및 자유게시판 통합 백엔드 서비스입니다. 데이터 모델 간의 관계와 효율적인 Cursor pagination을 고려하여 설계되었습니다.

---

## 🚀 기술 스택

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Middleware: Multer (이미지 업로드), CORS, Error Handler
- Deployment: Render.com

---

## 🛠️ 주요 기능 및 구현 사항

### 1. 중고마켓 (Used Market)
- Product 스키마: id, name, description, price, tags, createdAt, updatedAt 필드 구성
- 기능: 상품 등록, 상세 조회, 수정(PATCH), 삭제
- 조회 최적화: Offset 방식 페이지네이션, 최신순 정렬, 키워드(이름/설명) 검색

### 2. 자유게시판 (Free Board)
- Article 스키마: id, title, content, createdAt, updatedAt 필드 구성
- 기능: 게시글 등록, 상세 조회, 수정, 삭제
- 조회 최적화: Offset 방식 페이지네이션, 최신순 정렬, 키워드(제목/내용) 검색

### 3. 댓글 시스템 (Comments)
- 구조: 중고마켓과 자유게시판 각각의 독립적인 댓글 API 구현
- 기능: 댓글 등록, 수정(PATCH), 삭제
- 조회 최적화: Cursor 방식 페이지네이션 적용
- 데이터 무결성: onDelete: Cascade 설정으로 부모 게시글 삭제 시 댓글 자동 삭제

### 4. 공통 모듈
- 유효성 검증: 미들웨어를 통한 필수 데이터(이름, 가격, 제목 등) 검증
- 이미지 업로드: multer를 활용한 서버 이미지 저장 및 경로 반환 API
- 에러 핸들링: 통합 에러 미들웨어(400, 404, 500) 구현
- 라우트 최적화: app.route() 및 express.Router()를 활용한 중복 제거 및 모듈화

---

## 📍 API 명세

| 도메인 | 메서드 | 경로 | 설명 |
| :--- | :--- | :--- | :--- |
| 상품 | GET | /api/products | 상품 목록 조회 (Offset) |
| 상품 | POST | /api/products | 상품 등록 (Validation) |
| 상품 | PATCH | /api/products/:id | 상품 수정 |
| 게시판 | GET | /api/articles | 게시글 목록 조회 (Offset) |
| 게시판 | POST | /api/articles | 게시글 등록 (Validation) |
| 댓글 | POST | /api/products/:id/comments | 상품 댓글 등록 |
| 댓글 | GET | /api/products/:id/comments | 상품 댓글 조회 (Cursor) |
| 이미지 | POST | /api/images/upload | 이미지 업로드 및 경로 반환 |

---

## 🚦 설치 및 실행 (Installation & Execution)

### 1. 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 내용을 입력합니다.

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

### 2. 패키지 설치 및 실행 (Bash)
터미널에서 아래 명령어를 순서대로 입력하세요.
bash 
```
# 1. 의존성 패키지 설치
$ npm install

# 2. 데이터베이스 시딩 (초기 데이터 생성)
$ npm run seed

# 3. 서버 실행
$ npm start
```

## 🌐 배포 (Deployment)
본 프로젝트는 Render.com을 통해 배포되었습니다.

- Build Command: npm install

- Start Command: npm start

- Environment Variables: Render Dashboard 내에 .env 설정값 등록 완료

- CORS Configuration: 모든 오리진에 대한 접근 허용 설정 적용
