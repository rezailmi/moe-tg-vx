-- Migration: Add 2 additional cases for each of the 12 Primary 5A students
-- Total: 24 new cases with 2-3 issues each
-- All cases are open status

-- ============================================================================
-- STEP 1: Insert 24 New Cases (2 per student)
-- ============================================================================

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
  WHERE year_level = '5'
    AND created_at >= '2025-10-22'
    AND student_id IN (
      'S050101', 'S050102', 'S050103', 'S050104', 'S050105', 'S050106',
      'S050107', 'S050108', 'S050109', 'S050110', 'S050111', 'S050112'
    )
)
INSERT INTO cases (
  student_id,
  case_number,
  case_type,
  title,
  description,
  status,
  severity,
  opened_date,
  closed_date,
  created_by,
  assigned_to,
  guardian_notified,
  guardian_notified_date,
  guardian_notification_method
)
SELECT
  sm.id,
  case_data.case_number,
  case_data.case_type,
  case_data.title,
  case_data.description,
  'open',
  case_data.severity,
  case_data.opened_date,
  NULL,
  ti.teacher_uuid,
  ti.teacher_uuid,
  case_data.guardian_notified,
  case_data.guardian_notified_date,
  case_data.notification_method
FROM teacher_info ti, (VALUES
  -- Eric Lim (S050101) - 2 new cases
  (1, '250120-00017', 'counselling', 'Academic Pressure & Stress Management', 'Ongoing counselling for managing academic expectations and building coping strategies', 'medium', '2025-01-20'::date, true, '2025-01-21'::date, 'Phone Call'),
  (1, '241205-00018', 'discipline', 'Classroom Participation Issues', 'Minor disruptions during lessons, withdrawn behavior affecting class engagement', 'low', '2024-12-05'::date, true, '2024-12-06'::date, 'Email'),

  -- Lim Hui Ling (S050102) - 2 new cases
  (2, '250115-00019', 'discipline', 'Chronic Tardiness Pattern', 'Frequent late arrivals affecting morning lessons and routine', 'medium', '2025-01-15'::date, true, '2025-01-16'::date, 'Phone Call'),
  (2, '241128-00020', 'career_guidance', 'Subject Interest & Future Planning', 'Exploring strengths and interests for subject selection guidance', 'low', '2024-11-28'::date, false, NULL, NULL),

  -- Siti Nurul Ain (S050103) - 2 new cases
  (3, '250110-00021', 'counselling', 'Peer Relationship Difficulties', 'Conflicts with classmates, social integration challenges', 'high', '2025-01-10'::date, true, '2025-01-11'::date, 'In-Person'),
  (3, '241220-00022', 'sen', 'Learning Support - Reading Intervention', 'Below grade level reading, requires targeted literacy support', 'medium', '2024-12-20'::date, true, '2024-12-21'::date, 'Phone Call'),

  -- Chen Jia Yi (S050104) - 2 new cases
  (4, '250105-00023', 'discipline', 'Homework Completion Monitoring', 'Inconsistent homework submission, requires accountability plan', 'medium', '2025-01-05'::date, true, '2025-01-06'::date, 'Email'),
  (4, '241215-00024', 'career_guidance', 'Strengths-Based Subject Selection', 'Identifying academic strengths for informed subject choices', 'low', '2024-12-15'::date, false, NULL, NULL),

  -- Nicholas Loh (S050105) - 2 new cases
  (5, '241230-00025', 'sen', 'Attention & Focus Support', 'Difficulty maintaining attention, assessment for support strategies', 'medium', '2024-12-30'::date, true, '2024-12-31'::date, 'Phone Call'),
  (5, '241118-00026', 'discipline', 'Focus & On-Task Behavior', 'Easily distracted during lessons, affecting learning outcomes', 'low', '2024-11-18'::date, true, '2024-11-19'::date, 'Email'),

  -- Muhammad Iskandar (S050106) - 2 new cases
  (6, '241225-00027', 'counselling', 'Social Integration Support', 'Struggles with making friends, lunchtime isolation observed', 'medium', '2024-12-25'::date, true, '2024-12-26'::date, 'Phone Call'),
  (6, '241110-00028', 'discipline', 'Classroom Participation Enhancement', 'Reluctant to participate in group activities and discussions', 'low', '2024-11-10'::date, false, NULL, NULL),

  -- Tan Wei Jie (S050107) - 2 new cases
  (7, '241222-00029', 'counselling', 'Family Support & Home Environment', 'Family undergoing transition, affecting student wellbeing', 'high', '2024-12-22'::date, true, '2024-12-23'::date, 'In-Person'),
  (7, '241105-00030', 'sen', 'Reading Comprehension Support', 'Below-level reading comprehension, intervention plan needed', 'medium', '2024-11-05'::date, true, '2024-11-06'::date, 'Email'),

  -- Alice Wong (S050108) - 2 new cases
  (8, '241218-00031', 'discipline', 'Group Work Conflict Management', 'Recurring conflicts during collaborative activities', 'medium', '2024-12-18'::date, true, '2024-12-19'::date, 'Phone Call'),
  (8, '241101-00032', 'counselling', 'Self-Confidence Building', 'Low self-esteem affecting academic participation and social engagement', 'medium', '2024-11-01'::date, true, '2024-11-02'::date, 'Email'),

  -- Priya Krishnan (S050109) - 2 new cases
  (9, '241212-00033', 'counselling', 'Cultural Adjustment & Integration', 'Navigating cultural differences, building sense of belonging', 'medium', '2024-12-12'::date, true, '2024-12-13'::date, 'Phone Call'),
  (9, '241028-00034', 'career_guidance', 'Strengths & Talent Identification', 'Exploring multiple talents and interests for future planning', 'low', '2024-10-28'::date, false, NULL, NULL),

  -- Reza Halim (S050110) - 2 new cases
  (10, '241208-00035', 'discipline', 'Attendance Pattern Concerns', 'Irregular attendance pattern requiring monitoring and support', 'medium', '2024-12-08'::date, true, '2024-12-09'::date, 'Phone Call'),
  (10, '241022-00036', 'career_guidance', 'Interest Exploration Sessions', 'Structured career interest exploration through activities', 'low', '2024-10-22'::date, false, NULL, NULL),

  -- Wong Kai Xuan (S050111) - 2 new cases
  (11, '241201-00037', 'sen', 'Mathematics Intervention Support', 'Struggling with numeracy concepts, requires targeted intervention', 'medium', '2024-12-01'::date, true, '2024-12-02'::date, 'Email'),
  (11, '241018-00038', 'discipline', 'Playground Behavior Management', 'Rough play during recess, safety concerns raised', 'medium', '2024-10-18'::date, true, '2024-10-19'::date, 'Phone Call'),

  -- Ryan Tan (S050112) - 2 new cases
  (12, '241128-00039', 'counselling', 'Anger Management Support', 'Emotional regulation difficulties, outbursts affecting relationships', 'high', '2024-11-28'::date, true, '2024-11-29'::date, 'In-Person'),
  (12, '241015-00040', 'career_guidance', 'Goal Setting & Future Planning', 'Developing realistic goals and understanding pathways', 'low', '2024-10-15'::date, false, NULL, NULL)
) AS case_data(
  student_order, case_number, case_type, title, description, severity,
  opened_date, guardian_notified, guardian_notified_date, notification_method
)
JOIN student_map sm ON sm.student_order = case_data.student_order;


