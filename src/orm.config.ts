import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    SYNCRONIZE: true,
    ENTITIES: [__dirname + "/entities/*{.ts,.js}"],
    MIGRATIONS: [__dirname + "/migrations/**/*{.ts,.js}"],
    MIGRATIONS_RUN: false,
  };

  return {
    type: "mysql",
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    logging: true,
    synchronize: commonConf.SYNCRONIZE,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    migrationsRun: commonConf.MIGRATIONS_RUN,
    namingStrategy: new SnakeNamingStrategy(),
  };
}

export { ormConfig };
