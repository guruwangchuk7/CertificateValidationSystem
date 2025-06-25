// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Cert {
        string studentName;
        string degreeName;
        string institutionName;
        string graduationDate;
        string ipfsHash;
    }

    mapping(bytes32 => Cert) public certificates;
    bytes32[] public certHashes;

    // Store a certificate
    function storeCertificate(
        string memory studentName,
        string memory degreeName,
        string memory institutionName,
        string memory graduationDate,
        string memory ipfsHash
    ) public returns (bytes32) {
        bytes32 certHash = keccak256(abi.encodePacked(studentName, degreeName, institutionName, graduationDate, ipfsHash, block.timestamp));

        certificates[certHash] = Cert(studentName, degreeName, institutionName, graduationDate, ipfsHash);
        certHashes.push(certHash);

        return certHash;
    }

    // Get certificate details by hash
    function getCertificate(bytes32 certHash) public view returns (Cert memory) {
        return certificates[certHash];
    }

    // Get total certificates count
    function getCertificatesCount() public view returns (uint) {
        return certHashes.length;
    }

    // Get certificate hash by index
    function getCertificateHashByIndex(uint index) public view returns (bytes32) {
        require(index < certHashes.length, "Index out of bounds");
        return certHashes[index];
    }
}
