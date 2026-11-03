export class SessionNotFoundError extends Error {
  constructor(id: string) {
    super(`Session ${id} not found`);
    this.name = 'SessionNotFoundError';
  }
}

export class SeatAlreadyTakenError extends Error {
  constructor(seat: string) {
    super(`Seat ${seat} is already taken`);
    this.name = 'SeatAlreadyTakenError';
  }
}
