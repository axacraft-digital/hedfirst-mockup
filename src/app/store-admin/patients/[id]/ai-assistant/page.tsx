"use client"

import { use, useState, useEffect } from "react"
import {
  IconChevronLeft,
  IconCode,
  IconPaperclip,
  IconPlus,
  IconSend,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input"
import { cn } from "@/lib/utils"

// Mock chat history
const mockChatHistory = [
  {
    id: "chat_001",
    title: "Treatment plan review",
    preview: "Can you summarize the patient's current...",
    date: "Today",
  },
  {
    id: "chat_002",
    title: "Lab results analysis",
    preview: "Looking at the recent lab work...",
    date: "Yesterday",
  },
  {
    id: "chat_003",
    title: "Dosage adjustment question",
    preview: "What would be an appropriate...",
    date: "Dec 1",
  },
]

// Breakpoint for lg (1024px)
const LG_BREAKPOINT = 1024

interface Props {
  params: Promise<{ id: string }>
}

export default function AIAssistantPage({ params }: Props) {
  const { id: _patientId } = use(params)
  // Start collapsed, will open on desktop after mount
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= LG_BREAKPOINT) {
        setSidebarCollapsed(false)
      } else {
        setSidebarCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    // Listen for resize events
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    // In production, this would send to the AI backend
    setInputValue("")
  }

  const handleNewChat = () => {
    setSelectedChat(null)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "border-r transition-all duration-200",
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-64"
          )}
        >
          <div className="flex h-full flex-col p-4">
            {/* Sidebar Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Chat history</h3>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setSidebarCollapsed(true)}
              >
                <IconChevronLeft className="size-4" />
                <span className="sr-only">Collapse sidebar</span>
              </Button>
            </div>

            {/* New Chat Button */}
            <Button className="mb-4 w-full" onClick={handleNewChat}>
              <IconPlus className="mr-2 size-4" />
              New chat
            </Button>

            {/* Chat History List */}
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {mockChatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={cn(
                      "w-full rounded-lg p-3 text-left transition-colors hover:bg-muted",
                      selectedChat === chat.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {chat.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {chat.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 truncate text-xs">
                      {chat.preview}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b px-6 py-3">
            <div className="flex items-center gap-2">
              {sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setSidebarCollapsed(false)}
                >
                  <IconChevronLeft className="size-4 rotate-180" />
                  <span className="sr-only">Expand sidebar</span>
                </Button>
              )}
              <h2 className="font-medium">
                {selectedChat
                  ? mockChatHistory.find((c) => c.id === selectedChat)?.title
                  : "New chat"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" className="size-8">
              <IconCode className="size-4" />
              <span className="sr-only">Toggle developer mode</span>
            </Button>
          </div>

          {/* Chat Messages Area */}
          <ScrollArea className="flex-1 px-6">
            <div className="mx-auto max-w-2xl py-8">
              {!selectedChat ? (
                // Empty state for new chat
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <h3 className="text-xl font-semibold">Talk to Hedfirst AI</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Ask questions, summarize patient history, or get help
                    drafting a treatment plan.
                  </p>
                </div>
              ) : (
                // Mock conversation for selected chat
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-muted size-8 shrink-0 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">You</p>
                      <p className="mt-1 text-sm">
                        Can you summarize the patient&apos;s current treatment
                        plan and recent lab results?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary size-8 shrink-0 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hedfirst AI</p>
                      <div className="mt-1 space-y-2 text-sm">
                        <p>
                          Based on the patient&apos;s records, here&apos;s a
                          summary of their current treatment plan:
                        </p>
                        <p>
                          <strong>Current Medication:</strong> Testosterone
                          Cypionate 100mg weekly, administered intramuscularly.
                        </p>
                        <p>
                          <strong>Treatment Goal:</strong> Hormone optimization,
                          energy improvement, and athletic recovery enhancement.
                        </p>
                        <p>
                          <strong>Recent Lab Results (March 2025):</strong> All
                          values within normal limits. Minor elevations in
                          calcium (10.4) and AST (47) noted but not clinically
                          significant.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t px-6 py-4">
            <div className="mx-auto max-w-2xl">
              <PromptInput
                value={inputValue}
                onValueChange={setInputValue}
                onSubmit={handleSubmit}
                className="bg-muted/50"
              >
                <PromptInputTextarea placeholder="How can I help you today?" />
                <PromptInputActions className="justify-between px-2 pb-2">
                  <PromptInputAction tooltip="Attach file">
                    <Button variant="ghost" size="icon" className="size-8">
                      <IconPaperclip className="size-4" />
                    </Button>
                  </PromptInputAction>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      Claude Sonnet 4
                    </span>
                    <PromptInputAction tooltip="Send message">
                      <Button
                        size="sm"
                        disabled={!inputValue.trim()}
                        onClick={handleSubmit}
                      >
                        <IconSend className="mr-1 size-4" />
                        Send
                      </Button>
                    </PromptInputAction>
                  </div>
                </PromptInputActions>
              </PromptInput>

              {/* Footer */}
              <p className="text-muted-foreground mt-3 text-center text-xs">
                Powered by Claude Sonnet 4 • Store settings: Max tokens: 8000,
                Temperature: 1, Thinking budget: 2000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
