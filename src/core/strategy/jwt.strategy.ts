import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserConfig } from '../../modules/users-system/config/user.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userConfig: UserConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: userConfig.accessTokenSecret
        });
    }

    async validate(payload: any) {
        return payload.userId;
    }
}
