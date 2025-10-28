# Account Switcher Implementation

**Status**: ✅ Completed
**Date**: October 28, 2025
**Type**: Feature Implementation

## Overview

Implemented an account role switcher allowing users to toggle between "Form Teacher" and "Year Head" roles. The primary difference is that Form Teachers do not see the "School Management" section in the sidebar, while Year Heads have full access to all features including school management oversight.

## Requirements

### User Story
As a teacher, I want to switch between my Form Teacher and Year Head roles so that I can access role-appropriate features and reduce UI clutter when working in my primary teaching capacity.

### Acceptance Criteria
- ✅ Account switcher UI on the profile page
- ✅ Two roles: "Form Teacher" (default) and "Year Head"
- ✅ Role persists across page refreshes
- ✅ School Management section hidden for Form Teachers
- ✅ School Management section visible for Year Heads
- ✅ All other features remain identical across roles
- ✅ No breaking changes to existing functionality

## Implementation Details

### 1. User Role Context

**File**: `src/contexts/user-role-context.tsx`

Created a new React Context to manage user role state with localStorage persistence:

```typescript
export type UserRole = 'form-teacher' | 'year-head'

interface UserRoleContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
}
```

**Key Features**:
- Default role: `'form-teacher'`
- Persists to localStorage key: `'user-role'`
- Provides `useUserRole()` hook for components
- Client-side only with proper hydration handling

**Location**: Lines 1-60

### 2. Profile Page Account Switcher

**File**: `src/app/[[...slug]]/page.tsx`

Added a new card on the profile page (lines 783-836) with:

**Components Used**:
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Label` for accessibility
- `Shield` and `User` icons

**UI Elements**:
1. **Role Selector**: Dropdown select with two options
   - Form Teacher: Shows User icon with "Manage your classes and students" description
   - Year Head: Shows Shield icon with "School management and oversight" description

2. **Status Display**: Shows current role with contextual description
   - Form Teacher: "You have access to your classes, students, and teaching tools"
   - Year Head: "You have additional access to school management features and oversight tools"

**Integration**: Added `useUserRole()` hook in TabContent component (line 441)

### 3. Conditional Sidebar Rendering

**File**: `src/app/[[...slug]]/page.tsx`

**Modified**: Lines 1872-1902

Wrapped the "School Management" section with conditional rendering:

```typescript
{role === 'year-head' && (
  <>
    <SidebarSeparator className="mx-0 my-2 w-full" />

    <div className="space-y-1">
      <SidebarGroupLabel className="text-xs">School Management</SidebarGroupLabel>
      <SidebarMenu>
        {/* My School menu item */}
      </SidebarMenu>
    </div>

    <SidebarSeparator className="mx-0 my-2 w-full" />
  </>
)}
```

**Behavior**:
- Form Teachers: Section completely hidden (including separators)
- Year Heads: Full section visible with "My School" menu item

**Integration**: Added `useUserRole()` hook in Home component (line 889)

### 4. Provider Integration

**File**: `src/app/layout.tsx`

**Modified**: Lines 11 and 69-75

Added `UserRoleProvider` to the app-wide provider stack:

```typescript
<UserProvider>
  <UserRoleProvider>
    <InboxProvider>
      <AssistantProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AssistantProvider>
    </InboxProvider>
  </UserRoleProvider>
