import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomError extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    const stack = process.env.NODE_ENV === "development" ? new Error().stack : undefined;
    super({ message, stack }, statusCode);
  }
}

// 개발환경에서만 stack trace가 보이게할수있는 방법 구상필요
