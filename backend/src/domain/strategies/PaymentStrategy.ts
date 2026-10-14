import { PaymentMethod } from '../../config/constants';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

/**
 * Strategy Pattern (GoF - Behavioral)
 * Payment processing strategy interface for different payment modes (UPI, Card, Net Banking).
 */
export interface PaymentStrategy {
  processPayment(amount: number, paymentDetails: Record<string, any>): Promise<PaymentResult>;
}

export class UPIPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, details: Record<string, any>): Promise<PaymentResult> {
    const vpa = details.vpa || 'user@upi';
    const txnId = 'UPI' + Date.now() + Math.floor(Math.random() * 1000);
    return {
      success: true,
      transactionId: txnId,
      message: `Payment of ₹${amount} successful via UPI (${vpa}).`
    };
  }
}

export class CardPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, details: Record<string, any>): Promise<PaymentResult> {
    const cardNumber = details.cardNumber ? details.cardNumber.slice(-4) : '4242';
    const txnId = 'CRD' + Date.now() + Math.floor(Math.random() * 1000);
    return {
      success: true,
      transactionId: txnId,
      message: `Payment of ₹${amount} successful via Card ending in ${cardNumber}.`
    };
  }
}

export class NetBankingPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, details: Record<string, any>): Promise<PaymentResult> {
    const bank = details.bankName || 'SBI';
    const txnId = 'NBK' + Date.now() + Math.floor(Math.random() * 1000);
    return {
      success: true,
      transactionId: txnId,
      message: `Payment of ₹${amount} successful via Net Banking (${bank}).`
    };
  }
}

/**
 * Factory Pattern (GoF - Creational)
 */
export class PaymentStrategyFactory {
  public static getStrategy(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.UPI:
        return new UPIPaymentStrategy();
      case PaymentMethod.CARD:
        return new CardPaymentStrategy();
      case PaymentMethod.NET_BANKING:
        return new NetBankingPaymentStrategy();
      default:
        return new UPIPaymentStrategy();
    }
  }
}
