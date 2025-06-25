Student Certificate Validation DApp Documentation
The Student Certificate Validation DApp is a decentralized application that enables educational authorities (admins) to upload student certificates to IPFS and the Ethereum blockchain, and allows institutions to verify the authenticity of those certificates. This system ensures secure, immutable, and transparent verification using blockchain and IPFS technology.

Technology Stack
•	Frontend: React.js with TypeScript and Tailwind CSS
•	Backend: Node.js with Express
•	Blockchain: Ethereum (Ganache for local development)
•	Smart Contract: Solidity (Truffle Framework)
•	Decentralized Storage: IPFS (via Pinata)
•	Database: MySQL or PostgreSQL (via Sequelize ORM)

Application Roles
Admin
•	Can log in using hardcoded or stored credentials.
•	Uploads student certificates with details:
o	Student Name
o	Degree Name
o	Graduation Date
o	Institution Name
o	Certificate File (PDF/Image)
•	Certificate data is:
o	Uploaded to IPFS (file)
o	Stored on Ethereum blockchain (metadata)
o	Stored in SQL database for querying
Institution
•	Can sign up and log in securely.
•	Can verify certificates using an IPFS hash.
•	Receives status and details of certificate if valid.

How the App Works
1. Admin Login and Upload
1.	Admin logs in from /admin-login.
2.	JWT token is returned and stored in frontend.
3.	Admin uploads certificate (via form + file upload).
4.	Certificate is sent to backend:
o	File is uploaded to IPFS
o	Metadata stored on blockchain via smart contract
o	Record saved in SQL database
2. Institution Signup and Verification
1.	Institution signs up at /institution-auth.
2.	JWT token is issued after login.
3.	On verification page:
o	Institution enters an IPFS hash
o	Backend verifies hash by reading blockchain
o	Returns student details if matched, else error


Environment Variables
PORT=5000
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=certificatevalidationsystem
PINATA_API_KEY=your_key
PINATA_API_SECRET=your_secret
GANACHE_URL=http://127.0.0.1:7545

Notes
•	Ensure Ganache is running before backend
•	Always use correct contract ABI in backend
•	Use IPFS hash from upload for verification
•	Admin token required for upload, institution token for verification

