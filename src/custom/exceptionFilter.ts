// import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
// import { Request, Response } from "express";
// import { QueryFailedError } from "typeorm";

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = "서버 오류가 발생했습니다.";

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       message = exception.message;
//     } else if (exception instanceof QueryFailedError) {
//       status = HttpStatus.UNPROCESSABLE_ENTITY;
//       message = (exception as QueryFailedError).message;
//     }

//     const stack = process.env.NODE_ENV === "development" ? new Error().stack : undefined;

//     response.status(status).json({
//       statusCode: status,
//       message,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       stack,
//     });
//   }
// }

// // 개발환경에서만 stack trace가 보이게할수있는 방법 구상필요
