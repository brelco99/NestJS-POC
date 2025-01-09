import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController() // This hides the auth endpoints from Swagger

@Controller('auth')
export class AuthController {
 constructor(private authService: AuthService) {}

 @Post('login')
 @ApiOperation({ summary: 'Login' })
 @ApiBody({
   schema: {
     type: 'object',
     properties: {
       username: { type: 'string', example: 'admin' },
       password: { type: 'string', example: 'admin123' }
     }
   }
 })
 @ApiResponse({ status: 200, description: 'Login successful' })
 @ApiResponse({ status: 401, description: 'Unauthorized' })
 async login(
   @Body('username') username: string,
   @Body('password') password: string,
 ) {
   const result = await this.authService.login(username, password);
   if (!result) {
     throw new UnauthorizedException();
   }
   return result;
 }
}

