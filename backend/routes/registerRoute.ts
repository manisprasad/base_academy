import express from 'express'
import handleRegister from '../controller/registerController';

export const registerRoute = express.Router();
registerRoute.post('/', handleRegister)