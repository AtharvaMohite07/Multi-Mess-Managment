import React, { useState } from "react";
import axios from "axios";
import QrReader from "react-qr-scanner";
import Alert from "../../Components/Alert";

const QrAttendance = () => {
    const [alert, setAlert] = useState({
        mode: false,
        message: "",
        type: "bg-[red]",
    });

    const [cameraError, setCameraError] = useState(false);

    const handleErrorWebCam = (error) => {
        console.error(error);
        setCameraError(true); // Set camera error flag to true
    };

    const handleScanWebCam = async (result) => {
        try {
            if (result) {
                // Process the scanned QR code text
                console.log("Scanned Code:", result);

                // Here you can proceed with the scanned QR code text for further processing or validation

                // For example, you can make an axios POST request to validate the scanned QR code
                const response = await axios.post(`/qrcodes/validate`, { code: result });
                console.log(response.data.message); // Log the validation message

                // Handle UI updates based on the response if needed
                if (response.data.success) {
                    setAlert({
                        mode: true,
                        message: response.data.message || "QR code validated successfully!",
                        type: "bg-[green]",
                    });
                } else {
                    setAlert({
                        mode: true,
                        message: response.data.message || "QR code validation failed.",
                    });
                }
            }
        } catch (error) {
            console.error('Error validating QR code:', error);
            // Handle error scenarios
        }
    };

    return (
        <div>
            {alert.mode && <Alert alert={alert} setAlert={setAlert} />}
            {cameraError && <div className="flex items-center justify-center h-screen">No camera access</div>}
            {!cameraError && (
                <div className="flex items-center justify-center h-screen">
                    <QrReader
                        delay={300}
                        onError={handleErrorWebCam}
                        onScan={handleScanWebCam}
                        style={{ width: "100%", height: "100%" }}
                        facingMode={"environment"} // Use the back camera if available
                        legacyMode={true} // Use the legacy mode to improve compatibility
                        resolution={1200} // Higher resolution for better scanability (adjust as needed)
                    />
                </div>
            )}
        </div>
    );
};

export default QrAttendance;
