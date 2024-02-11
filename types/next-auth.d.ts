import NextAuth from 'next-auth/next';
import { DefaultUser, Account, DefaultSession } from 'next-auth/core/types';
import { JWT } from 'next-auth/jwt';

type ISSTJwt = IUser & {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiration: string;
  error?: string;
};

interface IUser extends DefaultUser {
  id?: string;
  employeeId?: string;
  role?: string;
  routerPerms?: string[];
  perms?: string[];
  employeeId?: string;
  branchId?: string;
  organizationId?: string;
}

declare module 'next-auth/jwt' {
  interface JWT extends ISSTJwt {}
}

declare module 'next-auth' {
  interface Session {
    user: IUser;
    error?: string | boolean;
    accessToken?: string;
  }
}
