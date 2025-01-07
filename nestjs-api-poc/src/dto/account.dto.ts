import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEmail, IsString } from 'class-validator';


export class AccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firestoreId: string;
 
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
 }