-- ============================================================================
-- STEP 2: Insert Case Issues (2-3 per case = ~60 issues)
-- ============================================================================

WITH teacher_info AS (
  SELECT id as teacher_uuid FROM teachers WHERE email = 'daniel.tan@school.edu.sg' LIMIT 1
),
case_map AS (
  SELECT
    id as case_id,
    case_number
  FROM cases
  WHERE case_number IN (
    '250120-00017', '241205-00018', '250115-00019', '241128-00020',
    '250110-00021', '241220-00022', '250105-00023', '241215-00024',
    '241230-00025', '241118-00026', '241225-00027', '241110-00028',
    '241222-00029', '241105-00030', '241218-00031', '241101-00032',
    '241212-00033', '241028-00034', '241208-00035', '241022-00036',
    '241201-00037', '241018-00038', '241128-00039', '241015-00040'
  )
)
INSERT INTO case_issues (
  case_id,
  issue_title,
  issue_description,
  occurred_date,
  severity,
  issue_type,
  action_taken,
  outcome,
  created_by
)
SELECT
  cm.case_id,
  issue_data.issue_title,
  issue_data.issue_description,
  issue_data.occurred_date,
  issue_data.severity,
  issue_data.issue_type,
  issue_data.action_taken,
  issue_data.outcome,
  ti.teacher_uuid
