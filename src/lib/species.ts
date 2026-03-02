import type { Species } from "@/types/species";
import speciesData from "@/data/species.json";
import featuredData from "@/data/featured.json";

export async function getAllSpecies(): Promise<Species[]> {
  return speciesData as Species[];
}

export async function getFeaturedSpecies(): Promise<Species[]> {
  return featuredData as Species[];
}

export async function totalSpeciesCount(): Promise<number> {
  const allSpecies = await getAllSpecies();
  return allSpecies.length;
}

export async function totalEndangeredSpeciesCount(): Promise<number> {
  const allSpecies = await getAllSpecies();
  return allSpecies.filter(
    (s) => s.conservationStatus === "EN" || s.conservationStatus === "CR"
  ).length;
}