import axios from "axios";
import express from "express";
import fs from 'fs'
import pdf from 'pdf-parse'

export const verification = async (
    req: express.Request,
    res: express.Response) => {
    try {

        const filePath = req.file.path;
        console.log('Yüklenen dosya:', filePath);

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const text = data.text;
        console.log('PDF Metni:', text);


        const keywords = {
            adSoyad: /Adı\s*\/\s*Soyadı\s*:\s*([A-Za-zÇçĞğİıÖöŞşÜü\s]+)/,
            ogrencilikDurumu: /Öğrencilik\s*Durumu\s*:\s*([A-Za-zÇçĞğİıÖöŞşÜü\s]+)/
        };

        const result: any = {};

        for (const [key, regex] of Object.entries(keywords)) {
            console.log("key", key, regex)
            const match = text.match(regex);
            console.log("match ", match)
            if (match && match[1]) {
                result[key] = match[1].trim();
            } else {
                result[key] = null;
            }
        }

        if (result.ad && result.soyad && result.ogrencilikDurumu) {
            res.status(200).json({
                success: true,
                message: 'success',
                data: result
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'error',
                data: result
            });
        }

    } catch (error) {
        return {
            isSuccessful: false,
        };
    }
};

