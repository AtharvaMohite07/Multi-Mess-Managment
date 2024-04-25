import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import useAuth from "../../Auth/useAuth";
import QRCode from "react-qr-code";
const QRCodes = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState("breakfast");

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
    const filteredQRCodes = qrCodes.filter(
        (qrCode) => qrCode.mealType === selectedMealType
    );
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Pad with 0 if single digit
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month (0-indexed) and pad
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    console.log("QR Codes:", qrCodes);
    return (
        <div className="profilescanner m-auto flex items-center justify-center h-[40rem]">
            <div className="scanner flex-[1] h-[30rem] flex items-center justify-center">
                {/* Meal type buttons */}
                <div className="mb-4">
                    <button className="btn" onClick={() => setSelectedMealType("breakfast")}>
                        Breakfast
                    </button>
                    <button className="btn" onClick={() => setSelectedMealType("lunch")}>
                        Lunch
                    </button>
                    <button className="btn" onClick={() => setSelectedMealType("dinner")}>
                        Dinner
                    </button>
                </div>

                {/* QR code display */}
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : error ? (
                    <h1>Error: {error}</h1>
                ) : filteredQRCodes.length === 0 ? (
                    <h1 className="text-black text-center text-4xl font-semibold">
                        No QR code available for {selectedMealType}.
                    </h1>
                ) : (
                    <div className="qr-code">
                        <h2>{filteredQRCodes[0].mealType}</h2>
                        <p>Validity Date: {formatDate(filteredQRCodes[0].validityDate).toLocaleString()}</p>
                        <QRCode value={filteredQRCodes[0].qrCode} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodes;