"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteQuestionButtonProps = {
  questionId: string;
};

export function DeleteQuestionButton({
  questionId,
}: DeleteQuestionButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    await fetch(`/api/admin/questions/${questionId}`, {
      method: "DELETE",
    });
    router.refresh();
    setSubmitting(false);
  }

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      disabled={submitting}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}
