"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./RandomSelection.module.css";

const RANDOM_BOXES = [
  { id: "blue", src: "/assets/ic_random_box_blue.png" },
  { id: "purple", src: "/assets/ic_random_box_purple.png" },
  { id: "red", src: "/assets/ic_random_box_red.png" },
];

// 테스트용 랜덤 포인트 api 호출 결과
const RANDOM_POINT_RESULT = {
  amount: 50,
  unselectedAmounts: [20, 200],
};

export default function RandomSelection({ setStep, onClose }) {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSelectConfirmed, setIsSelectConfirmed] = useState(false);

  const unselectedBoxes = RANDOM_BOXES.filter(
    (randomBox) => randomBox.id !== selectedBox,
  );

  useEffect(() => {
    if (!isFadingOut) return undefined;

    const revealTimer = setTimeout(() => {
      setIsSelectConfirmed(true);
    }, 500);

    const resultTimer = setTimeout(() => {
      setStep("result");
    }, 2000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(resultTimer);
    };
  }, [isFadingOut, setStep]);

  return (
    <div className={styles.wrapper}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="random-point-selection-title"
        className={styles.content}
      >
        <button
          className={styles.closeBtn}
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          autoFocus
        >
          <Image src="/assets/ic_close.svg" width={25} height={25} alt="" />
        </button>

        <h2 className={styles.title} id="random-point-selection-title">
          랜덤<span>포인트</span>
        </h2>

        <p className={styles.description}>
          하루에 두 번 열리는 행운의 상자!
          <br />
          원하는 상자를 골라 랜덤 포인트를 받아보세요!
        </p>

        <div className={styles.boxes}>
          {!isSelectConfirmed
            ? RANDOM_BOXES.map((randomBox, index) => {
                const isSelected = selectedBox === randomBox.id;
                const isUnselected =
                  selectedBox !== null && selectedBox !== randomBox.id;

                return (
                  <button
                    key={randomBox.id}
                    type="button"
                    aria-label={`${index + 1}번째 랜덤 포인트 박스`}
                    aria-pressed={isSelected}
                    disabled={isFadingOut}
                    className={`
                    ${styles.boxBtn}
                    ${isSelected ? styles.selectedBox : ""}
                    ${isUnselected ? styles.unselectedBox : ""}
                    ${isFadingOut ? styles.fadeOut : ""}
                  `}
                    onClick={() => setSelectedBox(randomBox.id)}
                  >
                    <Image
                      className={styles.boxImage}
                      src={randomBox.src}
                      width={245}
                      height={190}
                      alt=""
                    />
                  </button>
                );
              })
            : RANDOM_BOXES.map((randomBox) =>
                randomBox.id === selectedBox ? (
                  <p key={randomBox.id} className={styles.selectedPoint}>
                    {RANDOM_POINT_RESULT.amount}P
                  </p>
                ) : (
                  <p key={randomBox.id} className={styles.unselectedPoint}>
                    {
                      RANDOM_POINT_RESULT.unselectedAmounts[
                        unselectedBoxes.findIndex(
                          (box) => box.id === randomBox.id,
                        )
                      ]
                    }
                    P
                  </p>
                ),
              )}
        </div>

        {selectedBox && !isSelectConfirmed && (
          <button
            type="button"
            className={styles.selectBtn}
            onClick={() => setIsFadingOut(true)}
            disabled={isFadingOut}
          >
            선택 완료
          </button>
        )}
      </div>
    </div>
  );
}
