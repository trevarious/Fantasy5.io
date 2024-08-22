// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

interface IFantasy5 {
    enum LotteryState {
        OPEN,
        CALCULATING,
        CLOSED
    }
    enum PrizeTier {
        TWO,
        THREE,
        FOUR
    }

    /**
     * @notice Owner receives 95% of donations, miner receives 5%
     */
    function donate() external payable;

    /**
     * @notice Changes the contract ownership to a new address.
     * @param newOwner The address of the new owner.
     */
    function transfersOwnership(address newOwner) external;

    /**
     * @notice Allows the contract owner to set the payout amount for a specific prize tier.
     * @param tier The prize tier to update.
     * @param amount The new payout amount for the specified prize tier.
     */
    function setPayoutAmount(PrizeTier tier, uint256 amount) external;

    /**
     * @notice Allows contract owner to set the new fee amount within reasonable bounds
     */
    function setFee(uint256 newFee) external;

    /**
     * @notice Toggles the lottery state between OPEN and CLOSED.
     * @dev If the lottery is OPEN, it is set to CLOSED, and vice versa. Emits appropriate events on state change.
     */
    function setLotteryState() external;

    /**
     * @notice Transfers the entire contract balance to the owner.
     * @dev Only callable by the contract owner. Ensures the transfer succeeds.
     * @dev (For development only, Sepolia has become scarce)
     */
    function withdrawContractBalance() external;

    /**
     * @notice Retrieves the current state of the lottery
     * @dev This function is marked as `external` and `view`, which means it can only be called from outside the contract and doesn't modify the contract's state.
     * @return players An array of addresses representing the players in the lottery
     * @return numberOfPlayers The number of players in the lottery
     * @return owner The address of the lottery owner
     * @return entranceFee The fee required to enter the lottery
     * @return roundStartTimestamp The timestamp when the current lottery round started
     * @return interval The interval between lottery rounds
     * @return _previousDraw The previous winning numbers
     * @return _jackpotAmount The current jackpot amount
     * @return _lastJackpotAmount The amount of the last jackpot
     * @return _countdownStarted Whether the countdown for the next lottery round has started
     */
    function getLotteryDetails()
        external
        view
        returns (
            address[] memory players,
            uint256 numberOfPlayers,
            address owner,
            uint256 entranceFee,
            uint256 roundStartTimestamp,
            uint256 interval,
            uint8[5] memory _previousDraw,
            uint256 _jackpotAmount,
            uint256 _lastJackpotAmount,
            bool _countdownStarted
        );

    function viewLotteryState() external;

    /**
     * @notice Retrieves the conditions needed for the next draw to start
     * @notice Different from checkUpkeep in that we return bools indiviually so that we can identify failures
     * @return hasTimePassed True if enough time has passed since the last draw
     * @return isLotteryOpen True if the LotteryState enum is in state 0 or "OPEN"
     * @return isContractFunded True if the contract balance is above zero
     * @return hasParticipants True if there is at least one player who has entered the lottery
     * @dev If all conditions are true, the LotteryState should be in 1 or "CALCULATING"
     */
    function viewIsTimeToDraw()
        external
        view
        returns (
            bool hasTimePassed,
            bool isLotteryOpen,
            bool isContractFunded,
            bool hasParticipants
        );

    /**
     *@notice Retrives the timestamp for the next draw.
     *@return nextDrawsTimestamp The exact time for the next draw.
     */
    function timestampForNextDraw()
        external
        view
        returns (uint256 nextDrawsTimestamp);

    /**
     * @notice Retrieves all tickets submitted by a specific player.
     * @param player The address of the player whose tickets are to be retrieved.
     * @return entries An array of arrays, where each inner array represents the numbers of a ticket.
     */
    function viewPlayerSubmittedTickets(
        address player
    ) external view returns (uint8[][] memory entries);

    /**
     * @notice Allows a player to submit a lottery ticket with 5 unique numbers.
     * @param player The address of the player submitting the ticket.
     * @param guess An array of 5 unique numbers between 1 and 36.
     * @dev The function checks that the lottery is open, the entrance fee is paid, and the numbers are valid and unique.
     *      If the player is new, they are added to the list of players. If this is the first ticket, a countdown for the draw starts.
     *      The numbers are sorted and packed into a uint256 for storage, and the ticket is added to the player’s entries.
     * @notice Emits a `ticketSubmitted` event with the player's address and guessed numbers.
     */

    function submitTicket(address player, uint8[5] memory guess) external;

    /**
     * @notice Allows a player to view the current payouts for winning
     * @param correctSelections The number of correct selections
     * @return The prize amount depending on the number of correct selections
     */
    function viewPayoutAmount(
        uint256 correctSelections
    ) external returns (uint256);

    /**
     * @notice Processes the results of the lottery draw by determining winners, calculating payouts,
     *         and distributing Ether to the winning players.
     * @dev This function iterates through each player and each of their tickets to compare the
     *      ticket numbers with the winning numbers. It calculates the payout based on the number
     *      of correct selections and transfers the prize to the winner. It also updates the contract
     *      state to reflect the new jackpot amount and resets the player list for the next draw.
     * @param winningNumbers A packed uint256 value containing the winning numbers for the draw.
     *                       The numbers are packed in a format where each number occupies 6 bits.
     * @notice The function performs the following actions:
     *         - Iterates through each player to check their tickets.
     *         - For each ticket, extracts the numbers and compares them with the winning numbers.
     *         - Calculates the number of correct guesses and determines the payout amount.
     *         - Distributes the calculated prize to the player and updates the total amount distributed.
     *         - Emits events for jackpot hits and prize payments.
     *         - Resets the player list, updates the jackpot amount, and sets the contract state
     *           for the next round of the lottery.
     * @dev The function uses bitwise operations to extract individual numbers from the packed format
     *      for efficient comparison. It ensures that each ticket’s payout is calculated accurately
     *      and that all state variables are properly updated.
     * @dev Gas Efficiency: Bitwise operations for number extraction are gas-efficient. Looping through
     *      players and tickets can be gas-intensive, especially with a large number of entries. The
     *      function optimizes gas usage by minimizing the number of operations and performing necessary
     *      state updates in a single transaction.
     */

    function handleDraw(uint256 winningNumbers) external;
}
