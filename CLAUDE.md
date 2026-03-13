# CLAUDE.md — AI 컨텍스트 파일

## 프로젝트 개요

**MenuLens**는 해외 식당 메뉴판 사진을 찍으면 AI가 번역, 음식 설명, 개인 취향 기반 추천을 제공하는 서비스입니다. 언어 장벽으로 인해 현지 음식을 제대로 즐기지 못하는 여행자의 문제를 해결합니다.

## 이 프로젝트에서 AI의 역할

Claude는 이 프로젝트의 핵심 엔진입니다. 단순 번역 도구가 아니라 **음식 문화를 이해하는 가이드** 역할을 합니다.

### AI가 수행하는 작업

1. **이미지 분석**: 메뉴판 사진에서 텍스트를 추출하고 구조화
2. **번역**: 메뉴 이름과 설명을 한국어로 번역
3. **음식 설명 생성**: 재료, 맛, 조리법, 비슷한 한국 음식 비유 등을 자연어로 설명
4. **추천**: 사용자 취향 프로필을 기반으로 최적의 메뉴 추천 및 이유 설명

## 프롬프트 설계 원칙

- **친근하고 쉬운 언어** 사용 — 음식 초보자도 이해할 수 있게
- **한국인 관점**에서 설명 — "갈비찜과 비슷한 맛", "순두부찌개처럼 부드러운 식감" 등 비유 활용
- **과도한 전문 용어 지양** — 요리사가 아닌 여행자를 위한 설명
- **추천 시 이유 명시** — "매운 음식을 좋아하신다고 하셔서 추천드려요" 형태

## 시스템 프롬프트 구조

```
You are a friendly food guide for Korean travelers.
Given a menu photo, you will:
1. Extract all menu items
2. Translate each item to Korean
3. Describe each dish in simple Korean (ingredients, taste, texture, similar Korean food)
4. Recommend top 3 items based on user preferences: {user_preferences}

Response format: JSON
{
  "items": [{ "original": "", "translated": "", "description": "", "tags": [] }],
  "recommendations": [{ "item": "", "reason": "" }]
}
```

## 사용자 취향 프로필 스키마

```json
{
  "spicy": "low | medium | high",
  "vegetarian": true | false,
  "allergies": ["seafood", "nuts", "dairy", ...],
  "preferred_cuisine": ["japanese", "french", "chinese", ...],
  "adventurous": "low | medium | high"
}
```

## 개발 시 주의사항

- 메뉴판 이미지 품질이 낮을 경우 재촬영 안내 메시지 표시
- 인식 불가 항목은 "확인 불가" 표시, 전체 실패 처리 지양
- 응답은 항상 한국어로 출력
- 개인정보(얼굴, 배경 인물 등)는 서버에 저장하지 않음

## 디렉토리 구조

```
menulens/
├── app/
│   ├── page.tsx          # 메인 페이지 (사진 업로드)
│   ├── result/page.tsx   # 분석 결과 페이지
│   └── api/
│       └── analyze/route.ts  # Claude API 호출
├── components/
│   ├── MenuUploader.tsx
│   ├── MenuCard.tsx
│   └── RecommendationList.tsx
├── lib/
│   └── claude.ts         # AI 호출 유틸리티
├── CLAUDE.md
└── README.md
```
