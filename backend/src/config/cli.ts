import { CliModule } from './cli.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(CliModule, {
    errorHandler: (err) => {
      console.error(err);
      process.exit(1);
    },
  });
}

bootstrap();