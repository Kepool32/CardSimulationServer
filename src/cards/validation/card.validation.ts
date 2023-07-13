import { IsNotEmpty, IsEmail } from 'class-validator';

export class CheckEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class CheckConfirmationCodeDto {
    @IsNotEmpty()
    code: string;
}