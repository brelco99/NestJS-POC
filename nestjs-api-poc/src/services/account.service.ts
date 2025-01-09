import { Injectable } from '@nestjs/common';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import { AccountDto } from 'src/dto/account.dto';


@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) { }

  async create(createAccountDto: AccountDto) {
    const account = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(account);
  }

  async storeAccounts(accounts: any[]) {
    for (const account of accounts) {
      await this.accountRepository.save({
        firestoreId: account.id,
        name: account.name
      });
    }
  }

  async findByAccountId(accountId: number) {
    return await this.accountRepository.findOne({
      where: { accountId }
    });
  }

  async getAllAccounts() {
    return await this.accountRepository.find();
  }

  async createAccount(accountDto: AccountDto) {
    const account = this.accountRepository.create({
      firestoreId: accountDto.firestoreId,
      name: accountDto.name
    });
    return await this.accountRepository.save(account);
  }

  async getAccountNames() {
    try {
      const accounts = await this.accountRepository
        .createQueryBuilder('account')
        .select(['account.name'])
        .orderBy('account.accountId', 'ASC')
        .getRawMany();
      return accounts.map(account => ({ name: account.account_name }));
    } catch (error) { console.error('Detail:', error); throw error; }
  }


  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [data, total] = await this.accountRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}