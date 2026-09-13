import { pointKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/components/common/Toast/ToastProvider";

// 00시·12시까지 남은 시간 계산
function getMsUntilNextTargetTime() {
  const now = new Date();

  const time00 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  const time12 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12,
    0,
    0,
    0,
  );

  let nextTarget;

  if (now < time12) {
    nextTarget = time12;
  } else {
    nextTarget = time00;
  }

  return nextTarget.getTime() - now.getTime();
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
