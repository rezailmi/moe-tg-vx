export type ContentType = 'video' | 'pdf' | 'guide';

export interface LearningContent {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  authorRole: string;
  duration?: string; // for videos: "4:32"
  pages?: number; // for PDFs
  description: string;
  thumbnailUrl?: string;
  contextTags: string[]; // e.g., ['wellbeing', 'at-risk', 'crisis', 'intervention']
}

export interface LearningContext {
  trigger: string; // e.g., 'student-at-risk', 'declining-attendance', 'parent-meeting'
  title: string;
  description: string;
  recommendedContent: string[]; // content IDs
}

// Mock content library
export const mockLearningContent: LearningContent[] = [
  {
    id: 'vid-001',
    type: 'video',
    title: 'First Steps in Student Crisis Support',
    author: 'Mrs. Linda Ng',
    authorRole: 'Master Teacher, Wellbeing',
    duration: '4:32',
    description: 'What to do in the first 10 minutes when you identify a student in crisis. Covers immediate assessment, creating safe space, and when to escalate.',
    contextTags: ['wellbeing', 'at-risk', 'crisis', 'intervention'],
  },
  {
    id: 'vid-002',
    type: 'video',
    title: 'Building Rapport with Struggling Students',
    author: 'Mr. Ahmad Rahman',
    authorRole: 'Senior Teacher, Student Development',
    duration: '6:15',
    description: 'Practical techniques for connecting with students who are withdrawn or resistant. Includes conversation starters and body language tips.',
    contextTags: ['wellbeing', 'at-risk', 'engagement', 'rapport'],
  },
  {
    id: 'pdf-001',
    type: 'pdf',
    title: 'Wellbeing Conversation Guide',
    author: 'MOE Student Development Branch',
    authorRole: 'Official Resource',
    pages: 8,
    description: 'Step-by-step guide for conducting wellbeing check-ins with students. Includes sample questions and red flags to watch for.',
    contextTags: ['wellbeing', 'at-risk', 'conversation', 'checklist'],
  },
  {
    id: 'pdf-002',
    type: 'pdf',
    title: 'Crisis Response Checklist',
    author: 'Mrs. Sarah Tan',
    authorRole: 'Lead Teacher, Counselling',
    pages: 2,
    description: 'Quick reference checklist for immediate actions when a student shows signs of crisis. Printable one-pager.',
    contextTags: ['crisis', 'checklist', 'emergency', 'intervention'],
  },
  {
    id: 'vid-003',
    type: 'video',
    title: 'Engaging Parents in Student Support',
    author: 'Dr. Michelle Lee',
    authorRole: 'Educational Psychologist',
    duration: '8:45',
    description: 'How to have productive conversations with parents about student wellbeing concerns. Covers cultural sensitivity and partnership building.',
    contextTags: ['parents', 'communication', 'wellbeing', 'partnership'],
  },
  {
    id: 'guide-001',
    type: 'guide',
    title: 'De-escalation Techniques',
    author: 'MOE Guidance Branch',
    authorRole: 'Official Resource',
    description: 'Quick reference guide for calming escalated situations. 5 techniques with examples.',
    contextTags: ['crisis', 'de-escalation', 'behavior', 'intervention'],
  },
];

// Context-to-content mapping
export const learningContexts: LearningContext[] = [
  {
    trigger: 'student-at-risk',
    title: 'Student Wellbeing Support',
    description: "You're viewing a student flagged for wellbeing concerns. Here are resources that might help.",
    recommendedContent: ['vid-001', 'pdf-002', 'pdf-001', 'vid-002'],
  },
  {
    trigger: 'declining-attendance',
    title: 'Attendance Intervention',
    description: 'This student has declining attendance. Consider these approaches.',
    recommendedContent: ['vid-002', 'vid-003', 'pdf-001'],
  },
  {
    trigger: 'academic-decline',
    title: 'Academic Support Strategies',
    description: 'This student shows declining academic performance. Resources to help.',
    recommendedContent: ['vid-002', 'vid-003'],
  },
];

// Helper function to get content for a context
export function getContentForContext(trigger: string): {
  context: LearningContext | undefined;
  content: LearningContent[];
} {
  const context = learningContexts.find(c => c.trigger === trigger);
  if (!context) return { context: undefined, content: [] };

  const content = context.recommendedContent
    .map(id => mockLearningContent.find(c => c.id === id))
    .filter((c): c is LearningContent => c !== undefined);

  return { context, content };
}
