export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  isAdmin: boolean;
}
