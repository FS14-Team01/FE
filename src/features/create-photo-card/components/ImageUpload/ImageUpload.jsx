"use client";

import { useRef } from "react";
import Button from "@/components/common/Button/Button";
import styles from "./ImageUpload.module.css";

export default function ImageUpload({ imageFile, onChange }) {
  const fileInputRef = useRef(null);

  return (
    <div className={styles.imageUploadWrap}>
      <label className={styles.formTitle}>사진 업로드</label>

      <div className={styles.imageUploadForm}>
        {/* 선택된 파일명 표시 */}
        <div className={styles.fileName}>
          {imageFile ? imageFile.name : "사진 업로드"}
        </div>

        {/* 실제 파일 input은 숨김 */}
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          onChange={(event) => onChange(event.target.files[0] ?? null)}
        />

        <Button
          variant="secondary"
          className={styles.selectButton}
          onClick={() => fileInputRef.current?.click()}
        >
          파일 선택
        </Button>
      </div>
    </div>
  );
}