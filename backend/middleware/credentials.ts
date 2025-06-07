// import { NextFunction ,Response, Request} from "express";
// import { origins } from "../config/allowedOrigin";

// origins
// const credentials = (req:Request, res:Response, next:NextFunction) => {
//     const origin = req.headers.origin;
//     if (origin !== undefined && origins.includes(origin)) {
//         res.header('Access-Control-Allow-Credentials', "true");
//     }
//     next();
// }

// module.exports = credentials