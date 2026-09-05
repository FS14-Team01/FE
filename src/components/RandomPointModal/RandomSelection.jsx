'use client';

import Image from "next/image";
import { useState } from "react";
import closeIcon from "../../../public/assets/ic_close.svg";
import randomBoxBlue from "../../../public/assets/ic_random_box_blue.png";
import randomBoxPurple from "../../../public/assets/ic_random_box_purple.png";
import randomBoxRed from "../../../public/assets/ic_random_box_red.png";
import styles from "./RandomSelection.module.css";

const RANDOME_BOXES = [
  { id: "blue", src: randomBoxBlue, },
  { id: "purple", src: randomBoxPurple, },
  { id: "red", src: randomBoxRed, },
]

export default function RandomSelection() {
  const [selectedBox, setSelectedBox] = useState(null);

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
          aria-label="모달 닫기"
        >
          <Image
            src={closeIcon}
            width={17}
            height={17}
            alt=""
            loading="eager"
          />
        </button>

        <p 
          className={styles.title}
          id="random-point-selection-title"
        >
          랜덤<span>포인트</span>
        </p>

        <p className={styles.description}>
          하루에 두 번 열리는 행운의 상자!
          <br />
          원하는 상자를 골라 랜덤 포인트를 받아보세요!
        </p>

        <div className={styles.boxes}>
          {RANDOME_BOXES.map((randomBox) => {
            const isSelected = selectedBox === randomBox.id;
            const isUnselected =
              selectedBox !== null && selectedBox !== randomBox.id;

            return (
              <button
                key={randomBox.id}
                type="button"
                aria-label="랜덤 포인트 박스"
                className={`
                  ${styles.boxBtn}
                  ${isSelected ? styles.selectedBox : ''}
                  ${isUnselected ? styles.unselectedBox : ''}
                `}
                onClick={() => setSelectedBox(randomBox.id)}
              >
                <Image
                  src={randomBox.src}
                  width={245}
                  height={190}
                  alt=""
                  loading="eager"
                />
              </button>
            );
          })}
        </div>

        {selectedBox && 
          <button 
            className={styles.selectBtn}
          >
            선택 완료
          </button>
        }
      </div>
    </div>
  )
}