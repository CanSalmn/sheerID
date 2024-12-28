import verification from './verification';
import express from 'express'

const router = express.Router();

export default (): express.Router => {
    verification(router)
    return router;
}