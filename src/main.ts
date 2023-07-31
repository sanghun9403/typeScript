import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
// import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const port = process.env.SERVER_PORT;
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  await app.listen(port, () => {
    console.log(port, "번 포트로 서버 실행");
  });
}
bootstrap();
