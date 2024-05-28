export class ApiError<T = any> {
    message: string;
    detail: T | T[];

    constructor(props: ApiError) {
        Object.assign(this, props);
    }
}