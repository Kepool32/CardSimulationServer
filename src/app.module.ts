import { Module } from '@nestjs/common';

import { CardsModule } from "./cards/module/cards.module";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb+srv://kuksoartem:user@cluster0.szaguwi.mongodb.net/CardSimuletion?retryWrites=true&w=majority"),
        CardsModule,
    ],
})
export class AppModule {}
