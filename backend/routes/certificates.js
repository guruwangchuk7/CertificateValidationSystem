const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFileToIPFS } = require('../utils/ipfs');
const { web3, certificateContract } = require('../utils/blockchain');
const authMiddleware = require('../middlewares/auth');
const Certificate = require('../models/Certificate');

// Setup multer to store file in memory (for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload certificate (admin only)
router.post('/upload', authMiddleware, upload.single('certificate'), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  const { studentName, degreeName, graduationDate, institutionName } = req.body;
  const file = req.file;

  if (!studentName || !degreeName || !graduationDate || !institutionName || !file) {
    return res.status(400).json({ message: 'Missing required fields or certificate file' });
  }

  try {
    // Upload certificate PDF to IPFS (Pinata)
    const ipfsHash = await uploadFileToIPFS(file.buffer, file.originalname);
    console.log('✅ IPFS Hash:', ipfsHash);

    // Get Ganache account to send blockchain transaction
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // Store certificate metadata on blockchain
    const receipt = await certificateContract.methods.storeCertificate(
      studentName,
      degreeName,
      institutionName,
      graduationDate,
      ipfsHash
    ).send({ from: account, gas: 3000000 });

    console.log('✅ Blockchain Receipt:', receipt);

    // Extract certificate hash from contract event logs
    let certHash = null;
    if (receipt.events) {
      const eventNames = Object.keys(receipt.events);
      if (eventNames.length > 0) {
        const firstEvent = receipt.events[eventNames[0]];
        if (firstEvent.returnValues && firstEvent.returnValues[0]) {
          certHash = firstEvent.returnValues[0];
        }
      }
    }

    // Save certificate record in SQL database
    const savedCert = await Certificate.create({
      studentName,
      degreeName,
      graduationDate,
      institutionName,
      ipfsHash,
      blockchainHash: certHash || receipt.transactionHash,
    });

    console.log('✅ Certificate saved to DB:', savedCert.id);

    res.json({
      message: 'Certificate uploaded successfully',
      ipfsHash,
      blockchainHash: certHash || receipt.transactionHash,
      downloadLink: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Certificate upload failed', error: err.message });
  }
});

// Verify certificate by IPFS hash (institution only)
router.post('/verify', authMiddleware, async (req, res) => {
  if (req.user.role !== 'institution') {
    return res.status(403).json({ message: 'Forbidden: Institutions only' });
  }

  const { ipfsHash } = req.body;
  if (!ipfsHash) {
    return res.status(400).json({ message: 'IPFS hash is required for verification' });
  }

  try {
    // Get total number of certificates stored on blockchain
    const count = await certificateContract.methods.getCertificatesCount().call();

    for (let i = 0; i < count; i++) {
      const certHash = await certificateContract.methods.getCertificateHashByIndex(i).call();
      const cert = await certificateContract.methods.getCertificate(certHash).call();

      if (cert.ipfsHash === ipfsHash) {
        return res.json({
          message: 'Approved',
          studentName: cert.studentName,
          degreeName: cert.degreeName,
          graduationDate: cert.graduationDate,
          institutionName: cert.institutionName,
        });
      }
    }

    res.status(404).json({ message: 'Wrong Credentials' });

  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).json({ message: 'Certificate verification failed', error: err.message });
  }
});

module.exports = router;
