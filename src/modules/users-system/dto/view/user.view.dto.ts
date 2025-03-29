import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
        id:              string;
        login:           string;
        email:           string;
        createdAt:       string;
    constructor(user: UserDocument) {
        this.id = user._id.toString();
        this.login = user.login;
        this.email = user.email;
        this.createdAt = user.createdAt.toISOString();
    }

    static   mapToView(inputUser: UserDocument): UserViewDto {
        return  new UserViewDto(inputUser);
    }
}
