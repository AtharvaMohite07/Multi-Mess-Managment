import { Router } from "express";
import qrCodeController from '../Controller/QRCodeController.js';

const router = Router();

// Route for generating a new QR code
router.post('/generate', qrCodeController.generateQRCode);

// Route for validating a scanned QR code
router.post('/validate', qrCodeController.validateQRCode);

// ... (Add more routes as needed for other QR code operations)

export default router;