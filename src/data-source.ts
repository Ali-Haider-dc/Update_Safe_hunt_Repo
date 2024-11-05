import { DataSource } from 'typeorm';
import { UserEntity } from './typeorm/entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'mysql', // or 'mysql', etc.
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'safehunt',
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

