const PinataSDK = require('@pinata/sdk');
require('dotenv').config();

// ✅ Use `new` to create an instance of Pinata
const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function uploadFileToIPFS(fileBuffer, fileName) {
  const options = {
    pinataMetadata: {
      name: fileName,
    },
  };

  try {
    // Note: pinFileToIPFS expects a stream, not a raw buffer
    const stream = require('stream');
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);

    const result = await pinata.pinFileToIPFS(readableStream, options);
    return result.IpfsHash;
  } catch (err) {
    console.error('IPFS upload failed:', err);
    throw err;
  }
}

module.exports = { uploadFileToIPFS };
