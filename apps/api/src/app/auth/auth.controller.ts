
import { Controller, Post, UseGuards, Request, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // Ideally use LocalAuthGuard but for simplicity doing direct validation call or just use AuthService
        // If we want to stick to "validate email + password" inside the endpoint:
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user); // Generates JWT
    }
}
