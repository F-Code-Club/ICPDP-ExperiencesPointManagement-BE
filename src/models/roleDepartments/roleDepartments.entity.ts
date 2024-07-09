import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleDepartments {
    @PrimaryGeneratedColumn("uuid")
    roleDepartmentID: string;

    @Column()
    point: number;

    @Column({
        unique: true,
    })
    role: string;
}