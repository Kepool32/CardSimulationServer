import { NestFactory } from '@nestjs/core';
import {AppModule} from "./app.module";


async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    app.enableCors();
<<<<<<< HEAD
    await app.listen(process.env.PORT || 5000);

=======
    await app.listen(process.env.PORT ||5000);
>>>>>>> d26ff1d21186bfcffdfb14ea734ad06e0f7c0f6e
}

bootstrap();

