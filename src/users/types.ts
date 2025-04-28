export type SsoUserInfo = {
  sub?: string; // 구글의 고유 ID
  email: string;
  name: string;
  provider?: string; // 소셜 로그인 제공자 (예: google, kakao 등)
};

export type DbUserInfo = {
  id: number; // 구글의 고유 ID
  email: string;
  name: string;
  nickname: string;
  subdomain: string; // 서브도메인
  thumbnailUrl: string; // 썸네일 URL
  bio: string; // 자기소개
  role: string; // 사용자 역할 (예: admin, user 등)
  provider?: string; // 소셜 로그인 제공자 (예: google, kakao 등)
  sub?: string; // 구글의 고유 ID
};
