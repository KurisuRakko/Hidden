"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteAnswerButtonProps = {
  answerId: string;
};

export function DeleteAnswerButton({ answerId }: DeleteAnswerButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    await fetch(`/api/admin/answers/${answerId}`, {
      method: "DELETE",
    });
    router.refresh();
    setSubmitting(false);
  }

  return (
    <Button
      variant="outlined"
      color="warning"
      size="small"
      disabled={submitting}
      onClick={handleDelete}
    >
      Delete answer
    </Button>
  );
}
