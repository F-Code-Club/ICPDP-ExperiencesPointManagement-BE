import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointBoard } from "../point-board/pointBoard.entity";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";
import { Users } from "../users/users.entity";

@Entity()
export class Clbs {
    @PrimaryGeneratedColumn("uuid")
    clubId: string;

    @Column({ unique: true })
    name: string;

    @Column()
    avt: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: "userId" })
    userId: Users;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.clb)
    pointBoard?: PointBoard[]

    @ManyToMany(() => Students)
    @JoinTable()
    students?: Students[]

    @OneToMany(() => Events, (event) => event.clb)
    event?: Events[]
}