import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class InitializePaymentDto {
  @IsUUID()
  orderId: string;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  reference: string;
}