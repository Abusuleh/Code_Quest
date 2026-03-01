"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { PLACEMENT_QUESTIONS } from "@/data/placement-questions";

type Answer = {
  questionId: number;
  phase: 1 | 2 | 3 | 4;
  text: string;
};

type Props = {
  onComplete: (phase: number, answers: Answer[]) => void;
};

function scorePhase(answers: Answer[]) {
  const total = answers.reduce((sum, answer) => sum + answer.phase, 0);
  const score = total / answers.length;
  let phase = 4;
  if (score < 1.75) phase = 1;
  else if (score < 2.5) phase = 2;
  else if (score < 3.25) phase = 3;

  const ageAnswer = answers.find((answer) => answer.questionId === 1)?.text;
  if (ageAnswer === "6 or 7") {
    phase = Math.min(phase, 1);
  } else if (ageAnswer === "8 or 9") {
    phase = Math.min(phase, 2);
  } else if (ageAnswer === "12, 13, or 14" && phase === 1) {
    phase = 2;
  }

  return phase;
}

export function PlacementQuiz({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const question = PLACEMENT_QUESTIONS[index];
  const progress = Math.round(((index + 1) / PLACEMENT_QUESTIONS.length) * 100);

  function handleChoice(phase: 1 | 2 | 3 | 4, text: string) {
    const nextAnswers = [...answers, { questionId: question.id, phase, text }];
    setAnswers(nextAnswers);
    if (index === PLACEMENT_QUESTIONS.length - 1) {
      const recommended = scorePhase(nextAnswers);
      onComplete(recommended, nextAnswers);
      return;
    }
    setTimeout(() => setIndex((prev) => prev + 1), 1200);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-cq-bg-elevated">
          <motion.div
            className="h-full bg-cq-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
          Question {index + 1} of {PLACEMENT_QUESTIONS.length}
        </p>
      </div>
      <p className="text-sm text-cq-text-secondary">{question.byteComment}</p>
      <h2 className="text-2xl font-heading text-white">{question.question}</h2>
      <div className="grid gap-3">
        {question.answers.map((choice) => (
          <Button
            key={`${question.id}-${choice.text}`}
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleChoice(choice.phase, choice.text)}
          >
            <span className="mr-3">{choice.emoji}</span>
            {choice.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
