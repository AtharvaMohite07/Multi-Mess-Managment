import {Router} from "express";
import {generateQRCode, showQRCode, validateQRCode,} from '../Controller/QRCodeController.js';

const qrcodeRouter = Router();

// Route for generating a new QR code
qrcodeRouter.post("/generate", generateQRCode);
qrcodeRouter.get("/showQRCode/:userId", showQRCode);
// Route for validating a scanned QR code
qrcodeRouter.post("/validate", validateQRCode);

// ... (Add more routes as needed for other QR code operations)

export default qrcodeRouter;