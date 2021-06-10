import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let statementOperation: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

const user = {
  name: "User",
  email: "user@user.com",
  password: "1234"
} as ICreateUserDTO;

const statementDeposit = {
  user_id: "",
  description: "pay",
  amount: 5000,
  type: "deposit"
} as ICreateStatementDTO;

const statementWithdraw = {
  user_id: "",
  description: "expenses",
  amount: 3000,
  type: "withdraw"
} as ICreateStatementDTO;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    statementOperation = new GetStatementOperationUseCase(usersRepository, statementsRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })
  it("should be able a new statement operation of a user", async () => {
    const { id: user_id } = await createUserUseCase.execute(user);

    statementDeposit.user_id = user_id as string;
    statementWithdraw.user_id = user_id as string;

    await createStatementUseCase.execute(statementDeposit)
    const { id: statement_id } = await createStatementUseCase.execute(statementWithdraw);

    const statement = await statementOperation.execute({
      user_id: user_id as string,
      statement_id: statement_id as string,
    });

    console.log(statement);

    expect(statement.amount).toBe(3000);
    expect(statement.type).toBe('withdraw');

  });
  it("should not be able to get nonexistent statement operation", () => {
    expect(async () => {
      const { id: user_id } = await createUserUseCase.execute(user);

      await statementOperation.execute({
        user_id: user_id as string,
        statement_id: "id not found",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("should not be able to get statement operation of user not found", () => {
    expect(async () => {
      const { id: user_id } = await createUserUseCase.execute(user);

      statementDeposit.user_id = user_id as string;
      const { id: statement_id } = await createStatementUseCase.execute(statementDeposit);

      await statementOperation.execute({
        user_id: "id not found",
        statement_id: statement_id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

})
