import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clbs } from "../clbs/clbs.entity";
import { Departments } from "../departments/departments.entity";
import { EventStudent } from "../eventStudent/event-student.entity";

@Entity()
export class Events {
    @PrimaryGeneratedColumn("uuid")
    eventID: string;

    @Column()
    eventName: string;

    @Column()
    semester: string;

    @Column()
    year: number;

    @ManyToOne(() => Clbs, (clb) => clb.event)
    @JoinColumn({ name: "clubID" })
    clb: Clbs

    @ManyToOne(() => Departments, (department) => department.event)
    @JoinColumn({ name: "departmentID" })
    department: Departments

    @OneToMany(() => EventStudent, (eventStudent) => eventStudent.event)
    eventStudent: EventStudent[]
}