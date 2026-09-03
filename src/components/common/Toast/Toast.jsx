'use client'

import { useEffect } from 'react'
import Image from 'next/image'

import { TOAST_ACTIONS, TOAST_ICONS } from './toastConfig'
import styles from './Toast.module.css'

function Toast({ status, action, message, onClose }) {
  const isValidStatus = Object.hasOwn(TOAST_ICONS, status)

  const actionText = TOAST_ACTIONS[action]

  const toastMessage =
    status === 'info'
      ? message
      : actionText
        ? `포토카드 ${actionText}에 ${
            status === 'success' ? '성공했습니다!' : '실패했습니다.'
          }`
        : ''

  const hasValidMessage =
    typeof toastMessage === 'string' && toastMessage.trim()

  useEffect(() => {
    if (!isValidStatus || !hasValidMessage) return

    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [isValidStatus, hasValidMessage, onClose])

  if (!isValidStatus || !hasValidMessage) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <Image
        className={styles.icon}
        src={TOAST_ICONS[status]}
        alt=""
        width={24}
        height={24}
      />

      <p className={styles.message}>{toastMessage}</p>
    </div>
  )
}

export default Toast
