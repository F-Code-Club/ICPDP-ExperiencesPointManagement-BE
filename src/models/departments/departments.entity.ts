import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Students } from "../students/students.entity";
import { PointBoard } from "../point-board/pointBoard.entity";
import { Events } from "../event/event.entity";
import { Users } from "../users/users.entity";

@Entity()
export class Departments {
    @PrimaryGeneratedColumn("uuid")
    departmentID: string;

    @Column({ unique: true })
    name: string;

    @Column()
    avatar: string;

    @Column({ default: true })
    active: boolean;

    @OneToOne(() => Users)
    @JoinColumn({ name: "userId" })
    user: Users;

    @CreateDateColumn()
    createdAt?: Date;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.department)
    pointBoard?: PointBoard[]

    @ManyToMany(() => Students)
    @JoinTable({
        name: "departmentmember",
        joinColumn: {
            name: "departmentID",
            referencedColumnName: "departmentID"
        },
        inverseJoinColumn: {
            name: "studentID",
            referencedColumnName: "studentID"
        }
    })
    students?: Students[]

    @OneToMany(() => Events, (event) => event.department)
    event?: Event[]
}