import { Controller, Post, Body, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject(AuthService) private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @Post('signup')
    async signup(@Body() dto: CreateSignupDto) {
        try {
            return await this.authService.signup(dto);
        } catch (error: any) {
            if (error.message === 'User already exists') {
                throw new ConflictException('User with this email already exists');
            }
            throw error;
        }
    }
}
