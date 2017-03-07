function Cell () {
// Postcondition: Cell object created with default state and nextstate of 0
   this.state = 0;              // Current state of cell (either 0 or 1)
   this.nextState = this.state; // State of cell during next life cycle
}


Cell.prototype.invert = function () {
// Precondition:  Cell's state is either 0 or 1
// Postcondition: Cell's state is switched
   if (this.state === 0)
      this.state = 1;
   else
      this.state = 0;
}


Cell.prototype.isAlive = function () {
// Precondition:  Cell's state is either 0 or 1
// Postcondition: True returned if cell is alive; False returned otherwise
   return (this.state === 1);
}


Cell.prototype.invertNextState = function () {
// Precondition:  Cell's state is either 0 or 1
// Postcondition: nextState is set to the opposite of current state
   if (this.state === 0)
      this.nextState = 1;
   else
      this.nextState = 0;
}


Cell.prototype.retainState = function () {
// Postcondition: Cell's nextState is set equal to current state
    this.nextState = this.state;
}


Cell.prototype.updateState = function () {
// Postcondition:  Cell's state is set equal to it's nextState
   this.state = this.nextState;
}