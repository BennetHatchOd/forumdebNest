import { CreateUserHandler } from '@modules/users-system/application/UseCase/user/create.user.usecase';
import { CreateSessionHandler } from '@modules/users-system/application/UseCase/session/create.session.usecase';
import { UpdateSessionHandler } from '@modules/users-system/application/UseCase/session/update.session.usecase';
import { DeleteOneSessionHandler } from '@modules/users-system/application/UseCase/session/delete.one.session.usecase';
import { DeleteOthersSessionHandler } from '@modules/users-system/application/UseCase/session/delete.others.sessions.usecase';
import { DeleteMySessionHandler } from '@modules/users-system/application/UseCase/session/delete.my.session.usecase';
import { DeleteUserHandler } from '@modules/users-system/application/UseCase/user/delete.user.usecase';
import { ConfirmationEmailHandler } from '@modules/users-system/application/UseCase/auth/confirmation.email.usecase';
import { CreateCodeConfirmationEmailHandler } from '@modules/users-system/application/UseCase/auth/create.code.confirmation.email.usecase';

export const CommandHandlers = [
    CreateUserHandler,
    DeleteUserHandler,
    ConfirmationEmailHandler,
    CreateCodeConfirmationEmailHandler,
    CreateSessionHandler,
    UpdateSessionHandler,
    DeleteOneSessionHandler,
    DeleteMySessionHandler,
    DeleteOthersSessionHandler
];