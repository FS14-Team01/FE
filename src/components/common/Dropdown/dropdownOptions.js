/* Dropdown 공통 옵션. value는 API에 명세된 값, label은 화면에 보이는 값 */

export {
  CARD_GRADE_OPTIONS as GRADE_OPTIONS,
  CARD_CATEGORY_OPTIONS as CATEGORY_OPTIONS,
  SALE_STATUS_OPTIONS,
  EXCHANGE_STATUS_OPTIONS,
} from '@/constants/marketplace-options';

/** 마켓플레이스 목록 정렬 */
export const MARKET_SORT_OPTIONS = [
  { value: 'recent', label: '최신순' },
  { value: 'priceAsc', label: '낮은 가격순' },
  { value: 'priceDesc', label: '높은 가격순' },
];

