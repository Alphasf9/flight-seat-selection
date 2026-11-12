import type { Meal } from "../types";

export const NO_MEAL_ID = "none";

export const MEALS: Meal[] = [
  { id: NO_MEAL_ID, name: "No meal", description: "Skip the meal", price: 0 },
  { id: "veg-sandwich", name: "Veg Sandwich", description: "Grilled veg sandwich with juice", price: 0 },
  { id: "salad-bowl", name: "Fresh Salad Bowl", description: "Seasonal salad with dressing", price: 249 },
  { id: "paneer-combo", name: "Paneer Combo", description: "Paneer butter masala, rice and roti", price: 299 },
  { id: "chicken-biryani", name: "Chicken Biryani", description: "Biryani with raita", price: 349 },
];

export const MEALS_BY_ID: Record<string, Meal> = Object.fromEntries(
  MEALS.map((meal) => [meal.id, meal]),
);
