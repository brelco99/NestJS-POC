import { Injectable, HttpException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
 ) {}

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
  return await this.accountRepository.find({
    select: ['name']
  });
 }
}