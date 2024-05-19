import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EventStudent } from "../eventStudent/event-student.entity";

@Entity()
export class Students {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column()
    name: string;

    @OneToMany(() => EventStudent, (eventStudent) => eventStudent.student)
    eventStudent: EventStudent[]
}