import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import useAuth from "../../Auth/useAuth";

const QRCodes = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const response = await axios.get(`/qrcode/getUserQrCodes/${auth.userId}`, {
          withCredentials: true,
        });
        setQrCodes(response.data);
      } catch (err) {
        console.error("Error fetching QR codes:", err);
        // Handle error (e.g., display an error message)
      }
    };
    fetchQrCodes();
  }, [auth.userId]);

  return (
    <div className="qr-codes-container">
      {qrCodes.length > 0 ? (
        qrCodes.map((qrCode) => (
          <div key={qrCode.id} className="qr-code">
            <img src={qrCode.code} alt={`QR Code for ${qrCode.purpose}`} />
            <p>{qrCode.purpose}</p>
          </div>
        ))
      ) : (
        <p>No QR codes available.</p>
      )}
    </div>
  );
};

export default QRCodes;