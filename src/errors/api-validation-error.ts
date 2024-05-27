import { ValidationError } from "class-validator";
import { ApiError } from "./api-error";

export class ApiValidationError extends ApiError<ValidationError[]> {
    constructor(errors: ValidationError[]) {
        super({
            message: "Validation Error!",
            detail: errors
        });
    }
}