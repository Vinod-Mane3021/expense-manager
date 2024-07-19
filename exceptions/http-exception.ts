import HttpStatusCode from "@/constants/http-status-code";
import { HttpStatus } from "@/constants/response-status";
import { HTTPExceptionProps } from "@/types/exception-props";
import { Context } from "hono";
import { HTTPException as HonoHTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { NextResponse } from "next/server";

class HTTPException extends HonoHTTPException {
    constructor(
        c: Context,
        {
            status,
            statusCode,
            message,
        }: HTTPExceptionProps
    ) {
        super(statusCode, {
            res: c.json(
                {
                    success: false,
                    status,
                    statusCode,
                    error: message,
                },
                statusCode
            ),
        });
    }
}

export { HTTPException };

// new NextResponse(
//     JSON.stringify({
//         status: status,
//         statusCode: statusCode,
//         error: message,
//     }),
//     {
//         status: statusCode,
//         headers: { "Content-Type": "application/json" },
//     }
// ),
