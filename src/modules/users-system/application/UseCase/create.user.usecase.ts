import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User, UserDocument, UserModelType } from '@modules/users-system/domain/user.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { UserInputDto } from '@modules/users-system/dto/input/user.input.dto';
import { UserConfig } from '@modules/users-system/config/user.config';
import { EmailService } from '@modules/notifications/application/email.service';
import { PasswordHashService } from '../password.hash.service';
import { UserRepository } from '@modules/users-system/infrastucture/user.repository';
import { InjectModel } from '@nestjs/mongoose';

export class CreateUserCommand extends Command<string> {
    constructor(
        public userDto: UserInputDto,
        public confirmedEmail: boolean,
    ) {
        super()}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, string> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHashService: PasswordHashService,
        private readonly mailService: EmailService,
        private readonly userConfig: UserConfig,
        @InjectModel(User.name) private UserModel: UserModelType,
        ) {}

    async execute({userDto, confirmedEmail}: CreateUserCommand):Promise<string> {

        const checkUniq: string[] | null = await this.userRepository.checkUniq(
            userDto.login,
            userDto.email,
        );

        if (checkUniq) {
            const errors = checkUniq.map((fieldError:string) => {
                return {
                    message: `user's ${fieldError} must be uniq`,
                    field: fieldError,
                };
            });
            throw new DomainException({
                message: "user's email or login must be uniq",
                code: DomainExceptionCode.ValidationError,
                extension: errors,
            });
        }

        const passwordHash: string = await this.passwordHashService.createHash(
            userDto.password,
            this.userConfig.saltRound,
        );
        const createdUser: UserDocument = this.UserModel.createInstance({
            ...userDto,
            password: passwordHash,
        });

        if(!confirmedEmail) {
            createdUser.isConfirmEmail = false;
            createdUser.createConfirmCode(this.userConfig.timeLifeEmailCode)
            this.mailService.createConfirmEmail(
                userDto.email,
                createdUser.confirmEmail.code,
            );
        }
        await this.userRepository.save(createdUser);
        return createdUser._id.toString();
    }
}


