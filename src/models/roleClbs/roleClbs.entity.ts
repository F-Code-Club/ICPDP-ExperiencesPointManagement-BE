import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleClbs {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    point: number;

    @Column({
        unique: true
    })
    name: string;
}