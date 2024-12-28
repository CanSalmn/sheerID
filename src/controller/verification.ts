import { verification } from "business/verification";
import express from "express";

export const verificationStudent = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const params = {
            programId: process.env.SHEERID_PROGRAM_ID,
            metadata: {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                university: req.body.university,
            },
            document: req.file,
        };

        const verificationResponse: any = await verification(params);
        return res.status(200).json(verificationResponse);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
