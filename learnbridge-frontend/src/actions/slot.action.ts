"use server";

import { createSlotService, CreateSlotPayload } from "@/services/slot.service";
import { revalidatePath } from "next/cache"; 

export const createSlotAction = async (data: CreateSlotPayload) => {
  try {
    const result = await createSlotService(data);
    

    revalidatePath("/courses"); 
    
    return {
      success: true,
      message: "Slot created successfully!",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};