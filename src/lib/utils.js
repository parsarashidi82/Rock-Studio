import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * تابع کمکی ادغام شرطی و هوشمند کلاس‌های تیل‌ویند (Classnames Merger).
 * از تداخل کلاس‌های متضاد Tailwind جلوگیری می‌کند.
 * 
 * @param {...any} inputs - نام کلاس‌ها یا مقادیر شرطی
 * @returns {string} رشته نهایی کلاس‌های CSS ادغام‌شده
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
