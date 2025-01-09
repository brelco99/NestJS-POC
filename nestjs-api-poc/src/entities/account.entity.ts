import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    accountId: number;

    @Column()
    firestoreId: string;

    @Column()
    name: string;

    @Column({ default: "newfieldtest" })
    newfieldformigration: string;
}

