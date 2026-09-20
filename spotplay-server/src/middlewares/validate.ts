import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "Zod";

export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Data validation error",
          errors: error,
        });
        return;
      }
      next(error);
    }
  };
};
