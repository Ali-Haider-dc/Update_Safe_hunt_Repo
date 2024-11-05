import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddResetTokenFieldsToUser1685749200732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'resetToken',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'resetTokenExpires',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'resetToken');
    await queryRunner.dropColumn('user', 'resetTokenExpires');
  }
}
