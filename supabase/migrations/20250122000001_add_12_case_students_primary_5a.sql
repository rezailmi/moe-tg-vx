-- Migration: Add 12 Case Students to Primary Class 5A
-- Description: Add students with active/closed cases, guardians, and case histories

-- =====================================================
-- STEP 1: Insert 12 Parent/Guardian Records
-- =====================================================

INSERT INTO parents_guardians (name, relationship, phone, email, occupation, address) VALUES
-- Eric Lim
('Dr. & Mrs. Lim', 'parents', '+65 9123 5001', 'dr.lim@email.com', 'Medical Professionals', 'Blk 101 Bukit Timah Ave 5'),
-- Lim Hui Ling
('Mrs. Rachel Lim', 'mother', '+65 9123 5002', 'rachel.lim@email.com', 'Retail Manager', 'Blk 234 Ang Mo Kio St 21'),
-- Siti Nurul Ain
('Mr. & Mrs. Hassan', 'parents', '+65 9123 5003', 'hassan.family@email.com', 'Teacher / Engineer', 'Blk 567 Bedok North Ave 2'),
-- Chen Jia Yi
('Mrs. Susan Chen', 'mother', '+65 9123 5004', 'susan.chen@email.com', 'Accountant', 'Blk 890 Tampines St 45'),
-- Nicholas Loh
('Mr. & Mrs. Loh', 'parents', '+65 9123 5005', 'loh.family@email.com', 'Business Owner', 'Blk 345 Clementi Ave 3'),
-- Muhammad Iskandar
('Mr. Iskandar Rahman', 'father', '+65 9123 5006', 'iskandar.rahman@email.com', 'IT Manager', 'Blk 678 Jurong West St 62'),
-- Tan Wei Jie
('Mrs. Jennifer Tan', 'mother', '+65 9123 5007', 'jennifer.tan@email.com', 'Pharmacist', 'Blk 901 Bishan St 12'),
-- Alice Wong
('Dr. & Mrs. Wong', 'parents', '+65 9123 5008', 'wong.family@email.com', 'Surgeon / Lawyer', 'Blk 456 Orchard Rd'),
-- Priya Krishnan
('Mr. Ravi Krishnan', 'father', '+65 9123 5009', 'ravi.krishnan@email.com', 'Software Engineer', 'Blk 789 Woodlands Ave 9'),
-- Reza Halim
('Mrs. Siti Halim', 'mother', '+65 9123 5010', 'siti.halim@email.com', 'Nurse', 'Blk 234 Pasir Ris Dr 1'),
-- Wong Kai Xuan
('Mr. & Mrs. Wong', 'parents', '+65 9123 5011', 'wong.family2@email.com', 'Teacher / Accountant', 'Blk 567 Hougang Ave 8'),
-- Ryan Tan
('Mr. David Tan', 'father', '+65 9123 5012', 'david.tan.single@email.com', 'Warehouse Supervisor', 'Blk 890 Yishun Ring Rd');

-- =====================================================
-- STEP 2: Insert 12 Student Records for Primary 5A
-- =====================================================

WITH class_info AS (
  SELECT id as class_uuid FROM classes WHERE name = '5A' AND type = 'form' AND academic_year = '2025' LIMIT 1
),
teacher_info AS (
  SELECT id as teacher_uuid FROM teachers WHERE email = 'daniel.tan@school.edu.sg' LIMIT 1
),
new_guardians AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM parents_guardians
  WHERE created_at >= NOW() - INTERVAL '1 minute'
  ORDER BY created_at DESC
  LIMIT 12
)
INSERT INTO students (student_id, name, date_of_birth, gender, nationality, form_teacher_id, primary_guardian_id, academic_year, year_level)
SELECT
  student_data.student_id,
  student_data.name,
  student_data.dob,
  student_data.gender,
  student_data.nationality,
  teacher_info.teacher_uuid,
  ng.id,
  '2025',
  '5'
