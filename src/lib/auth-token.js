/**
 * 액세스 토큰 보관소
 *
 * 액세스 토큰은 localStorage, 리프레시 토큰은 httpOnly 쿠키입니다.
 * 리프레시 토큰은 브라우저가 자동으로 주고받으므로 여기서 다루지 않습니다.
 *
 * localStorage를 직접 부르지 않고 항상 이 파일을 거칩니다.
 * 키 이름이 바뀌거나 저장 위치가 바뀌어도 이 파일만 고치면 됩니다.
 */

const ACCESS_TOKEN_KEY = 'accessToken';

/** localStorage가 막혀도 새로고침 전까지는 로그인이 유지되도록 하는 대체 보관소 */
let memoryToken = null;

/** SSR·빌드 시점에는 window가 없습니다 */
const canUseStorage = () => typeof window !== 'undefined';

export function getAccessToken() {
  if (!canUseStorage()) return null;

  try {
    // 저장에 실패해 메모리에만 있는 토큰이 최신입니다
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? memoryToken;
  } catch {
    // 시크릿 모드 등에서 접근이 막힐 수 있습니다
    return memoryToken;
  }
}

export function setAccessToken(token) {
  if (!canUseStorage()) return;

  memoryToken = token;

  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // 저장에 실패해도 memoryToken으로 이번 세션은 동작합니다
  }
}

export function clearAccessToken() {
  if (!canUseStorage()) return;

  memoryToken = null;

  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // 무시
  }
}
