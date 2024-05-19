import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clbs } from "../clbs/clbs.entity";
import { Departments } from "../departments/departments.entity";
import { EventStudent } from "../eventStudent/event-student.entity";

@Entity()
export class Events {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Clbs, (clb) => clb.event)
    clb: Clbs

    @ManyToOne(() => Departments, (department) => department.event)
    department: Departments

    @OneToMany(() => EventStudent, (eventStudent) => eventStudent.event)
    eventStudent: EventStudent[]
}