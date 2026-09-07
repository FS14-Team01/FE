/* Dropdown 공통 옵션. value는 API에 명세된 값, label은 화면에 보이는값 */

/** enum 카드 등급 */
export const GRADE_OPTIONS = [
  { value: 'COMMON', label: 'COMMON' },
  { value: 'RARE', label: 'RARE' },
  { value: 'SUPER_RARE', label: 'SUPER RARE' },
  { value: 'LEGENDARY', label: 'LEGENDARY' },
];

/** enum 카드 카테고리 */
export const CATEGORY_OPTIONS = [
  { value: 'POKEMON', label: '포켓몬' },
  { value: 'SUPER_MARIO', label: '슈퍼마리오' },
  { value: 'HELLO_KITTY', label: '헬로키티' },
  { value: 'DIGIMON', label: '디지몬' },
];

/** enum SaleListingStatus */
export const SALE_STATUS_OPTIONS = [
  { value: 'ON_SALE', label: '판매중' },
  { value: 'SOLD_OUT', label: '판매 완료' },
  { value: 'CANCELLED', label: '판매 취소' },
];
