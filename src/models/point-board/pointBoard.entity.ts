import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Semesters } from "../semesters/semesters.entity";
import { Clbs } from "../clbs/clbs.entity";
import { Departments } from "../departments/departments.entity";
import { Events } from "../event/event.entity";

@Entity()
export class PointBoard {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    openAt: Date;

    @Column()
    closeAt: Date;

    @ManyToOne(() => Semesters, (semester) => semester.pointBoard)
    semester: Semesters

    @ManyToOne(() => Clbs, (clb) => clb.pointBoard)
    clb: Clbs

    @ManyToOne(() => Departments, (department) => department.pointBoard)
    department: Departments

    @ManyToMany(() => Events)
    @JoinTable()
    event: Events[]
}