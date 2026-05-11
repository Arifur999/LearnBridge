export enum AvailabilityStatus {
  BOOKED = "BOOKED",
  AVAILABLE = "AVAILABLE",
}

export interface AvailabilityData {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
  tutorId: string;
}

export interface AvailabilityCardProps {
  availability: AvailabilityData;
}
