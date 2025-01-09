import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    account_id: number;

    @Column({ type: 'varchar', length: 255 })
    firestore_id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;
}
