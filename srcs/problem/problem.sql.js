export const sql = {
  searchProblem: `
    SELECT 
      *
    FROM 
      problem
    WHERE 
      problem_text LIKE ?
  `,

  searchProblemByFolder: `
    SELECT 
      *
    FROM 
      problem
    WHERE 
      problem_text LIKE ? AND folder_id = ?
  `,

  checkSubscriptionStatus: `
    SELECT 
      status,
      start_date,
      end_date
    FROM 
      subscription
    WHERE 
      user_id = ? AND status = '구독' AND NOW() BETWEEN start_date AND end_date
  `
  ,
    findProblemById: `
    SELECT *
    FROM 
      problem
    WHERE 
      problem_id = ?
  `,

  findPhotosByProblemId: `
    SELECT 
      photo_url,
      photo_type
    FROM 
      photo
    WHERE 
      problem_id = ?
  `,

  findTypesByProblemId: `
    SELECT 
      pt.type_name,
      pt.type_level
    FROM 
      problemtype pt
    JOIN 
      problemtypeassignment pta ON pt.type_id = pta.type_id
    WHERE 
      pta.problem_id = ?
  `,

  // 문제 수정
  updateProblemImages: `
  UPDATE problems 
  SET 
    problem_image_url = COALESCE(?, problem_image_url),
    solution_image_url = COALESCE(?, solution_image_url),
    passage_image_url = COALESCE(?, passage_image_url)
  WHERE 
    problem_id = ?
`,

// 문제 텍스트 및 정답 업데이트
updateProblem: `
  UPDATE problems 
  SET 
    problem_text = ?, 
    answer_text = ?, 
    updated_at = NOW()
  WHERE 
    problem_id = ?
`,

// 기존 추가 이미지 삭제
deleteAdditionalProblemImages: `
  DELETE FROM photos WHERE problem_id = ? AND photo_type = 'additional'
`,

// 새로운 추가 이미지 삽입
addAdditionalProblemImage: `
  INSERT INTO photos (problem_id, photo_url, photo_type, created_at, updated_at)
  VALUES (?, ?, 'additional', NOW(), NOW())
`,

// 기존 유형 할당 삭제
deleteProblemTypeAssignment: `
  DELETE FROM problemtypeassignment WHERE problem_id = ?
`,

// 새로운 유형 할당 추가
addProblemTypeAssignment: `
  INSERT INTO problemtypeassignment (problem_id, type_id)
  VALUES (?, ?)
`,

// 문제 유형 ID 조회
findProblemTypeIdByNameAndLevel: `
  SELECT type_id 
  FROM problemtype 
  WHERE type_name = ? AND type_level = ?
`,


  addProblem: 'INSERT INTO problem (folder_id, folder_name, subscription_plan, problem_text, answer, main_category, category, sub_category, problem_image, solution_image, passage_image, additional_problem_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  };
  