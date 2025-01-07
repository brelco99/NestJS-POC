import { AccountService } from '../services/account.service';
import { Controller, Post, Body, Query, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import axios from 'axios';
import { AccountDto } from 'src/dto/account.dto';

@ApiTags('Accounts')
@Controller()
export class AccountController {
 constructor(private readonly accountService: AccountService) {}

 @Get('/initialize')
 @ApiExcludeEndpoint()

 @Get('/accounts/:accountId')
 @ApiOperation({ summary: 'Get account by ID' })
 @ApiParam({ name: 'accountId', type: 'number' })
 async getAccountById(@Param('accountId') accountId: number) {
   return await this.accountService.findByAccountId(accountId);
 }

 @Get('/accounts')
 @ApiOperation({ summary: 'Get all accounts' })
 async getAllAccounts() {
   return await this.accountService.getAllAccounts();
 }

 @Post('/accounts')
@ApiOperation({ summary: 'Create new account' })
async createAccount(@Body() accountDto: AccountDto) {
  return await this.accountService.createAccount(accountDto);
}
@Get('/accounts/names')
@ApiOperation({ summary: 'Get all account names' })
async getAccountNames() {
 return await this.accountService.getAccountNames();
}
}