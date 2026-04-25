import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
