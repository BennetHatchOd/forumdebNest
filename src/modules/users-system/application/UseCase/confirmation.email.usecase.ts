import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntityAssociated } from '@modules/users-system/dto/user.entity.associated';
import { isBefore } from 'date-fns';
import { UserRepository } from '@modules/users-system/infrastucture/user.repository';
import { User } from '@modules/users-system/domain/user.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

export class ConfirmationEmailCommand extends Command<void> {
    constructor(
        public code: string,
    ) {
        super()}
}

@CommandHandler(ConfirmationEmailCommand)
export class ConfirmationEmailHandler implements ICommandHandler<ConfirmationEmailCommand> {
    constructor(
        private userRepository: UserRepository,
        ) {}

    async execute({code}: ConfirmationEmailCommand):Promise<void> {

            const foundUserInfo: UserEntityAssociated | null
            = await this.userRepository.findAndDeleteConfirmCode(code);


        if ( !!foundUserInfo
            && !foundUserInfo.isConfirmEmail
            && !foundUserInfo.deletedAt
            && isBefore(new Date(), foundUserInfo.entityExpiredTime)
        ) {
            foundUserInfo.isConfirmEmail = true;
            const changedUser: User = foundUserInfo.mapToUser();
            await this.userRepository.saveUser(changedUser)
            return;
        }
        throw new DomainException({
            message: "the confirmation code is incorrect, expired or already been applied",
            code: DomainExceptionCode.EmailNotConfirmed,
            extension: [{message: "the confirmation code is incorrect, expired or already been applied",
                field: "code"}]
        });
    }
}


