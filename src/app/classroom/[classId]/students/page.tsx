import { StudentList } from '@/components/classroom/student-list'

interface StudentListPageProps {
  params: Promise<{ classId: string }>
}

export default async function StudentListPage({ params }: StudentListPageProps) {
  const { classId } = await params

  return <StudentList classId={classId} />
}
