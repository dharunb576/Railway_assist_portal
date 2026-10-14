import { BookingStatus } from '../../config/constants';

/**
 * State Pattern (GoF - Behavioral)
 * Handles transitions between booking states (Pending -> Confirmed -> Cancelled / Completed).
 */
export interface BookingState {
  getStatus(): BookingStatus;
  canCancel(): boolean;
  canComplete(): boolean;
}

export class PendingBookingState implements BookingState {
  getStatus(): BookingStatus { return BookingStatus.PENDING; }
  canCancel(): boolean { return true; }
  canComplete(): boolean { return false; }
}

export class ConfirmedBookingState implements BookingState {
  getStatus(): BookingStatus { return BookingStatus.CONFIRMED; }
  canCancel(): boolean { return true; }
  canComplete(): boolean { return true; }
}

export class CancelledBookingState implements BookingState {
  getStatus(): BookingStatus { return BookingStatus.CANCELLED; }
  canCancel(): boolean { return false; }
  canComplete(): boolean { return false; }
}

export class CompletedBookingState implements BookingState {
  getStatus(): BookingStatus { return BookingStatus.COMPLETED; }
  canCancel(): boolean { return false; }
  canComplete(): boolean { return false; }
}

export class BookingStateContext {
  private state: BookingState;

  constructor(status: BookingStatus) {
    switch (status) {
      case BookingStatus.PENDING:
        this.state = new PendingBookingState();
        break;
      case BookingStatus.CONFIRMED:
        this.state = new ConfirmedBookingState();
        break;
      case BookingStatus.CANCELLED:
        this.state = new CancelledBookingState();
        break;
      case BookingStatus.COMPLETED:
        this.state = new CompletedBookingState();
        break;
      default:
        this.state = new PendingBookingState();
    }
  }

  public getStatus(): BookingStatus {
    return this.state.getStatus();
  }

  public canCancel(): boolean {
    return this.state.canCancel();
  }
}
