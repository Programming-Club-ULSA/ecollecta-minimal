import type { Species } from "@/types/species";

export async function getAllSpecies(): Promise<Species[]> {
  const response = await fetch("/data/species.json");

  if (!response.ok) {
    throw new Error("Failed to load species data");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid species JSON format");
  }

  return data as Species[];
}