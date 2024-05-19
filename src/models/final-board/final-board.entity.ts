import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Semesters } from "../semesters/semesters.entity";
import { Students } from "../students/students.entity";

@Entity()
export class FinalBoard {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => Semesters)
    @JoinColumn()
    semester: Semesters;

    @ManyToMany(() => Students)
    @JoinTable()
    student: Students[]
};