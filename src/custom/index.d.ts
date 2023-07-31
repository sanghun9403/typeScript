declare namespace Express {
  export interface Request {
    file: Express.Multer.File;
    user: { userId: number; isAdmin: boolean };
  }
}
