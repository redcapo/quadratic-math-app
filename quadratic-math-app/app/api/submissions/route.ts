import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }
  return neon(process.env.DATABASE_URL);
}

// 1. 교사용: 전체 제출 내역 조회 (GET)
export async function GET() {
  try {
    const sql = getDb();
    
    await sql`
      CREATE TABLE IF NOT EXISTS math_submissions (
        id SERIAL PRIMARY KEY,
        grade INT NOT NULL,
        class_num INT NOT NULL,
        student_num INT NOT NULL,
        student_name VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        answers JSONB NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const rows = await sql`
      SELECT id, grade, class_num, student_num, student_name, score, answers, submitted_at
      FROM math_submissions
      ORDER BY grade ASC, class_num ASC, student_num ASC, submitted_at DESC;
    `;

    return NextResponse.json({ submissions: rows });
  } catch (error: any) {
    console.error('Database GET Error:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}

// 2. 학생용: 답안 제출 및 저장 (POST)
export async function POST(request: Request) {
  try {
    const sql = getDb();
    const body = await request.json();
    const { grade, classNum, studentNum, studentName, score, answers } = body;

    if (!grade || !classNum || !studentNum || !studentName || !answers) {
      return NextResponse.json(
        { error: '학생 정보와 답안을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    await sql`
      CREATE TABLE IF NOT EXISTS math_submissions (
        id SERIAL PRIMARY KEY,
        grade INT NOT NULL,
        class_num INT NOT NULL,
        student_num INT NOT NULL,
        student_name VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        answers JSONB NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const result = await sql`
      INSERT INTO math_submissions (grade, class_num, student_num, student_name, score, answers)
      VALUES (${Number(grade)}, ${Number(classNum)}, ${Number(studentNum)}, ${studentName.trim()}, ${Number(score)}, ${JSON.stringify(answers)}::jsonb)
      RETURNING id;
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error: any) {
    console.error('Database POST Error:', error);
    return NextResponse.json(
      { error: '답안 저장 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
