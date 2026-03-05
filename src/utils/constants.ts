const ORIGIN = String(import.meta.env.VITE_API_ORIGIN ?? 'https://larek-api.nomoreparties.co').replace(/\/+$/, '');

export const API_URL = `${ORIGIN}/api/weblarek`;
export const CDN_URL = `${ORIGIN}/content/weblarek/`;

export const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};