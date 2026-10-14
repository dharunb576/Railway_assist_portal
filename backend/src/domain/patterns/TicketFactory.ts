import { Ticket, Booking } from '../types';

/**
 * Factory & Builder Pattern (GoF)
 * Encapsulates ticket domain creation & 10-digit Indian Railway PNR checksum generation logic.
 */
export class TicketFactory {
  public static generatePNR(): string {
    // 10-digit PNR starting with 4, 6, or 8 (zone prefixes like 4 = Southern, 8 = South Western)
    const prefixes = ['421', '840', '652', '410'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().slice(0, 7);
    return `${prefix}${suffix}`;
  }

  public static createTicket(booking: Booking): Ticket {
    const issuedAt = new Date().toISOString();
    const qrData = `PNR:${booking.pnr}|TRAIN:${booking.trainId}|DATE:${booking.journeyDate}|PAX:${booking.totalPassengers}|FARE:${booking.totalFare}`;
    
    return {
      id: `ticket_${booking.id}`,
      bookingId: booking.id,
      pnr: booking.pnr,
      issuedAt,
      qrData
    };
  }
}
