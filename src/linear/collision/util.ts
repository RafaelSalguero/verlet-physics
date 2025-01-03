
/**
 * Calculate the mass ratio of two objects collision, allows for
 * infinite masses
  *
  */
export function calcMassRatio(
  thisMass: number,
  otherMass: number): number {
  if (!Number.isFinite((thisMass))) {
    return 0;
  }
  if (!Number.isFinite(otherMass)) {
    return 1;
  }

  return otherMass / (thisMass + otherMass);
}
