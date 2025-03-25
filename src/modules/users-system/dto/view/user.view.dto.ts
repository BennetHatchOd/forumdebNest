import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
        id:              string;
        login:           string;
        email:           string;
        createdAt:       string;

    static   mapToView(item: UserDocument): UserViewDto {
        const mappedUser = new this();

        mappedUser.id = item._id.toString();
        mappedUser.login = item.login;
        mappedUser.email = item.email;
        mappedUser.createdAt = item.createdAt.toISOString();

        return mappedUser;
    }
}
