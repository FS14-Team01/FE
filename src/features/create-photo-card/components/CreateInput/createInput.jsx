import styles from "@/features/create-photo-card/components/CreateInput/createInput.module.css";

export default function CreateInput({
  label,
  placeholder,
  value,
  variant,
  onChange,
  onBlur,
  type,
  max,
  min,
  error,
}) {
  // number 타입은 정수만 입력할 수 있도록 처리
  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (type === "number" && inputValue !== "" && !/^\d+$/.test(inputValue)) {
      return;
    }

    onChange(event);
  };

  return (
    <div className={styles.createInputWrap}>
      <label className={styles.formTitle}>{label}</label>

      <input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        type={type === "number" ? "text" : type}
        inputMode={type === "number" ? "numeric" : undefined}
        max={max}
        min={min}
        className={`${styles.createInput} ${variant ? styles[variant] : ""
          } ${error ? styles.errorInput : ""}`}
        onKeyDown={(event) => {
          if (type === "number" && ["-", ".", "e", "E"].includes(event.key)) {
            event.preventDefault();
          }
        }}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}