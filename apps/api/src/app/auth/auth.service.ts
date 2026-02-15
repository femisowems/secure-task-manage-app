
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Organization } from '@secure-task-manage-app/data/entities';
import { UserRole } from '@secure-task-manage-app/data/enums';
import { CreateSignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Organization)
        private orgRepository: Repository<Organization>,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signup(dto: CreateSignupDto) {
        const { email, password } = dto;

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        let defaultOrg = await this.orgRepository.findOne({ where: { name: 'Default Organization' } });
        if (!defaultOrg) {
            defaultOrg = this.orgRepository.create({
                name: 'Default Organization',
                parentOrganizationId: undefined
            });
            await this.orgRepository.save(defaultOrg);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            passwordHash,
            role: UserRole.VIEWER,
            organizationId: defaultOrg.id
        });

        await this.usersRepository.save(user);

        return { message: 'Account created successfully' };
    }
}
