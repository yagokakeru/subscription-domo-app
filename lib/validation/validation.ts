import { z } from "zod";
import { LABELS } from "../consts/labels";
import { MESSAGES } from "../consts/messages";

// priceidのバリデーション
export const priceidValidation = z.string().nullable().optional();

// supabace idのバリデーション
export const supabaceIdValidation = z.string().nullable().optional();

// メールアドレスのバリデーション
export const emailValidation = z.email(MESSAGES.INVALID_EMAIL);

// パスワードのバリデーション
export const passwordValidation = z.string().min(8, MESSAGES.MIN_LENGTH(LABELS.PASSWORD, 8));

// 名前のバリデーション
export const nameValidation = z.string().max(255, MESSAGES.MAX_LENGTH(LABELS.NAME, 255));