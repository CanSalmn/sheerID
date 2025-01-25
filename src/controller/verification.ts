import { verification } from "../business/verification";
import express from "express";

export const verificationStudent = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        
        const verificationResponse: any = await verification(req,res);
        return res.status(200).json(verificationResponse);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
