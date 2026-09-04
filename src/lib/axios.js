import axios from 'axios';

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './auth-token';

/** 공통 Axios 인스턴스. 기능 코드는 axios 대신 이 파일을 사용 */
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  // 리프레시 토큰 쿠키를 주고받기 위해 필요. 백엔드 CORS에 credentials 허용 필요
  withCredentials: true,
  // Content-Type은 지정하지 않음. 고정하면 FormData 요청에 boundary가 빠짐
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/** 서버가 응답하지 못한 경우의 status */
const NO_RESPONSE_STATUS = 0;

const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';

const REFRESH_ENDPOINT = '/auth/refresh';

/** 여기서 나는 401은 토큰 갱신으로 해결되지 않음 */
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/logout',
  REFRESH_ENDPOINT,
];

const DEFAULT_MESSAGES = {
  timeout: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
  network: '네트워크에 연결할 수 없습니다.',
  unknown: '알 수 없는 오류가 발생했습니다.',
};

/** 백엔드가 code/message를 주지 못한 경우에만 사용 */
const STATUS_FALLBACKS = {
  400: { code: 'INVALID_REQUEST', message: '요청 데이터가 올바르지 않습니다.' },
  401: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' },
  403: { code: 'FORBIDDEN', message: '해당 요청에 대한 권한이 없습니다.' },
  404: { code: 'NOT_FOUND', message: '요청한 데이터를 찾을 수 없습니다.' },
  409: {
    code: 'CONFLICT',
    message: '요청을 처리할 수 없는 상태입니다.',
  },
  500: {
    code: 'INTERNAL_SERVER_ERROR',
    message: '서버 오류가 발생했습니다.',
  },
};

/** baseURL이 붙은 절대 URL로도 들어와 경로 끝으로 비교 */
function isAuthEndpoint(url) {
  if (!url) return false;

  const path = url.split('?')[0];

  return AUTH_ENDPOINTS.some(
    (endpoint) => path === endpoint || path.endsWith(endpoint),
  );
}

/** 백엔드 계약 확정 전이라 { error: {...} }와 { code, message } 두 형태를 모두 받음 */
function extractErrorBody(data) {
  if (!data || typeof data !== 'object') return null;

  return data.error && typeof data.error === 'object' ? data.error : data;
}

/** 모든 에러를 { status, code, message, details, requestId, original } 형태로 통일 */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const body = extractErrorBody(data);
    const fallback = STATUS_FALLBACKS[status];

    return {
      status,
      code: body?.code ?? fallback?.code ?? UNKNOWN_ERROR_CODE,
      message: body?.message ?? fallback?.message ?? DEFAULT_MESSAGES.unknown,
      details: body?.details ?? null,
      requestId: body?.requestId ?? null,
      original: error,
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      status: NO_RESPONSE_STATUS,
      code: 'TIMEOUT',
      message: DEFAULT_MESSAGES.timeout,
      details: null,
      requestId: null,
      original: error,
    };
  }

  // 서버 다운, 네트워크 끊김, CORS
  if (error.request) {
    return {
      status: NO_RESPONSE_STATUS,
      code: 'NETWORK_ERROR',
      message: DEFAULT_MESSAGES.network,
      details: null,
      requestId: null,
      original: error,
    };
  }

  return {
    status: NO_RESPONSE_STATUS,
    code: UNKNOWN_ERROR_CODE,
    message: error.message || DEFAULT_MESSAGES.unknown,
    details: null,
    requestId: null,
    original: error,
  };
}

/** 401이 동시에 여러 개 나도 갱신은 한 번만 실행 */
let refreshPromise = null;

function refreshAccessToken() {
  // instance로 보내면 이 요청의 401이 인터셉터를 타 무한 루프
  refreshPromise ??= axios
    .post(REFRESH_ENDPOINT, null, {
      baseURL: instance.defaults.baseURL,
      withCredentials: true,
      timeout: instance.defaults.timeout,
    })
    .then((response) => {
      // 응답 형태가 확정 전이라 { accessToken }과 { data: { accessToken } } 모두 받음
      const body = response.data;
      const token = body?.accessToken ?? body?.data?.accessToken;

      if (!token) {
        throw new Error('갱신 응답에 액세스 토큰이 없습니다');
      }

      setAccessToken(token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/** 401이면 토큰을 갱신하고 원래 요청을 한 번만 재시도 */
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url) &&
      !!getAccessToken();

    if (shouldRefresh) {
      originalRequest._retry = true;

      let token;

      // 갱신 실패만 재로그인 상황이라 여기서만 토큰을 지움
      try {
        token = await refreshAccessToken();
      } catch (refreshError) {
        clearAccessToken();

        return Promise.reject(normalizeError(refreshError));
      }

      // 만료된 토큰이 남아 있어 갈아끼움
      originalRequest.headers.Authorization = `Bearer ${token}`;

      // 재시도가 실패하면 그 응답이 다시 인터셉터를 타 정규화됨
      return instance(originalRequest);
    }

    return Promise.reject(normalizeError(error));
  },
);

/**
 * 구매, 교환 승인에 필요한 Idempotency-Key.
 * 재시도 시에도 같은 키를 보내야 하므로 호출부에서 만들어 재사용할 것.
 */
export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default instance;
