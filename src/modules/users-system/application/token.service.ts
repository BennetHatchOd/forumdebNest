import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService,){ }

    async createAccessToken(id: string): Promise<string>{
        return this.jwtService.signAsync(
            {sub: id},
            {secret: process.env.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: process.env.TIME_LIFE_ACCESS_TOKEN,});
    }

    async createRefreshToken(id: string): Promise<string>{
        return this.jwtService.signAsync(
            {sub: id},
            {secret: process.env.REFRESH_TOKEN_SECRET_KEY,
             expiresIn: process.env.TIME_LIFE_REFRESH_TOKEN,});
    }

    async verifyAccessToken(token: string): Promise<string>{
        const payload = await this.jwtService.verifyAsync(token,
            { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
        return payload.sub;
    }

    async verifyRefreshToken(token: string): Promise<string>{
        const payload = await this.jwtService.verifyAsync(token,
            { secret: process.env.REFRESH_TOKEN_SECRET_KEY });
        return payload.sub;
    }
}
