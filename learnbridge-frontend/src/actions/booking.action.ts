"use server";

import { bookingService } from "@/services/booking.service";
import { revalidatePath } from "next/cache";

export const getTrainerSlots = async (trainerId: string) => {
  return await bookingService.getTrainerSlots(trainerId);
};

export const bookSlotAction = async (slotId: string) => {
  try {
    const result = await bookingService.bookSlot(slotId);
    
   
    revalidatePath("/courses/[id]", "page"); 
    
    return { success: true, message: "Booking successful!", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to book slot",
    };
  }
};