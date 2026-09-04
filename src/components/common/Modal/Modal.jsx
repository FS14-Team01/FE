'use client'

import { useId } from 'react'
import Image from 'next/image'
import styles from './Modal.module.css'

function Modal({ title, message, confirmText, onConfirm, onClose }) {
  // 한 페이지에 동시에 여러 공통 모달이 렌더링될 경우 고정 id는 충돌 방지
  const titleId = useId()
  const messageId = useId()

  const hasValidTitle = typeof title === 'string' && title.trim()
  // 문자열뿐 아니라  줄바꿈 등 허용
  const hasValidMessage = Boolean(message)
  const hasValidConfirmText =
    typeof confirmText === 'string' && confirmText.trim()

  if (!hasValidTitle || !hasValidMessage || !hasValidConfirmText) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="모달 닫기"
        >
          <Image
            className={styles.iconClose}
            src="/assets/ic_close.svg"
            alt=""
            width={32}
            height={32}
          />
        </button>

        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>

          <p id={messageId} className={styles.message}>
            {message}
          </p>

          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