</UserProvider>
```

**Position**: Wrapped after `UserProvider` but before `InboxProvider` to ensure user context is available if needed in future enhancements.

## Technical Architecture

### State Management
- **Context API**: React Context for global state
- **LocalStorage**: Persistence across sessions
- **Default Value**: `'form-teacher'` for all new users

### Component Integration
- **TabContent Component**: Uses role for profile page rendering
- **Home Component**: Uses role for sidebar conditional rendering
- **No Props Drilling**: Both components access role via `useUserRole()` hook

### Type Safety
```typescript
type UserRole = 'form-teacher' | 'year-head'
```

All role values are type-checked at compile time.

## Files Modified

1. ✅ `src/contexts/user-role-context.tsx` (NEW) - 60 lines
2. ✅ `src/app/layout.tsx` (MODIFIED) - Added provider import and wrapper
3. ✅ `src/app/[[...slug]]/page.tsx` (MODIFIED) - 3 sections:
   - Added imports (Card, Label, Select components, Shield icon)
   - Added useUserRole hook usage in 2 places
   - Added account switcher UI in profile page
   - Added conditional rendering in sidebar

## User Experience

### Role Switching Flow

1. User navigates to Profile page
2. Scrolls to "Account Role" card below profile information
3. Clicks on role selector dropdown
4. Sees two options with icons and descriptions
5. Selects new role
6. Role immediately saved to localStorage
7. Sidebar updates instantly (School Management section appears/disappears)
8. Status text updates to reflect current role

### Visual Design

- **Profile Card**: Clean card design matching existing profile UI
- **Select Dropdown**: Native-feeling dropdown with rich option display
- **Icons**: Shield for Year Head (authority), User for Form Teacher (individual focus)
- **Colors**: Uses theme colors for consistency
- **Spacing**: Proper spacing with `mt-6` gap from profile card

## Testing Considerations

### Manual Testing Checklist

- [x] Switch from Form Teacher to Year Head - School Management appears
- [x] Switch from Year Head to Form Teacher - School Management disappears
- [x] Refresh page - role persists correctly
- [x] Open in new tab - role matches across tabs
- [x] Check localStorage - role value saved correctly
- [x] Profile page UI - account switcher renders properly
- [x] Sidebar rendering - no layout shifts or flicker

### Edge Cases Handled

1. **localStorage unavailable**: Graceful fallback to default role
2. **Invalid stored value**: Validates role before applying
3. **Hydration mismatch**: Client-side only state with proper initialization
4. **Role persistence**: Works across page navigations and refreshes

## Future Enhancements

### Potential Improvements

1. **Role Permissions**: Connect to backend user roles/permissions
2. **Multiple Roles**: Support users with multiple concurrent roles
3. **Role History**: Track role switches for analytics
4. **Role Badges**: Show current role in sidebar footer
5. **Keyboard Shortcuts**: Quick role switching via keyboard
6. **Role-specific Features**: More granular feature access control

### Database Integration

Currently client-side only. Future database schema:

```sql
-- Add to users table
ALTER TABLE users ADD COLUMN preferred_role TEXT DEFAULT 'form-teacher';
ALTER TABLE users ADD CONSTRAINT check_role CHECK (preferred_role IN ('form-teacher', 'year-head'));
```

## Performance Impact

- **Bundle Size**: +60 lines of code (~2KB)
- **Runtime**: Minimal - single context provider
- **Re-renders**: Optimized with Context API, only affected components re-render
- **localStorage**: Negligible overhead (single key read/write)

## Accessibility

- ✅ Proper ARIA labels on select element
- ✅ Semantic HTML with Label component
- ✅ Keyboard navigation fully supported
- ✅ Screen reader friendly descriptions
- ✅ Focus states on interactive elements

## Documentation Updates

This file serves as the primary documentation. Additional updates:
- README: No changes needed (internal feature)
- Architecture docs: Context added to provider list

## Lessons Learned

1. **Context Placement**: Placed UserRoleProvider after UserProvider for future flexibility
2. **UI Design**: Rich select options with descriptions improve UX significantly
3. **Conditional Rendering**: Wrapping separators with section prevents extra spacing
4. **Type Safety**: Strict typing prevents invalid role values
5. **Persistence**: localStorage works well for simple UI preferences

## Related Issues/PRs

None - standalone feature implementation.

## Rollback Plan

If needed, revert these commits:
1. Remove `src/contexts/user-role-context.tsx`
2. Revert changes to `src/app/layout.tsx`
3. Revert changes to `src/app/[[...slug]]/page.tsx`
4. Clear localStorage key 'user-role' for affected users

---

**Implemented by**: Claude Code
**Review Status**: N/A (solo implementation)
**Deployed**: Pending
