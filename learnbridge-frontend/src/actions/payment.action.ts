"use server";

import { paymentService } from "@/services/payment.service";

export const createBookingPaymentAction = async (bookingId: string) => {
  const res = await paymentService.createBookingPaymentSession(bookingId);
  return res;
};

export const createCoursePaymentAction = async (courseId: string) => {
  const res = await paymentService.createCoursePaymentSession(courseId);
  return res;
};

export const getMyPaymentsAction = async () => {
  const res = await paymentService.getMyPayments();
  return res;
};

export const getTutorPaymentsAction = async () => {
  const res = await paymentService.getTutorPayments();
  return res;
};

export const getAllPaymentsAction = async (page = 1, limit = 20) => {
  const res = await paymentService.getAllPayments(page, limit);
  return res;
};

export const verifyPaymentSessionAction = async (sessionId: string) => {
  const res = await paymentService.verifyPaymentSession(sessionId);
  return res;
};
