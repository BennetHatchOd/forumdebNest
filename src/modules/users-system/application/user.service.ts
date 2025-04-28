import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInputDto } from '../dto/input/user.input.dto';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UserRepository } from '../infrastucture/user.repository';
import { PasswordHashService } from './password.hash.service';
import { UserConfig } from '../config/user.config';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { AuthService } from '@src/modules/users-system/application/auth.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userConfig: UserConfig,
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
        private readonly passwordHashService: PasswordHashService,
        @InjectModel(User.name) private UserModel: UserModelType,
    ) {}

    async create(inputUserDto: UserInputDto): Promise<string> {

        const newUser: UserDocument =await this.authService.checkUniq(inputUserDto);

        newUser.isConfirmEmail = true;
        // for directly created user no need to check email
        await this.userRepository.save(newUser);
        return newUser._id.toString();
    }

    // async edit(id: string, editData: UserInputDto): Promise<void> {
    //
    //     const user: UserDocument | null = await this.userRepository.findById(id);
    //
    //     if (!user)
    //         throw new DomainException({
    //                 message: 'user with ${id} not found',
    //                 code: DomainExceptionCode.NotFound});
    //     const passwordHash: string = await this.passwordHashService.createHash(editData.password);
    //     user.edit({...editData,
    //                   password: passwordHash});
    //     this.userRepository.save(user);
    //     return;
    // }

    async delete(id: string): Promise<void> {
        const user: UserDocument | null = await this.userRepository.findById(id);

        if (!user)
            throw new DomainException({
                message: 'user with id-${id} not found',
                code: DomainExceptionCode.NotFound});
        user.delete();
        this.userRepository.save(user);
        return;

    }

}
