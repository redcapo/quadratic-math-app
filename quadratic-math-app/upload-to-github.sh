#!/bin/bash
echo "===================================================="
echo "   중3 이차함수 탐구 및 평가 시스템 GitHub 업로드"
echo "===================================================="
read -p "생성한 GitHub 저장소 주소(URL)를 입력하세요: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "오류: 저장소 주소가 입력되지 않았습니다."
  exit 1
fi

git init
git add .
git commit -m "Initial commit: 중학교 3학년 이차함수 탐구 및 형성평가 웹앱"
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git push -u origin main

echo "✅ GitHub 업로드가 완료되었습니다! 이제 Vercel에서 해당 저장소를 Import 하세요."
