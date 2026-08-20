export type SubmissionType = "create" | "update";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: number;
  type: SubmissionType;
  masjid_id: number | null;
  submitted_by: string;
  payload: string;
  status: SubmissionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
};
