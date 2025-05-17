import { CreateUserHandler } from '@modules/users-system/application/UseCase/create.user.usecase';
import { CreateSessionHandler } from '@modules/users-system/application/UseCase/create.session.usecase';

export const CommandHandlers = [
    CreateUserHandler,
    CreateSessionHandler
];