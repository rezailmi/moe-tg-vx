'use client'

import { useEffect, useState } from 'react'

import type { LucideIcon } from 'lucide-react'
import {
  CalendarDaysIcon,
  FilePenIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  LayersIcon,
  NewspaperIcon,
  PieChartIcon,
  PlusIcon,
  StarIcon,
  XIcon,
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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const primaryPages = [
  { key: 'roundup', label: 'Round-up', icon: NewspaperIcon, tooltip: 'Round-up' },
  { key: 'home', label: 'Home', icon: HomeIcon, tooltip: 'Home' },
  { key: 'draft', label: 'Draft', icon: FilePenIcon, tooltip: 'Drafts' },
  { key: 'calendar', label: 'Calendar', icon: CalendarDaysIcon, tooltip: 'Calendar' },
  { key: 'analysis', label: 'Analysis', icon: PieChartIcon, tooltip: 'Analysis' },
  { key: 'inbox', label: 'Inbox', icon: InboxIcon, tooltip: 'Inbox' },
] as const

const newTabConfig = {
  key: 'new-tab',
  label: 'New Tab',
  icon: PlusIcon,
  tooltip: 'New tab',
} as const

type PageKey = (typeof primaryPages)[number]['key']
type TabKey = typeof newTabConfig['key'] | PageKey
type PageConfig = (typeof primaryPages)[number]
type TabConfig = PageConfig | typeof newTabConfig

type EmptyState = {
  heading: string
  title: string
  description: string
  icon: LucideIcon
  primaryAction?: string
  secondaryAction?: string
}

const emptyStates: Record<TabKey, EmptyState> = {
  'new-tab': {
    heading: 'New Tab',
    title: 'Create your first tab',
    description:
      'Open a page from the sidebar or start with a preselected one to jump into your workspace.',
    icon: PlusIcon,
  },
  roundup: {
    heading: 'Round-up',
    title: 'No highlights yet',
    description:
      'Summaries and noteworthy updates from your team will appear here once activity picks up.',
    icon: NewspaperIcon,
    primaryAction: 'Share an update',
  },
  home: {
    heading: 'Home',
    title: 'You’re all set to begin',
    description:
      'Start exploring your workspace or jump into a project to keep momentum going.',
    icon: HomeIcon,
    primaryAction: 'Create reminder',
    secondaryAction: 'Invite a teammate',
  },
  draft: {
    heading: 'Drafts',
    title: 'No drafts on file',
    description:
      'Capture your thoughts and save them as drafts to revisit and refine later.',
    icon: FilePenIcon,
    primaryAction: 'Compose draft',
  },
  calendar: {
    heading: 'Calendar',
    title: 'Your schedule looks clear',
    description:
      'Link your calendar to review upcoming meetings and plan focus time without conflicts.',
    icon: CalendarDaysIcon,
    primaryAction: 'Connect calendar',
  },
  analysis: {
    heading: 'Analysis',
    title: 'No insights generated',
    description:
      'Run reports or review metrics to uncover patterns and stay ahead of upcoming work.',
    icon: PieChartIcon,
    primaryAction: 'Build report',
  },
  inbox: {
    heading: 'Inbox',
    title: 'No updates right now',
    description:
      'When teammates mention you or share docs, they’ll show up here for quick triage.',
    icon: InboxIcon,
    primaryAction: 'Compose a note',
  },
}

const pageConfigMap: Record<PageKey, PageConfig> = primaryPages.reduce(
  (acc, page) => {
    acc[page.key] = page
    return acc
  },
  {} as Record<PageKey, PageConfig>,
)

const tabConfigMap: Record<TabKey, TabConfig> = {
  [newTabConfig.key]: newTabConfig,
  ...pageConfigMap,
}

const MAX_TABS = 8

export default function Home() {
  const [openTabs, setOpenTabs] = useState<PageKey[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>(newTabConfig.key)
  const [tabLimitReached, setTabLimitReached] = useState(false)

  const currentState = emptyStates[activeTab]
  const ActiveIcon = currentState.icon
  const isNewTabActive = activeTab === newTabConfig.key

  const handleNavigate = (pageKey: PageKey) => {
    setOpenTabs((tabs) => {
      if (tabs.includes(pageKey)) {
        setActiveTab(pageKey)
        return tabs
      }

      if (tabs.length >= MAX_TABS) {
        setTabLimitReached(true)
        return tabs
      }

      const nextTabs = [...tabs, pageKey]

      setActiveTab(pageKey)
      return nextTabs
    })
  }

  const handleCloseTab = (pageKey: TabKey) => {
    setOpenTabs((tabs) => {
      if (pageKey === newTabConfig.key) {
        return tabs
      }

      const filteredTabs = tabs.filter((key) => key !== pageKey)

      setActiveTab((currentActive) => {
        if (currentActive !== pageKey) {
          return currentActive
        }

        const closingIndex = tabs.indexOf(pageKey)
        return (
          filteredTabs[closingIndex - 1] ??
          filteredTabs[closingIndex] ??
          (filteredTabs.length > 0 ? filteredTabs[filteredTabs.length - 1] : newTabConfig.key)
        )
      })

      return filteredTabs
    })
  }

  useEffect(() => {
    if (openTabs.length < MAX_TABS) {
      setTabLimitReached(false)
    }
  }, [openTabs])

  const handleNewTab = () => {
    setActiveTab(newTabConfig.key)
  }

  return (
    <div className="flex min-h-svh w-full bg-background">
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent className="gap-6">
          <SidebarGroup className="gap-3">
            <div className="flex h-8 w-full items-center justify-between px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <SidebarGroupLabel className="flex-1 truncate px-0 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:hidden">
                Reza’s Space
              </SidebarGroupLabel>
              <SidebarTrigger className="size-7 shrink-0" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {primaryPages.map((page) => {
                  const Icon = page.icon

                  return (
                    <SidebarMenuItem key={page.key}>
                      <SidebarMenuButton
                        tooltip={page.tooltip}
                        isActive={activeTab === page.key}
                        onClick={() => handleNavigate(page.key)}
                        type="button"
                      >
                        <Icon className="size-4" />
                        <span>{page.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="gap-3">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Folders
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="2025">
                    <FolderIcon className="size-4" />
                    <span>2025</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border px-3 py-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl bg-transparent px-1 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar/20 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0"
            aria-label="Open profile"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-foreground/15 text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:size-8">
              RI
            </div>
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">Reza Ilmi</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border/70 bg-muted/20 px-4">
            <div className="tab-scrollbar-hidden -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-2">
              <TooltipProvider delayDuration={150}>
                {openTabs.map((tabKey) => {
                  const tab = tabConfigMap[tabKey]

                  if (!tab) {
                    return null
                  }

                  const Icon = tab.icon
                  const isActive = activeTab === tabKey
                  return (
                    <div
                      key={tabKey}
                      className={cn(
                        'group relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                        : 'text-muted-foreground hover:bg-background/70 hover:text-foreground hover:ring-1 hover:ring-border/80',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveTab(tabKey)}
                        className="flex items-center gap-2 truncate"
                      >
                        <Icon className="size-4" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleCloseTab(tabKey)
                        }}
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:text-foreground flex size-6 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 group-[.ring-1]:opacity-100"
                        aria-label={`Close ${tab.label}`}
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                  )
                })}
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleNewTab}
                      disabled={tabLimitReached}
                      className={cn(
                        'flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors',
                        isNewTabActive
                          ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                          : 'hover:bg-background/70 hover:text-foreground hover:ring-1 hover:ring-border/80',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                      aria-label="Open new tab"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">New Tab</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {tabLimitReached && (
              <div className="pb-2 text-xs text-muted-foreground">
                You’ve reached the tab limit. Close an open page before adding a new
                one.
              </div>
            )}
          </div>
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden flex-1 md:flex">
              <h1 className="text-lg font-semibold tracking-tight">
                {currentState ? currentState.heading : 'New Tab'}
              </h1>
            </div>
            <Button size="sm" variant="outline">
              Customize
            </Button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
            {currentState ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full">
                  {ActiveIcon ? <ActiveIcon className="size-7" /> : <PlusIcon className="size-7" />}
                </div>
                <div className="mt-6 space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {currentState.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentState.description}
                  </p>
                </div>
                {(currentState.primaryAction || currentState.secondaryAction) && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {currentState.primaryAction && (
                      <Button size="sm">{currentState.primaryAction}</Button>
                    )}
                    {currentState.secondaryAction && (
                      <Button size="sm" variant="outline">
                        {currentState.secondaryAction}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full">
                  <PlusIcon className="size-7" />
                </div>
                <div className="mt-6 space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Create your first tab
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Open a page from the sidebar or start with a preselected one
                    to jump into your workspace.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button size="sm" onClick={() => handleNavigate('home')}>
                    Go Home
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleNavigate('roundup')}>
                    Open Round-up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
