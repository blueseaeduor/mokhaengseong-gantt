# mokhaengseong-gantt
## 로그인과 저장 (통합 회원 시스템 연결)

- 로그인한 상태에서는 기존 통합 회원 서비스(`goodgamedu-account-service`)의 성장 데이터(목행성 → 꿈일 → 세부 꿈일)에 저장됩니다.
- 로그인하지 않았거나 서비스에 닿지 않으면 이 기기(브라우저)에만 저장하는 모드로 동작합니다. 주소 끝에 `?local=1`을 붙여도 이 모드로 열립니다.
- `functions/api/account/[[path]].js` 가 `/api/account/*` 요청을 회원 서비스로 전달합니다.
- 운영 설정(Cloudflare Pages): 서비스 바인딩 `ACCOUNT` → `goodgamedu-account-service`, 사용자 도메인 연결, 회원 서비스 `ALLOWED_ORIGINS`에 이 사이트 주소 추가, 카카오·구글 로그인에 콜백 주소 `https://<이 사이트>/api/account/api/auth/callback/{kakao|google}` 등록.
