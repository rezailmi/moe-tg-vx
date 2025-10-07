# Development Guide: Next.js 15 + shadcn/ui + Tailwind CSS 4

Complete reference documentation for building with our technology stack.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Next.js 15 Deep Dive](#nextjs-15-deep-dive)
- [shadcn/ui Patterns](#shadcnui-patterns)
- [Tailwind CSS 4 Reference](#tailwind-css-4-reference)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Testing Strategies](#testing-strategies)
- [Common Pitfalls](#common-pitfalls)

---

## Architecture Overview

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.4 | React framework with App Router |
| React | 19.1.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | Component library |
| Radix UI | Various | Accessible primitives |
| lucide-react | Latest | Icon library |

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Route group (doesn't affect URL)
│   │   ├── page.tsx         # Server Component
│   │   ├── layout.tsx       # Shared layout
│   │   └── loading.tsx      # Loading state
│   ├── (dashboard)/         # Another route group
│   │   ├── settings/
│   │   └── profile/
│   ├── api/                 # API routes
│   │   └── users/
│   │       └── route.ts     # GET /api/users
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── marketing/           # Feature-specific components
│   │   ├── hero.tsx
│   │   └── pricing.tsx
│   └── dashboard/
│       └── sidebar.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── db.ts               # Database client
│   └── auth.ts             # Authentication
├── hooks/
│   ├── use-auth.ts         # Custom hooks
│   └── use-media-query.ts
├── actions/                # Server Actions
│   ├── user.ts
│   └── post.ts
└── types/
    └── index.ts            # Shared TypeScript types
```

---

## Next.js 15 Deep Dive

### Server Components vs Client Components

#### Decision Tree

```
Is it interactive? (onClick, onChange, etc.)
├─ YES → Client Component ('use client')
└─ NO
   │
   Does it use React hooks? (useState, useEffect, etc.)
   ├─ YES → Client Component ('use client')
   └─ NO
      │
      Does it need browser APIs? (window, localStorage, etc.)
      ├─ YES → Client Component ('use client')
      └─ NO → Server Component (default) ✅
```

#### Server Component Benefits

- **Zero JavaScript to client** - Reduces bundle size
- **Direct backend access** - Query databases, read files
- **Automatic code splitting** - Each component is a separate chunk
- **Improved SEO** - Content rendered on server

```tsx
// ✅ Perfect for Server Component
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Direct database query - no API route needed
  const product = await db.product.findUnique({
    where: { id },
    include: { reviews: true }
  })

  if (!product) notFound()

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductGallery images={product.images} /> {/* Client Component */}
      <Reviews data={product.reviews} />
    </div>
  )
}
```

#### Client Component Best Practices

```tsx
// ✅ Good: Small, focused Client Component
'use client'

import { useState } from 'react'

export function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}

// ❌ Bad: Large Client Component with server logic
'use client'

export function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData)
  }, [])

  // This should be a Server Component fetching directly!
}
```

### Data Fetching Strategies

#### 1. Static Data (Default)

```tsx
// Cached indefinitely, regenerated at build time
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // Can be omitted, it's the default
  })

  return <PostList posts={await posts.json()} />
}

// Alternative: Using ORM
export default async function BlogPage() {
  const posts = await db.post.findMany()
  return <PostList posts={posts} />
}
```

#### 2. Dynamic Data (No Cache)

```tsx
// Always fetch fresh data
export default async function DashboardPage() {
  const stats = await fetch('https://api.example.com/stats', {
    cache: 'no-store'
  })

  return <StatsDisplay data={await stats.json()} />
}

// Or use dynamic functions to opt out of caching
import { cookies } from 'next/headers'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')

  // This page is now dynamic
  const user = await db.user.findUnique({ where: { id: userId?.value } })

  return <UserProfile user={user} />
}
```

#### 3. Incremental Static Regeneration (ISR)

```tsx
// Revalidate every 60 seconds
export default async function NewsPage() {
  const articles = await fetch('https://api.example.com/news', {
    next: { revalidate: 60 }
  })

  return <ArticleList articles={await articles.json()} />
}

// Route-level revalidation
export const revalidate = 3600 // 1 hour

export default async function Page() {
  const data = await getData()
  return <Content data={data} />
}
```

#### 4. On-Demand Revalidation

```tsx
// actions/post.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    }
  })

  // Revalidate specific path
  revalidatePath('/blog')

  // Or revalidate by tag
  revalidateTag('posts')

  return post
}

