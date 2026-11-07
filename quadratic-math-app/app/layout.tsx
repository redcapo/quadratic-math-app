import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '중3 수학 | 이차함수 그래프 탐구 및 형성평가',
  description: '이차함수의 그래프 평행이동, 일반형과 표준형, 최댓값과 최솟값 시각적 탐구 및 문제 풀이 웹사이트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
