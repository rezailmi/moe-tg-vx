# Contextual Learning POC

## Overview

This POC demonstrates a "contextual learning" feature that surfaces relevant professional development content (videos, PDFs, guides) to teachers based on their current workflow context. This is a **UI mockup with simulated responses** - no real backend or API integration.

## Feature Concept

**Problem:** Teachers access professional learning backwards - scheduled courses disconnected from actual work moments.

**Solution:** When teachers view certain contexts (e.g., a student flagged "at-risk"), automatically surface relevant learning content from GLOW's library.

## Files Created

### Components (`src/components/contextual-learning/`)

1. **`LearningMomentCard.tsx`** - A dismissible notification card that appears contextually
   - Shows title, description, and "View Resources" CTA
   - States: visible, dismissed (persists in localStorage)
   - Includes gentle fade-in animation

2. **`LearningResourcesPanel.tsx`** - Expanded view showing available learning content
   - Displays "Recommended for You" content
   - Grid layout of content cards
   - Show more/less functionality
   - Handles modals for viewing content

3. **`ContentCard.tsx`** - Reusable card for individual content items
   - Supports video, PDF, and guide types
   - Shows type badge, duration/pages, author info
   - Actions: View and Save for Later

4. **`VideoPlayerModal.tsx`** - Modal that simulates video playback
   - Shows video placeholder with play icon
   - Displays title, author, duration, description
   - Fake progress bar for demo purposes

5. **`PdfViewerModal.tsx`** - Modal that simulates PDF viewing
   - Shows PDF preview placeholder
   - Download button (shows toast notification)
   - Page indicator

6. **`index.ts`** - Barrel export file for all components

### Data (`src/lib/`)

**`mock-learning-content.ts`** - Mock data and helper functions
- `LearningContent` type definition
- `LearningContext` type definition
- Mock content library with 6 items
- Context-to-content mapping
- `getContentForContext()` helper function

### Demo Page (`src/app/learning-demo/`)

**`page.tsx`** - Standalone demo page with:
- Demo controls to simulate different contexts
- Simplified Student Profile mockup
- Learning Moment sidebar
- Status indicators
- Full interactive flow

## How to Use

### Viewing the Demo

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/learning-demo` in your browser

3. Use the demo controls to:
   - Switch between different student contexts (At-Risk, Declining Attendance, Academic Decline)
   - Toggle the Learning Moment card visibility
   - Reset the demo state

### Interaction Flow

1. **Initial State**: Learning Moment card appears with a gentle fade-in animation
2. **View Resources**: Click to expand the resources panel below
3. **Explore Content**: Browse video, PDF, and guide cards
4. **View Content**: Click "Watch" or "View" to open modal with placeholder content
5. **Save for Later**: Toggle saved state (shows toast notification)
6. **Dismiss**: Close the Learning Moment card (persists in localStorage)

## Design Decisions

### Visual Style

- **Colors**: Soft blue/yellow gradient for Learning Moment card (helpful, not intrusive)
- **Icons**: Lucide React icons (Lightbulb for learning moment, PlayCircle for video, FileText for PDF, BookOpen for guide)
- **Typography**: Follows existing project patterns from shadcn/ui
- **Cards**: Uses existing Card component patterns
- **Animations**: Gentle fade-in/out transitions

### Architecture

- **Non-invasive**: All components are isolated in their own directory
- **No modifications** to existing Student Profile components
- **Client-side only**: All state managed in React with useState
- **Standalone demo**: Dedicated route that doesn't interfere with existing pages

### State Management

- Component-level state using React hooks
- localStorage for dismissal persistence
- No complex state management needed for POC

## Integration Points (Future)

To integrate this into the real Student Profile:

### Option A: Wrapper Component
Create a wrapper that includes both the existing Student Profile and the Learning Moment:

```tsx
<StudentProfileWithLearning>
  <StudentProfile {...props} />
  <LearningMomentCard {...learningProps} />
</StudentProfileWithLearning>
```

### Option B: Context Provider
Create a provider that can be added at the app level:

```tsx
<LearningMomentProvider>
  <App />
