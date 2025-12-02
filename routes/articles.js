import express from "express";
import { prisma } from "../prisma/prisma.js";
import res from "express/lib/response.js";
import { validateArticleInfo } from "../middlewares/validator.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
const router = express.Router();

class Article {
   constructor(id, title, content, createdAt) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdAt = createdAt;
   }

   static fromEntity(entity) {
      // entity는 쌩 오브젝트 => 클래스 소속으로 만들어줘야 함
      return new Article(entity.id.toString(), entity.title, entity.content, entity.created_at);
   }
}
// 게시글 목록 조회 API를 만들어 주세요.
// id, title, content, createdAt를 조회합니다.
// todo: offset 방식의 페이지네이션 기능을 포함해 주세요.

//쉬운 기능부터 구현하면서 차근차근

// id, title, content, createdAt, updatedAt 필드를 가집니다.
// => 라고 할때, DB에서 가져온 걸 절대 그대로 쓰면 안된다.
// => DB의 형상을 무너뜨리는 행위임 => 클래스가 있어야 함
// => db에서 읽어온 거 그대로 사용 XXXXXXX, fromEntity가 변환을 책임져줌
function getFindOptionFrom(req) {
   // 최신순(recent)으로 정렬할 수 있습니다.
   // title, content에 포함된 단어로 검색할 수 있습니다.
   const findOption = {
      orderBy: { created_at: "desc" },
   };
   if (req.query.keyword) {
      findOption.where = {
         OR: [{ title: { contains: req.query.keyword } }, { content: { contains: req.query.keyword } }],
      };
   }
   return findOption;
}

router.post("/", validateArticleInfo, (req, res, next) => {
   // 상품 등록 (getOnlyEntity)
   // > title, content를 입력해 게시글을 등록합니다.
   const { title, content } = req.body;
   Promise.resolve({ title, content })
      .then((data) => {
         return prisma.article.create({
            data: {
               title: data.title,
               content: data.content,
            },
         });
      })
      .then((entities) => {
         return Article.fromEntity(entities);
      })
      .then((newArticle) => {
         res.status(201).json(newArticle);
         console.log("게시글 생성 완료");
      })
      .catch((err) => {
         console.error(err);
         next(err);
      });
});

router.get("/:id", (req, res, next) => {
   // 상품 상세 조회 (getOnlyEntity)
   //  id, title, content, createdAt를 조회합니다.
   const articleId = parseInt(req.params.id);
   if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
   }
   Promise.resolve(articleId)
      .then((articleId) => {
         return prisma.article.findUnique({
            where: { id: articleId },
            orderBy: { created_at: "desc" },
         });
      })
      .then((Entities) => {
         if (!Entities) {
            throw new NotFoundError("게시글을 찾을 수 없습니다.");
         }
         return Article.fromEntity(Entities);
      })
      .then((article) => {
         res.json(article);
      })
      .catch((err) => {
         console.error(err);
         next(err);
      });
});

router.patch("/:id", (req, res, next) => {
   // 상품 수정
   const articleId = parseInt(req.params.id);
   const updateData = req.body;
   if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
   }
   Promise.resolve(articleId)
      .then((id) => {
         return prisma.article.update({
            where: { id: id },
            data: updateData,
         });
      })
      // .then((entities) => entities.map(Product.getEntity))
      .then((updatedArticle) => {
         res.json(updatedArticle);
      })
      .catch((err) => {
         if (err.code === "P2025") {
            // Prisma Client Known Request Error 중 하나로, 데이터베이스에서 찾아야 하거나 의존하는 레코드를 찾지 못했을 때 발생하는 특정 오류 코드
            return res.status(404).json({ message: "등록된 게시글이 없습니다." });
         }
         console.error(err);
         next(err);
      });
});

router.delete("/:id", (req, res, next) => {
   // 상품 삭제
   const articleId = parseInt(req.params.id);
   if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
   }
   Promise.resolve(articleId).then((id) => {
      return prisma.article
         .delete({
            where: { id: id },
         })
         .then(() => {
            res.status(204).end();
            console.log("Successful Deletion of Article");
         })
         .catch((err) => {
            console.error(err);
            next(err);
         });
   });
});
router.get("/", async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const [articles, total] = await prisma.$transaction([
         prisma.article.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: "desc" },
         }),
         prisma.article.count(),
      ]);

      res.json({
         articles,
         total,
         page,
         totalPages: Math.ceil(total / limit),
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

//  this.id = id;
//       this.title = title;
//       this.content = content;
//       this.createdAt = createdAt;
//    }
export default router;
// 그냥 아는거 다줘. DB 읽기 // result는 entities

// console.log(result);
// res.json("뭔가 하는 중"); //일단 오는지 띄워보기
// id에 4n이라고 나옴 => DB로부터 가져올때 쌩으로 가져오면 안 되겠구나 생각하기

//app.js에 set으로 세팅해놓음. replacer 안 불러도 빅인트면 자동으로 변환 수행함.

// 비동기 Promise로
// router.get("/", (req, res, next) =>
//    Promise.resolve(getFindOptionFrom(req))
//       .then(prisma.article.findMany)
//       .then((entities) => entities.map(Article.fromEntity))
//       .then(res.json)
//       .catch((err) => {
//          console.error(err);
//          next(err);
//       })
// );

// 짤짤이로 실행해보고 고치고 조금씩 진행하기
// 시딩코드 한 후 > curl localhost:포트/articles 하면 등록된 자료 다와야함
// 그러면 articles 다 가져오는 로직을 짜야겠지? >
