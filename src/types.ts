export type LayoutId = "3-2" | "2-3-2";
export type SeatCategory = "standard" | "premium" | "extra-legroom";

export interface LayoutConfig {
  id: LayoutId;
  label: string;
  description: string;
  /** Seat letters per group; groups are separated by an aisle. */
  groups: string[][];
}

export interface Seat {
  id: string; // e.g. "12C"
  row: number;
  letter: string;
  category: SeatCategory;
  price: number;
  occupied: boolean;
}

export interface SeatRowData {
  row: number;
  groups: Seat[][];
}

export interface Passenger {
  id: string;
  name: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface SeatOwner {
  passengerId: string;
  index: number;
  name: string;
}

export type NoticeType = "error" | "info" | "success";

export interface Notice {
  id: number;
  type: NoticeType;
  text: string;
}

export interface LineItem {
  passenger: Passenger;
  seat: Seat | null;
  meal: Meal | null;
  seatPrice: number;
  mealPrice: number;
}

export interface Totals {
  seats: number;
  meals: number;
  total: number;
}
