export function formatNotificationTime(createdAt) {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = Date.now();
  const elapsedMilliseconds = currentTime - createdTime;

  const seconds = elapsedMilliseconds / 1000;
  if (seconds < 120) {
    return "방금 전";
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${Math.floor(minutes)}분 전`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.floor(hours)}시간 전`;
  }

  const days = hours / 24;
  if (days < 7) {
    return `${Math.floor(days)}일 전`;
  }

  const weeks = days / 7;
  if (weeks < 4) {
    return `${Math.floor(weeks)}주일 전`;
  }

  if (days < 365) {
    const months = Math.max(1, Math.floor(days / 30));
    return `${Math.min(months, 11)}개월 전`;
  }

  const years = Math.floor(days / 365);
  return `${years}년 전`;
}
