"use client"
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { CATEGORY_OPTIONS, GRADE_OPTIONS } from "@/components/common/Dropdown/dropdownOptions";
import styles from "@/features/create-photo-card/components/CreatePage/createPage.module.css";
import { useState } from "react";
import CreateInput from "../CreateInput/createInput";
import Button from "@/components/common/Button/Button";
import ImageUpload from "../ImageUpload/ImageUpload";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [imageFile, setImageFile] = useState(null);

  //수량 오류체크
  const totalSupplyError =
    totalSupply !== "" && Number(totalSupply) > 10
      ? "총 발행량은 10장 이하로 선택 가능합니다."
      : "";
  const priceError =
    price !== "" && Number(price) > 1000
      ? "가격은 1,000P 이하로 입력 가능합니다."
      : "";

  const isFormInvalid = Boolean(priceError || totalSupplyError);

  return (
    <>
      <div className={styles.PhotoCardCreateWrap}>
        <div className={styles.titleWrap}>
          <div className={styles.title}>
            포토카드 생성
          </div>
        </div>
        <form className={styles.createForm}>
          <div className={styles.formWrap}>
            <CreateInput
              label="포토카드 이름"
              type="text"
              placeholder="포토카드 이름을 입력해 주세요"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className={styles.formWrap}>
            <div className={styles.formTitle}>
              등급
            </div>
            <div className={styles.sortArea}>
              <Dropdown
                label="등급을 선택해 주세요"
                variant="sort"
                placeholder="등급을 선택해 주세요"
                options={GRADE_OPTIONS}
                onChange={setGrade}
                value={grade}
                className={styles.createSort}
              />
            </div>
          </div>
          <div className={styles.formWrap}>
            <div className={styles.formTitle}>
              장르
            </div>
            <div className={styles.sortArea}>
              <Dropdown
                label="장르를 선택해 주세요"
                variant="sort"
                placeholder="장르를 선택해 주세요"
                options={CATEGORY_OPTIONS}
                onChange={setCategory}
                value={category}
                className={styles.createSort}
              />
            </div>
          </div>
          <div className={styles.formWrap}>
            <CreateInput
              label="가격"
              type="number"
              min={0}
              max={1000}
              placeholder="가격을 입력해 주세요"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              error={priceError}
            />
          </div>
          <div className={styles.formWrap}>
            <CreateInput
              label="총 발행량"
              type="number"
              min={1}
              max={10}
              placeholder="총 발행량을 입력해 주세요"
              value={totalSupply}
              onChange={(event) => setTotalSupply(event.target.value)}
              error={totalSupplyError}
            />
          </div>
          <div className={styles.formWrap}>
            <ImageUpload/>
          </div>
          <div className={styles.buttonWrap}>
            <Button 
              className={styles.btnCreate}
              disabled
            >생성하기</Button>
          </div>
        </form>
      </div>
    </>
  )
}