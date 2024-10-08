import { NextFunction, Request, Response } from "express";


export const errorMiddleWaresHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`We have an error: ${error.message}`);
  res.status(500).json({ message: "Internal server error" });
};
