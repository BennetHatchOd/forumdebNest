import { CreateUserHandler } from '@modules/users-system/application/UseCase/create.user.usecase';
import { CreateSessionHandler } from '@modules/users-system/application/UseCase/create.session.usecase';
import { UpdateSessionHandler } from '@modules/users-system/application/UseCase/update.session.usecase';
import { DeleteOneSessionHandler } from '@modules/users-system/application/UseCase/delete.one.session.usecase';
import { DeleteOthersSessionHandler } from '@modules/users-system/application/UseCase/delete.others.sessions.usecase';
import { DeleteMySessionHandler } from '@modules/users-system/application/UseCase/delete.my.session.usecase';
import { DeleteUserHandler } from '@modules/users-system/application/UseCase/delete.user.usecase';
import { ConfirmationEmailHandler } from '@modules/users-system/application/UseCase/confirmation.email.usecase';
import { CreateCodeConfirmationEmailHandler } from '@modules/users-system/application/UseCase/create.code.confirmation.email.usecase';

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