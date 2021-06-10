import jwt from "jsonwebtoken"

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { User } from "@modules/users/entities/User";

import authConfig from '../../../../config/auth';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  interface ITokenUser {
    user: User,
    token: string,
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user in a new session", async () => {
    const userData: ICreateUserDTO = {
      name: "User test",
      email: "test@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(userData);

    // cria a autenticação
    const { token, user } = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    const decodedToken = jwt.verify(token, authConfig.jwt.secret) as ITokenUser

    console.log(decodedToken);

    expect(user).toHaveProperty("id")
    expect(user).not.toHaveProperty("password")

    expect(decodedToken.user).toHaveProperty("id")
    expect(decodedToken.user).toHaveProperty("password")

  });

  it("should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User test",
        email: "test@test.com",
        password: "1234",
      };

      // cria o usuário
      await createUserUseCase.execute(user);

      // passando uma senha falsa para dar erro
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
