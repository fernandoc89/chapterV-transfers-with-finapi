import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

const userTest1: ICreateUserDTO = {
  name: 'User Test 1',
  email: 'usertest1@email.com',
  password: '1234'
};

const userTest2: ICreateUserDTO = {
  name: 'User Test 2',
  email: 'usertest1@email.com',
  password: '1234'
};

describe("Create User", () => {
  beforeEach(() =>{
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async() => {
    const user = await createUserUseCase.execute(
      userTest1);

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with exists email", () => {
    expect(async () => {
      await createUserUseCase.execute(userTest1);
      await createUserUseCase.execute(userTest2);

    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
