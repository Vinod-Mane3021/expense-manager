import { Context, MiddlewareHandler, Next } from "hono";
import { ZodError } from "zod";

export const zodErrorHandlerMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
    console.log("Validation failed. Please check your input data 2200")
  try {
    await next();
    if(c.error) {
        console.log("Validation failed. Please check your input data 1111")
    }
    if(c.res) {
        console.log("c.res ", c.res)
    }
    // c.json({name: "vinod"}, 400)
  } catch (err) {
    console.log("Validation failed. Please check your input data 9999")
    if (err) {
      const customError = {
        success: false,
        error: {
          message: "Validation failed. Please check your input data.",
        //   details: err.errors.map((issue) => ({
        //     path: issue.path.join("."),
        //     message: issue.message,
        //   })),
        },
      };
      return c.json(customError, 400);
    }
    throw err; // Re-throw the error if it's not a ZodError
  }
};
