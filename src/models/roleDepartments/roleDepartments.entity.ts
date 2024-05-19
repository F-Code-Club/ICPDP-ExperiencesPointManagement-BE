import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleDepartments {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    point: number;

    @Column()
    name: string;
}