import express from 'express';
import handleLogin from '../controller/authControlle';

export const authRoute = express.Router();

authRoute.post('/', handleLogin)