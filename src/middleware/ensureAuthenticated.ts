import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string
}


export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        })
    }

    const [,token ] = authToken.split(" ")
    try{
        const { sub } = verify(token, "bb9ef910b11e3955b6f340e43dde6787") as IPayload

        request.user_id = sub

        return next()
    }catch(err) {
        return response.status(401).json({ errorCode: "token.expired" })
    }
}