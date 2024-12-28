import axios from "axios";
const FormData = require("form-data");

const SHEERID_API_KEY = process.env.SHEERID_API_KEY;
const SHEERID_BASE_URL = "https://services.sheerid.com/rest/v2";

export const verification = async (params: {
    programId: string;
    metadata: {
        email: string;
        firstName: string;
        lastName: string;
        birthDate: string;
        university: string;
    };
}) => {
    try {
        const verificationResponse = await axios.post(
            `${SHEERID_BASE_URL}/verification/program/${params.programId}/step/collectStudentPersonalInfo`,
            {
                firstName: params.metadata.firstName,
                lastName: params.metadata.lastName,
                birthDate: params.metadata.birthDate,
                email: params.metadata.email,
                organization: {
                    idExtended: 1234, //university id gelecek onada ne verirsek bize kalmış
                    name: params.metadata.university,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${SHEERID_API_KEY}`,
                },
            }
        );

        const verificationId = verificationResponse.data.verificationId;
        if (document && verificationId) {
            const uploadDocumentResult = await uploadDocumentForVerification(
                document,
                verificationId
            );
            if (uploadDocumentResult.isSuccessful) {
                const verificationCheck = await checkVerificationStatus(verificationId);
                if (verificationCheck.isSuccessful) {
                    return {
                        isSuccessful: true,
                        responseData: verificationCheck.responseData,
                    };
                } else {
                    return {
                        isSuccessful: false,
                        responseData: [],
                    };
                }
            }
        }
    } catch (error) {
        return {
            isSuccessful: false,
            responseData: [],
        };
    }
};

export const uploadDocumentForVerification = async (
    document: any,
    verificationId: string
) => {
    try {
        const formData = new FormData();
        formData.append("file", document);
        const response = await axios.post(
            `${SHEERID_BASE_URL}/verification/${verificationId}/step/docUpload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${SHEERID_API_KEY}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === 200) {
            return {
                isSuccessful: true,
                responseData: response.data,
            };
        }
    } catch (error) {
        return {
            isSuccessful: true,
            error: error,
        };
    }
};

export const checkVerificationStatus = async (verificationId: string) => {
    try {
        const response = await axios.post(
            `${SHEERID_BASE_URL}/verification/${verificationId}`,
            {
                headers: {
                    Authorization: `Bearer ${SHEERID_API_KEY}`,
                },
            }
        );
        if (response.data.currentStep === "success") {
            return {
                isSuccessful: true,
                responseData: response.data,
            };
        }
    } catch (error) {
        return {
            isSuccessful: true,
            error: error,
        };
    }
};
