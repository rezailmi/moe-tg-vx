import type { Announcement } from '@/types/announcements'

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Emergency Drill Tomorrow at 10:00 AM',
    content: 'All staff and students are required to participate in the emergency evacuation drill tomorrow at 10:00 AM. Please ensure all classroom doors are unlocked and review evacuation procedures with your classes.',
    author: 'Admin Office',
    authorRole: 'School Administration',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    priority: 'high',
    category: 'emergency',
    read: false,
  },
  {
    id: 'ann-2',
    title: 'Parent-Teacher Conference Schedule Released',
    content: 'The schedule for the upcoming parent-teacher conferences has been released. Please check your assigned time slots in the Meetings tab and prepare necessary documents for discussion.',
    author: 'Principal Lee',
    authorRole: 'Principal',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    priority: 'medium',
    category: 'administrative',
    read: false,
  },
  {
    id: 'ann-3',
    title: 'School Assembly Cancelled - Friday, Nov 8',
    content: 'Due to unforeseen circumstances, the school assembly scheduled for Friday, November 8th has been cancelled. Regular classes will proceed as normal during the assembly period.',
    author: 'VP Academic Affairs',
    authorRole: 'Vice Principal',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    priority: 'medium',
    category: 'administrative',
    read: true,
  },
  {
    id: 'ann-4',
    title: 'PSLE Preparation Workshop - Registration Open',
    content: 'Registration is now open for the PSLE preparation workshop series starting next month. The workshops will cover examination techniques, time management, and subject-specific strategies. Limited seats available.',
    author: 'HOD Mathematics',
    authorRole: 'Head of Department',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    priority: 'medium',
    category: 'academic',
    read: true,
    attachments: [
      {
        name: 'PSLE_Workshop_Schedule.pdf',
        url: '/files/psle-workshop-schedule.pdf',
        type: 'application/pdf',
      },
    ],
  },
  {
    id: 'ann-5',
    title: 'Year-End Concert - Call for Performers',
    content: 'The school is organizing a year-end concert and we are looking for talented students to perform. If you have students interested in showcasing their talents, please submit their names and performance details by November 15th.',
    author: 'CCA Department',
    authorRole: 'CCA Coordinator',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    priority: 'low',
    category: 'event',
    read: true,
  },
  {
    id: 'ann-6',
    title: 'Updated COVID-19 Safety Measures',
    content: 'Please be informed of the updated COVID-19 safety measures effective immediately. All students and staff must wear masks in common areas, and social distancing of 1 meter should be maintained where possible.',
    author: 'Admin Office',
    authorRole: 'School Administration',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    priority: 'high',
    category: 'administrative',
    read: true,
  },
  {
    id: 'ann-7',
    title: 'Science Fair 2025 - Project Submissions',
    content: 'The annual Science Fair is approaching! Students who wish to participate should submit their project proposals by December 1st. Judging will take place in early January.',
    author: 'HOD Science',
    authorRole: 'Head of Department',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    priority: 'medium',
    category: 'academic',
    read: true,
    attachments: [
      {
        name: 'Science_Fair_Guidelines.pdf',
        url: '/files/science-fair-guidelines.pdf',
        type: 'application/pdf',
      },
      {
        name: 'Project_Template.docx',
        url: '/files/project-template.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
  },
  {
    id: 'ann-8',
    title: 'Staff Professional Development Day',
    content: 'Reminder: There will be no classes on November 22nd due to Staff Professional Development Day. All teachers are required to attend the sessions scheduled at the multi-purpose hall.',
    author: 'HR Department',
    authorRole: 'Human Resources',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    priority: 'low',
    category: 'administrative',
    read: true,
  },
]

export function getAnnouncementById(id: string): Announcement | undefined {
  return mockAnnouncements.find((announcement) => announcement.id === id)
}

export function getUnreadAnnouncementsCount(): number {
  return mockAnnouncements.filter((announcement) => !announcement.read).length
}

export function getAnnouncementsByCategory(category: string): Announcement[] {
  if (category === 'all') return mockAnnouncements
  return mockAnnouncements.filter((announcement) => announcement.category === category)
}

export function getAnnouncementsByPriority(priority: string): Announcement[] {
  if (priority === 'all') return mockAnnouncements
  return mockAnnouncements.filter((announcement) => announcement.priority === priority)
}
