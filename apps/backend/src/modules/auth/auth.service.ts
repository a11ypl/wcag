import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OracleService } from '../../integrations/oracle/oracle.service';
import { verifyPassword } from '../../common/password';
import { AuthUser, RoleCode } from '../../common/auth-user';
import { JwtTokenService } from '../../common/jwt-token.service';

interface UserRow {
  userId: number;
  email: string;
  fullName: string;
  roleCode: RoleCode;
  passwordHash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly oracle: OracleService,
    private readonly jwtToken: JwtTokenService,
  ) {}

  async login(email: string, password: string) {
    const rows = await this.oracle.execute<UserRow>(
      `
      SELECT
        user_id AS "userId",
        email AS "email",
        full_name AS "fullName",
        role_code AS "roleCode",
        password_hash AS "passwordHash"
      FROM app_users
      WHERE LOWER(email) = LOWER(:email)
        AND is_active = 1
      FETCH FIRST 1 ROWS ONLY
      `,
      { email },
    );

    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtToken.sign({
      sub: user.userId,
      email: user.email,
      fullName: user.fullName,
      roleCode: user.roleCode,
    });

    return {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      roleCode: user.roleCode,
      accessToken,
    };
  }

  requireUserFromAuthorizationHeader(headerValue?: string): AuthUser {
    if (!headerValue || !headerValue.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = headerValue.slice('Bearer '.length);
    const payload = this.jwtToken.verify(token);

    return {
      userId: Number(payload.sub),
      email: payload.email,
      fullName: payload.fullName,
      roleCode: payload.roleCode,
    };
  }
}
