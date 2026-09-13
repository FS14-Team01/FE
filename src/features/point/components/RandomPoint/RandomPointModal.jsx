"use client";

import { useEffect, useState } from "react";
import RandomPointResult from "./RandomPointResult.jsx";
import RandomSelection from "./RandomSelection.jsx";
import { useDrawRandomPoint } from "../../hooks/use-point.js";

export default function RandomPointModal({ onClose }) {
  const [step, setStep] = useState("selecting");
  const [isRevealing, setIsRevealing] = useState(false);

  // 랜덤포인트 뽑기 hook
  const { mutateAsync, data, isPending } = useDrawRandomPoint();

  const handleDrawRandomPoint = () => mutateAsync();

  const period = data?.randomPointDraw?.period;
  const nextAvailable = period
    ? period === "MORNING"
      ? "오늘 낮 12시"
      : "내일 자정"
    : undefined;
  const drawResult = {
    amount: data?.randomPointDraw?.amount,
    unselectedAmounts: data?.randomPointDraw?.unselectedAmounts,
    nextAvailable,
  };

  // esc로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPending || isRevealing) return;
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPending, isRevealing, onClose]);

  // 화면에 보여줄 모달 선택
  if (step === "selecting") {
    return (
      <RandomSelection
        setStep={setStep}
        isRevealing={isRevealing}
        setIsRevealing={setIsRevealing}
        onClose={onClose}
        onDrawRandomPoint={handleDrawRandomPoint}
        isDrawing={isPending}
        amount={drawResult.amount}
        unselectedAmounts={drawResult.unselectedAmounts}
      />
    );
  }

  if (step === "result") {
    return (
      <RandomPointResult
        amount={drawResult.amount}
        nextAvailable={drawResult.nextAvailable}
        onClose={onClose}
      />
    );
  }

  return null;
}
