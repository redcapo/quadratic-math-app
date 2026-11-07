-- Neon SQL Editor에서 실행할 테이블 생성 쿼리 (API에서도 자동 생성되도록 구현되어 있습니다)
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
