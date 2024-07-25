import { ApiResponseType } from "@/types/responseTypes";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { NextResponse } from "next/server";

/**
 * Function to send the response in the API workflow.
 * This function takes in an object of type ApiResponseType, which contains
 * various properties representing the response data such as success status,
 * status code, message, etc. It constructs a NextResponse object with the
 * provided data and returns it.
 *
 */
export const apiResponse = (
    c: Context,
    { success, status, statusCode, message, error, data }: ApiResponseType
) => {
    // Constructing the response object with the provided data
    const response: ApiResponseType = {
        success,
        status,
        statusCode,
        message,
        error,
        data,
    };
    // Returning a NextResponse object with JSON data and status code
    return c.json(response, { status: statusCode });
};

// const apiResponse = (
//   c: Context,
//   {
//       options,
//     }: {
//         options: Object;
//     },
//     statusCode: StatusCode,̥̥
// ) => {
//   return c.json(options, statusCode);
// };

// export { apiResponse };
