import express from 'express';
import { handleGetMe } from '../controller/getMe';


export const getMeRoute = express.Router();
getMeRoute.get('/', handleGetMe);