import { formatDate } from "@/lib/utils";
import { ActivityFeed, User } from "@prisma/client";

export function getFeedData(
  feedData: (ActivityFeed & { actor: User; objectTitle: string })[]
) {
  return feedData.map((r) => {
    let message = `<strong>${r.actor.firstName} ${r.actor.lastName}</strong>`;
    message += `  ${r.verb} <strong>${r.objectTitle}</strong> ${r.objectType}`;
    message += ` (${formatDate(r.time)})`;

    return message;
  });
}