// Usage with tags
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  })

  return <PostList posts={await posts.json()} />
}
```

#### 5. Parallel Data Fetching

```tsx
// ✅ Good: Fetch in parallel
export default async function Page() {
  // Start both fetches immediately
  const userPromise = getUser()
  const postsPromise = getPosts()

  // Wait for both
  const [user, posts] = await Promise.all([userPromise, postsPromise])

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
    </div>
  )
}

// ❌ Bad: Sequential fetching (waterfall)
export default async function Page() {
  const user = await getUser()    // Waits
  const posts = await getPosts()  // Then waits again

  return (...)
}
```

#### 6. Streaming with Suspense

```tsx
// ✅ Best: Stream content as it loads
export default async function Page() {
  return (
    <div>
      {/* Show immediately */}
      <Header />

      {/* Show loading state while fetching */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>

      {/* Show immediately */}
      <Footer />
    </div>
  )
}

async function Posts() {
  const posts = await getPosts() // Slow fetch
  return <PostList posts={posts} />
}

async function Comments() {
  const comments = await getComments() // Slow fetch
  return <CommentList comments={comments} />
}
```

### Server Actions

#### Form Submissions

```tsx
// app/signup/page.tsx
import { signup } from './actions'

export default function SignupPage() {
  return (
    <form action={signup}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign Up</button>
    </form>
  )
}

// app/signup/actions.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function signup(formData: FormData) {
  // 1. Validate
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  // 2. Create user
  try {
    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        password: await hash(parsed.data.password)
      }
    })

    // 3. Set session
    await setSession(user.id)

  } catch (error) {
    return { error: 'Email already exists' }
  }

  // 4. Redirect
  redirect('/dashboard')
}
```

#### Progressive Enhancement

```tsx
'use client'

import { useFormStatus } from 'react-dom'
import { updateProfile } from './actions'

export function ProfileForm() {
  return (
    <form action={updateProfile}>
      <input name="name" required />
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}
```

#### Optimistic Updates

```tsx
'use client'

import { useOptimistic } from 'react'
import { addTodo } from './actions'

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  async function formAction(formData: FormData) {
    const newTodo = {
      id: Date.now(),
      text: formData.get('text') as string,
      completed: false
    }

    // Add optimistically
    addOptimisticTodo(newTodo)

    // Then persist
    await addTodo(formData)
  }

  return (
    <div>
      <form action={formAction}>
        <input name="text" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Metadata and SEO

#### Static Metadata

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'The best app ever',
  keywords: ['nextjs', 'react', 'typescript'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'My App',
    description: 'The best app ever',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'The best app ever',
    images: ['/twitter-image.png'],
  },
}
```

#### Dynamic Metadata

```tsx
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}
```

---

## shadcn/ui Patterns

### Component Installation

```bash
# Install specific components
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu

# Install multiple at once
npx shadcn@latest add button dialog dropdown-menu
```

### Customization Philosophy

shadcn/ui components are **not a library** - they're starter code you own:

```tsx
// components/ui/button.tsx - This is YOUR code now
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ✅ Customize these variants however you want
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        // Add your own variants!
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // Add your own sizes!
        xl: "h-14 rounded-lg px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### Composition Patterns

```tsx
// ✅ Good: Compose complex UIs from simple components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Theming

#### CSS Variables Setup

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;

    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;

    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;

    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;

    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;

    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;

    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}
```

#### Dark Mode with next-themes

```tsx
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/theme-toggle.tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Tailwind CSS 4 Reference

### Migration from v3

#### Key Changes

1. **@utility instead of @layer utilities**
2. **Left-to-right variant stacking** (was right-to-left)
3. **ring defaults to 1px** (was 3px)
4. **shadow/blur/radius -xs** (was -sm)
5. **CSS variables preferred** over theme()
6. **No more JavaScript config auto-detection**

#### Custom Utilities (v4)

```css
/* ✅ v4 Syntax */
@utility container {
  margin-inline: auto;
  max-width: 1280px;
  padding-inline: 1rem;
}

@utility tab-4 {
  tab-size: 4;
}

/* ❌ v3 Syntax (deprecated) */
@layer utilities {
  .container {
    margin-inline: auto;
    max-width: 1280px;
  }
}
```

#### Variant Stacking Order

```html
<!-- ✅ v4: Left-to-right -->
<div class="hover:group-hover:bg-blue-500">
  <!-- hover applies THEN group-hover -->
