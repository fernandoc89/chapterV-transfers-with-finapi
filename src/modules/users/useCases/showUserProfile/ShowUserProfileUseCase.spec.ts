import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);

  })
  it("should be able to show a user's profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test Profile",
      email: "usertestprofile@email.com",
      password: "1234",
    });

    console.log(user);

    const id = user.id as string;

    const userData = await showUserProfileUseCase.execute(id);

    expect(userData).toHaveProperty("id");
    expect(userData.name).toBe("User Test Profile");
    expect(userData.email).toBe("usertestprofile@email.com");
  })

  it('Should not be able to show profile of nonexistent user', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('nonexistent_id');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
