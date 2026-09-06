'use client';

import Image from 'next/image';
import { useState } from 'react';
import closeIcon from '../../../public/assets/ic_close.svg';
import randomBoxBlue from '../../../public/assets/ic_random_box_blue.png';
import randomBoxPurple from '../../../public/assets/ic_random_box_purple.png';
import randomBoxRed from '../../../public/assets/ic_random_box_red.png';
import styles from './RandomSelection.module.css';

const RANDOM_BOXES = [
  { id: 'blue', src: randomBoxBlue },
  { id: 'purple', src: randomBoxPurple },
  { id: 'red', src: randomBoxRed },
]

// 테스트용 랜덤 포인트 api 호출 결과
const RANDOM_POINT_RESULT = {
  amount: 50,
  unselectedAmounts: [20, 200],
}

export default function RandomSelection({ setStep }) {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSelectConfirmed, setIsSelectConfirmed] = useState(false);
  const unselectedBoxes = RANDOM_BOXES.filter((randomBox) => randomBox.id !== selectedBox);

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
            width={25}
            height={25}
            alt=""
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
          {/** 선택 전에는 상자를, 선택 완료 후에는 각 상자의 포인트를 표시 */}
          {!isSelectConfirmed ? (
            RANDOM_BOXES.map((randomBox) => {
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
                    ${isFadingOut ? styles.fadeOut : ''}
                  `}
                  onClick={() => setSelectedBox(randomBox.id)}
                >
                  <Image
                    src={randomBox.src}
                    width={245}
                    height={190}
                    alt=""
                  />
                </button>
              );
            })
          ) : (
            RANDOM_BOXES.map((randomBox) => (
              randomBox.id === selectedBox 
              ? (
                <p 
                  key={randomBox.id}
                  className={styles.selectedPoint}
                >
                 {RANDOM_POINT_RESULT.amount}
                </p>
              ) : (
                <p 
                  key={randomBox.id}
                  className={styles.unselectedPoint}
                >
                  {RANDOM_POINT_RESULT.unselectedAmounts[unselectedBoxes.findIndex(box => box.id === randomBox.id)]}
                </p>
              )
            ))
          )}
        </div>

        {selectedBox && !isSelectConfirmed &&
          <button 
            className={styles.selectBtn}
            onClick={() => {
              setIsFadingOut(true)
              setTimeout(() => {
                setIsSelectConfirmed(true)
              }, 500)
              setTimeout(() => {
                setStep('result')
              }, 2000)
            }}
          >
            선택 완료
          </button>
        }
      </div>
    </div>
  )
}