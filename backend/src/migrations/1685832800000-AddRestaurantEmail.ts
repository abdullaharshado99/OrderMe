import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRestaurantEmail1685832800000 implements MigrationInterface {
  name = 'AddRestaurantEmail1685832800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" ADD COLUMN "email" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "email"`);
  }
}
