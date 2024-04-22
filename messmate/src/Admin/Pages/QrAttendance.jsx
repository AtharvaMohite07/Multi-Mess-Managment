import React, { useState } from "react";
import axios from "axios";
import QrReader from "react-qr-reader";
import Alert from "../../Components/Alert";

const QrAttendance = () => {
    const [alert, setAlert] = useState({
        mode: false,
        message: "",
        type: "bg-[red]",
    });

    const handleErrorWebCam = (error) => {
        console.error(error); // Log the error message
        // Handle error scenarios if needed
    };

    const handleScanWebCam = async (result) => {
        try {
            if (result) {
                setAlert({
                    mode: true,
                    message: `Scanned Code: ${result}`,
                    type: "bg-[blue]", // You can customize the color
                });
                const response = await axios.post(`/qrcodes/validate`, {code: result});
                console.log(response.data.message); // Log the validation message
                // Handle UI updates based on the response if needed
                if (response.data.success) { // Assuming success property in response
                    setAlert({
                        mode: true,
                        message: response.data.message || "QR code validated successfully!",
                        type: "bg-[green]", // Success message type
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

            <div className="flex items-center justify-center h-screen">
                {/* Your QR scanner component */}
                <QrReader
                    delay={300}
                    onError={handleErrorWebCam}
                    onScan={handleScanWebCam}
                    style={{ width: "100%", height: "100%" }}
                    cameraContainerStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000",
                    }}
                    cameraStyle={{
                        width: "90%",
                        height: "90%",
                        objectFit: "cover",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                    }}
                />
            </div>
        </div>
    );
};

export default QrAttendance;