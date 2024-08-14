import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clbs } from "../clbs/clbs.entity";
import { Departments } from "../departments/departments.entity";
import { EventPoint } from "../eventPoint/event-point.entity";

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

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => Clbs, (clb) => clb.event)
    @JoinColumn({ name: "clubID" })
    club: Clbs

    @ManyToOne(() => Departments, (department) => department.event)
    @JoinColumn({ name: "departmentID" })
    department: Departments

    @OneToMany(() => EventPoint, (eventPoint) => eventPoint.event)
    eventPoint?: EventPoint[]

    @CreateDateColumn()
    createdAt?: Date;
}