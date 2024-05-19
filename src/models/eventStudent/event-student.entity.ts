import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Students } from "../students/students.entity";
import { Events } from "../event/event.entity";

@Entity()
export class EventStudent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    roleForTheEvent: string;

    @ManyToOne(() => Students, (student) => student.eventStudent)
    student: Students

    @ManyToOne(() => Events, (event) => event.eventStudent)
    event: Events
}