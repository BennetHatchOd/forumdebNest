import bcrypt from 'bcrypt'
import { saltRounds } from '../../../core/setting';


export class PasswordService {

    async createHash(password: string):Promise<string>{
        const salt: string = await bcrypt.genSalt(saltRounds)
        const hash: string = await bcrypt.hash(password, salt)

        return hash;
    }

    async checkHash(password: string, hash: string):Promise<boolean>{

        return await bcrypt.compare(password, hash)
    }
}