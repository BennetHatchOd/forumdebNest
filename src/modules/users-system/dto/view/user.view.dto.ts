import { UserTuple } from '@modules/users-system/domain/user.tuple';

export class UserViewDto {
        id:              string;
        login:           string;
        email:           string;
        createdAt:       string;
    constructor(user: UserTuple) {
        this.id = user.id.toString();
        this.login = user.login;
        this.email = user.email;
        this.createdAt = user.createdAt.toISOString();
    }

    static   mapToView(inputUser: UserTuple): UserViewDto {
        return  new UserViewDto(inputUser);
    }
}
