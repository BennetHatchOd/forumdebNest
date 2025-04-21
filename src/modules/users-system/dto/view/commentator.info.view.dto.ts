import { UserDocument } from '../../domain/user.entity';

export class CommentatorInfoViewDto {
        userId:          string;
        login:           string;
    constructor(user: UserDocument) {
        this.userId = user._id.toString();
        this.login = user.login;
    }

    static   mapToView(inputUser: UserDocument): CommentatorInfoViewDto {
        return  new CommentatorInfoViewDto(inputUser);
    }
}
