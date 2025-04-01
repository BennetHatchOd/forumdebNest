import { UserDocument } from '../../domain/user.entity';

export class UserAboutViewDto {
        userId:              string;
        login:           string;
        email:           string;
    constructor(user: UserDocument) {
        this.userId = user._id.toString();
        this.login = user.login;
        this.email = user.email;
    }

    static   mapToView(inputUser: UserDocument): UserAboutViewDto {
        return  new UserAboutViewDto(inputUser);
    }
}
