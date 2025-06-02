import { User } from '@modules/users-system/domain/user.entity';

export class UserEntityAssociated {
    constructor(
        public userId: number,
        public email: string,
        public login: string,
        public passwordHash: string,
        public isConfirmEmail: boolean,
        public deletedAt:Date,
        public entityExpiredTime: Date,
    ){}
    mapToUser(): User {
        const user = new User();
        user.id = this.userId;
        user.email = this.email;
        user.login = this.login;
        user.isConfirmEmail = this.isConfirmEmail;
        user.deletedAt = this.deletedAt;
        user.passwordHash = this.passwordHash;
        return user;
    }
}