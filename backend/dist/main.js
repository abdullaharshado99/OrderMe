"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const express_1 = require("express");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const BODY_LIMIT = '5gb';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    app.use((0, express_1.json)({ limit: BODY_LIMIT }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: BODY_LIMIT }));
    // app.enableCors({
    //   origin: true, // process.env.FRONTEND_URL,
    //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    //   allowedHeaders: ['Content-Type', 'Authorization'],
    //   credentials: true,
    // });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Live With Quran API')
        .setDescription('Authentication and REST APIs for Live With Quran')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter session token',
        in: 'header',
    }, 'session_token')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter access token',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const server = await app.listen(3000, '0.0.0.0');
    server.requestTimeout = 3_600_000;
    server.headersTimeout = 3_610_000;
    server.keepAliveTimeout = 120_000;
}
bootstrap();
//# sourceMappingURL=main.js.map