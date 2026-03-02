import type { Species } from "@/types/species";
import speciesData from "@/data/species.json";
import featuredData from "@/data/featured.json";

export async function getAllSpecies(): Promise<Species[]> {
  return speciesData as Species[];
}

export async function getFeaturedSpecies(): Promise<Species[]> {
  return featuredData as Species[];
}

export async function getSpeciesCount(): Promise<number> {
  const allSpecies = await getAllSpecies();
  return allSpecies.length;
}

export async function getVulnerableSpeciesCount(): Promise<number> {
  const allSpecies = await getAllSpecies();
  return allSpecies.filter((s) => s.conservationStatus === "VU").length;
}

export async function getEndangeredSpeciesCount(): Promise<number> {
  const allSpecies = await getAllSpecies();
  return allSpecies.filter(
    (s) => s.conservationStatus === "EN" || s.conservationStatus === "CR"
  ).length;
}