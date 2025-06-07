import express from 'express';
import verifyJWT from '../middleware/verifyJWT'; 
import { handleGetAllPurchaseCourse, handleGetPurchaseCourseById } from '../controller/studentController';

export const myCourseRoute = express.Router();

myCourseRoute.get('/', verifyJWT, handleGetAllPurchaseCourse)
myCourseRoute.get('/:id', verifyJWT, handleGetPurchaseCourseById);