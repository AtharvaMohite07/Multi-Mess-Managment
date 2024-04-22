import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import useAuth from "../../Auth/useAuth";

const QRCodes = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const {auth} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function isValidDataURI(str) {
    const dataURIRegex = /^data:[a-z]+\/[a-z]+;base64,/;
    return dataURIRegex.test(str);
  }

  function isValidURL(str) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  useEffect(() => {
    const fetchQrCodes = () => {
      return axios.get(`/qrcodes/showQRCode/${auth.userId}`, {
        withCredentials: true,
      })
          .then((response) => {
            console.log("Response:", response.data);
            setQrCodes(response.data);
          })
          .catch((err) => {
            console.error("Error fetching QR codes:", err);
            setError("Failed to load QR codes.");
          })
          .finally(() => {
            setIsLoading(false);
          });
    };

    fetchQrCodes();
  }, [auth.userId]);


  console.log("QR Codes:", qrCodes); // Log QR codes data

  return (
      <div className="profilescanner m-auto flex items-center justify-center h-[40rem]">
        <div className="scanner flex-[1] h-[30rem] flex items-center justify-center">
          {qrCodes.length > 0 ? (
              qrCodes.map((qrCode, index) => (
                  <div key={index} className="qr-code">
                    {/* Check if qrCode is a valid data URI or URL */}
                    {isValidDataURI(qrCode) || isValidURL(qrCode) ? (
                        <img src={qrCode} alt={`QR Code ${index}`} className="qr-code-img"
                             onError={(e) => {
                               e.target.src = '/path/to/default/image.png';
                             }}/>
                    ) : (
                        <p>Invalid QR code data.</p>
                    )}
                  </div>
              ))
          ) : (
              <h1 className="text-black text-center text-4xl font-semibold">No QR codes available.</h1>
          )}
        </div>
      </div>
  );
};
export default QRCodes;