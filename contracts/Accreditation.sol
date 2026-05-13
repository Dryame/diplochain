// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Accreditation {
    address public admin;
    mapping(address => bool) public isAccredited;
    mapping(address => string) public institutionNames;

    event InstitutionAccredited(address indexed institution, string name);
    event InstitutionRevoked(address indexed institution);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function accreditInstitution(address _institution, string memory _name) public onlyAdmin {
        isAccredited[_institution] = true;
        institutionNames[_institution] = _name;
        emit InstitutionAccredited(_institution, _name);
    }

    function revokeAccreditation(address _institution) public onlyAdmin {
        isAccredited[_institution] = false;
        emit InstitutionRevoked(_institution);
    }
}
