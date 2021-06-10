import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalance: GetBalanceUseCase;
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

describe("Get Balance", () => {
  beforeEach(() =>{
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalance = new GetBalanceUseCase(statementsRepository, usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("should be able to get balance of all statements", async() => {
    const { id } = await createUserUseCase.execute(user);

    statementDeposit.user_id = id as string;
    statementWithdraw.user_id = id as string;

    await createStatementUseCase.execute(statementDeposit);
    await createStatementUseCase.execute(statementWithdraw);

    const balanceAll = await getBalance.execute({user_id : id as string});

    console.log(balanceAll);

    expect(balanceAll.statement.length).toBe(2);
    expect(balanceAll.balance).toBe(2000);
  });

  it("should not be able to get balance of user not exists", () => {
    expect(async () => {
      await getBalance.execute({user_id : "id not exists"})

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })
});
