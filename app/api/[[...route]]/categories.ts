import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  categoryNameSchema,
  deleteCategorySchema,
  categoryIdSchema,
} from "@/validations/schema/categories";
import { authorizeUserMiddleware } from "@/middlewares/auth";

const app = new Hono()

  // To get all categories
  .get("/", clerkMiddleware(), authorizeUserMiddleware, async (c) => {
    const data = await db.categories.findMany({
      where: {
        userId: c.auth.userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        updateAt: "desc",
      },
    });

    return c.json({ data });
  })

  // to get category by id
  .get(
    "/:id",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("param", categoryIdSchema),
    async (c) => {

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const data = await db.categories.findUnique({
        where: {
          userId: c.auth.userId,
          id: Number(id),
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!data) {
        return c.json({ error: "Not found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  )

  // to create a new category
  .post(
    "/create",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("json", categoryNameSchema),
    async (c) => {

      const { name } = c.req.valid("json");

      if (!name) {
        return c.json({ error: "Missing name" }, HttpStatusCode.BAD_REQUEST);
      }

      try {
        const existingCategory = await db.categories.findFirst({
          where: {
            name,
            userId: c.auth.userId,
          },
        });
        if (existingCategory) {
          return c.json(
            { error: "Category with this name is already exist" },
            HttpStatusCode.CONFLICT
          );
        }

        const category = await db.categories.create({
          data: {
            name,
            userId: c.auth.userId!,
          },
        });
        return c.json({ category });
      } catch (error) {
        return c.json(
          { error: "Failed to create category" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to delete an existing category
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", deleteCategorySchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { ids } = c.req.valid("json");

      const { count } = await db.categories.deleteMany({
        where: {
          userId: auth.userId,
          id: {
            in: ids,
          },
        },
      });

      return c.json({ count });
    }
  )

  // to update the category name
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", categoryIdSchema),
    zValidator("json", categoryNameSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const { name } = c.req.valid("json");
      if (!name) {
        return c.json(
          { error: "Missing account name" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const data = await db.categories.update({
        where: {
          userId: auth.userId,
          id: Number(id),
        },
        data: {
          name,
        },
      });

      if (!data) {
        return c.json({ error: "Not Found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  );

export default app;