FROM teacher_info, (VALUES
  ('S050101', 'Eric Lim', '2014-02-15'::date, 'male', 'Singaporean', 1),
  ('S050102', 'Lim Hui Ling', '2014-04-22'::date, 'female', 'Singaporean', 2),
  ('S050103', 'Siti Nurul Ain', '2014-06-10'::date, 'female', 'Singaporean', 3),
  ('S050104', 'Chen Jia Yi', '2014-03-18'::date, 'female', 'Singaporean', 4),
  ('S050105', 'Nicholas Loh', '2014-05-25'::date, 'male', 'Singaporean', 5),
  ('S050106', 'Muhammad Iskandar', '2014-01-30'::date, 'male', 'Singaporean', 6),
  ('S050107', 'Tan Wei Jie', '2014-07-12'::date, 'male', 'Singaporean', 7),
  ('S050108', 'Alice Wong', '2014-03-05'::date, 'female', 'Singaporean', 8),
  ('S050109', 'Priya Krishnan', '2014-08-20'::date, 'female', 'Singaporean', 9),
  ('S050110', 'Reza Halim', '2014-04-14'::date, 'male', 'Singaporean', 10),
  ('S050111', 'Wong Kai Xuan', '2014-06-28'::date, 'male', 'Singaporean', 11),
  ('S050112', 'Ryan Tan', '2014-02-08'::date, 'male', 'Singaporean', 12)
) AS student_data(student_id, name, dob, gender, nationality, guardian_order)
JOIN new_guardians ng ON ng.rn = student_data.guardian_order;

-- =====================================================
-- STEP 3: Link Students to Class 5A
-- =====================================================

WITH class_info AS (
  SELECT id as class_uuid FROM classes WHERE name = '5A' AND type = 'form' AND academic_year = '2025' LIMIT 1
),
new_students AS (
  SELECT id, student_id
  FROM students
  WHERE created_at >= NOW() - INTERVAL '1 minute'
  AND student_id LIKE 'S0501%'
  ORDER BY student_id
)
INSERT INTO student_classes (student_id, class_id, academic_year, is_primary_class)
SELECT ns.id, ci.class_uuid, '2025', true
FROM new_students ns, class_info ci;

-- =====================================================
-- STEP 4: Insert 12 Case Records
-- =====================================================

WITH teacher_info AS (
  SELECT id as teacher_uuid FROM teachers WHERE email = 'daniel.tan@school.edu.sg' LIMIT 1
),
student_map AS (
  SELECT
    id,
    student_id,
    name,
    ROW_NUMBER() OVER (ORDER BY student_id) as student_order
  FROM students
  WHERE created_at >= NOW() - INTERVAL '1 minute'
  AND student_id LIKE 'S0501%'
  ORDER BY student_id
)
INSERT INTO cases (case_number, student_id, case_type, title, status, opened_date, created_by, assigned_to)
SELECT
  case_data.case_number,
  sm.id,
  case_data.case_type,
  case_data.title,
  case_data.status,
  case_data.opened_date,
  ti.teacher_uuid,
  ti.teacher_uuid
