import { Students } from "src/models/students/students.entity";
import { ActivityPoint, CitizenshipPoint, OrganizationPoint, StudyPoint } from "../final-point.entity";

export class FinalPointAddDto {
    studentID: string;

    student?: Students;

    semesterID?: string;
    
    studyPoint?: StudyPoint;
    
    activityPoint?: ActivityPoint;
    
    citizenshipPoint?: CitizenshipPoint;

    organizationPoint?: OrganizationPoint;
}