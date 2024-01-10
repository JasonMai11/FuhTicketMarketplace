// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error NOT__OWNER();
error NOT__ENOUGH__TICKETS();
error EVENT__NOT__VALID();
error NOT__ENOUGH__FUNDS();
error SEAT__TAKEN();
error SEAT__NOT__VALID();

contract TokenMaster is ERC721 {

    address public immutable i_owner;
    uint256 public totalEvents;
    uint256 public totalTickets;
    
    // _Event (instead of event to avoid conflict with solidity keyword)
    struct _Event {
        uint256 id;         // unique id of each event
        string name;
        uint256 price;
        uint256 remainingTickets;
        uint256 numberOfTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => _Event) _events;
    // id of event => mapping [seat number => address of the owner]
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    // id of event => array of seats taken
    mapping(uint256 => uint256[]) public seatsTaken;
    // id of event => mapping [address of the owner => true/false]
    mapping(uint256 => mapping(address => bool)) public hasTicket;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NOT__OWNER();
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        i_owner = msg.sender;
    }



    /**
     * @dev - save events to a mapping
     * 
     * @param _name             - name of the event [string]
     * @param _price            - price of the event[uint256]
     * @param _numberOfTickets  - number of tickets [uint256]
     * @param _date             - date of the event [DD/MM/YYYY]
     * @param _time             - time of the event [HH:MM]
     * @param _location         - location of the event [street, city, country]
     * 
     * returns - nothing but adds the event struct to the mapping with the unique totalEvent identifier
     */

    function list(
        string memory _name,            
        uint256 _price,                 
        uint256 _numberOfTickets,       
        string memory _date,            
        string memory _time,            
        string memory _location         
    ) public onlyOwner {
        // checking if the owner is the one listing the event
        // require(msg.sender == i_owner, "Only the owner can list an event");

        // creating the _Event (struct)
        totalEvents = totalEvents + 1;
        _events[totalEvents] = _Event(totalEvents, _name, _price, _numberOfTickets, _numberOfTickets, _date, _time, _location);
    }




    /**
     * 
     * @param _id - event ID
     * @param _seat - seat number
     */
    function mint(uint _id, uint256 _seat) public payable {
        if (_events[_id].remainingTickets == 0) revert NOT__ENOUGH__TICKETS(); // <-- revert if there are not enough tickets
        if (_id == 0) revert EVENT__NOT__VALID(); // <-- revert if the event is not valid
        if (_id > totalEvents) revert EVENT__NOT__VALID(); // <-- revert if the event is not valid
        if (msg.value < _events[_id].price) revert NOT__ENOUGH__FUNDS(); // <-- revert if the msg.value is not enough
        if (seatTaken[_id][_seat] != address(0)) revert SEAT__TAKEN(); // <-- revert if the seat is already taken
        if (_seat > _events[_id].numberOfTickets) revert SEAT__NOT__VALID(); // <-- revert if the seat is not valid
        

        hasTicket[_id][msg.sender] = true; // <-- update the buying status (NFT won't be bought twice)
        _events[_id].remainingTickets -= 1; // <-- update the ticket count
        seatTaken[_id][_seat] = msg.sender; // <-- assign the seat to the msg.sender
        seatsTaken[_id].push(_seat); // <-- add the seat to the array of seats taken (so no one can buy the seat again)


        totalTickets = totalTickets + 1; // <-- update the unique ticket identifier
        // creating an NFT for a Ticket which will get assigned to whoever calls this function (msg.sender)
        _safeMint(msg.sender, totalTickets);
    }

    /* public / pure functions */
    function getTotalEvents() public view returns(uint256) {
        return totalEvents;
    }
    function getEvent(uint256 _id) public view returns(_Event memory) {
        return _events[_id];
    }
    function getSeatsTaken(uint256 _id) public view returns(uint256[] memory) {
        return seatsTaken[_id];
    }   
    function withdraw() public onlyOwner {
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

}