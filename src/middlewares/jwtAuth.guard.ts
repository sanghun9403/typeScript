import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomError } from "src/custom/custom.error";

@Injectable()
// 가드를 구현하기 위해 Nestjs에서 지원하는 CanActive 인터페이스 사용
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // ExecutionContext는 Nestjs에서 실행 컨텍스트에 대한 정보를 가지고 있는 객체
  // HTTP요청 시 컨텍스트 정보를 추출 가능
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      throw new CustomError("인증 토큰이 없습니다.", HttpStatus.UNAUTHORIZED);
    }

    const [tokenType, token] = (accessToken ?? "").split(" ");
    if (tokenType != "Bearer" || !token) {
      throw new CustomError("유효하지 않은 인증 토큰입니다.", HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.userId;
      request.user = userId;
      return true;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("만료된 인증 토큰입니다.", HttpStatus.UNAUTHORIZED);
      }
      console.error(error);
      throw new CustomError("유효하지 않은 인증 토큰입니다2.", HttpStatus.UNAUTHORIZED);
    }
  }
}
