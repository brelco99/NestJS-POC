import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async login(username: string, password: string) {
    if (username === 'admin' && password === 'admin123') {
      const payload = {
        username: username,
        role: 'admin'
      };

      return {
        access_token: this.jwtService.sign(payload)
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUser(username: string, password: string): Promise<any> {
    if (username === 'admin' && password === 'admin123') {
      return { username, role: 'admin' };
    }
    return null;
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