FROM teacher_info ti, (VALUES
  -- Eric Lim - SWAN (SEN)
  ('241015-00016', 1, 'sen', 'SWAN - Mental Health Support', 'open', '2024-10-15'::date),
  -- Lim Hui Ling - Counselling
  ('251002-00015', 2, 'counselling', 'Low Attendance & Family Support', 'open', '2024-10-02'::date),
  -- Siti Nurul Ain - Disciplinary
  ('250928-00014', 3, 'discipline', 'Classroom Behavior Management', 'open', '2024-09-28'::date),
  -- Chen Jia Yi - Counselling (Closed)
  ('250926-00013', 4, 'counselling', 'Attendance & Peer Relationships', 'closed', '2024-09-26'::date),
  -- Nicholas Loh - Counselling
  ('250920-00012', 5, 'counselling', 'Attendance Pattern Monitoring', 'open', '2024-09-20'::date),
  -- Muhammad Iskandar - Career Guidance (Closed)
  ('250918-00011', 6, 'career_guidance', 'GEP Pathway & Leadership Development', 'closed', '2024-09-18'::date),
  -- Tan Wei Jie - Career Guidance
  ('250915-00010', 7, 'career_guidance', 'STEM Academic Planning', 'open', '2024-09-15'::date),
  -- Alice Wong - Career Guidance (Closed)
  ('250912-00009', 8, 'career_guidance', 'University & Scholarship Planning', 'closed', '2024-09-12'::date),
  -- Priya Krishnan - SEN Support
  ('250910-00008', 9, 'sen', 'Learning Support Assessment', 'open', '2024-09-10'::date),
  -- Reza Halim - Counselling (Closed)
  ('250905-00007', 10, 'counselling', 'Exam Anxiety Management', 'closed', '2024-09-05'::date),
  -- Wong Kai Xuan - Academic Support (mapped to counselling)
  ('250901-00006', 11, 'counselling', 'Math & Study Skills Support', 'open', '2024-09-01'::date),
  -- Ryan Tan - Disciplinary
  ('250815-00005', 12, 'discipline', 'Behavioral Support & CMT Intervention', 'open', '2024-08-15'::date)
) AS case_data(case_number, student_order, case_type, title, status, opened_date)
JOIN student_map sm ON sm.student_order = case_data.student_order;

-- =====================================================
-- STEP 5: Insert Case Issues
-- =====================================================

WITH case_map AS (
  SELECT
    id as case_id,
    case_number,
    ROW_NUMBER() OVER (ORDER BY case_number DESC) as case_order
  FROM cases
  WHERE created_at >= NOW() - INTERVAL '1 minute'
  ORDER BY case_number DESC
)
INSERT INTO case_issues (case_id, issue_title, issue_description, occurred_date, severity)
SELECT
  cm.case_id,
  issue_data.issue_title,
  issue_data.issue_description,
  issue_data.occurred_date,
  issue_data.severity
