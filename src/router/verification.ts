import { verificationStudent } from "controller/verification";
import express from "express";

export default (router: express.Router) => {
    router.post("/verify-student", verificationStudent);
};
