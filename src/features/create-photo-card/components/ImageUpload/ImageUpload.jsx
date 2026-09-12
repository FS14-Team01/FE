"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/common/Button/Button";
import ImageCrop from "@/features/create-photo-card/components/ImageCrop/ImageCrop";
import styles from "@/features/create-photo-card/components/ImageUpload/ImageUpload.module.css";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function ImageUpload({ imageFile, onChange, onTouched, error }) {
  const fileInputRef = useRef(null);
  const [draftFile, setDraftFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 현재 편집 파일과 일치하는 주소만 사용
  const imageUrl = draftFile && preview?.file === draftFile ? preview.url : "";

  useEffect(() => {
    if (!draftFile) return;

    const url = URL.createObjectURL(draftFile);
    setPreview({ file: draftFile, url });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [draftFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // 같은 파일도 다시 선택 가능
    if (!file) return;
    console.log("파일 형식:", file.type);
    console.log("파일 용량:", file.size);
    console.log(ALLOWED_IMAGE_TYPES.includes(file.type));
    // 이미지 확정하지 않음
    setDraftFile(file);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropClose = () => {
    setDraftFile(null); // 취소하면 기존 확정 이미지 유지
  };

  const handleCropApply = (croppedFile) => {
    onChange(croppedFile); // 잘린 파일을 부모에 전달
    onTouched?.();
    setDraftFile(null);
  };

  return (
    <div className={styles.imageUploadWrap}>
      <label className={styles.formTitle}>사진 업로드</label>

      <div className={styles.imageUploadForm}>
        {/* 선택된 파일명 표시 */}
        <div title={imageFile?.name} className={`${styles.fileName} ${error ? styles.errorInput : ""}`}>
          {imageFile ? imageFile.name : "사진 업로드"}
        </div>

        {/* 실제 파일 input은 숨김 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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

      {imageUrl && (
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
