# Design System Theme Playground
change design system(from vercel design system resource)
<img width="1851" height="894" alt="스크린샷 2026-06-22 오후 1 56 51" src="https://github.com/user-attachments/assets/9fa8c5bd-89ad-42c9-9e64-56534c38933f" />

`design-md/` 안에 있는 여러 브랜드 디자인 시스템 문서를 선택해서, 같은 페이지가 어떻게 달라지는지 확인하는 테스트 페이지입니다.

## What It Does

- `design-md/*/DESIGN.md` 파일을 자동으로 불러옵니다.
- 상단 select에서 Airbnb, Apple, Cursor, Vercel 등 다양한 디자인 시스템을 전환할 수 있습니다.
- 선택한 디자인 시스템의 색상, 타이포그래피, radius, spacing, component token을 CSS 변수로 변환해 페이지에 적용합니다.
- 배경, hero, color palette, button, input, card, code block, CTA 영역의 변화를 한눈에 비교할 수 있습니다.

## Project Structure