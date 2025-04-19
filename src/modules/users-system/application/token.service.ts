import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserConfig } from '../config/user.config';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService,
                private userConfig: UserConfig,
    ){ }

    async createAccessToken(id: string): Promise<string> {

        const stringPromise = await this.jwtService.signAsync(
            {userId: id.toString()},
            {secret: this.userConfig.accessTokenSecret,
            expiresIn: this.userConfig.timeLifeAccessToken
        });
        return stringPromise;
    }

    async createRefreshToken(id: string): Promise<string>{
        return await this.jwtService.signAsync(
            {userId: id},
            {secret: this.userConfig.refreshTokenSecret,
             expiresIn: this.userConfig.timeLifeRefreshToken});
    }

    async verifyAccessToken(token: string): Promise<string>{
        const payload = await this.jwtService.verifyAsync(token,
            { secret: this.userConfig.accessTokenSecret });
        return payload.userId;
    }

    async verifyRefreshToken(token: string): Promise<string>{
        const payload = await this.jwtService.verifyAsync(token,
            { secret: this.userConfig.refreshTokenSecret });
        return payload.userId;
    }
}
