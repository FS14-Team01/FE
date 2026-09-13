import { pointKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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

  useEffect(() => {
    let timerId;

    const scheduleNextRun = () => {
      const delay = getMsUntilNextTargetTime();

      timerId = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: pointKeys.me(),
        });

        scheduleNextRun();
      }, delay);
    };

    scheduleNextRun();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [queryClient]);
}
