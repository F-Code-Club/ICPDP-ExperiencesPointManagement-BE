import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleClbs {
    @PrimaryGeneratedColumn("uuid")
    roleClubID: string;

    @Column()
    point: number;

    @Column({
        unique: true
    })
    role: string;
}