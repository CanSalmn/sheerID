import { verificationStudent } from "../controller/verification";
import express from "express";
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

export default (router: express.Router) => {
    router.post("/verify-student", upload.single('pdfFile'), verificationStudent);
};
