export class UserTuple{
    id: number;
    login: string;
    email: string;
    passwordHash: string;
    isConfirmEmail: boolean;
    confirmEmailCode: string;
    confirmEmailExpTime: Date;
    createdAt: Date;
    deletedAt: Date | null
}