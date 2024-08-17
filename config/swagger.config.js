import SwaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WASH API",
      version: "1.0.0",
      description:
        "wash api / 헤더로 토큰 넣으실때 {AcessToken} 형식으로 중괄호 내부 값만 넣으셔야 합니다",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "로컬 서버",
      },
      {
        url: "https://dev.team-wash.store",
        description: "개발 서버",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./swagger/*"],
};

export const specs = SwaggerJsdoc(options);