</div>

<!-- ❌ v3: Right-to-left (reversed) -->
<div class="group-hover:hover:bg-blue-500">
  <!-- group-hover applies THEN hover -->
</div>
```

#### Updated Utility Names

```html
<!-- ✅ v4 -->
<div class="shadow-xs rounded-xs blur-xs">

<!-- ❌ v3 (now deprecated) -->
<div class="shadow-sm rounded-sm blur-sm">

<!-- ✅ v4: ring is 1px -->
<button class="ring ring-blue-500">
<!-- Use ring-3 for old 3px default -->
<button class="ring-3 ring-blue-500">
```

#### CSS Variables (Recommended)

```tsx
// ✅ Good: Use CSS variables directly
<div className="bg-[var(--color-primary)]">

// Or in custom CSS
<style jsx>{`
  .custom-class {
    background: var(--color-red-500);
    color: var(--color-gray-900);
  }
`}</style>

// ❌ Avoid: theme() when CSS vars work
<style jsx>{`
  .custom-class {
    background: theme(colors.red.500);
  }
`}</style>
```

### Advanced Patterns

#### Responsive Design

```tsx
// Mobile-first approach
<div className="
  w-full          // All screens
  md:w-1/2        // >= 768px
  lg:w-1/3        // >= 1024px
  xl:w-1/4        // >= 1280px
">

// Container queries (requires plugin)
<div className="
  @container
  @lg:grid-cols-2
  @xl:grid-cols-3
">
```

#### Dark Mode

```tsx
// Automatic with 'dark' class
<div className="
  bg-white
  dark:bg-gray-900
  text-gray-900
  dark:text-gray-100
">

// Group-based dark mode
<div className="group dark">
  <div className="bg-white group-[.dark]:bg-gray-900">
</div>
```

#### Arbitrary Values

```tsx
// Use when exact value needed
<div className="
  w-[376px]
  h-[calc(100vh-64px)]
  bg-[#bada55]
  before:content-['Hello']
">
```

---

## Component Patterns

### Layout Component

```tsx
// components/layout/main-layout.tsx
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
```

### Data Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DataTableProps {
  data: User[]
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## State Management

### URL State (Search Params)

```tsx
// Server Component
export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const { query = '', page = '1' } = await searchParams

  const results = await searchProducts(query, parseInt(page))

  return <SearchResults results={results} query={query} page={page} />
}

// Client Component for interactions
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams)
    params.set('query', query)
    router.push(`?${params.toString()}`)
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

### React Context (Client State)

```tsx
// contexts/cart-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface CartItem {
  id: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (id: string) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === id)
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

---

## Testing Strategies

### Unit Tests (Vitest)

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Integration Tests (Playwright)

```tsx
import { test, expect } from '@playwright/test'

test('user can sign up', async ({ page }) => {
  await page.goto('/signup')

  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

---

## Common Pitfalls

### ❌ Pitfall 1: Using 'use client' Unnecessarily

```tsx
// ❌ Bad: Marking everything as Client Component
'use client'

export default function Page() {
  // This could be a Server Component!
  return <div>Static content</div>
}

// ✅ Good: Server Component by default
export default function Page() {
  return <div>Static content</div>
}
```

### ❌ Pitfall 2: Data Fetching Waterfalls

```tsx
// ❌ Bad: Sequential fetching
export default async function Page() {
  const user = await getUser()
  const posts = await getPosts()  // Waits for user to finish
  return (...)
}

// ✅ Good: Parallel fetching
export default async function Page() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts()
  ])
  return (...)
}
```

### ❌ Pitfall 3: Not Using TypeScript Properly

```tsx
// ❌ Bad: Using any
async function getUser(id: any) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()  // Returns any
}

// ✅ Good: Proper typing
interface User {
  id: string
  name: string
  email: string
}

async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
```

### ❌ Pitfall 4: Ignoring Loading States

```tsx
// ❌ Bad: No loading state
export default async function Page() {
  const data = await slowFetch()  // User sees blank page while waiting
  return <Content data={data} />
}

// ✅ Good: Use Suspense
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DataComponent />
    </Suspense>
  )
}

async function DataComponent() {
  const data = await slowFetch()
  return <Content data={data} />
}
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
