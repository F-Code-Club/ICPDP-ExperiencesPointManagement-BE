import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EventStudent } from "../eventPoint/event-point.entity";

@Entity()
export class Students {
    @PrimaryColumn({ unique: true })
    studentID: string;

    @Column()
    name: string;

    @OneToMany(() => EventStudent, (eventStudent) => eventStudent.student)
    eventStudent?: EventStudent[]
}