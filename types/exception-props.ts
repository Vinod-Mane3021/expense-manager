import HttpStatusCode from "@/constants/http-status-code";
import { HttpStatus } from "@/constants/response-status";

export interface HTTPExceptionProps {
    status: HttpStatus;
    statusCode: HttpStatusCode;
    message: string;
}