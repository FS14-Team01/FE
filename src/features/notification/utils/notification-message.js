export function formatNotificationMessage(notification) {
  switch (notification.type) {
    case "CARD_SOLD":
      return (
        `${notification.userNickname}님이 ` +
        `[${notification.cardGrade} | ${notification.cardName}] ` +
        `포토카드 ${notification.quantity}장을 구매했습니다.`
      );
    case "CARD_SOLD_OUT":
      return (
        `[${notification.cardGrade} | ${notification.cardName}] ` +
        `포토카드가 품절되었습니다.`
      );
    case "EXCHANGE_OFFER_RECEIVED":
      return (
        `${notification.userNickname}님이 ` +
        `[${notification.cardGrade} | ${notification.cardName}] ` +
        `포토카드 교환을 제안했습니다.`
      );
    case "EXCHANGE_ACCEPTED":
      return (
        `${notification.userNickname}님과의 ` +
        `[${notification.cardGrade} | ${notification.cardName}] ` +
        `포토카드 교환이 성사되었습니다.`
      );
    case "EXCHANGE_REJECTED":
      return (
        `${notification.userNickname}님과의 ` +
        `[${notification.cardGrade} | ${notification.cardName}] ` +
        `포토카드 교환이 거절되었습니다.`
      );
    default:
      return "새로운 알림이 있습니다.";
  }
}
