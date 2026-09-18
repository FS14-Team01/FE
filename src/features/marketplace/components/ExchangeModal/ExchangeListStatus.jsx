import Button from "@/components/common/Button/Button";
import styles from "./ExchangeListStatus.module.css";

export default function ExchangeListStatus({
  message,
  isError = false,
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className={styles.feedback}>
      <p className={styles.message} role={isError ? "alert" : "status"}>
        {message}
      </p>
      {onRetry && (
        <Button
          className={styles.retryButton}
          onClick={onRetry}
          disabled={isRetrying}
        >
          다시 시도
        </Button>
      )}
    </div>
  );
}
