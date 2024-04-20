import {Router} from "express";
import {generateQRCode, showQRCode, validateQRCode,} from '../Controller/QRCodeController.js';

const router = Router();

// Route for generating a new QR code
router.post('/generate', generateQRCode);
router.get('/showQRCode/:userId', showQRCode);
// Route for validating a scanned QR code
router.post('/validate', validateQRCode);

// ... (Add more routes as needed for other QR code operations)

export default router;