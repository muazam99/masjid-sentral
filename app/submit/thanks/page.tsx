import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitThanksPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
      <h1 className="mb-2 text-2xl font-bold">Submission received</h1>
      <p className="mb-8 text-muted-foreground">
        Thanks for contributing. An admin will review your submission before it appears in the directory.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/directory">Back to directory</Link>
        </Button>
        <Button asChild>
          <Link href="/submissions/mine">View my submissions</Link>
        </Button>
      </div>
    </div>
  );
}
