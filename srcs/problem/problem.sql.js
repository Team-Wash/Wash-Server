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
  `,
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

  updateProblem: `UPDATE problem SET problem_text = ? WHERE problem_id = ?`,
  addProblem: `
    INSERT INTO problem (
      folder_id, user_id, problem_text, answer, status,
      correct_count, incorrect_count, order_value, memo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  addPhotos: `
    INSERT INTO photo (problem_id, photo_url, photo_type)
    VALUES ?
  `,
  addProblemTypeAssignment: `
    INSERT INTO PROBLEMTYPEASSIGNMENT (problem_id, type_id)
    VALUES (?, ?)
  `,
  addProblemTypeAssignments: `
    INSERT INTO PROBLEMTYPEASSIGNMENT (problem_id, type_id)
    VALUES ?
  `,

  getMainTypes: `
    SELECT type_id, type_name FROM PROBLEMTYPE
    WHERE type_level = 1
  `,

  getMidTypes: `
    SELECT type_id, type_name FROM PROBLEMTYPE
    WHERE parent_type_id = ? AND type_level = 2
  `,

  getSubTypes: `
    SELECT type_id, type_name FROM PROBLEMTYPE
    WHERE parent_type_id = ? AND type_level = 3
  `,

  addMainType: `
    INSERT INTO PROBLEMTYPE (type_name, type_level) 
    VALUES (?, 1)
  `,

  addMidType: `
    INSERT INTO PROBLEMTYPE (type_name, parent_type_id, type_level) 
    VALUES (?, ?, 2)
  `,

  addSubType: `
    INSERT INTO PROBLEMTYPE (type_name, parent_type_id, type_level) 
    VALUES (?, ?, 3)
  `,
  addProblem:
  "INSERT INTO problem (folder_id, folder_name, subscription_plan, problem_text, answer, main_category, category, sub_category, problem_image, solution_image, passage_image, additional_problem_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",



  getIncorrectProblemStatistic: `SELECT * FROM problem WHERE user_id = ? ORDER BY incorrect_count DESC LIMIT 5;`,

  getIncorrectTypeStatistic:`SELECT sub_category, SUM(incorrect_count) AS total_incorrect 
  FROM problem 
  WHERE user_id = ?
  GROUP BY sub_category 
  ORDER BY total_incorrect DESC 
  LIMIT 5;`,

  getIncorrectRatioStatistic:`SELECT sub_category, (SUM(incorrect_count) * 100.0 / (SELECT SUM(incorrect_count) FROM problem )) AS incorrect_percentage 
  FROM problem 
  WHERE user_id = ?
  GROUP BY sub_category 
  ORDER BY incorrect_percentage DESC;`,

};


  