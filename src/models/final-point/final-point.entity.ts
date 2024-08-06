import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Semesters } from "../semesters/semesters.entity";
import { Students } from "../students/students.entity";

export class StudyPoint {
    @Column({ default: 0 })
    extraPoint: number;

    @Column({ default: '' })
    comment: string;
}

export class ActivityPoint {
    @Column({ default: 0 })
    extraPoint1: number;

    @Column({ default: 0 })
    extraPoint2: number;

    @Column({ default: 0 })
    extraPoint3: number;

    @Column({ default: 0 })
    extraPoint4: number;

    @Column({ default: 0 })
    extraPoint5: number;
}

export class CitizenshipPoint {
    @Column({ default: 0 })
    extraPoint: number;

    @Column({ default: '' })
    comment: string;
}

export class OrganizationPoint {
    @Column({ default: 0 })
    extraPoint: number;

    @Column({ default: '' })
    comment: string;
}

@Entity()
export class FinalPoint {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column(type => StudyPoint)
    studyPoint: StudyPoint;

    @Column(type => ActivityPoint)
    activityPoint: ActivityPoint;

    @Column(type => CitizenshipPoint)
    citizenshipPoint: CitizenshipPoint;

    @Column(type => OrganizationPoint)
    organizationPoint: OrganizationPoint;

    @ManyToOne(() => Semesters, (semester) => semester.finalPoint)
    @JoinColumn({ name: "semesterID" })
    semester: Semesters;

    @ManyToOne(() => Students, (student) => student.finalPoint)
    @JoinColumn({ name: "studentID" })
    student: Students;
};