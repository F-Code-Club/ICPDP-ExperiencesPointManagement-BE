import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointBoard } from "../point-board/pointBoard.entity";

@Entity()
export class Semesters {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    year: number;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.semester)
    pointBoard: PointBoard[]
}