import { AccountService } from '../services/account.service';
import { Controller, Post, Body, Query, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { AccountDto } from 'src/dto/account.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@ApiBearerAuth('access-token')
@ApiTags('Accounts')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('/accounts')
  @ApiOperation({ summary: 'Create new account' })
  async createAccount(@Body() accountDto: AccountDto) {
    return await this.accountService.createAccount(accountDto);
  }

  @Get('/accounts')
  @ApiOperation({ summary: 'Get all accounts' })
  async getAllAccounts() {
    return await this.accountService.getAllAccounts();
  }

  @Get('/accounts/names')
  @ApiOperation({ summary: 'Get all account names' })
  async getAccountNames() {
    try {
      const result = await this.accountService.getAccountNames();
      console.log('Controller result:', result);
      return result;
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Roles('admin')
  @Get('/accounts/:accountId')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'accountId', type: 'number' })
  async getAccountById(@Param('accountId') accountId: number) {
    return await this.accountService.findByAccountId(accountId);
  }

  // ~Paginated endpoint
  @Get()
  @ApiOperation({ summary: 'Get a paginated list of accounts' })
  async getAccounts(@Query() paginationDto: PaginationDto) {
    return {
      page: paginationDto.page,
      limit: paginationDto.limit,
      accounts: (await this.accountService.findAll(paginationDto)).data
    }
  }

}