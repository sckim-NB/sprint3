// ★ app.js (After - 모듈화)
import express from "express";
// 라우터 import
import productRouter from "./routes/products.js"; //CJS로 표현됨 users 파일로 가서, export default router

// MJS로 변경하면 default가 하나라면 import usersRouter from "./routes/users";
import articleRouter from "./routes/articles.js";
import dotenv from "dotenv"; //env 읽어오기
import imageRouter from "./routes/upload.js"; // routes/uploads.js 파일 이름이 맞는지 확인

dotenv.config(); //경로 빼면 그냥 .env 읽는다.

const app = express();
// 파일 업로드
// 1. 정적 파일 서비스를 위한 설정 (필수!)
app.use("/uploads", express.static("uploads"));

// 2. 업로드 라우터 마운트
app.use("/uploads", imageRouter);
// 본문 파싱한 것
app.use(express.json());
// 무조건 세팅하기
app.set("json replacer", (key, value) => {
   if (typeof value === "bigint") {
      return value.toString();
   } // Bigint 일때만 스트링으로 바꿔
   return value;
});

// 라우터 mount - 뜯어낸다. users는 users로.
app.use("/articles", articleRouter);
app.use("/products", productRouter);

// 기본 라우트
app.get("/", (req, res) => {
   res.json({
      message: "API Server", //나 API 서버고, 아티클, 프로덕트가 있어.
      endpoints: ["/articles", "/products"],
   });
});

const apiPort = process.env.API_PORT;
//console.log(apiPort);
//env("API_PORT");  //.env에 있음 위에 임포트때 읽어와서 포트 등록된다
app.listen(apiPort, () => {
   console.log(`Server running on port ${apiPort}`);
});
