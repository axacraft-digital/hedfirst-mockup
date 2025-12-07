import type { PaymentMethod, PaymentTransaction } from "./types"
import paymentMethodsJson from "./mock/financial/payment-methods.json"
import paymentHistoryJson from "./mock/financial/payment-history.json"

/**
 * Payment data - using centralized mock data
 * Payment methods and transaction history for patients
 */

export const paymentMethods = paymentMethodsJson as PaymentMethod[]
export const paymentTransactions = paymentHistoryJson as PaymentTransaction[]

// Get payment methods for a specific patient
export function getPaymentMethodsByPatientId(patientId: string): PaymentMethod[] {
  return paymentMethods.filter((pm) => pm.patientId === patientId)
}

// Get payment history for a specific patient
export function getPaymentHistoryByPatientId(patientId: string): PaymentTransaction[] {
  return paymentTransactions
    .filter((txn) => txn.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get payment method by ID
export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return paymentMethods.find((pm) => pm.id === id)
}

// Get payment transaction by ID
export function getPaymentTransactionById(id: string): PaymentTransaction | undefined {
  return paymentTransactions.find((txn) => txn.id === id)
}
