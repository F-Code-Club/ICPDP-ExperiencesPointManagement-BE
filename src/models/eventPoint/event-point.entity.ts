import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";

@Entity({ name: "eventpoint" })
export class EventPoint {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    role: string;

    @Column()
    point: number;  

    @CreateDateColumn()
    createdAt?: Date;

    @ManyToOne(() => Students, (student) => student.eventPoint)
    @JoinColumn({ name: "studentID" })
    student: Students

    @ManyToOne(() => Events, (event) => event.eventPoint)
    @JoinColumn({ name: "eventID" })
    event: Events
}