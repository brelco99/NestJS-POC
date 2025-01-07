import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';

const AppDataSource = new DataSource({
 type: 'postgres',
 host: 'localhost',
 port: 5432,
 username: 'postgres',
 password: 'postgres',
 database: 'accounts_db',
 entities: [Account],
 migrations: ['src/migrations/*.ts'],
 migrationsTableName: 'migrations'
});

export default AppDataSource;