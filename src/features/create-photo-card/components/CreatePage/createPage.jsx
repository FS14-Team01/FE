"use client";

import { useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  CATEGORY_OPTIONS,
  GRADE_OPTIONS,
} from "@/components/common/Dropdown/dropdownOptions";
import Button from "@/components/common/Button/Button";
import styles from "@/features/create-photo-card/components/CreatePage/createPage.module.css";
import CreateInput from "../CreateInput/createInput";
import ImageUpload from "../ImageUpload/ImageUpload";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 사용자가 한 번이라도 건드린 필드
  const [touched, setTouched] = useState({
    name: false,
    grade: false,
    category: false,
    price: false,
    totalSupply: false,
    image: false,
    description: false,
  });

  const handleTouched = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // 에러 메시지
  const nameError =
    touched.name && !name.trim()
      ? "포토카드 이름을 입력해 주세요."
      : "";

  const gradeError =
    touched.grade && !grade
      ? "등급을 선택해 주세요."
      : "";

  const categoryError =
    touched.category && !category
      ? "장르를 선택해 주세요."
      : "";

  const priceError =
    touched.price && price === ""
      ? "가격을 입력해 주세요."
      : price !== "" && Number(price) > 1000
        ? "가격은 1,000P 이하로 입력 가능합니다."
        : "";

  const totalSupplyError =
    touched.totalSupply && totalSupply === ""
      ? "총 발행량을 입력해 주세요."
      : totalSupply !== "" &&
          (Number(totalSupply) < 1 || Number(totalSupply) > 10)
        ? "총 발행량은 1장 이상 10장 이하로 선택 가능합니다."
        : "";

  const imageError =
    touched.image && !imageFile
      ? "이미지를 업로드해 주세요."
      : "";

  const descriptionError =
    touched.description && !description.trim()
      ? "포토카드 설명을 입력해 주세요."
      : "";

  // 모든 필드가 정상이어야 생성 버튼 활성화
  const isFormInvalid =
    !name.trim() ||
    !grade ||
    !category ||
    price === "" ||
    Number(price) > 1000 ||
    totalSupply === "" ||
    Number(totalSupply) < 1 ||
    Number(totalSupply) > 10 ||
    !imageFile ||
    !description.trim();

  return (
    <div className={styles.PhotoCardCreateWrap}>
      <div className={styles.titleWrap}>
        <div className={styles.title}>포토카드 생성</div>
      </div>

      <form className={styles.createForm}>
        {/* 포토카드 이름 */}
        <div className={styles.formWrap}>
          <CreateInput
            label="포토카드 이름"
            type="text"
            placeholder="포토카드 이름을 입력해 주세요"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => handleTouched("name")}
            error={nameError}
          />
        </div>

        {/* 등급 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>등급</div>

          <div
            className={styles.sortArea}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
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
              className={`${styles.createSort} ${
                gradeError ? styles.errorDropdown : ""
              }`}
            />
          </div>

          {gradeError && (
            <p className={styles.errorMessage}>{gradeError}</p>
          )}
        </div>

        {/* 장르 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>장르</div>

          <div
            className={styles.sortArea}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                handleTouched("category");
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
                handleTouched("category");
              }}
              className={`${styles.createSort} ${
                categoryError ? styles.errorDropdown : ""
              }`}
            />
          </div>

          {categoryError && (
            <p className={styles.errorMessage}>{categoryError}</p>
          )}
        </div>

        {/* 가격 */}
        <div className={styles.formWrap}>
          <CreateInput
            label="가격"
            type="number"
            min={0}
            max={1000}
            placeholder="가격을 입력해 주세요"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            onBlur={() => handleTouched("price")}
            error={priceError}
          />
        </div>

        {/* 총 발행량 */}
        <div className={styles.formWrap}>
          <CreateInput
            label="총 발행량"
            type="number"
            min={1}
            max={10}
            placeholder="총 발행량을 입력해 주세요"
            value={totalSupply}
            onChange={(event) => setTotalSupply(event.target.value)}
            onBlur={() => handleTouched("totalSupply")}
            error={totalSupplyError}
          />
        </div>

        {/* 이미지 */}
        <div className={styles.formWrap}>
          <ImageUpload
            imageFile={imageFile}
            onChange={setImageFile}
            onTouched={() => handleTouched("image")}
            error={imageError}
          />

          {imageError && (
            <p className={styles.errorMessage}>{imageError}</p>
          )}
        </div>

        {/* 설명 */}
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>포토카드 설명</div>

          <textarea
            className={`${styles.createDetail} ${
              descriptionError ? styles.errorInput : ""
            }`}
            placeholder="카드 설명을 입력해 주세요"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => handleTouched("description")}
          />

          {descriptionError && (
            <p className={styles.errorMessage}>
              {descriptionError}
            </p>
          )}
        </div>

        {/* 생성하기 */}
        <div className={styles.buttonWrap}>
          <Button
            type="submit"
            className={styles.btnCreate}
            disabled={isFormInvalid}
          >
            생성하기
          </Button>
        </div>
      </form>
    </div>
  );
}