FROM teacher_info ti, (VALUES
  -- Case 250120-00017 (Eric - Counselling: Academic Pressure)
  ('250120-00017', 'Initial Counselling Assessment', 'Parent-driven academic pressure identified. Eric reports feeling overwhelmed by expectations for top grades. Anxiety symptoms present.', '2025-01-20'::date, 'high', 'counselling_session', 'Referred to school counsellor for weekly sessions', 'First session scheduled for Jan 27'),
  ('250120-00017', 'Study Skills Workshop Enrollment', 'Enrolled in study skills workshop to build time management and organization skills, reducing reliance on excessive study hours.', '2025-01-15'::date, 'medium', 'intervention', 'Registered for 6-week workshop program', 'Attendance confirmed, materials provided'),
  ('250120-00017', 'Parent Meeting Scheduled', 'Meeting with Dr. & Mrs. Lim scheduled to discuss reducing academic pressure and focusing on holistic development.', '2025-01-10'::date, 'medium', 'parent_meeting', 'PTM scheduled for Feb 14, 2025', 'Waiting for meeting date'),

  -- Case 241205-00018 (Eric - Discipline: Classroom Participation)
  ('241205-00018', 'Withdrawn Behavior Observed', 'Eric increasingly withdrawn during lessons, minimal participation in class discussions despite strong academic ability.', '2024-12-05'::date, 'medium', 'observation', 'One-on-one check-in conducted', 'Student shared feeling tired and stressed'),
  ('241205-00018', 'Disruption During Group Work', 'Minor disruption during group science project - appeared distracted and unfocused, affecting team dynamics.', '2024-12-10'::date, 'low', 'incident', 'Gentle reminder given, partner reassigned', 'Improved focus after partner change'),

  -- Case 250115-00019 (Lim Hui Ling - Discipline: Tardiness)
  ('250115-00019', 'Tardiness Pattern Documented', 'Late arrival 8 times in past 3 weeks. Missing morning assembly and first 15 minutes of lessons consistently.', '2025-01-15'::date, 'high', 'observation', 'Parent phone call to discuss morning routine', 'Parent committed to improved morning schedule'),
  ('250115-00019', 'Morning Routine Support Plan', 'Implemented early arrival incentive program. Hui Ling to check in with form teacher upon arrival.', '2025-01-10'::date, 'medium', 'intervention', 'Reward chart created for on-time arrivals', 'First week: 4/5 on-time arrivals'),
  ('250115-00019', 'Follow-up Review', 'Review of tardiness pattern after 2 weeks of intervention. Slight improvement noted but consistency still needed.', '2025-01-05'::date, 'medium', 'review', 'Continue monitoring, parent meeting in Feb', 'Improvement trend positive'),

  -- Case 241128-00020 (Lim Hui Ling - Career: Future Planning)
  ('241128-00020', 'Interest Inventory Session', 'Completed career interest inventory. Strong interest in creative arts, languages, and helping professions identified.', '2024-11-28'::date, 'low', 'assessment', 'Discussed results with student', 'Student excited about arts pathway'),
  ('241128-00020', 'Subject Selection Discussion', 'Discussed subject options for next year aligned with identified interests and strengths.', '2024-12-05'::date, 'low', 'counselling_session', 'Provided subject information packages', 'To discuss with parents at home'),

  -- Case 250110-00021 (Siti - Counselling: Peer Relationships)
  ('250110-00021', 'Peer Conflict Incident', 'Argument with classmate during recess escalated. Both students upset, conflict mediation required.', '2025-01-10'::date, 'high', 'incident', 'Mediation session conducted same day', 'Both students apologized, agreement made'),
  ('250110-00021', 'Social Skills Group', 'Recommended for social skills group to develop conflict resolution and communication strategies.', '2025-01-08'::date, 'medium', 'intervention', 'Enrolled in weekly social skills sessions', 'First session attended, positive response'),
  ('250110-00021', 'Friendship Challenges Discussed', 'One-on-one session to discuss difficulties making and keeping friends. Loneliness and frustration expressed.', '2025-01-05'::date, 'medium', 'counselling_session', 'Strategies discussed, buddy system explored', 'Student willing to try new approaches'),

  -- Case 241220-00022 (Siti - SEN: Reading Intervention)
  ('241220-00022', 'Reading Assessment Completed', 'Reading level 1.5 years below grade level. Decoding skills adequate but comprehension weak.', '2024-12-20'::date, 'high', 'assessment', 'Referred to learning support program', 'LSP enrollment confirmed for Term 2'),
  ('241220-00022', 'Parent Consultation', 'Met with mother to discuss reading intervention plan and home support strategies.', '2024-12-18'::date, 'medium', 'parent_meeting', 'Home reading program materials provided', 'Parent supportive and committed'),

  -- Case 250105-00023 (Chen Jia Yi - Discipline: Homework)
  ('250105-00023', 'Missing Homework Pattern', 'Homework incomplete or missing 6 times in past 2 weeks across multiple subjects. Affecting learning progress.', '2025-01-05'::date, 'high', 'observation', 'Homework monitoring sheet implemented', 'Student to show completed work daily'),
  ('250105-00023', 'Parent Communication', 'Email sent to parents regarding homework concerns and accountability plan.', '2025-01-03'::date, 'medium', 'parent_communication', 'Parents acknowledged, will supervise homework', 'Improved completion in first week'),

  -- Case 241215-00024 (Chen Jia Yi - Career: Subject Selection)
  ('241215-00024', 'Strengths Analysis Session', 'Strong performance in Science and Math identified. Enjoys hands-on experiments and problem-solving.', '2024-12-15'::date, 'low', 'counselling_session', 'Discussed STEM pathway options', 'Student interested in engineering fields'),
  ('241215-00024', 'Subject Preview Activities', 'Participated in subject preview sessions for Sciences and Advanced Math options.', '2024-12-10'::date, 'low', 'activity', 'Observed student engagement levels', 'High engagement in both sessions'),

  -- Case 241230-00025 (Nicholas - SEN: Attention Support)
  ('241230-00025', 'Attention Difficulties Observed', 'Struggles to maintain focus during lessons, frequently off-task. Teacher observations across subjects consistent.', '2024-12-30'::date, 'high', 'observation', 'Referral to educational psychologist', 'Assessment scheduled for Feb 2025'),
  ('241230-00025', 'Classroom Accommodations Trial', 'Implemented preferential seating (front of class) and movement breaks. Monitoring effectiveness.', '2024-12-28'::date, 'medium', 'intervention', 'Accommodations in place for 2 weeks', 'Some improvement in on-task behavior'),
  ('241230-00025', 'Parent Consultation', 'Discussed attention concerns with parents. Parents report similar difficulties with homework completion at home.', '2024-12-22'::date, 'medium', 'parent_meeting', 'Assessment referral explained and agreed', 'Parents cooperative and concerned'),

  -- Case 241118-00026 (Nicholas - Discipline: Focus Issues)
  ('241118-00026', 'Off-Task Behavior Pattern', 'Frequently distracted during independent work time. Requires multiple redirections per lesson.', '2024-11-18'::date, 'medium', 'observation', 'Self-monitoring checklist introduced', 'Student using checklist with reminders'),
  ('241118-00026', 'Work Completion Concerns', 'Class assignments often incomplete due to time spent off-task. Quality of work affected.', '2024-11-22'::date, 'medium', 'observation', 'Extra time provided for task completion', 'Improvement when given extended time'),

  -- Case 241225-00027 (Muhammad Iskandar - Counselling: Social Integration)
  ('241225-00027', 'Social Isolation Observed', 'Frequently alone during recess and lunch. Limited peer interactions noted by multiple teachers.', '2024-12-25'::date, 'high', 'observation', 'Lunch club invitation extended', 'Student attended first session'),
  ('241225-00027', 'Friendship Support Plan', 'Working with student on conversation skills and peer approach strategies.', '2024-12-20'::date, 'medium', 'counselling_session', 'Role-play practice conducted', 'Student practiced greetings and questions'),
  ('241225-00027', 'Parent Discussion', 'Parents aware of social challenges. Limited community connections outside school identified.', '2024-12-18'::date, 'medium', 'parent_meeting', 'Community activities suggested', 'Parents exploring local programs'),

  -- Case 241110-00028 (Muhammad Iskandar - Discipline: Participation)
  ('241110-00028', 'Minimal Class Participation', 'Rarely volunteers to answer questions or share ideas during discussions. Appears hesitant and uncertain.', '2024-11-10'::date, 'medium', 'observation', 'Private encouragement provided', 'Slight increase in written responses'),
  ('241110-00028', 'Group Work Reluctance', 'Passive during group activities, allows others to dominate. Not contributing ideas or taking roles.', '2024-11-15'::date, 'low', 'observation', 'Assigned specific roles in groups', 'Performed assigned role adequately'),

  -- Case 241222-00029 (Tan Wei Jie - Counselling: Family Support)
  ('241222-00029', 'Family Transition Impact', 'Parents separating. Wei Jie showing signs of emotional distress - withdrawn, tearful at times.', '2024-12-22'::date, 'high', 'incident', 'Immediate counselling session provided', 'Student relieved to talk, emotions validated'),
  ('241222-00029', 'Ongoing Counselling Support', 'Weekly check-ins established to monitor wellbeing during family transition period.', '2024-12-20'::date, 'high', 'counselling_session', 'Counselling schedule set up', 'Three sessions completed so far'),
  ('241222-00029', 'Academic Support During Transition', 'Homework load adjusted temporarily. Teachers briefed on situation to provide understanding.', '2024-12-18'::date, 'medium', 'intervention', 'Modified expectations communicated', 'Student managing academic demands'),

  -- Case 241105-00030 (Tan Wei Jie - SEN: Reading Support)
  ('241105-00030', 'Reading Comprehension Assessment', 'Struggles with inference and reading between the lines. Literal comprehension adequate but higher-order thinking weak.', '2024-11-05'::date, 'high', 'assessment', 'Small group reading intervention started', 'Attending 3x weekly sessions'),
  ('241105-00030', 'Progress Monitoring', 'After 4 weeks of intervention, showing gradual improvement in comprehension strategies.', '2024-12-03'::date, 'medium', 'review', 'Continue intervention, add questioning strategies', 'Student more confident asking questions'),

  -- Case 241218-00031 (Alice - Discipline: Group Work Conflicts)
  ('241218-00031', 'Group Work Disagreement', 'Conflict during art project over creative direction. Alice became frustrated and refused to compromise.', '2024-12-18'::date, 'medium', 'incident', 'Mediation and compromise strategies taught', 'Completed project after resolution'),
  ('241218-00031', 'Pattern of Control Issues', 'Tendency to want to lead and control group work outcomes. Difficulty accepting others'' ideas.', '2024-12-15'::date, 'medium', 'observation', 'Collaboration skills explicitly taught', 'Practicing turn-taking in decisions'),
  ('241218-00031', 'Conflict Resolution Practice', 'Role-play sessions on handling disagreements and finding win-win solutions.', '2024-12-10'::date, 'low', 'intervention', 'Multiple scenarios practiced', 'Alice identifying better approaches'),

  -- Case 241101-00032 (Alice - Counselling: Self-Confidence)
  ('241101-00032', 'Low Self-Esteem Indicators', 'Frequent self-deprecating comments. Reluctant to try new things due to fear of failure.', '2024-11-01'::date, 'high', 'observation', 'Self-esteem building program started', 'Weekly sessions addressing negative self-talk'),
  ('241101-00032', 'Success Celebration Strategy', 'Implementing success journal to document achievements and build positive self-image.', '2024-11-08'::date, 'medium', 'intervention', 'Journal started, reviewed weekly', 'Alice proud of documented successes'),

  -- Case 241212-00033 (Priya - Counselling: Cultural Adjustment)
  ('241212-00033', 'Cultural Adjustment Challenges', 'Recent immigrant family. Priya navigating differences in classroom culture and social norms.', '2024-12-12'::date, 'medium', 'counselling_session', 'Cultural bridge-building discussions', 'Priya expressing feelings openly'),
  ('241212-00033', 'Peer Buddy System', 'Paired with culturally-aware classmate to support social integration and school navigation.', '2024-12-10'::date, 'medium', 'intervention', 'Buddy partnership established', 'Positive friendship developing'),
  ('241212-00033', 'Family Support Connection', 'Connected family with multicultural parent support group for community building.', '2024-12-08'::date, 'low', 'parent_communication', 'Contact information shared', 'Family attended first meeting'),

  -- Case 241028-00034 (Priya - Career: Strengths Identification)
  ('241028-00034', 'Multiple Talents Identified', 'Strong in languages, arts, and music. Difficulty choosing focus area due to diverse interests.', '2024-10-28'::date, 'low', 'counselling_session', 'Explored how interests can combine', 'Priya excited about possibilities'),
  ('241028-00034', 'Exposure Activities Planned', 'Signed up for debate club and art club to explore interests further before making decisions.', '2024-11-05'::date, 'low', 'activity', 'Club participation commenced', 'Enjoying both activities'),

  -- Case 241208-00035 (Reza - Discipline: Attendance)
  ('241208-00035', 'Irregular Attendance Pattern', 'Missing 1-2 days per week without clear medical reasons. Affecting academic continuity.', '2024-12-08'::date, 'high', 'observation', 'Parent meeting scheduled', 'Discussion planned for Dec 12'),
  ('241208-00035', 'Parent Meeting Conducted', 'Family facing morning routine challenges. Single parent household with multiple children.', '2024-12-12'::date, 'medium', 'parent_meeting', 'Support strategies discussed', 'Parent committed to improvement'),
  ('241208-00035', 'Attendance Monitoring', 'Daily attendance tracking with positive reinforcement for consistent attendance weeks.', '2024-12-15'::date, 'medium', 'intervention', 'Reward system implemented', 'Improved attendance in week 1'),

  -- Case 241022-00036 (Reza - Career: Interest Exploration)
  ('241022-00036', 'Career Exploration Activities', 'Participating in hands-on career exploration workshops - construction, technology, healthcare.', '2024-10-22'::date, 'low', 'activity', 'Three workshops completed', 'Most engaged in technology session'),
  ('241022-00036', 'Interest Profile Emerging', 'Strong interest in technology and computers. Enjoys problem-solving and building things.', '2024-11-01'::date, 'low', 'counselling_session', 'Technology pathway discussed', 'Student excited about IT possibilities'),

  -- Case 241201-00037 (Wong Kai Xuan - SEN: Math Intervention)
  ('241201-00037', 'Math Difficulties Assessment', 'Struggling with multiplication, division, and word problems. Conceptual understanding weak.', '2024-12-01'::date, 'high', 'assessment', 'Math intervention program enrollment', 'Small group instruction 4x weekly'),
  ('241201-00037', 'Manipulatives Introduction', 'Using concrete materials to build number sense and operation understanding.', '2024-12-05'::date, 'medium', 'intervention', 'Hands-on learning approach started', 'Student showing increased engagement'),
  ('241201-00037', 'Parent Math Support', 'Provided parents with games and activities to reinforce math concepts at home.', '2024-12-03'::date, 'medium', 'parent_communication', 'Resource kit sent home', 'Parent reports student enjoying games'),

  -- Case 241018-00038 (Wong Kai Xuan - Discipline: Playground)
  ('241018-00038', 'Rough Play Incident', 'Physical play during soccer too aggressive. Another student fell and was hurt. Kai Xuan remorseful.', '2024-10-18'::date, 'high', 'incident', 'Apology and recess consequences', 'Apology accepted, missed one recess'),
  ('241018-00038', 'Safe Play Expectations Review', 'Reviewed playground safety rules and appropriate physical play boundaries.', '2024-10-22'::date, 'medium', 'intervention', 'Safety contract signed', 'Improved awareness of physical boundaries'),

  -- Case 241128-00039 (Ryan - Counselling: Anger Management)
  ('241128-00039', 'Anger Outburst Incident', 'Yelled at classmate and threw materials during frustrating task. Difficulty regulating emotions.', '2024-11-28'::date, 'high', 'incident', 'Immediate cool-down and discussion', 'Identified triggers and warning signs'),
  ('241128-00039', 'Anger Management Program', 'Enrolled in 8-week anger management group. Learning calm-down strategies and emotional regulation.', '2024-12-02'::date, 'high', 'intervention', 'Weekly group sessions started', 'Ryan practicing breathing techniques'),
  ('241128-00039', 'Parent Collaboration', 'Working with parents on consistent behavior management strategies between home and school.', '2024-12-05'::date, 'medium', 'parent_meeting', 'Shared behavior plan created', 'Parents using same language at home'),

  -- Case 241015-00040 (Ryan - Career: Goal Setting)
  ('241015-00040', 'Goal Setting Workshop', 'Participated in goal-setting workshop. Struggling to identify specific, achievable goals.', '2024-10-15'::date, 'low', 'activity', 'SMART goals framework taught', 'Ryan created one academic goal'),
  ('241015-00040', 'Progress Monitoring System', 'Set up weekly check-ins to monitor progress toward goals and celebrate small wins.', '2024-10-22'::date, 'low', 'intervention', 'Goal tracking sheet created', 'Ryan meeting with teacher weekly')

) AS issue_data(
  case_number, issue_title, issue_description, occurred_date, severity,
  issue_type, action_taken, outcome
)
JOIN case_map cm ON cm.case_number = issue_data.case_number;
