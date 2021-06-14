import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { sender_id } = request.params;
    const { amount, description } = request.body;


    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      id,
      sender_id,
      amount,
      description
    });

    return response.status(201).json(transfer);

  }
}

