import { UserConfig } from '../../src/modules/users-system/config/user.config';
import { CoreConfig } from '../../src/core/core.config';
import { copyPathResolve } from '@nestjs/cli/lib/compiler/helpers/copy-path-resolve';

export class AuthBasic{
    login: string;
    password: string;

    constructor(private coreConfig: CoreConfig) {
        this.login = coreConfig.adminNameBasicAuth;
        this.password = coreConfig.adminPasswordBasicAuth;
    }
    static createAuthHeader(coreConfig: CoreConfig): string{
        const authBasic = new this(coreConfig)
        const buff = Buffer.from(`${authBasic.login}:${authBasic.password}`, 'utf-8');
        const base64 = buff.toString('base64');
        const authheader: string = `Basic ${base64}`;
        return authheader;
    }
}