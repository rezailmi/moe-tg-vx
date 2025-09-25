import {
  CalendarDaysIcon,
  FileTextIcon,
  FolderIcon,
  InboxIcon,
  LayersIcon,
  ListCheckIcon,
  StarIcon,
  UsersIcon,
  PlusIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const highlights = [
  {
    title: 'Kick off your workspace',
    description:
      'Invite your team members, set up your first project, and track progress in one place.',
    action: 'Get Started',
  },
  {
    title: 'Capture quick notes',
    description:
      'Use rich text notes to summarize meetings, decisions, and next steps without friction.',
    action: 'Create Note',
  },
  {
    title: 'Build checklists fast',
    description:
      'Break down work into tasks, assign owners, and mark items complete as you ship.',
    action: 'Add Checklist',
  },
]

const quickLinks = [
  {
    title: 'Connect integrations',
    body: 'Hook up your tools to sync calendars, docs, and task updates automatically.',
  },
  {
    title: 'Browse templates',
    body: 'Start with pre-built layouts for standups, roadmaps, and retrospectives.',
  },
  {
    title: 'Customize themes',
    body: 'Match your brand colors and typography across the workspace.',
  },
]

const reminders = [
  'Plan sprint retrospective agenda',
  'Outline next product demo run-through',
  'Draft onboarding checklist for new joiners',
]

export default function Home() {
  return (
    <div className="flex min-h-svh w-full bg-background">
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent className="gap-6">
          <SidebarGroup className="gap-3">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Reza’s Space
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Welcome">
                    <FileTextIcon className="size-4" />
                    <span>Welcome</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Inbox">
                    <InboxIcon className="size-4" />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Tasks">
                    <ListCheckIcon className="size-4" />
                    <span>Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Calendar">
                    <CalendarDaysIcon className="size-4" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Shared with me">
                    <UsersIcon className="size-4" />
                    <span>Shared with Me</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup className="gap-3">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Starred
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Launch Plan">
                    <StarIcon className="size-4" />
                    <span>Launch Plan</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup className="gap-3">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Folders
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Unsorted">
                    <FolderIcon className="size-4" />
                    <span>Unsorted</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Work">
                    <LayersIcon className="size-4" />
                    <span>Work</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border pt-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0"
            aria-label="Create new document"
          >
            <PlusIcon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              New Doc
            </span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <SidebarTrigger />
          <div className="flex flex-1 flex-col">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Dashboard
            </span>
            <h1 className="text-lg font-semibold tracking-tight">
              Welcome back, Reza
            </h1>
          </div>
          <Button size="sm" variant="outline">
            Customize
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-8 py-10">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Start with a quick win
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((highlight) => (
                <article
                  key={highlight.title}
                  className="border-border/70 bg-card text-card-foreground rounded-xl border p-6"
                >
                  <h3 className="text-base font-semibold">{highlight.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {highlight.description}
                  </p>
                  <Button size="sm" className="mt-4">
                    {highlight.action}
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Quick links
              </h2>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <article
                    key={link.title}
                    className="border-border/70 bg-card text-card-foreground rounded-lg border p-4"
                  >
                    <h3 className="text-sm font-semibold">{link.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {link.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="border-border/70 bg-muted/40 rounded-lg border p-5">
              <h2 className="text-sm font-semibold text-foreground">
                Today’s reminders
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {reminders.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-md bg-background/60 p-2"
                  >
                    <span className="mt-1 inline-block size-1.5 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="ghost"
                className="mt-4 px-0 font-semibold"
              >
                View agenda
              </Button>
            </aside>
          </section>
        </div>
      </SidebarInset>
    </div>
  )
}
