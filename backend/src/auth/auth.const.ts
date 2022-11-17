import { env } from 'process';

export const jwtConstants = {
  secret: env.AUTH_SECRET,
};
