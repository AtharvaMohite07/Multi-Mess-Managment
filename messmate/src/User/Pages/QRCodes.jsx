import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import useAuth from "../../Auth/useAuth";
import QRCode from "react-qr-code";
const QRCodes = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQrCodes = async () => {
            try {
                const response = await axios.get(`/qrcodes/showQRCode/${auth.userId}`, {
                    withCredentials: true,
                });
                setQrCodes(response.data.qrCodes || []); // Ensure qrCodes is initialized as an array
                setIsLoading(false);
                setError(null);
            } catch (error) {
                console.error("Error fetching QR codes:", error);
                setError("Failed to load QR codes.");
                setIsLoading(false);
            }
        };

        fetchQrCodes();
    }, [auth.userId]);

    console.log("QR Codes:", qrCodes);
    return (
        <div className="profilescanner m-auto flex items-center justify-center h-[40rem]">
            <div className="scanner flex-[1] h-[30rem] flex items-center justify-center">
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : error ? (
                    <h1>Error: {error}</h1>
                ) : qrCodes.length === 0 ? (
                    <h1 className="text-black text-center text-4xl font-semibold">
                        No QR codes available.
                    </h1>
                ) : (
                    <div>
                        {qrCodes.map((qrCode, index) => (
                            <div key={index} className="qr-code">
                                <h2>{qrCode.mealType}</h2>
                                <p>Validity Date: {new Date(qrCode.validityDate).toLocaleString()}</p>
                                {/* Render QR code using react-qr-code directly from base64-encoded text */}
                                <QRCode value={qrCode.qrCode} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodes;