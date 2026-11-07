'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: '계수 a의 역할과 그래프의 폭·방향',
    question: '이차함수 y = ax² + bx + c의 그래프가 위로 볼록하고, y = -2x²의 그래프보다 폭이 좁을 때, 다음 중 상수 a의 값으로 알맞은 것은?',
    options: ['a = -3', 'a = -1', 'a = 2', 'a = 4'],
    correctIndex: 0,
    explanation: '위로 볼록하므로 a < 0이어야 하고, 폭이 y = -2x²보다 좁으려면 |a| > 2이어야 합니다. 따라서 a = -3이 알맞습니다.'
  },
  {
    id: 2,
    category: '평행이동의 불변량과 변화량',
    question: '이차함수 y = 3x²의 그래프를 x축 방향으로 2만큼, y축 방향으로 -5만큼 평행이동했을 때, 처음 그래프와 비교하여 변하지 않는 것은?',
    options: [
      '꼭짓점의 좌표',
      '축의 방정식',
      '그래프의 모양(폭)과 볼록한 방향',
      'y축과 만나는 점의 좌표(y절편)'
    ],
    correctIndex: 2,
    explanation: '평행이동을 해도 이차항의 계수 a(여기서는 3)는 변하지 않으므로 그래프의 모양(폭)과 아래로 볼록한 방향은 그대로 유지됩니다.'
  },
  {
    id: 3,
    category: '완전제곱식을 이용한 일반형 → 표준형 변환',
    question: '이차함수 y = 2x² - 8x + 5를 표준형 y = a(x - p)² + q 꼴로 고칠 때, 꼭짓점의 좌표 (p, q)와 축의 방정식으로 옳은 것은?',
    options: [
      '꼭짓점: (-2, -3), 축의 방정식: x = -2',
      '꼭짓점: (2, -3), 축의 방정식: x = 2',
      '꼭짓점: (2, 5), 축의 방정식: x = 2',
      '꼭짓점: (4, -11), 축의 방정식: x = 4'
    ],
    correctIndex: 1,
    explanation: 'y = 2(x² - 4x + 4 - 4) + 5 = 2(x - 2)² - 3 이므로 꼭짓점의 좌표는 (2, -3)이고, 축의 방정식은 x = 2입니다.'
  },
  {
    id: 4,
    category: '전체 범위에서의 최댓값과 최솟값',
    question: 'x의 값의 범위가 실수 전체일 때, 이차함수 y = -(x + 1)² + 4에 대한 설명으로 옳은 것은?',
    options: [
      'x = 1일 때 최댓값 4를 갖는다.',
      'x = -1일 때 최솟값 4를 갖는다.',
      'x = -1일 때 최댓값 4를 가지며, 최솟값은 없다.',
      '최댓값은 4이고, 최솟값은 0이다.'
    ],
    correctIndex: 2,
    explanation: 'a = -1 < 0이므로 위로 볼록한 포물선입니다. 따라서 꼭짓점 (-1, 4)에서 최댓값 4를 가지며, 아래로 끝없이 내려가므로 최솟값은 없습니다.'
  },
  {
    id: 5,
    category: '제한된 범위(양 끝점 후보)에서의 최대·최소',
    question: '제한된 범위 1 ≤ x ≤ 4에서 이차함수 y = (x - 2)² + 1의 최댓값(M)과 최솟값(m)을 구할 때, 각 값이 나타나는 지점으로 옳게 짝지어진 것은?',
    options: [
      '최댓값: 꼭짓점(x=2), 최솟값: 왼쪽 끝점(x=1)',
      '최댓값: 오른쪽 끝점(x=4), 최솟값: 왼쪽 끝점(x=1)',
      '최댓값: 오른쪽 끝점(x=4), 최솟값: 꼭짓점(x=2)',
      '최댓값: 왼쪽 끝점(x=1), 최솟값: 오른쪽 끝점(x=4)'
    ],
    correctIndex: 2,
    explanation: '꼭짓점의 x좌표 2가 범위(1 ≤ x ≤ 4) 안에 포함됩니다. 아래로 볼록하므로 꼭짓점 x=2일 때 최솟값 1을 갖고, 대칭축(x=2)에서 더 멀리 떨어진 오른쪽 끝점 x=4일 때 최댓값 5를 갖습니다.'
  }
];

const fmt = (n: number) => {
  const rounded = Math.round(n * 100) / 100;
  return Object.is(rounded, -0) ? '0' : rounded.toString();
};

export default function QuadraticMathApp() {
  const [activeProgram, setActiveProgram] = useState<'program1' | 'program2'>('program1');

  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(3);
  const [p, setP] = useState<number>(2);
  const [q, setQ] = useState<number>(-1);

  const [useDomain, setUseDomain] = useState<boolean>(false);
  const [x1, setX1] = useState<number>(-1);
  const [x2, setX2] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleAChange = (newA: number) => {
    const safeA = newA === 0 ? 0.5 : newA;
    const newP = -b / (2 * safeA);
    const newQ = c - (b * b) / (4 * safeA);
    setA(safeA);
    setP(Number(newP.toFixed(2)));
    setQ(Number(newQ.toFixed(2)));
  };

  const handleGeneralChange = (newB: number, newC: number) => {
    const newP = -newB / (2 * a);
    const newQ = newC - (newB * newB) / (4 * a);
    setB(Number(newB.toFixed(2)));
    setC(Number(newC.toFixed(2)));
    setP(Number(newP.toFixed(2)));
    setQ(Number(newQ.toFixed(2)));
  };

  const handleStandardChange = (newP: number, newQ: number) => {
    const newB = -2 * a * newP;
    const newC = a * newP * newP + newQ;
    setP(Number(newP.toFixed(2)));
    setQ(Number(newQ.toFixed(2)));
    setB(Number(newB.toFixed(2)));
    setC(Number(newC.toFixed(2)));
  };

  const getExtremaAnalysis = () => {
    const f = (x: number) => a * (x - p) * (x - p) + q;
    const leftX = Math.min(x1, x2);
    const rightX = Math.max(x1, x2);
    const vertexIncluded = p >= leftX && p <= rightX;

    const candidates: { label: string; x: number; y: number; type: 'left' | 'right' | 'vertex' }[] = [
      { label: '왼쪽 끝점', x: leftX, y: f(leftX), type: 'left' },
      { label: '오른쪽 끝점', x: rightX, y: f(rightX), type: 'right' }
    ];

    if (vertexIncluded) {
      candidates.push({ label: '꼭짓점 (범위 내 포함)', x: p, y: q, type: 'vertex' });
    }

    let maxPt = candidates[0];
    let minPt = candidates[0];
    for (const pt of candidates) {
      if (pt.y > maxPt.y) maxPt = pt;
      if (pt.y < minPt.y) minPt = pt;
    }

    return { leftX, rightX, vertexIncluded, candidates, maxPt, minPt };
  };

  const extrema = getExtremaAnalysis();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25;
    const originX = width / 2;
    const originY = height / 2;

    const toPxX = (x: number) => originX + x * scale;
    const toPxY = (y: number) => originY - y * scale;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.strokeStyle = i % 5 === 0 ? '#cbd5e1' : '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(toPxX(i), 0);
      ctx.lineTo(toPxX(i), height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, toPxY(i));
      ctx.lineTo(width, toPxY(i));
      ctx.stroke();
    }

    if (useDomain) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      const startPx = toPxX(extrema.leftX);
      const endPx = toPxX(extrema.rightX);
      ctx.fillRect(startPx, 0, endPx - startPx, height);
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        ctx.fillText(i.toString(), toPxX(i) - 6, originY + 15);
        ctx.fillText(i.toString(), originX + 6, toPxY(i) + 4);
      }
    }
    ctx.fillText('O', originX - 14, originY + 15);

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px - originX) / scale;
      const y = a * x * x;
      const py = toPxY(y);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toPxX(p), 0);
    ctx.lineTo(toPxX(p), height);
    ctx.stroke();
    ctx.fillStyle = '#9333ea';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`축 x = ${fmt(p)}`, toPxX(p) + 6, 20);
    ctx.restore();

    const f = (x: number) => a * (x - p) * (x - p) + q;

    if (!useDomain) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scale;
        const py = toPxY(f(x));
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else {
      ctx.save();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scale;
        const py = toPxY(f(x));
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const startPx = Math.max(0, toPxX(extrema.leftX));
      const endPx = Math.min(width, toPxX(extrema.rightX));
      for (let px = startPx; px <= endPx; px += 1) {
        const x = (px - originX) / scale;
        const py = toPxY(f(x));
        if (px === startPx) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(toPxX(0), toPxY(c), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`y절편 (0, ${fmt(c)})`, toPxX(0) + 8, toPxY(c) - 6);

    if (!useDomain) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(toPxX(p), toPxY(q), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`꼭짓점 (${fmt(p)}, ${fmt(q)})`, toPxX(p) + 8, toPxY(q) + 16);
    } else {
      if (!extrema.vertexIncluded) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(toPxX(p), toPxY(q), 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = '11px sans-serif';
        ctx.fillText(`꼭짓점(범위 밖) (${fmt(p)}, ${fmt(q)})`, toPxX(p) + 8, toPxY(q) + 14);
      }

      extrema.candidates.forEach((pt) => {
        const isMax = pt.x === extrema.maxPt.x && pt.y === extrema.maxPt.y;
        const isMin = pt.x === extrema.minPt.x && pt.y === extrema.minPt.y;

        ctx.fillStyle = isMax ? '#dc2626' : isMin ? '#2563eb' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(toPxX(pt.x), toPxY(pt.y), 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        const tag = isMax ? '최댓값' : isMin ? '최솟값' : '후보';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(
          `[${tag}] ${pt.label} (${fmt(pt.x)}, ${fmt(pt.y)})`,
          toPxX(pt.x) + 10,
          toPxY(pt.y) - 8
        );
      });
    }
  }, [a, b, c, p, q, useDomain, x1, x2, extrema]);

  const [subMode, setSubMode] = useState<'student' | 'teacher'>('student');
  const [grade, setGrade] = useState<string>('3');
  const [classNum, setClassNum] = useState<string>('');
  const [studentNum, setStudentNum] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!grade || !classNum || !studentNum || !studentName.trim()) {
      setSubmitError('학년, 반, 번호, 이름을 모두 정확히 입력해주세요.');
      return;
    }

    if (Object.keys(selectedAnswers).length < QUESTIONS.length) {
      setSubmitError('모든 문제를 풀어야 제출할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);

    let correctCount = 0;
    const detailedAnswers = QUESTIONS.map((q) => {
      const chosen = selectedAnswers[q.id];
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        category: q.category,
        chosenIndex: chosen,
        chosenText: q.options[chosen],
        correctIndex: q.correctIndex,
        isCorrect
      };
    });

    const totalScore = correctCount * 20;

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: Number(grade),
          classNum: Number(classNum),
          studentNum: Number(studentNum),
          studentName: studentName.trim(),
          score: totalScore,
          answers: detailedAnswers
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '제출에 실패했습니다.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || '서버 통신 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTeacherResults = async () => {
    setIsLoadingResults(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (res.ok && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('교사용 데이터 조회 실패:', error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  useEffect(() => {
    if (activeProgram === 'program2' && subMode === 'teacher') {
      fetchTeacherResults();
    }
  }, [activeProgram, subMode]);

  const getQuestionStats = () => {
    const totalStudents = submissions.length;
    return QUESTIONS.map((q) => {
      if (totalStudents === 0) {
        return { ...q, wrongCount: 0, wrongRate: 0 };
      }
      let wrongCount = 0;
      submissions.forEach((sub) => {
        const ansList = Array.isArray(sub.answers) ? sub.answers : [];
        const target = ansList.find((a: any) => a.questionId === q.id);
        if (!target || !target.isCorrect) {
          wrongCount++;
        }
      });
      const wrongRate = Math.round((wrongCount / totalStudents) * 100);
      return { ...q, wrongCount, wrongRate };
    });
  };

  const questionStats = getQuestionStats();

  const formatGeneralFormula = () => {
    const aStr = a === 1 ? 'x²' : a === -1 ? '-x²' : `${fmt(a)}x²`;
    const bStr =
      b === 0
        ? ''
        : b > 0
        ? ` + ${b === 1 ? '' : fmt(b)}x`
        : ` - ${Math.abs(b) === 1 ? '' : fmt(Math.abs(b))}x`;
    const cStr = c === 0 ? '' : c > 0 ? ` + ${fmt(c)}` : ` - ${fmt(Math.abs(c))}`;
    return `y = ${aStr}${bStr}${cStr}`;
  };

  const formatStandardFormula = () => {
    const aStr = a === 1 ? '' : a === -1 ? '-' : fmt(a);
    const pPart =
      p === 0 ? 'x²' : p > 0 ? `(x - ${fmt(p)})²` : `(x + ${fmt(Math.abs(p))})²`;
    const qPart = q === 0 ? '' : q > 0 ? ` + ${fmt(q)}` : ` - ${fmt(Math.abs(q))}`;
    return `y = ${aStr}${pPart}${qPart}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              중학교 3학년 수학
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              이차함수의 그래프와 최대·최소 탐구 시스템
            </h1>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveProgram('program1')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeProgram === 'program1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              프로그램 1: 이차함수 시각적 탐구실
            </button>
            <button
              onClick={() => setActiveProgram('program2')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeProgram === 'program2'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              프로그램 2: 문제 풀이 및 교사 확인
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeProgram === 'program1' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-around gap-4">
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-500 mb-1">일반형 (General Form)</p>
                <p className="text-2xl font-extrabold text-blue-700 font-mono">{formatGeneralFormula()}</p>
              </div>
              <div className="text-slate-400 font-bold text-xl">⟺</div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-500 mb-1">표준형 (Standard Form / 평행이동)</p>
                <p className="text-2xl font-extrabold text-indigo-700 font-mono">{formatStandardFormula()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="font-bold text-slate-800 text-lg">좌표평면 그래프 시각화</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-slate-400 inline-block border-b border-dashed" /> 기본형 y = ax²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 bg-blue-600 inline-block rounded" /> 현재 그래프
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block" /> 꼭짓점/최댓값
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="border border-slate-200 rounded-xl shadow-inner bg-slate-50 max-w-full h-auto"
                  />
                </div>

                <div className="w-full mt-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">핵심 원리</span>
                    완전제곱식을 이용한 일반형 → 표준형 변환 과정
                  </h3>
                  <div className="text-xs sm:text-sm space-y-1.5 font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                    <p>
                      <span className="text-slate-400 mr-2">1단계 (현재 일반형):</span>
                      <strong>{formatGeneralFormula()}</strong>
                    </p>
                    <p>
                      <span className="text-slate-400 mr-2">2단계 (이차항 계수 a로 묶기):</span>
                      y = {fmt(a)}(x² {b / a >= 0 ? `+ ${fmt(b / a)}x` : `- ${fmt(Math.abs(b / a))}x`}) {c >= 0 ? `+ ${fmt(c)}` : `- ${fmt(Math.abs(c))}`}
                    </p>
                    <p>
                      <span className="text-slate-400 mr-2">3단계 (일차항 계수 절반의 제곱 더하고 빼기):</span>
                      y = {fmt(a)}(x² {b / a >= 0 ? `+ ${fmt(b / a)}x` : `- ${fmt(Math.abs(b / a))}x`}{' '}
                      <span className="text-blue-600 font-bold">+ {fmt(p * p)} - {fmt(p * p)}</span>) {c >= 0 ? `+ ${fmt(c)}` : `- ${fmt(Math.abs(c))}`}
                    </p>
                    <p>
                      <span className="text-slate-400 mr-2">4단계 (완전제곱식 정리 완료):</span>
                      <strong className="text-indigo-700">{formatStandardFormula()}</strong>
                      <span className="text-slate-500 ml-2">
                        (꼭짓점: ({fmt(p)}, {fmt(q)}), 대칭축: x = {fmt(p)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800">1. 일반형 계수 조작 (y = ax² + bx + c)</h3>
                    <button
                      onClick={() => {
                        setA(1);
                        handleGeneralChange(-4, 3);
                      }}
                      className="text-xs text-slate-500 hover:text-blue-600 underline"
                    >
                      초기화
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>이차항 계수 a (그래프의 폭과 볼록 방향, a ≠ 0)</span>
                        <span className="text-blue-600">a = {fmt(a)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-4"
                          max="4"
                          step="0.5"
                          value={a}
                          onChange={(e) => handleAChange(parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={a}
                          onChange={(e) => handleAChange(parseFloat(e.target.value) || 1)}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded text-center font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>일차항 계수 b (축의 위치에 영향)</span>
                        <span className="text-blue-600">b = {fmt(b)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          step="0.5"
                          value={b}
                          onChange={(e) => handleGeneralChange(parseFloat(e.target.value), c)}
                          className="w-full accent-blue-600"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={b}
                          onChange={(e) => handleGeneralChange(parseFloat(e.target.value) || 0, c)}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded text-center font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>상수항 c (y축과의 교점 / y절편)</span>
                        <span className="text-blue-600">c = {fmt(c)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-8"
                          max="8"
                          step="0.5"
                          value={c}
                          onChange={(e) => handleGeneralChange(b, parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={c}
                          onChange={(e) => handleGeneralChange(b, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-3">
                    2. 평행이동 조작 (y = a(x - p)² + q)
                  </h3>

                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>x축 방향 평행이동 p (꼭짓점의 x좌표)</span>
                        <span className="text-indigo-600">p = {fmt(p)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-6"
                          max="6"
                          step="0.5"
                          value={p}
                          onChange={(e) => handleStandardChange(parseFloat(e.target.value), q)}
                          className="w-full accent-indigo-600"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={p}
                          onChange={(e) => handleStandardChange(parseFloat(e.target.value) || 0, q)}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded text-center font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>y축 방향 평행이동 q (꼭짓점의 y좌표)</span>
                        <span className="text-indigo-600">q = {fmt(q)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-6"
                          max="6"
                          step="0.5"
                          value={q}
                          onChange={(e) => handleStandardChange(p, parseFloat(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={q}
                          onChange={(e) => handleStandardChange(p, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                      <p className="font-bold text-emerald-800 mb-1.5">✓ 평행이동해도 변하지 않는 것</p>
                      <ul className="space-y-1 text-emerald-900">
                        <li>• 이차항 계수: <strong>a = {fmt(a)}</strong></li>
                        <li>• 볼록한 방향: <strong>{a > 0 ? '아래로 볼록' : '위로 볼록'}</strong></li>
                        <li>• 그래프의 폭(모양)은 기준 그래프(점선)와 완전히 포개어짐</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                      <p className="font-bold text-amber-800 mb-1.5">⚡ 평행이동하면 변하는 것</p>
                      <ul className="space-y-1 text-amber-900">
                        <li>• 꼭짓점: (0, 0) → <strong>({fmt(p)}, {fmt(q)})</strong></li>
                        <li>• 대칭축: x = 0 → <strong>x = {fmt(p)}</strong></li>
                        <li>• y축 교점: (0, 0) → <strong>(0, {fmt(c)})</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">
                      3. 최댓값과 최솟값 탐구 (양 끝점 후보 확인)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    함숫값(y값) 중 가장 큰 값을 <strong>최댓값</strong>, 가장 작은 값을 <strong>최솟값</strong>이라고 합니다.
                    x의 범위가 제한되면 꼭짓점뿐만 아니라 <strong>구간의 양 끝점도 최대·최소의 후보</strong>가 됩니다.
                  </p>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-100 p-2.5 rounded-xl mb-3">
                    <input
                      type="checkbox"
                      checked={useDomain}
                      onChange={(e) => setUseDomain(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      제한된 x의 값의 범위 설정하기 (양 끝점 후보 활성화)
                    </span>
                  </label>

                  {!useDomain ? (
                    <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs space-y-1.5">
                      <p className="font-bold text-blue-900">현재 범위: 실수 전체</p>
                      {a > 0 ? (
                        <p className="text-blue-800">
                          • 아래로 볼록하므로 꼭짓점 <strong>x = {fmt(p)}</strong>에서{' '}
                          <strong className="text-blue-700 underline">최솟값 y = {fmt(q)}</strong>를 갖습니다. (최댓값은 없음)
                        </p>
                      ) : (
                        <p className="text-blue-800">
                          • 위로 볼록하므로 꼭짓점 <strong>x = {fmt(p)}</strong>에서{' '}
                          <strong className="text-red-600 underline">최댓값 y = {fmt(q)}</strong>를 갖습니다. (최솟값은 없음)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            왼쪽 끝점 x₁ = {fmt(extrema.leftX)}
                          </label>
                          <input
                            type="range"
                            min="-8"
                            max="8"
                            step="0.5"
                            value={x1}
                            onChange={(e) => setX1(parseFloat(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            오른쪽 끝점 x₂ = {fmt(extrema.rightX)}
                          </label>
                          <input
                            type="range"
                            min="-8"
                            max="8"
                            step="0.5"
                            value={x2}
                            onChange={(e) => setX2(parseFloat(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl text-xs space-y-2">
                        <p className="font-bold text-indigo-950">
                          범위 [{fmt(extrema.leftX)} ≤ x ≤ {fmt(extrema.rightX)}] 후보점 y값 비교:
                        </p>
                        <ul className="space-y-1 text-slate-700">
                          {extrema.candidates.map((pt, idx) => (
                            <li key={idx} className="flex justify-between bg-white px-2.5 py-1.5 rounded border border-indigo-100">
                              <span>
                                • {pt.label} (x = {fmt(pt.x)})
                              </span>
                              <span className="font-mono font-bold">y = {fmt(pt.y)}</span>
                            </li>
                          ))}
                          {!extrema.vertexIncluded && (
                            <li className="text-red-600 font-semibold px-1">
                              ※ 주의: 꼭짓점 (x = {fmt(p)})이 현재 범위 밖에 있으므로 양 끝점에서만 최대·최소가 결정됩니다!
                            </li>
                          )}
                        </ul>
                        <div className="pt-2 border-t border-indigo-200 flex flex-col gap-1 font-bold">
                          <p className="text-red-600">
                            ▶ 최댓값: x = {fmt(extrema.maxPt.x)} ({extrema.maxPt.label})에서 y = {fmt(extrema.maxPt.y)}
                          </p>
                          <p className="text-blue-700">
                            ▶ 최솟값: x = {fmt(extrema.minPt.x)} ({extrema.minPt.label})에서 y = {fmt(extrema.minPt.y)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeProgram === 'program2' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="font-bold text-lg text-slate-800">이차함수 형성평가 및 학습 진단</h2>
                <p className="text-xs text-slate-500">
                  학생은 문제를 풀고 답안을 제출하며, 교사는 제출된 점수와 취약 개념 통계를 실시간으로 확인합니다.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSubMode('student')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    subMode === 'student'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  학생용 문제 풀이
                </button>
                <button
                  onClick={() => setSubMode('teacher')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    subMode === 'teacher'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  교사용 결과·오답 확인
                </button>
              </div>
            </div>

            {subMode === 'student' && (
              <div className="max-w-3xl mx-auto">
                {isSubmitted ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                      ✓
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900">수고하셨습니다.</h3>
                    <p className="text-sm text-slate-600">
                      {grade}학년 {classNum}반 {studentNum}번 {studentName} 학생의 답안이 정상적으로 제출되었습니다.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setSelectedAnswers({});
                        setStudentName('');
                        setStudentNum('');
                      }}
                      className="mt-4 px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700"
                    >
                      새로운 답안 작성하기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">학생 인적사항 입력</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">학년</label>
                          <input
                            type="number"
                            min="1"
                            max="3"
                            required
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="3"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">반</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            required
                            value={classNum}
                            onChange={(e) => setClassNum(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="예: 2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">번호</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            required
                            value={studentNum}
                            onChange={(e) => setStudentNum(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="예: 15"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">이름</label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="홍길동"
                          />
                        </div>
                      </div>
                    </div>

                    {QUESTIONS.map((q, index) => (
                      <div
                        key={q.id}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                            문항 {index + 1} · {q.category}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">20점</span>
                        </div>
                        <p className="font-bold text-slate-800 text-base leading-relaxed">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition text-sm ${
                                  isSelected
                                    ? 'bg-blue-50 border-blue-500 font-bold text-blue-900'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                  }
                                  className="w-4 h-4 accent-blue-600"
                                />
                                <span>
                                  {optIdx + 1}) {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-xl">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-extrabold rounded-2xl shadow-md transition text-base"
                    >
                      {isSubmitting ? '답안 제출 중...' : '답안 제출하기'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {subMode === 'teacher' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        문항별 오답률 및 취약 개념 분석 (총 제출 인원: {submissions.length}명)
                      </h3>
                      <p className="text-xs text-slate-500">
                        오답률이 높은 문항을 통해 학생들이 가장 헷갈려하는 이차함수 개념을 즉시 파악할 수 있습니다.
                      </p>
                    </div>
                    <button
                      onClick={fetchTeacherResults}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      {isLoadingResults ? '불러오는 중...' : '↻ 새로고침'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {questionStats.map((stat) => (
                      <div
                        key={stat.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-500">문항 {stat.id}</span>
                          <p className="font-bold text-sm text-slate-800 mt-1 line-clamp-2">
                            {stat.category}
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-red-600">오답률 {stat.wrongRate}%</span>
                            <span className="text-slate-500">
                              ({stat.wrongCount}/{submissions.length}명 오답)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                stat.wrongRate >= 50 ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${stat.wrongRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                  <h3 className="font-bold text-slate-800 text-lg mb-4">학생별 제출 점수 및 정오답 현황</h3>

                  {submissions.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">
                      아직 제출된 학생 답안이 없습니다.
                    </p>
                  ) : (
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs">
                          <th className="py-3 px-4 font-bold">학년-반-번호</th>
                          <th className="py-3 px-4 font-bold">이름</th>
                          <th className="py-3 px-4 font-bold">점수</th>
                          {QUESTIONS.map((q) => (
                            <th key={q.id} className="py-3 px-3 font-bold text-center">
                              문항 {q.id}
                              <br />
                              <span className="text-[10px] font-normal text-slate-400">
                                (정답: {q.correctIndex + 1}번)
                              </span>
                            </th>
                          ))}
                          <th className="py-3 px-4 font-bold">제출 시각</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {submissions.map((sub) => {
                          const ansList = Array.isArray(sub.answers) ? sub.answers : [];
                          return (
                            <tr key={sub.id} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-mono font-semibold">
                                {sub.grade}-{sub.class_num}-{sub.student_num}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800">{sub.student_name}</td>
                              <td className="py-3 px-4 font-extrabold text-blue-600">{sub.score}점</td>
                              {QUESTIONS.map((q) => {
                                const ans = ansList.find((a: any) => a.questionId === q.id);
                                const isCorrect = ans?.isCorrect;
                                const chosenNum = ans ? ans.chosenIndex + 1 : '-';
                                return (
                                  <td key={q.id} className="py-3 px-3 text-center">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                        isCorrect
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {isCorrect ? 'O' : 'X'} ({chosenNum}번)
                                    </span>
                                  </td>
                                );
                              })}
                              <td className="py-3 px-4 text-xs text-slate-400">
                                {new Date(sub.submitted_at).toLocaleString('ko-KR')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
