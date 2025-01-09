import { DataSource } from 'typeorm';

// ~Database config
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'postgresexpress',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'accounts_db',
    synchronize: true,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts']
});