# Cloudflare Images 백업 도구

이 프로젝트는 [Cursor AI](https://cursor.sh/)를 활용하여 개발된 Cloudflare Images의 이미지들을 로컬로 백업하는 도구입니다.

## 기능

- Cloudflare Images API를 사용하여 모든 이미지 목록 조회
- 이미지 파일들을 로컬의 `backups` 디렉토리에 자동 다운로드
- 페이지네이션을 통한 대량의 이미지 처리 지원
- 진행 상황 실시간 표시

## 시작하기

### 필수 요구사항

- Node.js (v14 이상)
- npm 또는 yarn
- Cloudflare 계정 및 API 토큰

### 설치

1. 저장소 클론:

```bash
git clone [repository-url]
cd backup-cloudflare-images
```

2. 의존성 설치:

```bash
npm install
```

3. 환경 변수 설정:

```bash
cp .env.example .env
```

`.env` 파일을 열어 실제 Cloudflare API 토큰과 계정 ID를 입력하세요.

### 실행

개발 모드로 실행:

```bash
npm run dev
```

프로덕션 모드로 실행:

```bash
npm start
```

빌드:

```bash
npm run build
```

## 프로젝트 구조

```
src/
  ├── index.ts              # 메인 애플리케이션 진입점
  └── services/
      ├── cloudflare.ts     # Cloudflare API 통신 서비스
      └── backup.ts         # 백업 프로세스 관리 서비스
```

## 환경 변수

| 변수명                | 설명                | 필수 여부 |
| --------------------- | ------------------- | --------- |
| CLOUDFLARE_API_TOKEN  | Cloudflare API 토큰 | 필수      |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare 계정 ID  | 필수      |

## 개발 도구

이 프로젝트는 [Cursor AI](https://cursor.sh/)를 사용하여 개발되었습니다. Cursor AI는 강력한 AI 기반 코드 에디터로, 효율적인 코드 작성과 프로젝트 구조화를 도와주었습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
