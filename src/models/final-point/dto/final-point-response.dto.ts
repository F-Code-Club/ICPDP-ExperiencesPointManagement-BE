import { Expose, Type } from "class-transformer";

class StudyPoint {
    @Expose()
    extraPoint: number;

    @Expose()
    comment: string;
}

class ActivityPoint {
    @Expose()
    extraPoint1: number;

    @Expose()
    extraPoint2: number;

    @Expose()
    extraPoint3: number;

    @Expose()
    extraPoint4: number;

    @Expose()
    extraPoint5: number;
}

class CitizenshipPoint {
    @Expose()
    extraPoint: number;

    @Expose()
    comment: string;
}

class OrganizationPoint {
    @Expose()
    extraPoint: number;

    @Expose()
    comment: string;
}

export class FinalPointResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    @Type(() => StudyPoint)
    studyPoint: StudyPoint;

    @Expose()
    @Type(() => ActivityPoint)
    activityPoint: ActivityPoint;

    @Expose()
    @Type(() => CitizenshipPoint)
    citizenshipPoint: CitizenshipPoint;

    @Expose()
    @Type(() => OrganizationPoint)
    organizationPoint: OrganizationPoint;
}