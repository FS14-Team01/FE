"use client"
import Button from "@/components/common/Button/Button.jsx";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { CATEGORY_OPTIONS, GRADE_OPTIONS } from "@/components/common/Dropdown/dropdownOptions";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MyGalleryPage.module.css";
import MobileFilterSheet from "@/components/MobileFilterSheet/MobileFilterSheet";
import PhotoCard from "@/components/common/PhotoCard/PhotoCard";

export default function MyGalleryPage() {
  const router = useRouter(); // 페이지 이동에 사용할 객체
  const nickname = "유디"
  const totalCount = "40"
  const gradeCounts = [
    { grade: "COMMON", count: 20 },
    { grade: "RARE", count: 8 },
    { grade: "SUPER_RARE", count: 3 },
    { grade: "LEGENDARY", count: 5 }
  ];
  /* 필터 */
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /* 포토카드 */
  const photoCardList =
    Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      imageUrl: "",
      name: "카드예시",
      creatorNickname: "유디짱",
      grade: "RARE",
      category: "포켓몬",
      quantity: 5
    }));

  return (
    <>
      <div className={styles.myGalleryWrap}>
        <div className={styles.titleWrap}>
          <div className={styles.title}>마이 갤러리</div>
          <Button className={styles.btnCreate}
            type="button"
            variant="primary"
            size="lg"
            onClick={() => router.push("/my-gallery/create")}
          >포토카드 생성하기</Button>
        </div>
        <div className={styles.ownershipWrap}>
          <div className={styles.title}>
            {nickname}님이 보유한 포토카드<span>({totalCount}장)</span>
          </div>
          <div className={styles.gradeWrap}>
            {gradeCounts.map((item) => (
              <div
                key={item.grade}
                className={`${styles.grade} ${styles[item.grade.toLowerCase()]}`}
              >
                {item.grade.replace("_", " ")} {item.count}장
              </div>
            ))}
          </div>
        </div>
        <div className={styles.searchWrap}>
          <div className={styles.mobileFilterWrap}>
            <MobileFilterSheet />
          </div>
          <div className={styles.searchInputWrap}>
            <SearchInput className={styles.searchInput} />
          </div>
          <div className={styles.dropDownWrap}>
            <div className={styles.gradeDropdown}>
              <Dropdown
                options={GRADE_OPTIONS}
                value={selectedGrade}
                onChange={setSelectedGrade}
                placeholder="등급"
                label="등급 필터"
                variant="filter"
              />
            </div>
            <div className={styles.categoryDropdown}>
              <Dropdown
                options={CATEGORY_OPTIONS}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="장르"
                label="장르 필터"
                variant="filter"
              />
            </div>
          </div>
        </div>
        <div className={styles.photocardWrap}>
          {photoCardList.map((photoCard) => (
            <PhotoCard
              variant="ownership"
              showPrice={false}
              key={photoCard.id}
              name={photoCard.name}
              imageUrl={photoCard.imageUrl}
              category={photoCard.category}
              quantity={photoCard.quantity}
              grade={photoCard.grade}
              creatorNickname={photoCard.creatorNickname}
            />
          ))}
        </div>
      </div>

    </>

  );
}