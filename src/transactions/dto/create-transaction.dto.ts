export class CreateTransactionDto {
  readonly name: string;
  readonly business: string;
  readonly category: string;
  readonly type: string;
  readonly amount: number;
  readonly date: number;
}
