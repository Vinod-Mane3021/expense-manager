import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { getAuth } from "@hono/clerk-auth";
import { Context, Next } from "hono";

export const authorizeUserMiddleware = async (c: Context, next: Next) => {

  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json(
      { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
      HttpStatusCode.UNAUTHORIZED
    );
  }

  // Initialize auth object if not already present
  if (!c.auth) {
    c.auth = {};
  }
  // Attach userId to the context
  c.auth.userId = auth.userId;
  // Proceed to the next middleware or route handler
  await next();
};

