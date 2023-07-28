import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CustomError } from "src/custom/custom.error";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const existUser = await this.userRepository.findOne({ where: { email } });

    if (existUser) {
      throw new CustomError("중복된 이메일입니다.", HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    return this.userRepository.save(newUser);
  }
}
