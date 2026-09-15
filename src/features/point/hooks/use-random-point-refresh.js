import { pointKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/components/common/Toast/ToastProvider";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 다음 KST 00시·12시까지 남은 시간 계산
function getMsUntilNextTargetTime() {
  const nowMs = Date.now();
  const kstNow = new Date(nowMs + KST_OFFSET_MS);
  const kstNowMs = kstNow.getTime();

  const time00 = Date.UTC(
    kstNow.getUTCFullYear(),
    kstNow.getUTCMonth(),
    kstNow.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );

  const time12 = Date.UTC(
    kstNow.getUTCFullYear(),
    kstNow.getUTCMonth(),
    kstNow.getUTCDate(),
    12,
    0,
    0,
    0,
  );

  const nextTarget = kstNowMs < time12 ? time12 : time00;

  return nextTarget - kstNowMs;
}

// 00시·12시에 랜덤박스 상태를 갱신하고 타이머 재등록
export function useRandomPointRefresh() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    let timerId;

    const scheduleNextRun = () => {
      const delay = getMsUntilNextTargetTime();

      timerId = setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: pointKeys.me(),
        });

        const pointData = queryClient.getQueryData(pointKeys.me());

        if (pointData?.canUseRandomBox) {
          showToast({
            status: "info",
            message: "새로운 랜덤박스 기회가 열렸어요!",
          });
        }

        scheduleNextRun();
      }, delay);
    };

    scheduleNextRun();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [queryClient, showToast]);
}
