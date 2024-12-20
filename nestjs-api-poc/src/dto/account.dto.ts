import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class TimestampDto {
  @ApiProperty({
    description: 'Seconds part of the timestamp',
    example: '12345'
  })
  @IsNotEmpty()
  _seconds: string;

  @ApiProperty({
    description: 'Nanoseconds part of the timestamp',
    example: '123456'
  })
  @IsNotEmpty()
  _nanoseconds: string;
}

export class AccountRequestDto {
  @ApiProperty({
    description: 'The unique identifier for the account',
    example: 'test-account-123'
  })
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @ApiProperty({
    description: 'The admin account identifier',
    example: 'admin-123'
  })
  @IsNotEmpty()
  @IsString()
  adminAccountID: string;

  @ApiProperty({
    description: 'The subscription plan',
    example: 'premium'
  })
  @IsNotEmpty()
  @IsString()
  plan: string;

  @ApiProperty({
    description: 'The email address associated with the account',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The business center ID',
    example: 'bc-123'
  })
  @IsNotEmpty()
  @IsString()
  bcID: string;

  @ApiProperty({
    description: 'Timestamp information',
    type: TimestampDto
  })
  @IsNotEmpty()
  timestamp: TimestampDto;

  @ApiProperty({
    description: 'Authentication email address',
    example: 'auth@example.com'
  })
  @IsEmail()
  authenticationEmail: string;
}

export class AccountSearchParamsDto {
  @ApiPropertyOptional({
    description: 'Optional email to filter accounts',
    example: 'test@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Optional business center ID to filter accounts',
    example: 'bc-123'
  })
  @IsOptional()
  @IsString()
  bcId?: string;
}

export class AccountResponseDto {
  @ApiProperty({
    description: 'Status of the operation',
    example: 'success'
  })
  status: string;

  @ApiProperty({
    description: 'Retrieved account data',
    type: [AccountRequestDto]
  })
  data: AccountRequestDto[];
}