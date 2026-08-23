import { SubmitMasjidForm } from "@/components/submissions/SubmitMasjidForm";

// Admin entry point to the same submission flow every contributor uses — there is
// no separate direct-write path (see [[decisions]] ADR-007). Until the auto-approve
// branch for admin callers ships, an admin's submission here still lands in the
// review queue like anyone else's and needs a separate approval.
export default function CreateMasjidPage() {
  return <SubmitMasjidForm />;
}
