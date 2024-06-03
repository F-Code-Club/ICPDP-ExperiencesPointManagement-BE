import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointBoard } from "../point-board/pointBoard.entity";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";

@Entity()
export class Clbs {
    @PrimaryGeneratedColumn("uuid")
    clubId: string;

    @Column({ unique: true })
    name: string;

    @Column()
    avt: string;

    @Column()
    userId: string;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.clb)
    pointBoard?: PointBoard[]

    @ManyToMany(() => Students)
    @JoinTable()
    students?: Students[]

    @OneToMany(() => Events, (event) => event.clb)
    event?: Events[]
}