import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInputDto } from '../dto/input/user.input.dto';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UserRepository } from '../infrastucture/user.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        @InjectModel(User.name) private UserModel: UserModelType,
    ) {}

    async create(inputItem: UserInputDto): Promise<string> {
        const newUser: UserDocument = this.UserModel.createInstance(inputItem);
        await this.userRepository.save(newUser);
        return newUser._id.toString();
    }

    async edit(id: string, editData: UserInputDto): Promise<void> {

        const user: UserDocument | null = await this.userRepository.findById(id);

        if (!user)
            throw new NotFoundException(`user with ${id} not found`);
        user.edit(editData);
        this.userRepository.save(user);
        return;
    }

    async delete(id: string): Promise<void> {
        const user: UserDocument | null = await this.userRepository.findById(id);

        if (!user)
            throw new NotFoundException(`user with id-${id} not found`);
        user.delete();
        this.userRepository.save(user);
        return;

    }


}
