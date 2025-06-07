import express from 'express';
import { handleRefreshToken } from '../controller/refreshTokenController';

export const refreshRoute = express.Router()

refreshRoute.get('/', handleRefreshToken);