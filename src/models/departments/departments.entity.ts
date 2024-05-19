import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Students } from "../students/students.entity";
import { PointBoard } from "../point-board/pointBoard.entity";
import { Events } from "../event/event.entity";

@Entity()
export class Departments {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    avt: string;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.department)
    pointBoard: PointBoard[]

    @ManyToMany(() => Students)
    @JoinTable()
    students: Students[]

    @OneToMany(() => Events, (event) => event.department)
    event: Event[]
}