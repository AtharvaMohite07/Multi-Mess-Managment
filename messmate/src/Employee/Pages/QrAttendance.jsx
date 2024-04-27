import React, { useState } from "react";
import axios from "../../Api/axios";
import QrReader from "react-qr-scanner";
import Alert from "../../Components/Alert";
import useAuth from "../../Auth/useAuth";

const QrAttendance = () => {
  const [alert, setAlert] = useState({
    mode: false,
    message: "",
    type: "bg-[red]",
  });

  const [userId, setUserId] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [type, setType] = useState(null);
  const { auth } = useAuth();
  const messId = auth.messId;
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

        // Extract the text property from the result object
        const qrCodeText = result.text;

        // Make an axios POST request to validate the scanned QR code
        const response = await axios.post(`/qrcodes/validate`, { code: qrCodeText });
        console.log(response.data.message); // Log the validation message

        // Handle UI updates based on the response if needed
        if (response.data.success) {
          setAlert({
            mode: true,
            message: response.data.message ,
            type: "bg-[green]",
          });
          setUserId(response.data.userId);
          setPlanId(response.data.planId);
          setType(response.data.type);
          await takeAttendance();
        } else if (response.data.alreadyUsed) {
          // Handle already used scenario
          setAlert({
            mode: true,
            message: "QR code already used. Attendance already marked.",
            type: "bg-[orange]", // Or any appropriate color for already used
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

  const takeAttendance = async (userId, planId) => {
    try {
      console.log("Inside breakfast");
      const verifyThing = type;
      console.log(verifyThing, userId, planId);
      const response = await axios.patch(
          `dailyentry/updateentry`,
          JSON.stringify({ userId, verifyThing, planId , messId}),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
      );
      console.log("See daily entry");
      console.log(response);
      // alert(response.data.message);
      setAlert({
        mode: true,
        message: response.data.message,
        type: "bg-[green]",
      });
    } catch (error) {
      if (!error?.response) {
        console.log("No Server Response");
      }
          // else if(error.response?.status === 400)
          // {

      // }
      else {
        // console.log("Deletion Failed");
        console.log(error.message);
        console.log(error.response.data.message);
        const message = error.response.data.message;
        setAlert({
          mode: true,
          message: message,
          type: "bg-[red]",
        });
      }
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
