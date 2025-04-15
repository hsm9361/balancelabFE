# BalanceLab FE

AI 기반 식단 분석 및 건강 예측 웹서비스의 프론트엔드입니다.  
React를 기반으로 구현되었으며, 사용자 식단 등록, 분석 결과 시각화, 캘린더 관리 등의 기능을 제공합니다.

---

##  사용 기술

- React (Create React App)
- JavaScript (ES6)
- CSS Module
- Axios
- React Router
- Chart.js

---

##  프로젝트 실행 방법

### 1. 프로젝트 클론

```bash
git clone https://github.com/hsm9361/balancelabFE.git
cd balancelabFE
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 파일 생성

`.env` 파일을 생성하고 아래와 같은 환경변수를 설정합니다:

```env
REACT_APP_API_URL=http://localhost:8080
```


### 4. 개발 서버 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하면 됩니다.

---

##  프로젝트 구조

```bash
balancelabFE/
├── public/
├── src/
│   ├── assets/                # 이미지, CSS 등 정적 리소스
│   ├── components/            # 공통 컴포넌트
│   ├── pages/                 # 라우팅 페이지 컴포넌트
│   ├── App.js
│   └── index.js
├── .env                      # 환경 변수 (개인 설정)
├── package.json              # 프로젝트 설정 및 스크립트
└── README.md
```

---

##  주요 기능

- 이미지 기반 식단 분석
- 일간/주간 캘린더에서 섭취 내역 확인
- 건강 예측 모델 결과 시각화
- 마이페이지에서 사용자 통계 확인

---

##  기타

백엔드 레포: [balancelabBE](https://github.com/hsm9361/balancelabBE)  
개발발

---

## 📸 스크린샷
