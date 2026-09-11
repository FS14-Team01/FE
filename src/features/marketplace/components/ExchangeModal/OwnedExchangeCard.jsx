import PhotoCard from "@/components/common/PhotoCard/PhotoCard";
import { getCardCategoryLabel } from "@/constants/marketplace-options";
import styles from "./OwnedExchangeCard.module.css";

export default function OwnedExchangeCard({ ownership, onSelect, disabled }) {
  const { photoCard, quantity } = ownership;

  return (
    <div className={styles.cardFrame}>
      <PhotoCard
        imageUrl={photoCard.imageUrl}
        name={photoCard.name}
        grade={photoCard.grade}
        category={getCardCategoryLabel(photoCard.category)}
        quantity={quantity}
        variant="ownership"
        showPrice={false}
        onSelect={onSelect}
        disabled={disabled}
      />
    </div>
  );
}
