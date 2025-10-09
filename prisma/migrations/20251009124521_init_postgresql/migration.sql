-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TEACHER', 'FORM_TEACHER', 'HOD', 'YEAR_HEAD');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('NONE', 'GEP', 'SEN', 'IEP');

-- CreateEnum
CREATE TYPE "ConductGrade" AS ENUM ('EXCELLENT', 'ABOVE_AVERAGE', 'AVERAGE', 'NEEDS_IMPROVEMENT');

-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('DAILY', 'CCA', 'SCHOOL_EVENT', 'EARLY_DISMISSAL');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "AbsenceReason" AS ENUM ('SICK', 'MEDICAL_APPOINTMENT', 'FAMILY_EMERGENCY', 'SCHOOL_EVENT', 'PRE_APPROVED_LEAVE', 'TRANSPORT_ISSUES', 'OTHER');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('ASSIGNMENT', 'QUIZ', 'EXAM', 'PROJECT', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "CCEGradeEnum" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('DISCIPLINE', 'SEN', 'COUNSELLING', 'CAREER_GUIDANCE');

-- CreateEnum
CREATE TYPE "CaseSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('ACTIVE', 'MONITORING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "RecordVisibility" AS ENUM ('PRIVATE', 'STAFF', 'PARENT', 'STUDENT');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ACADEMIC', 'ATTENDANCE', 'BEHAVIORAL', 'WELLBEING', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('ONE_TO_ONE', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('TEACHER', 'PARENT');

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "department" TEXT NOT NULL,
    "avatar" TEXT,
    "classesAssigned" TEXT NOT NULL,
    "formClassId" TEXT,
    "ccaClassIds" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT,
    "hashedPassword" TEXT,
    "lastLogin" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "yearLevel" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "isFormClass" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" TEXT NOT NULL,
    "formTeacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSchedule" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "yearLevel" INTEGER NOT NULL,
    "className" TEXT NOT NULL,
    "status" "StudentStatus" NOT NULL DEFAULT 'NONE',
    "conductGrade" "ConductGrade" NOT NULL DEFAULT 'AVERAGE',
    "avatar" TEXT,
    "familyBackground" TEXT,
    "housingFinance" TEXT,
    "healthDeclaration" TEXT,
    "mentalWellnessNotes" TEXT,
    "friends" TEXT NOT NULL,
    "hasMedicalConditions" BOOLEAN NOT NULL DEFAULT false,
    "needsCounselling" BOOLEAN NOT NULL DEFAULT false,
    "hasDisciplinaryIssues" BOOLEAN NOT NULL DEFAULT false,
    "hasSEN" BOOLEAN NOT NULL DEFAULT false,
    "overallAverage" DOUBLE PRECISION,
    "attendanceRate" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "lastUpdatedPerformance" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassEnrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentParent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT,
    "type" "AttendanceType" NOT NULL,
    "date" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "reason" "AbsenceReason",
    "notes" TEXT,
    "ccaName" TEXT,
    "eventName" TEXT,
    "dismissalTime" TEXT,
    "dismissalReason" TEXT,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicGrade" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "assessmentType" "AssessmentType" NOT NULL,
    "assessmentName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "letterGrade" TEXT,
    "weightage" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "term" TEXT,
    "academicYear" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "gradedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedBy" TEXT NOT NULL,

    CONSTRAINT "AcademicGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCAPerformance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "ccaName" TEXT NOT NULL,
    "ccaType" TEXT NOT NULL,
    "attendanceRate" DOUBLE PRECISION,
    "participation" TEXT,
    "achievements" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "grade" TEXT,
    "remarks" TEXT,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CCAPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalFitnessRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "testDate" TEXT NOT NULL,
    "overallGrade" TEXT,
    "tests" TEXT NOT NULL,
    "remarks" TEXT,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysicalFitnessRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCEGrade" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "grade" "CCEGradeEnum" NOT NULL,
    "term" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "observations" TEXT,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CCEGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "type" "CaseType" NOT NULL,
    "severity" "CaseSeverity" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "openedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedBy" TEXT NOT NULL,
    "closedDate" TIMESTAMP(3),
    "closedBy" TEXT,
    "resolution" TEXT,
    "caseOwner" TEXT NOT NULL,
    "caseTeam" TEXT NOT NULL,
    "progressNotes" TEXT,
    "interventions" TEXT,
    "nextReviewDate" TIMESTAMP(3),
    "lastReviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceDataRecording" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "observationType" TEXT NOT NULL,
    "frequency" TEXT,
    "impact" TEXT,
    "parentContacted" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "RecordVisibility" NOT NULL DEFAULT 'STAFF',
    "tags" TEXT NOT NULL,
    "linkedCaseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceDataRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceDataRecording" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performanceArea" TEXT NOT NULL,
    "subject" TEXT,
    "trend" TEXT,
    "previousLevel" TEXT,
    "currentLevel" TEXT,
    "concernLevel" TEXT,
    "visibility" "RecordVisibility" NOT NULL DEFAULT 'STAFF',
    "tags" TEXT NOT NULL,
    "linkedCaseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceDataRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundDataRecording" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundArea" TEXT NOT NULL,
    "severity" TEXT,
    "actionRequired" BOOLEAN NOT NULL DEFAULT false,
    "actionTaken" TEXT,
    "referredTo" TEXT,
    "visibility" "RecordVisibility" NOT NULL DEFAULT 'STAFF',
    "tags" TEXT NOT NULL,
    "linkedCaseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackgroundDataRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialBehaviourRecording" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "behaviourArea" TEXT NOT NULL,
    "context" TEXT,
    "peersInvolved" TEXT,
    "isPositive" BOOLEAN NOT NULL DEFAULT true,
    "concernLevel" TEXT,
    "visibility" "RecordVisibility" NOT NULL DEFAULT 'STAFF',
    "tags" TEXT NOT NULL,
    "linkedCaseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialBehaviourRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAlert" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "dismissedBy" TEXT,
    "dismissedAt" TIMESTAMP(3),

    CONSTRAINT "ClassAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL,
    "groupName" TEXT,
    "studentId" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userType" "ParticipantRole" NOT NULL,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderRole" "ParticipantRole" NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReadReceipt" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReadReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_email_idx" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_department_idx" ON "Teacher"("department");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE INDEX "Parent_email_idx" ON "Parent"("email");

-- CreateIndex
CREATE INDEX "Parent_phone_idx" ON "Parent"("phone");

-- CreateIndex
CREATE INDEX "Class_yearLevel_className_idx" ON "Class"("yearLevel", "className");

-- CreateIndex
CREATE INDEX "Class_teacherId_idx" ON "Class"("teacherId");

-- CreateIndex
CREATE INDEX "Class_academicYear_idx" ON "Class"("academicYear");

-- CreateIndex
CREATE INDEX "ClassSchedule_classId_day_idx" ON "ClassSchedule"("classId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE INDEX "Student_name_idx" ON "Student"("name");

-- CreateIndex
CREATE INDEX "Student_yearLevel_idx" ON "Student"("yearLevel");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");

-- CreateIndex
CREATE INDEX "Student_className_idx" ON "Student"("className");

-- CreateIndex
CREATE INDEX "Student_overallAverage_idx" ON "Student"("overallAverage");

-- CreateIndex
CREATE INDEX "Student_attendanceRate_idx" ON "Student"("attendanceRate");

-- CreateIndex
CREATE INDEX "ClassEnrollment_studentId_idx" ON "ClassEnrollment"("studentId");

-- CreateIndex
CREATE INDEX "ClassEnrollment_classId_idx" ON "ClassEnrollment"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassEnrollment_studentId_classId_key" ON "ClassEnrollment"("studentId", "classId");

-- CreateIndex
CREATE INDEX "StudentParent_studentId_idx" ON "StudentParent"("studentId");

-- CreateIndex
CREATE INDEX "StudentParent_parentId_idx" ON "StudentParent"("parentId");

-- CreateIndex
CREATE INDEX "StudentParent_isPrimary_idx" ON "StudentParent"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "StudentParent_studentId_parentId_key" ON "StudentParent"("studentId", "parentId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_type_date_idx" ON "AttendanceRecord"("studentId", "type", "date");

-- CreateIndex
CREATE INDEX "AttendanceRecord_date_status_idx" ON "AttendanceRecord"("date", "status");

-- CreateIndex
CREATE INDEX "AttendanceRecord_type_idx" ON "AttendanceRecord"("type");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_studentId_type_date_key" ON "AttendanceRecord"("studentId", "type", "date");

-- CreateIndex
CREATE INDEX "AcademicGrade_studentId_subject_academicYear_idx" ON "AcademicGrade"("studentId", "subject", "academicYear");

-- CreateIndex
CREATE INDEX "AcademicGrade_studentId_term_idx" ON "AcademicGrade"("studentId", "term");

-- CreateIndex
CREATE INDEX "AcademicGrade_classId_subject_idx" ON "AcademicGrade"("classId", "subject");

-- CreateIndex
CREATE INDEX "AcademicGrade_gradedDate_idx" ON "AcademicGrade"("gradedDate");

-- CreateIndex
CREATE INDEX "AcademicGrade_published_idx" ON "AcademicGrade"("published");

-- CreateIndex
CREATE INDEX "CCAPerformance_studentId_academicYear_idx" ON "CCAPerformance"("studentId", "academicYear");

-- CreateIndex
CREATE INDEX "CCAPerformance_ccaName_idx" ON "CCAPerformance"("ccaName");

-- CreateIndex
CREATE INDEX "PhysicalFitnessRecord_studentId_testDate_idx" ON "PhysicalFitnessRecord"("studentId", "testDate");

-- CreateIndex
CREATE INDEX "CCEGrade_studentId_term_idx" ON "CCEGrade"("studentId", "term");

-- CreateIndex
CREATE INDEX "CCEGrade_academicYear_idx" ON "CCEGrade"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_studentId_status_idx" ON "Case"("studentId", "status");

-- CreateIndex
CREATE INDEX "Case_type_status_idx" ON "Case"("type", "status");

-- CreateIndex
CREATE INDEX "Case_caseNumber_idx" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_openedDate_idx" ON "Case"("openedDate");

-- CreateIndex
CREATE INDEX "Case_nextReviewDate_idx" ON "Case"("nextReviewDate");

-- CreateIndex
CREATE INDEX "AttendanceDataRecording_studentId_date_idx" ON "AttendanceDataRecording"("studentId", "date");

-- CreateIndex
CREATE INDEX "AttendanceDataRecording_linkedCaseId_idx" ON "AttendanceDataRecording"("linkedCaseId");

-- CreateIndex
CREATE INDEX "AttendanceDataRecording_createdAt_idx" ON "AttendanceDataRecording"("createdAt");

-- CreateIndex
CREATE INDEX "PerformanceDataRecording_studentId_date_idx" ON "PerformanceDataRecording"("studentId", "date");

-- CreateIndex
CREATE INDEX "PerformanceDataRecording_performanceArea_idx" ON "PerformanceDataRecording"("performanceArea");

-- CreateIndex
CREATE INDEX "PerformanceDataRecording_linkedCaseId_idx" ON "PerformanceDataRecording"("linkedCaseId");

-- CreateIndex
CREATE INDEX "PerformanceDataRecording_createdAt_idx" ON "PerformanceDataRecording"("createdAt");

-- CreateIndex
CREATE INDEX "BackgroundDataRecording_studentId_date_idx" ON "BackgroundDataRecording"("studentId", "date");

-- CreateIndex
CREATE INDEX "BackgroundDataRecording_backgroundArea_idx" ON "BackgroundDataRecording"("backgroundArea");

-- CreateIndex
CREATE INDEX "BackgroundDataRecording_linkedCaseId_idx" ON "BackgroundDataRecording"("linkedCaseId");

-- CreateIndex
CREATE INDEX "BackgroundDataRecording_actionRequired_idx" ON "BackgroundDataRecording"("actionRequired");

-- CreateIndex
CREATE INDEX "BackgroundDataRecording_createdAt_idx" ON "BackgroundDataRecording"("createdAt");

-- CreateIndex
CREATE INDEX "SocialBehaviourRecording_studentId_date_idx" ON "SocialBehaviourRecording"("studentId", "date");

-- CreateIndex
CREATE INDEX "SocialBehaviourRecording_behaviourArea_idx" ON "SocialBehaviourRecording"("behaviourArea");

-- CreateIndex
CREATE INDEX "SocialBehaviourRecording_linkedCaseId_idx" ON "SocialBehaviourRecording"("linkedCaseId");

-- CreateIndex
CREATE INDEX "SocialBehaviourRecording_isPositive_idx" ON "SocialBehaviourRecording"("isPositive");

-- CreateIndex
CREATE INDEX "SocialBehaviourRecording_createdAt_idx" ON "SocialBehaviourRecording"("createdAt");

-- CreateIndex
CREATE INDEX "ClassAlert_classId_status_idx" ON "ClassAlert"("classId", "status");

-- CreateIndex
CREATE INDEX "ClassAlert_severity_status_idx" ON "ClassAlert"("severity", "status");

-- CreateIndex
CREATE INDEX "ClassAlert_createdDate_idx" ON "ClassAlert"("createdDate");

-- CreateIndex
CREATE INDEX "Conversation_studentId_idx" ON "Conversation"("studentId");

-- CreateIndex
CREATE INDEX "Conversation_type_idx" ON "Conversation"("type");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_teacherId_idx" ON "ConversationParticipant"("teacherId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_parentId_idx" ON "ConversationParticipant"("parentId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "ConversationParticipant"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_teacherId_parentId_key" ON "ConversationParticipant"("conversationId", "teacherId", "parentId");

-- CreateIndex
CREATE INDEX "Message_conversationId_sentAt_idx" ON "Message"("conversationId", "sentAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "MessageReadReceipt_messageId_idx" ON "MessageReadReceipt"("messageId");

-- CreateIndex
CREATE INDEX "MessageReadReceipt_userId_idx" ON "MessageReadReceipt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReadReceipt_messageId_userId_key" ON "MessageReadReceipt"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_formTeacherId_fkey" FOREIGN KEY ("formTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicGrade" ADD CONSTRAINT "AcademicGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicGrade" ADD CONSTRAINT "AcademicGrade_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CCAPerformance" ADD CONSTRAINT "CCAPerformance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalFitnessRecord" ADD CONSTRAINT "PhysicalFitnessRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CCEGrade" ADD CONSTRAINT "CCEGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDataRecording" ADD CONSTRAINT "AttendanceDataRecording_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDataRecording" ADD CONSTRAINT "AttendanceDataRecording_linkedCaseId_fkey" FOREIGN KEY ("linkedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceDataRecording" ADD CONSTRAINT "PerformanceDataRecording_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceDataRecording" ADD CONSTRAINT "PerformanceDataRecording_linkedCaseId_fkey" FOREIGN KEY ("linkedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundDataRecording" ADD CONSTRAINT "BackgroundDataRecording_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundDataRecording" ADD CONSTRAINT "BackgroundDataRecording_linkedCaseId_fkey" FOREIGN KEY ("linkedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialBehaviourRecording" ADD CONSTRAINT "SocialBehaviourRecording_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialBehaviourRecording" ADD CONSTRAINT "SocialBehaviourRecording_linkedCaseId_fkey" FOREIGN KEY ("linkedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAlert" ADD CONSTRAINT "ClassAlert_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReadReceipt" ADD CONSTRAINT "MessageReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
