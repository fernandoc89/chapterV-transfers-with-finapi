interface ICreateTransferDTO {
  sender_id: string;
  description: string;
  amount: number;
  id?: string;
}

export { ICreateTransferDTO };
