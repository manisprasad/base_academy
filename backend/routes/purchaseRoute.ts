import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { handleCoursePurchase } from "../controller/studentController";

export const purchaseRoute = express.Router();

purchaseRoute.post('/:id', verifyJWT, handleCoursePurchase)