</LearningMomentProvider>
```

The provider would detect route/context and render learning moments as portals.

### Option C: Direct Integration
Import and add directly to the Student Profile layout:

```tsx
// In student profile component
import { LearningMomentCard } from '@/components/contextual-learning'

// Detect context based on student data
const shouldShowLearning = student.wellbeing === 'at-risk'
const { context, content } = getContentForContext('student-at-risk')

// Render in sidebar or below profile
{shouldShowLearning && (
  <LearningMomentCard
    title={context.title}
    description={context.description}
    onExpand={handleExpand}
    onDismiss={handleDismiss}
  />
)}
```

## Context Detection Logic (Future)

When integrating with real data, detect contexts based on student attributes:

```typescript
function detectContext(student: StudentProfileData): ContextType | null {
  // At-risk wellbeing
  if (student.wellbeing?.status === 'at-risk') {
    return 'student-at-risk'
  }

  // Declining attendance
  if (student.attendance.rate < 90 && student.attendance.trend === 'declining') {
    return 'declining-attendance'
  }

  // Academic decline
  if (hasDeciningGrades(student.academic_results)) {
    return 'academic-decline'
  }

  return null
}
```

## Mock Data Structure

The mock data includes:
- **6 learning content items**: 3 videos, 2 PDFs, 1 guide
- **3 learning contexts**: student-at-risk, declining-attendance, academic-decline
- Each context maps to 2-4 relevant content items

### Adding More Content

To add more mock content, edit `src/lib/mock-learning-content.ts`:

```typescript
export const mockLearningContent: LearningContent[] = [
  // ... existing content
  {
    id: 'vid-004',
    type: 'video',
    title: 'Your New Video Title',
    author: 'Author Name',
    authorRole: 'Teacher Role',
    duration: '10:30',
    description: 'Description of the content...',
    contextTags: ['relevant', 'tags', 'here'],
  },
]
```

## Success Criteria

The POC successfully demonstrates:

✅ **Concept clarity** - Contextual learning is understood within 30 seconds
✅ **Realistic interaction** - Smooth flow from profile → learning moment → resources → content
✅ **Non-invasive** - All new components are isolated; existing code unchanged
✅ **Visual consistency** - Matches existing design language (shadcn/ui, Tailwind)
✅ **Interactive** - Ready for stakeholder demos

## What's NOT Built (Out of Scope)

- Real video playback
- Real PDF rendering
- Backend API integration
- MCP server
- User authentication for learning content
- Progress tracking
- Content recommendation algorithms
- Search functionality
- Full mobile responsive design (basic responsive, not polished)

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Language**: TypeScript

## File Structure

```
src/
├── components/
│   └── contextual-learning/
│       ├── ContentCard.tsx
│       ├── LearningMomentCard.tsx
│       ├── LearningResourcesPanel.tsx
│       ├── PdfViewerModal.tsx
│       ├── VideoPlayerModal.tsx
│       └── index.ts
├── lib/
│   └── mock-learning-content.ts
└── app/
    └── learning-demo/
        └── page.tsx
```

## Next Steps for Production

1. **Backend Integration**
   - Create API endpoints for learning content
   - Implement real content recommendation engine
   - Add user progress tracking

2. **Content Management**
   - Admin interface for managing learning content
   - Content tagging and categorization
   - Analytics on content engagement

3. **Integration**
   - Add to real Student Profile pages
   - Implement context detection from real student data
   - Add to other relevant pages (attendance, assessments, etc.)

4. **Enhancement**
   - Real video player integration
   - Real PDF viewer
   - Bookmark/favorites functionality
   - Completion tracking
   - Personalized recommendations based on teacher role/subject

## Demo Screenshots Locations

Visit `/learning-demo` to see:
- Student At-Risk context
- Declining Attendance context
- Academic Decline context
- Learning Moment card appearance
- Resources panel expansion
- Content viewing modals
- Save for later functionality

---

**Built for**: Teachers Gateway - GLOW Integration POC
**Date**: January 2026
**Status**: Ready for stakeholder demo
