import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndOtpToUsers1723205928502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN status VARCHAR(50) DEFAULT 'inactive',
            ADD COLUMN otp VARCHAR(6)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN status,
            DROP COLUMN otp
        `);
    }

}
