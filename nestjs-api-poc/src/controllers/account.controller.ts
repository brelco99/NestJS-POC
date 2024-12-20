import { AccountService } from '../services/account.service';
import { Controller, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AccountRequestDto, AccountResponseDto, AccountSearchParamsDto } from '../dto/account.dto';

@ApiTags('Accounts')
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/accounts/get-all')
  @ApiOperation({ 
    summary: 'Get all accounts', 
    description: 'Retrieves all accounts based on the provided criteria with optional email and bcId filters' 
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved accounts', type: AccountResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ 
    name: 'email', 
    required: false, 
    description: 'Filter accounts by email' 
  })
  @ApiQuery({ 
    name: 'bcId', 
    required: false, 
    description: 'Filter accounts by business center ID' 
  })
  async getAllAccounts(
    @Body() accountData: AccountRequestDto,
    @Query() searchParams: AccountSearchParamsDto
  ) {
    return await this.accountService.getAllAccounts(accountData, searchParams);
  }
}