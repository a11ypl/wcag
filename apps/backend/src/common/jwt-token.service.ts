import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthTokenPayload extends JwtPayload {
  sub: number;
  email: string;
  fullName: string;
  roleCode: 'ADMIN' | 'CLIENT_STANDARD' | 'CLIENT_PREMIUM';
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly config: ConfigService) {}

  sign(payload: AuthTokenPayload): string {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Missing JWT_SECRET');
    }

    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '8h';
    return jwt.sign(payload, secret, { expiresIn });
  }

  verify(token: string): AuthTokenPayload {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Missing JWT_SECRET');
    }

    try {
      return jwt.verify(token, secret) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
