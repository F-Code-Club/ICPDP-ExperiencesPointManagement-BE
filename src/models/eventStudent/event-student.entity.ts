import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";

@Entity({ name: "eventstudent" })
export class EventStudent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    role: string;

    @Column()
    studentName: string;

    @Column()
    point: number;  

    @ManyToOne(() => Students, (student) => student.eventStudent)
    @JoinColumn({ name: "studentID" })
    student: Students

    @ManyToOne(() => Events, (event) => event.eventStudent)
    @JoinColumn({ name: "eventID" })
    event: Events
}