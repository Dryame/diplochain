// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAccreditation {
    function isAccredited(address _institution) external view returns (bool);
}

contract DiplomaRegistry {
    struct Diploma {
        bytes32 hash;
        bytes signature;
        address issuer;
        address graduate;
        uint256 timestamp;
        bool isValid;
    }

    IAccreditation public accreditationContract;
    mapping(bytes32 => Diploma) public diplomas;
    mapping(address => bytes32[]) public graduateDiplomas;

    event DiplomaRegistered(bytes32 indexed hash, address indexed issuer, address indexed graduate);

    constructor(address _accreditationAddress) {
        accreditationContract = IAccreditation(_accreditationAddress);
    }

    function registerDiploma(bytes32 _hash, bytes memory _signature, address _graduate) public {
        require(accreditationContract.isAccredited(msg.sender), "Caller is not an accredited institution");
        require(!diplomas[_hash].isValid, "Diploma hash already registered");
        require(_graduate != address(0), "Invalid graduate address");

        diplomas[_hash] = Diploma({
            hash: _hash,
            signature: _signature,
            issuer: msg.sender,
            graduate: _graduate,
            timestamp: block.timestamp,
            isValid: true
        });

        graduateDiplomas[_graduate].push(_hash);

        emit DiplomaRegistered(_hash, msg.sender, _graduate);
    }

    function verify(bytes32 _hash) public view returns (bool, address, address, uint256) {
        Diploma memory d = diplomas[_hash];
        return (d.isValid, d.issuer, d.graduate, d.timestamp);
    }

    function getGraduateDiplomas(address _graduate) public view returns (bytes32[] memory) {
        return graduateDiplomas[_graduate];
    }
}
