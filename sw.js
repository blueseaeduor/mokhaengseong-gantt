/* 목행성 간트: 홈 화면 앱으로 설치되게 해 주는 최소 서비스 워커.
   일정·로그인 정보는 항상 서버에서 새로 받아야 하므로 아무것도 저장(캐시)하지 않습니다. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* 브라우저가 평소처럼 처리 */ });
