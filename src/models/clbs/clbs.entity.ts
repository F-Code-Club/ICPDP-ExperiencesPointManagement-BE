import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointBoard } from "../point-board/pointBoard.entity";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";
import { Users } from "../users/users.entity";

@Entity()
export class Clbs {
    @PrimaryGeneratedColumn("uuid")
    clubID: string;

    @Column({ unique: true })
    name: string;

    @Column()
    avt: string;

    @Column({ default: true })
    active: boolean;

    @OneToOne(() => Users)
    @JoinColumn({ name: "userId" })
    user: Users;

    @CreateDateColumn()
    createdAt?: Date;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.clb)
    pointBoard?: PointBoard[]

    @ManyToMany(() => Students)
    @JoinTable()
    students?: Students[]

    @OneToMany(() => Events, (event) => event.clb)
    event?: Events[]
}