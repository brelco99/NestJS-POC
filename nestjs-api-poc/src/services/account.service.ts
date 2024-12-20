import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { AccountRequestDto, AccountSearchParamsDto } from '../dto/account.dto';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  
  constructor(private readonly httpService: HttpService) {}

  async getAllAccounts(accountData: AccountRequestDto, searchParams?: AccountSearchParamsDto) {
    try {
      this.logger.log(`Fetching accounts with search params: ${JSON.stringify(searchParams)}`);
      
      const requestBody = {
        ...accountData,
        ...(searchParams?.email && { searchEmail: searchParams.email }),
        ...(searchParams?.bcId && { searchBcId: searchParams.bcId })
      };

      this.logger.debug(`Making request with body: ${JSON.stringify(requestBody)}`);

      const response = await firstValueFrom(
        this.httpService.post(
          'https://localhost:3000', // Replace with your actual API URL
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).pipe(
          catchError((error) => {
            this.logger.error(`Error fetching accounts: ${error.message}`, error.stack);
            if (error.response) {
              throw new HttpException(
                {
                  status: error.response.status,
                  error: error.response.data,
                },
                error.response.status,
              );
            }
            throw error;
          }),
        )
      );
      this.logger.log(`Successfully fetched accounts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
