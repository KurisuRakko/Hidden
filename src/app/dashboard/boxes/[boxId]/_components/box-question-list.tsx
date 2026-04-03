import { Stack } from "@mui/material";
import { OwnerQuestionCard } from "@/components/questions/owner-question-card";

type BoxQuestionListProps = {
  boxId: string;
  questions: Array<{
    id: string;
    content: string;
    imageUrl: string | null;
    status: string;
    submittedAtLabel: string;
    publishedAtLabel: string | null;
    answer: {
      content: string;
      imageUrl: string | null;
    } | null;
  }>;
};

export function BoxQuestionList({
  boxId,
  questions,
}: BoxQuestionListProps) {
  return (
    <Stack spacing={2}>
      {questions.map((question) => (
        <OwnerQuestionCard
          key={question.id}
          boxId={boxId}
          question={question}
        />
      ))}
    </Stack>
  );
}
