/**
 * Determines a member's status based on their expiration date and database status.
 * @param member - The member object containing status and expirationDate.
 * @returns "active" | "inactive"
 */
export function getMemberStatus(member: {
  status: string;
  expirationDate?: string | null;
}): "active" | "inactive" {
  // If explicitly inactive in DB, return inactive
  if (member.status?.toLowerCase() !== "active") {
    return "inactive";
  }

  // If no expiration date is provided, assume active (if DB says active)
  if (!member.expirationDate) {
    return "active";
  }

  try {
    const expiration = new Date(member.expirationDate);
    const now = new Date();

    // If expiration date is in the past, member is inactive
    if (expiration.getTime() < now.getTime()) {
      return "inactive";
    }
  } catch (error) {
    // On error (invalid date), fallback to DB status
    return "active";
  }

  return "active";
}
