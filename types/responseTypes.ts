import HttpStatusCode from "@/constants/http-status-code";
import { HttpStatus } from "@/constants/response-status";

export interface ApiResponseType {
    success?: boolean;
    status?: HttpStatus;
    statusCode?: HttpStatusCode;
    message?: string;
    error?: string;
    data?: any;
}
