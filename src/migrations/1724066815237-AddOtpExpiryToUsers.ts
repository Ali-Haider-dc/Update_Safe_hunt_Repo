import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOtpExpiryToUsers1614792031234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'otpexpiry',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'otpexpiry');
  }
}
