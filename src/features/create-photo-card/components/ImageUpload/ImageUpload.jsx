"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/common/Button/Button";
import ImageCrop from "@/features/create-photo-card/components/ImageCrop/ImageCrop";
import styles from "@/features/create-photo-card/components/ImageUpload/ImageUpload.module.css";

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({
  imageFile,
  onChange,
  onTouched,
  error,
}) {
  const fileInputRef = useRef(null);

  const [draftFile, setDraftFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fileError, setFileError] = useState("");

  // 파일 검사 오류를 우선 표시
  const displayedError = fileError || error;

  // 생성한 Object URL 정리
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    // 같은 파일도 다시 선택 가능
    event.target.value = "";

    if (!file) return;

    // 허용 형식 검사
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFileError(
        "PNG, JPG, JPEG, WEBP 파일만 선택해 주세요."
      );
      return;
    }

    // 원본 파일 용량 검사
    if (file.size > MAX_IMAGE_SIZE) {
      setFileError(
        "5MB 이하의 파일을 업로드해 주세요."
      );
      return;
    }

    // 검사를 통과하면 편집용 파일로 저장
    setFileError("");
    setDraftFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropClose = () => {
    // 취소하면 기존 확정 이미지 유지
    setDraftFile(null);
    setImageUrl("");
  };

  const handleCropApply = (croppedFile) => {
    // 실제 업로드할 크롭 결과도 용량 검사
    if (croppedFile.size > MAX_IMAGE_SIZE) {
      setFileError(
        "자른 이미지가 5MB를 초과했어요. 더 작은 영역이나 다른 사진을 선택해 주세요."
      );

      setDraftFile(null);
      setImageUrl("");
      return;
    }

    // 정상 결과만 부모에 전달
    setFileError("");
    onChange(croppedFile);
    onTouched?.();

    setDraftFile(null);
    setImageUrl("");
  };

  return (
    <div className={styles.imageUploadWrap}>
      <label className={styles.formTitle}>
        사진 업로드
      </label>

      <div className={styles.imageUploadForm}>
        {/* 확정된 파일명 표시 */}
        <div
          title={imageFile?.name}
          className={`${styles.fileName} ${
            displayedError
              ? styles.errorInput
              : ""
          }`}
        >
          {imageFile
            ? imageFile.name
            : "사진 업로드"}
        </div>

        {/* 실제 파일 input은 숨김 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="secondary"
          className={styles.selectButton}
          onClick={handleSelectClick}
        >
          파일 선택
        </Button>
      </div>

      {/* 파일 검사 오류 또는 부모의 오류 표시 */}
      {displayedError && (
        <p
          className={styles.errorMessage}
          role="alert"
        >
          {displayedError}
        </p>
      )}

      {/* 편집할 이미지가 있을 때만 모달 표시 */}
      {imageUrl && draftFile && (
        <ImageCrop
          key={imageUrl}
          imageUrl={imageUrl}
          fileName={draftFile.name}
          onClose={handleCropClose}
          onApply={handleCropApply}
        />
      )}
    </div>
  );
}