FROM (VALUES
  -- Case 1: Eric Lim - SWAN (13 issues)
  (1, 'SWAN Activation - Mental Health', '[Oct 15, 2024] Student activated as SWAN for anxiety and social difficulties. Initial assessment shows high academic pressure from family, limited peer support, and stress-related psychosomatic symptoms.', '2024-10-15'::date, 'high'),
  (1, 'SEC Monitoring Initiated', '[Oct 15, 2024] Under active Student Engagement and Counselling (SEC) monitoring. Bi-weekly counseling sessions scheduled with Ms. Sarah Wong (School Counselor).', '2024-10-15'::date, 'medium'),
  (1, 'Academic Decline Observation', '[Oct 20, 2024] Baseline academic performance: 78% average across subjects. Teacher observations note decreased class participation and signs of stress during assessments.', '2024-10-20'::date, 'medium'),
  (1, 'Family Background Assessment', '[Oct 28, 2024] Both parents are high-achieving professionals with advanced degrees. Older sibling excelling in university. Eric experiences constant comparison and very high academic expectations. Limited emotional support at home.', '2024-10-28'::date, 'high'),
  (1, 'Health Concerns - Psychosomatic', '[Nov 5, 2024] Frequent nurse visits with stress-related complaints (headaches, stomach aches). 4 visits in one term. No chronic physical conditions identified. Concerns are mental health-related.', '2024-11-05'::date, 'medium'),
  (1, 'Social Isolation Noted', '[Nov 12, 2024] Very limited peer interactions. Only close friend is Daniel Koh. Student reports feeling socially isolated and difficulty connecting with classmates.', '2024-11-12'::date, 'medium'),
  (1, 'Counseling Session 1-4 Summary', '[Oct 22 - Nov 19, 2024] Completed first 4 counseling sessions. Eric is thoughtful and introspective but struggles with emotional regulation. Working on anxiety management techniques and building self-advocacy skills.', '2024-11-19'::date, 'medium'),
  (1, 'Term 3 Academic Review', '[Dec 18, 2024] End of year results show significant decline: 78% average → 64% average (-14 points). English: 65, Math: 68, Science: 62, Chinese: 60, Humanities: 64. Student is maintaining homework completion despite emotional challenges.', '2024-12-18'::date, 'high'),
  (1, 'Family Tensions Identified', '[Dec 20, 2024] Recent family tensions noted (possible marital stress between parents). Communication style at home is achievement-focused rather than emotion-focused. Student feels unable to express emotional needs.', '2024-12-20'::date, 'high'),
  (1, 'Counseling Session 5-8 Summary', '[Nov 26, 2024 - Jan 14, 2025] Sessions 5-8 completed. Progress in identifying stress triggers. Eric showing resilience in attending school regularly (89% attendance) despite difficulties. Building coping strategies for academic pressure.', '2025-01-14'::date, 'medium'),
  (1, 'Attendance Monitoring', '[Jan 20, 2025] Attendance at 89% - regular absences due to stress-related health issues. No disciplinary concerns. Eric is polite, respectful, and maintains average conduct grade despite personal difficulties.', '2025-01-20'::date, 'low'),
  (1, 'PTM Preparation - Feb 14, 2025', '[Jan 15, 2025] Preparing for sensitive PTM with Dr. & Mrs. Lim. Will recommend family counseling resources and discuss reducing academic pressure. Need to coordinate with Ms. Wong before meeting. Focus on Eric''s strengths and holistic development.', '2025-01-15'::date, 'medium'),
  (1, 'Current Status & Support Plan', '[Jan 20, 2025] SWAN case remains open. Ongoing bi-weekly counseling with Ms. Wong. Continued monitoring of academic performance, social engagement, and emotional wellbeing. Student shows resilience and is responsive to support. Next review: After Feb 14 PTM.', '2025-01-20'::date, 'medium'),

  -- Case 2: Lim Hui Ling - Counselling (2 issues)
  (2, 'Low attendance concern', 'Student has been absent 50% of school days. Family situation being assessed.', '2024-10-02'::date, 'high'),
  (2, 'Academic support needed', 'Struggling with keeping up with coursework due to irregular attendance.', '2024-10-05'::date, 'medium'),

  -- Case 3: Siti Nurul Ain - Disciplinary (2 issues)
  (3, 'Disruptive behaviour', 'Repeatedly interrupting class discussions and distracting peers.', '2024-09-28'::date, 'medium'),
  (3, 'Late submissions', 'Multiple assignments submitted past deadline without valid reasons.', '2024-10-01'::date, 'low'),

  -- Case 4: Chen Jia Yi - Counselling Closed (2 issues)
  (4, 'Attendance monitoring', 'Worked with family to address attendance issues. Improvement observed over past 2 weeks.', '2024-09-26'::date, 'medium'),
  (4, 'Peer relationship support', 'Participated in peer mediation sessions. Successfully resolved conflicts with classmates.', '2024-10-03'::date, 'low'),

  -- Case 5: Nicholas Loh - Counselling (1 issue)
  (5, 'Irregular attendance pattern', 'Attendance has dropped to 70%. Meeting scheduled with parents to discuss underlying issues.', '2024-09-20'::date, 'high'),

  -- Case 6: Muhammad Iskandar - Career Guidance Closed (2 issues)
  (6, 'GEP pathway exploration', 'Successfully completed advanced placement assessment. Recommended for specialized science program.', '2024-09-18'::date, 'low'),
  (6, 'Leadership development', 'Enrolled in student council training program. Showing strong potential in peer mentorship.', '2024-09-25'::date, 'low'),

  -- Case 7: Tan Wei Jie - Career Guidance (2 issues)
  (7, 'Academic pathway planning', 'Interested in STEM subjects. Discussing options for GEP stream advancement.', '2024-09-15'::date, 'low'),
  (7, 'Subject combination guidance', 'Evaluating strengths in Math and Science for optimal subject selection.', '2024-09-22'::date, 'low'),

  -- Case 8: Alice Wong - Career Guidance Closed (2 issues)
  (8, 'University pathway planning', 'Excellent academic performance. Provided guidance on scholarship opportunities and university applications.', '2024-09-12'::date, 'low'),
  (8, 'Leadership portfolio development', 'Reviewed CCA achievements and academic records for portfolio building.', '2024-09-19'::date, 'low'),

  -- Case 9: Priya Krishnan - SEN Support (2 issues)
  (9, 'Learning support assessment', 'Initial assessment completed. Recommended for additional time during examinations.', '2024-09-10'::date, 'medium'),
  (9, 'Resource allocation', 'Coordinating with learning support team for specialized resources and materials.', '2024-09-17'::date, 'low'),

  -- Case 10: Reza Halim - Counselling Closed (2 issues)
  (10, 'Stress management', 'Student experiencing exam-related anxiety. Referred to school counsellor for coping strategies.', '2024-09-05'::date, 'medium'),
  (10, 'Follow-up session', 'Completed 4-week counselling program. Student reports improved confidence and reduced anxiety levels.', '2024-10-03'::date, 'low'),

  -- Case 11: Wong Kai Xuan - Academic Support (2 issues)
  (11, 'Math intervention program', 'Enrolled in after-school math support sessions to address gaps in foundational concepts.', '2024-09-01'::date, 'medium'),
  (11, 'Study skills workshop', 'Participating in weekly workshops focusing on time management and effective study techniques.', '2024-09-08'::date, 'low'),

  -- Case 12: Ryan Tan - Disciplinary (10 issues)
  (12, 'Initial incident - Classroom disruption', '[Aug 15] Repeatedly talking during lessons, distracting peers. Multiple verbal warnings given. Parent contacted.', '2024-08-15'::date, 'medium'),
  (12, 'Incomplete homework pattern', '[Aug 20] Missing 5 out of 8 homework assignments over 2 weeks. Student cited difficulty focusing at home.', '2024-08-20'::date, 'medium'),
  (12, 'Talking back to teacher', '[Aug 25] Responded disrespectfully when reminded about classroom rules. Referred to Year Head.', '2024-08-25'::date, 'high'),
  (12, 'CMT intervention initiated', '[Sep 1] Case referred to Care Management Team. Initial assessment conducted. Discovered challenging home situation - single parent household, father works long hours.', '2024-09-01'::date, 'high'),
  (12, 'Behavioral support plan', '[Sep 8] CMT meeting with student and parent. Agreed on check-in system and mentorship program. Student expressed willingness to improve.', '2024-09-08'::date, 'medium'),
  (12, 'First positive observation - Ms. Lee', '[Sep 20] English teacher noted Ryan stayed back voluntarily to complete work. Engaged positively in group discussion.', '2024-09-20'::date, 'low'),
  (12, 'CMT progress update', '[Sep 25] Weekly check-ins showing consistent attendance. Ryan responding well to structured support. Building rapport with mentor teacher.', '2024-09-25'::date, 'low'),
  (12, 'Homework improvement noted', '[Oct 1] Math teacher reported 100% homework completion for 2 consecutive weeks. Quality of work also improving.', '2024-10-01'::date, 'low'),
  (12, 'Positive peer interaction - Mr. Kumar', '[Oct 5] Science teacher observed Ryan helping classmate with lab setup. Demonstrated leadership and patience.', '2024-10-05'::date, 'low'),
  (12, 'Recent CMT review', '[Oct 8] Significant behavioral improvement over past month. Student more engaged in class, respectful to teachers. Academic performance improving. Recommend continued monitoring with reduced intervention frequency.', '2024-10-08'::date, 'low')
) AS issue_data(case_order, issue_title, issue_description, occurred_date, severity)
JOIN case_map cm ON cm.case_order = issue_data.case_order;
