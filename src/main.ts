import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const port = process.env.SERVER_PORT;
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port, () => {
    console.log(port, "번 포트로 서버 실행");
  });
}
bootstrap();
