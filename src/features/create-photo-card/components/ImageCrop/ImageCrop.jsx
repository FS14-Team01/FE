"use client";

import { useEffect, useId, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "@/components/common/Button/Button";
import styles from "@/features/create-photo-card/components/ImageCrop/ImageCrop.module.css";

export default function ImageCrop({ imageUrl, fileName, onClose, onApply }) {
  const dialogRef = useRef(null);
  const imageRef = useRef(null);
  const busyRef = useRef(false);
  const titleId = useId();
  const [crop, setCrop] = useState();
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // 기본 dialog가 배경 클릭과 키보드 포커스를 차단
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  const handleImageLoad = (event) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    // 처음부터 중앙에 4:3 선택 영역을 표시
    setCrop(centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 4 / 3, width, height),
      width,
      height,
    ));
    setError("");
  };

  const handleClose = () => {
    if (!busyRef.current) onClose();
  };

  const handleApply = async () => {
    const image = imageRef.current;
    if (!image || !crop?.width || !crop?.height || busyRef.current) return;

    busyRef.current = true;
    setIsApplying(true);
    setError("");

    try {
      // 화면 크기와 무관하게 원본의 픽셀 좌표로 변환
      const x = (crop.x / 100) * image.naturalWidth;
      const y = (crop.y / 100) * image.naturalHeight;
      const width = (crop.width / 100) * image.naturalWidth;
      const height = (crop.height / 100) * image.naturalHeight;
      const unit = Math.floor(Math.min(width / 4, height / 3));
      if (unit < 1) throw new Error("크롭 영역을 조금 더 크게 선택해 주세요.");

      const canvas = document.createElement("canvas");
      canvas.width = unit * 4;
      canvas.height = unit * 3;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("이미지를 처리할 수 없습니다.");
      context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("이미지 생성에 실패했습니다. 다시 시도해 주세요."));
        }, "image/webp");
      });

      const name = (fileName || "photo").replace(/\.[^.]+$/, "");
      const file = new File([blob], `${name}-cropped.webp`, { type: "image/webp" });
      console.log("크롭 결과:", file.name, file.type, file.size);
      onApply(file);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "이미지 처리에 실패했습니다.");
    } finally {
      busyRef.current = false;
      setIsApplying(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.cropModal}
      aria-labelledby={titleId}
      aria-busy={isApplying}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
    >
      <div className={styles.layout}>
        <header className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.title}>사진 자르기</h2>
            <p className={styles.description}>영역을 움직이거나 크기를 조절해 주세요.</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="사진 자르기 취소"
            onClick={handleClose}
            disabled={isApplying}
          >
            <img
              src="/assets/ic_close.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.imageStage}>
            <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={4 / 3} keepSelection ruleOfThirds disabled={isApplying}
              className={styles.cropContent}>
              <img ref={imageRef} src={imageUrl} alt="자를 영역을 선택할 사진"
                className={styles.image} onLoad={handleImageLoad}
                onError={() => { setCrop(undefined); setError("사진을 불러올 수 없습니다. 다른 파일을 선택해 주세요."); }} />
            </ReactCrop>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>

        <footer className={styles.footer}>
          <Button type="button" variant="secondary" className={styles.actionButton}
            onClick={handleClose} disabled={isApplying}>취소</Button>
          <Button type="button" variant="secondary" className={`${styles.actionButton} ${styles.applyButton}`}
            onClick={handleApply} disabled={!crop?.width || !crop?.height || isApplying}>
            {isApplying ? "처리 중…" : "적용"}
          </Button>
        </footer>
      </div>
    </dialog>
  );
}
