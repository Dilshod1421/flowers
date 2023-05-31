import { Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

export async function generateToken(jwt_payload: object, jwtService: any) {
  const [access_token, refresh_token] = await Promise.all([
    jwtService.signAsync(jwt_payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    jwtService.signAsync(jwt_payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);
  return { access_token, refresh_token };
}

export async function writeToCookie(
  refresh_token: string,
  user: string,
  res: Response,
) {
  res.cookie(`refresh_token_${user}`, refresh_token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
}
