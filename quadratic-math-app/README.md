# 중학교 3학년 이차함수 개념 탐구 및 형성평가 시스템

Vercel + Neon(PostgreSQL) 기반으로 작동하는 중학교 3학년 이차함수 수업용 웹 애플리케이션입니다.

## 주요 기능
1. **프로그램 1: 이차함수 시각적 탐구실**
   - 일반형 `y = ax² + bx + c` 와 표준형 `y = a(x - p)² + q` 양방향 슬라이더 및 직접 입력 연동
   - 완전제곱식을 이용한 일반형 → 표준형 실시간 단계별 수식 변환 표시
   - 평행이동 시 변하지 않는 것(폭, 볼록 방향)과 변하는 것(꼭짓점, 대칭축, y절편) 비교
   - 제한된 범위 설정을 통한 최댓값·최솟값 및 양 끝점 후보 시각적 탐구
2. **프로그램 2: 형성평가 및 교사 대시보드**
   - 학년, 반, 번호, 이름 입력 및 5개 핵심 개념 문항 풀이
   - 답안 제출 시 **"수고하셨습니다."** 완료 화면 출력 및 Neon DB 자동 채점 기록
   - 교사용 대시보드: 문항별 오답률 그래프(취약 개념 파악) 및 학생별 정오답 표 제공

---

## 빠른 배포 가이드 (GitHub -> Vercel & Neon)

### 1단계: GitHub에 업로드하기
1. GitHub에서 새 빈 저장소(Repository)를 생성합니다.
2. 압축을 푼 폴더 안에서 운영체제에 맞게 실행합니다:
   - **Windows**: `upload-to-github.bat` 더블클릭 후 GitHub 저장소 주소 입력
   - **Mac / Linux**: 터미널에서 `sh upload-to-github.sh` 실행 후 GitHub 저장소 주소 입력

### 2단계: Vercel 배포 및 Neon DB 연결
1. [Vercel](https://vercel.com) 대시보드에서 **Add New... > Project**를 클릭하고 방금 올린 GitHub 저장소를 **Import** 합니다.
2. **Environment Variables** 설정란에 다음 변수를 추가합니다:
   - 이름(Key): `DATABASE_URL`
   - 값(Value): Neon 콘솔에서 복사한 PostgreSQL Connection String
3. **Deploy** 버튼을 누르면 배포가 완료됩니다. (학생이 첫 답안을 제출하거나 교사 탭을 열면 `math_submissions` 테이블이 자동으로 생성됩니다.)
