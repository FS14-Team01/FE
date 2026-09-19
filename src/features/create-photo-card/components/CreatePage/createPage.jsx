"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  CATEGORY_OPTIONS,
  GRADE_OPTIONS,
} from "@/components/common/Dropdown/dropdownOptions";
import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/common/Toast/ToastProvider";

import CreateInput from "@/features/create-photo-card/components/CreateInput/createInput";
import ImageUpload from "@/features/create-photo-card/components/ImageUpload/ImageUpload";
import useCreatePhotoCard from "@/features/create-photo-card/hooks/use-create-photo-card";
import usePhotoCardCreationStatus from "@/features/my-gallery/hooks/use-photo-card-creation-status";
import styles from "@/features/create-photo-card/components/CreatePage/createPage.module.css";

export default function CreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const creationSucceededRef = useRef(false);
  const {
    data: creationStatus,
    isLoading: isCreationStatusLoading,
    isError: isCreationStatusError,
  } = usePhotoCardCreationStatus();
  useEffect(() => {
    if (creationSucceededRef.current) return;
    if (isCreationStatusLoading) return;

    if (isCreationStatusError || !creationStatus) {
      showToast({
        status: "info",
        message: "생성 상태를 확인하지 못했어요.",
      });

      router.replace("/my-gallery");
      return;
    }

    if (!creationStatus.canCreate) {
      showToast({
        status: "info",
        message: "이번 주 모든 생성 기회를 소진했어요.",
      });

      router.replace("/my-gallery");
    }
  }, [
    creationStatus,
    isCreationStatusLoading,
    isCreationStatusError,
    router,
    showToast,
  ]);

  const {
    mutateAsync: createPhotoCard,
    isPending,
  } = useCreatePhotoCard();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [totalSupply, setTotalSupply] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [imageFile, setImageFile] =
    useState(null);

  // 사용자가 한 번이라도 건드린 필드
  const [touched, setTouched] = useState({
    name: false,
    grade: false,
    category: false,
    totalSupply: false,
    image: false,
    description: false,
  });

  // 특정 필드를 touched 상태로 변경
  const handleTouched = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // 포토카드 이름 오류
  const nameError =
    touched.name && !name.trim()
      ? "포토카드 이름을 입력해 주세요."
      : "";

  // 등급 오류
  const gradeError =
    touched.grade && !grade
      ? "등급을 선택해 주세요."
      : "";

  // 장르 오류
  const categoryError =
    touched.category && !category
      ? "장르를 선택해 주세요."
      : "";

  // 총 발행량 오류
  const totalSupplyError =
    touched.totalSupply &&
      totalSupply === ""
      ? "총 발행량을 입력해 주세요."
      : totalSupply !== "" &&
        (Number(totalSupply) < 1 ||
          Number(totalSupply) > 10)
        ? "총 발행량은 1장 이상 10장 이하로 선택 가능합니다."
        : "";

  // 이미지 오류
  const imageError =
    touched.image && !imageFile
      ? "이미지를 업로드해 주세요."
      : "";

  // 모든 필드가 정상이어야 생성 버튼 활성화
  const isFormInvalid =
    !name.trim() ||
    !grade ||
    !category ||
    totalSupply === "" ||
    Number(totalSupply) < 1 ||
    Number(totalSupply) > 10 ||
    !imageFile;

  // 포토카드 생성
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFormInvalid || isPending) {
      return;
    }

    try {
      await createPhotoCard({
        imageFile,
        name,
        grade,
        category,
        description,
        totalSupply,
      });
      creationSucceededRef.current = true;

      showToast({
        status: "success",
        action: "create",
      });

      router.push("/my-gallery");
    } catch {
      showToast({
        status: "failure",
        action: "create",
      });
    }
  };
  if (
    isCreationStatusLoading ||
    isCreationStatusError ||
    !creationStatus ||
    !creationStatus.canCreate
  ) {
    return null;
  }
  return (
    <div
      className={
        styles.PhotoCardCreateWrap
      }
    >
      <div className={styles.titleWrap}>
        <div className={styles.title}>
          포토카드 생성
        </div>
      </div>

      <form
        className={styles.createForm}
        onSubmit={handleSubmit}
      >
        {/* 포토카드 이름 */}
        <div className={styles.formWrap}>
          <CreateInput
            label="포토카드 이름"
            type="text"
            placeholder="포토카드 이름을 입력해 주세요"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            onBlur={() =>
              handleTouched("name")
            }
            error={nameError}
          />
        </div>

        {/* 등급 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>
            등급
          </div>

          <div
            className={styles.sortArea}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget
                )
              ) {
                handleTouched("grade");
              }
            }}
          >
            <Dropdown
              label="등급을 선택해 주세요"
              variant="sort"
              placeholder="등급을 선택해 주세요"
              options={GRADE_OPTIONS}
              value={grade}
              onChange={(value) => {
                setGrade(value);
                handleTouched("grade");
              }}
              className={`${styles.createSort} ${gradeError
                ? styles.errorDropdown
                : ""
              }`}
            />
          </div>

          {gradeError && (
            <p
              className={
                styles.errorMessage
              }
            >
              {gradeError}
            </p>
          )}
        </div>

        {/* 장르 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>
            장르
          </div>

          <div
            className={styles.sortArea}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget
                )
              ) {
                handleTouched(
                  "category"
                );
              }
            }}
          >
            <Dropdown
              label="장르를 선택해 주세요"
              variant="sort"
              placeholder="장르를 선택해 주세요"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(value) => {
                setCategory(value);
                handleTouched(
                  "category"
                );
              }}
              className={`${styles.createSort} ${categoryError
                ? styles.errorDropdown
                : ""
              }`}
            />
          </div>

          {categoryError && (
            <p
              className={
                styles.errorMessage
              }
            >
              {categoryError}
            </p>
          )}
        </div>

        {/* 총 발행량 */}
        <div className={styles.formWrap}>
          <CreateInput
            label="총 발행량"
            type="number"
            placeholder="총 발행량을 입력해 주세요"
            value={totalSupply}
            onChange={(event) =>
              setTotalSupply(
                event.target.value
              )
            }
            onBlur={() =>
              handleTouched(
                "totalSupply"
              )
            }
            error={totalSupplyError}
          />
        </div>

        {/* 이미지 */}
        <div className={styles.formWrap}>
          <ImageUpload
            imageFile={imageFile}
            onChange={setImageFile}
            onTouched={() =>
              handleTouched("image")
            }
            error={imageError}
          />
        </div>

        {/* 포토카드 설명 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>
            포토카드 설명
          </div>

          <textarea
            className={
              styles.createDetail
            }
            placeholder="카드 설명을 입력해 주세요"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
          />
        </div>

        {/* 생성하기 */}
        <div
          className={styles.buttonWrap}
        >
          <Button
            type="submit"
            className={
              styles.btnCreate
            }
            disabled={
              isFormInvalid ||
              isPending
            }
          >
            {isPending
              ? "생성 중..."
              : "생성하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}