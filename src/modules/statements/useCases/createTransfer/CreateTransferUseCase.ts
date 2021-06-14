import { Transfer } from "../../../../modules/statements/entities/Transfer";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("TransfersRepository")
    private transfersRepository: ITransfersRepository
  ){}

  async execute({sender_id, amount, description}: ICreateTransferDTO): Promise<Transfer>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
      TRANSFER = 'transfer',
    }

    const senderUserBalance = await this.statementsRepository.getUserBalance({user_id: sender_id})

    if(senderUserBalance.balance < amount){
      throw new AppError("Insufficient balance to perform transaction")
    }

    const transfer = await this.transfersRepository.create({
      sender_id,
      amount,
      description
    })

    const statement = await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.WITHDRAW,
      transfer_id: transfer.id
    })

    return transfer;
  }

}

export { CreateTransferUseCase}
