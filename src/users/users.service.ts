import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CustomError } from "src/custom/custom.error";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  // 회원가입
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password } = createUserDto;

      const existInfo = await this.userRepository.findOne({ where: { email } });

      if (existInfo) {
        throw new CustomError("중복된 이메일입니다.", HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
      return this.userRepository.save(newUser);
    } catch (err) {
      throw err;
    }
  }

  // 로그인
  async login(email: string, password: string): Promise<string> {
    try {
      const existUser = await this.userRepository.findOne({ where: { email } });

      if (!existUser) {
        throw new CustomError("유저 정보가 없습니다", HttpStatus.NOT_FOUND);
      }

      const checkPassword = await bcrypt.compare(password, existUser.password);

      if (!checkPassword) {
        throw new CustomError(
          "유효하지 않은 이메일 또는 비밀번호 입니다.",
          HttpStatus.UNAUTHORIZED
        );
      }

      const token = jwt.sign(
        {
          userId: existUser.id,
        },
        this.configService.get<string>("JWT_SECRET_KEY"),
        { expiresIn: "1h" }
      );

      return token;
    } catch (err) {
      throw err;
    }
  }

  // 유저 상세조회(프로필)
  async getUserById(id: number): Promise<User> {
    try {
      const userDetail = await this.userRepository.findOne({
        where: { id },
        select: ["id", "profileImg", "email", "nickname", "phoneNumber", "remainingPoint"],
      });

      if (!userDetail) {
        throw new CustomError("유저 정보가 없습니다", HttpStatus.NOT_FOUND);
      }

      return userDetail;
    } catch (err) {
      throw err;
    }
  }
}
