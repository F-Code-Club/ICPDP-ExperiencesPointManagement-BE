import { Expose, Type } from "class-transformer";
import { ActivityPoint, CitizenshipPoint, OrganizationPoint, StudyPoint } from "../final-point.entity";


export class FinalPointResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    @Type(() => StudyPoint)
    studyPoint: StudyPoint;

    @Expose()
    totalStudyPoint: number;

    @Expose()
    @Type(() => ActivityPoint)
    activityPoint: ActivityPoint;

    @Expose()
    totalActivityPoint: number;

    @Expose()
    @Type(() => CitizenshipPoint)
    citizenshipPoint: CitizenshipPoint;

    @Expose()
    totalCitizenshipPoint: number;

    @Expose()
    @Type(() => OrganizationPoint)
    organizationPoint: OrganizationPoint;

    @Expose()
    totalOrganizationPoint: number;

    @Expose()
    totalFinalPoint: number;

    @Expose()
    classification: string;
}