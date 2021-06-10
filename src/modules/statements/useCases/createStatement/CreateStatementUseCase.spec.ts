import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "@modules/statements/repositories/StatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create a new statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@user.com",
      password: "1234"
    })

    const id = user.id as string;

    const statement = await createStatementUseCase.execute({
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test"
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to show profile of nonexistent user", async () => {
    expect(async () => {
      const statement = await createStatementUseCase.execute({
        user_id: "not found id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should not be able to withdraw more than what user currently have in balance", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User",
        email: "user@user.com",
        password: "1234"
      })

      console.log(user);

      const id = user.id as string;

      const statement = await createStatementUseCase.execute({
        user_id: id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
});
