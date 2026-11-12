import { NO_MEAL_ID } from "../data/meals";
import type { LineItem, Meal, Passenger, Seat, Totals } from "../types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Always shows a currency amount, e.g. "₹0" or "₹1,250". */
export const formatCurrency = (amount: number) => currencyFormatter.format(amount);

/** Shows "Free" for zero, otherwise the currency amount. */
export const formatPrice = (amount: number) => (amount === 0 ? "Free" : formatCurrency(amount));

export function buildLineItems(
  passengers: Passenger[],
  seatAssignments: Record<string, string>,
  mealAssignments: Record<string, string>,
  seatsById: Record<string, Seat>,
  mealsById: Record<string, Meal>,
): LineItem[] {
  return passengers.map((passenger) => {
    const seat = seatsById[seatAssignments[passenger.id]] ?? null;
    const mealId = mealAssignments[passenger.id];
    const meal = mealId && mealId !== NO_MEAL_ID ? (mealsById[mealId] ?? null) : null;

    return {
      passenger,
      seat,
      meal,
      seatPrice: seat?.price ?? 0,
      mealPrice: meal?.price ?? 0,
    };
  });
}

export function calculateTotals(items: LineItem[]): Totals {
  const seats = items.reduce((sum, item) => sum + item.seatPrice, 0);
  const meals = items.reduce((sum, item) => sum + item.mealPrice, 0);
  return { seats, meals, total: seats + meals };
}
