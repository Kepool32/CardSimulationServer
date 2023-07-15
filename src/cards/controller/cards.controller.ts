import {Body, Controller, Get, Post, Param, BadRequestException, NotFoundException} from '@nestjs/common';
import { Card } from '../model/card.model';
import { CardsService } from '../service/card.service';
import { detectCardType } from '../utils/card.util';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import validator from 'validator';
import {validate} from "class-validator";
import {CheckConfirmationCodeDto, CheckEmailDto} from "../validation/card.validation";

@Controller('cards')
export class CardsController {
    private transporter;

    constructor(private cardsService: CardsService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'kukso.artem@mail.ru',
                pass: '2GZ1hKa6hZTPBehnjeGp',
            },
        });
    }

    @Post()
    async create(@Body() card: Card): Promise<string> {
        const cardType = detectCardType(card.cardNumber);
        card.cardType = cardType;

        if (!validator.isEmail(card.email)) {
            throw new BadRequestException('Invalid email address');
        }

        const cardsWithEmail = await this.cardsService.findAllByEmail(card.email);
        if (cardsWithEmail.length > 0) {
            // У этого email уже есть карточки, добавляем новую
            const confirmationCode = crypto.randomBytes(4).toString('hex');
            card.confirmationCode = confirmationCode;

            const createdCard = await this.cardsService.create(card);
            return createdCard.toString();
        } else {
            // У этого email нет карточек, добавляем первую
            const createdCard = await this.cardsService.create(card);
            return createdCard.toString();
        }
    }

    @Post('email/:email/code')
    async sendConfirmationCodeByEmail(@Param('email') email: string): Promise<string> {
        const checkEmailDto: CheckEmailDto = { email };

        const errors = await validate(checkEmailDto);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        const card = await this.cardsService.findOneByEmail(email);

        if (!card) {
            throw new BadRequestException('Card not found');
        }

        // Генерация кода подтверждения
        const confirmationCode = crypto.randomBytes(4).toString('hex');
        card.confirmationCode = confirmationCode;

        // Отправка кода подтверждения на почту
        const mailOptions = {
            from: 'kukso.artem@mail.ru',
            to: card.email,
            subject: 'Confirmation Code',
            text: `Your confirmation code is: ${confirmationCode}`,
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Message sent:', info.response);
            }
        });

        await this.cardsService.update(card._id, card);

        return 'Confirmation code sent to your email';
    }

    @Get('email/:email/confirm/:code')
    async confirmByEmailAndCode(
        @Param('email') email: string,
        @Param('code') code: string,
    ): Promise<Card[]> {
        const checkCodeDto: CheckConfirmationCodeDto = { code };

        const errors = await validate(checkCodeDto);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        const cards = await this.cardsService.findAllByEmail(email);

        if (cards.length === 0) {
            throw new NotFoundException('Cards not found');
        }

        const updatedCards: Card[] = [];

        for (const card of cards) {
            if (card.confirmationCode === code) {
                card.isConfirmed = true;
                card.confirmationCode = undefined;
            } else {
                card.confirmationCode = undefined;
            }
            updatedCards.push(card);
        }

        const confirmedCards: Card[] = await Promise.all(
            updatedCards.map(updatedCard =>
                this.cardsService.update(updatedCard._id, updatedCard),
            ),
        );

        if (!confirmedCards.every(card => card !== null)) {
            throw new BadRequestException('Failed to update cards');
        }

        return confirmedCards;
    }


    @Get()
    async findAll(): Promise<Card[]> {
        return this.cardsService.findAll();
    }
}