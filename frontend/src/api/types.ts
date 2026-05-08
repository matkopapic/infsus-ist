// za paginirane odgovore (memberships, trainings)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// backend greska
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// MEMBERSHIP

export interface Membership {
  membershipId: string;
  name: string;
  durationInDays: number;
  price: number;
}

export interface CreateMembershipPayload {
  name: string;
  durationInDays: number;
  price: number;
}

export type UpdateMembershipPayload = Partial<CreateMembershipPayload>;

export interface ListMembershipsQuery {
  search?: string;
  page?: number;
  limit?: number;
}

// TRAINER

export interface TrainerOption {
  trainerId: string;
  name: string;
}

// MEMBER

export interface MemberOption {
  memberId: string;
  name: string;
  email: string;
}

export interface ListMembersQuery {
  search?: string;
}

// TRAINING

export interface TrainingTrainer {
  trainerId: string;
  name: string;
}

export interface Training {
  trainingId: string;
  name: string;
  trainingTime: string;
  durationInMinutes: number;
  capacity: number;
  availableSlots: number;
  trainer: TrainingTrainer;
}

export interface CreateTrainingPayload {
  name: string;
  trainingTime: string;
  durationInMinutes: number;
  capacity: number;
  trainerId: string;
}

export type UpdateTrainingPayload = Partial<CreateTrainingPayload>;

export interface ListTrainingsQuery {
  search?: string;
  trainerId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

// RESERVATION

export interface ReservationMember {
  memberId: string;
  name: string;
}

export interface Reservation {
  reservationId: string;
  member: ReservationMember;
}

export interface CreateReservationPayload {
  memberId: string;
}