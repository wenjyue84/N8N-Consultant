# 🎯 Jay's n8n Automation Master Implementation Plan

**AI-Powered Personal Assistant Hub with PARA Integration**

- **Prepared for:** Jay (Lew Wen Jyue)
- **Businesses:** Prisma Technology | Makan Moments Cafe | Pelangi Capsule Hostel | Southern Homestay
- **Date:** January 16, 2026

---

## 📋 Executive Summary

This plan outlines a comprehensive n8n automation system designed specifically for your multi-business operations. The architecture combines an AI-powered personal assistant (accessible via Telegram/WhatsApp) with your existing GTD + PARA methodology in Notion.

### Key Benefits
- Capture tasks via voice or text in any language (EN/CN/BM)
- Automatic routing to correct @Context based on task content
- Query your tasks and get summaries naturally: "What's on my plate today?"
- Business-specific automations for Cafe, Hostel, and Prisma operations
- Future-proof architecture ready for MCP integration with Claude

| ⏱️ Total Time | 📊 Workflows | 🎯 Phases |
|---------------|--------------|-----------|
| 8-12 hours    | 12 total     | 4 phases  |

---

## 🏗️ System Architecture

The system follows a **Hub-and-Spoke architecture** with an AI Assistant at the center, connecting to your Notion PARA system and various business operations.

```
┌─────────────────────────────────────────────────────────────┐
│                    🎛️ MASTER AI ASSISTANT                   │
│     Telegram/WhatsApp → Voice/Text → AI Processing         │
└──────────────────────────┬──────────────────────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
     ▼                     ▼                     ▼
┌─────────┐         ┌─────────────┐         ┌─────────┐
│  GTD    │         │   NOTION    │         │ BUSINESS│
│ TASKS   │         │    PARA     │         │   OPS   │
└─────────┘         └─────────────┘         └─────────┘
```

### 🔗 Your Notion Database IDs

| Database | ID / Data Source |
|----------|------------------|
| 🔖 Jay Tasks | `collection://8daa8801-62e4-4447-a1cb-a5fedceedcb9` |
| 💼 Jay AOR | `collection://4eae4ea2-61ed-4065-b0a0-898e73ddb081` |
| 📋 Jay Projects | `collection://0a45c455-11dd-4fd2-aee7-dae7b8778187` |

### 🏷️ Context Tags Mapping

Your existing @Context tags will be used for intelligent routing:

| Context | When to Use | AI Detection Keywords |
|---------|-------------|----------------------|
| @Computer | Tasks requiring computer | code, website, email, document |
| @Phone | Calls and quick mobile tasks | call, WhatsApp, message, contact |
| @Cafe Ops | Makan Moments operations | cafe, menu, kitchen, staff, FeedMe |
| @Property Ops | Hostel/Homestay tasks | hostel, room, guest, booking, tenant |
| @Deep Work | Focus-required tasks | research, analyze, develop, design |
| @Waiting | Delegated/pending items | waiting for, pending, follow up |

---

## 🚀 Phase 1: AI Assistant Core

> ⏱️ Estimated Time: 2-3 hours | 🎯 Priority: HIGHEST | 📊 Workflows: 3

### 🤖 Workflow 1.1: Telegram Task Assistant

The core AI assistant that receives messages via Telegram, processes voice/text, and manages your Notion tasks.

**Components:**
- **Telegram Trigger** - Receives incoming messages
- **Voice Detection** - Check if message is voice or text
- **OpenAI Whisper** - Transcribe voice to text (multilingual: EN/CN/BM)
- **AI Agent (GPT-4/Claude)** - Understand intent and execute actions
- **Memory Buffer** - Maintain conversation context
- **Notion Tools** - Custom tools for task CRUD operations

**Capabilities:**

| User Says | AI Does |
|-----------|---------|
| "Add task: review cafe menu pricing" | Creates task with @Cafe Ops context |
| "What's on my plate today?" | Queries TODAY view, returns summary |
| "Mark task 234 as done" | Updates task status to Done |
| [Voice in Chinese about hostel] | Transcribes → Creates task @Property Ops |

### 📱 Workflow 1.2: WhatsApp Bridge (Optional)

If you prefer WhatsApp over Telegram, this workflow mirrors the same functionality using WhatsApp Business API. Since you already use WhatsApp heavily for business communications, this may be more convenient.

### 🌅 Workflow 1.3: Daily Briefing

Automated morning summary sent at 8:00 AM daily.

- Pulls tasks from TODAY and PAST (overdue) views
- Generates AI summary grouped by @Context
- Sends via Telegram with quick action buttons

---

## ⚡ Phase 2: GTD Automation

> ⏱️ Estimated Time: 2-3 hours | 🎯 Priority: HIGH | 📊 Workflows: 4

### 📥 Workflow 2.1: Inbox Processing Reminder

Triggered when INBOX view has items older than 24 hours without a When date.

- **Schedule:** Every 6 hours
- **Action:** Sends reminder with count of unprocessed items
- Includes direct link to INBOX view

### ⏰ Workflow 2.2: Overdue Task Nudge

Monitors the PAST view for overdue tasks.

- **Schedule:** Daily at 10:00 AM
- Sends list of overdue tasks grouped by days overdue
- Offers quick actions: Reschedule to Today / Tomorrow / Next Week

### 📊 Workflow 2.3: Weekly Review Generator

Automated weekly review report every Sunday at 6:00 PM.

- Completed tasks this week (from DONE view)
- Tasks still pending (from Not Done view)
- Productivity score and trend chart data
- AI-generated insights and recommendations

### 🎯 Workflow 2.4: Context Switcher

Manual trigger workflow for context-based task retrieval.

- **Input:** Select current context (e.g., "I'm at the computer")
- **Output:** All relevant tasks for that @Context
- Sorted by priority and due date

---

## 💼 Phase 3: Business Operations

> ⏱️ Estimated Time: 3-4 hours | 🎯 Priority: MEDIUM | 📊 Workflows: 4

### 🍜 Workflow 3.1: Cafe Payroll Calculator

Leverages your existing cafe-payroll skill for automated salary calculation.

- **Trigger:** Bi-monthly schedule (1st and 16th)
- **Input:** Staff attendance data (CSV/Excel from DingTalk)
- **Process:** Calculate regular hours, overtime, deductions
- **Output:** Payroll summary to Notion + notification to you

### 📣 Workflow 3.2: Social Post Scheduler

Automates your 发帖任务 workflow for Makan Moments Cafe.

- **Trigger:** When a 发帖任务 is marked ready
- **Action:** Format content for Facebook/Instagram
- Schedule post at optimal time
- Update task status to "Posted"

### 🏨 Workflow 3.3: Guest Feedback Processor

For Pelangi Capsule Hostel guest feedback analysis.

- **Trigger:** New feedback form submission or email
- **AI Analysis:** Sentiment scoring, key issues extraction
- Auto-create task if negative feedback detected
- Log to Notion database for trend analysis

### 🔧 Workflow 3.4: Property Maintenance Router

For Southern Homestay Group maintenance requests.

- **Trigger:** Maintenance request via form/WhatsApp
- **AI Classification:** Categorize by urgency and type
- Auto-assign to appropriate person
- Create task with @Property Ops context

---

## 🔮 Phase 4: Future Evolution (MCP)

> ⏱️ Estimated Time: 2-3 hours | 🎯 Priority: FUTURE | 📊 Workflows: 1 (Master)

### 🔌 Workflow 4.1: MCP Server Trigger

This transforms your n8n instance into an MCP server that AI assistants (like Claude) can connect to directly.

**What This Enables:**
- Talk to Claude directly and have it manage your Notion tasks
- Claude can call your n8n workflows as "tools"
- No need for Telegram as intermediary - direct AI integration
- Future-proof for AI agent ecosystem developments

**Implementation:**
- Add MCP Server Trigger node to n8n
- Expose tools: `create_task`, `query_tasks`, `update_task`, `get_summary`
- Connect Claude Desktop or other MCP clients
- Authenticate with Bearer token for security

---

## ✅ Implementation Checklist

### 📋 Prerequisites

- [ ] n8n instance running (self-hosted or cloud)
- [ ] Telegram Bot Token (create via @BotFather)
- [ ] OpenAI API Key (for GPT-4 and Whisper)
- [ ] Notion Integration Token (create in Notion settings)
- [ ] WhatsApp Business API credentials (optional)

### 🚀 Phase 1 Checklist

- [ ] Create Telegram bot and get token
- [ ] Set up OpenAI credentials in n8n
- [ ] Create Notion integration and connect databases
- [ ] Build Workflow 1.1: Telegram Task Assistant
- [ ] Test voice transcription in all languages
- [ ] Build Workflow 1.3: Daily Briefing
- [ ] Test end-to-end task creation flow

### ⚡ Phase 2 Checklist

- [ ] Build Workflow 2.1: Inbox Processing Reminder
- [ ] Build Workflow 2.2: Overdue Task Nudge
- [ ] Build Workflow 2.3: Weekly Review Generator
- [ ] Build Workflow 2.4: Context Switcher
- [ ] Test all scheduled triggers

### 💼 Phase 3 Checklist

- [ ] Connect cafe-payroll skill to n8n
- [ ] Build Workflow 3.1: Cafe Payroll Calculator
- [ ] Build Workflow 3.2: Social Post Scheduler
- [ ] Build Workflow 3.3: Guest Feedback Processor
- [ ] Build Workflow 3.4: Property Maintenance Router

### 🔮 Phase 4 Checklist

- [ ] Set up MCP Server Trigger
- [ ] Define and expose tools
- [ ] Test with Claude Desktop
- [ ] Document all endpoints

---

## 👣 Recommended Next Steps

1. **Start with Phase 1, Workflow 1.1**
   - This is your foundation. Get the Telegram → AI → Notion flow working first.

2. **Test extensively with real tasks**
   - Use it daily for 1 week before adding more workflows.

3. **Add Daily Briefing (Workflow 1.3)**
   - This gives you immediate daily value and helps establish the habit.

4. **Gradually add GTD automations (Phase 2)**
   - These enhance your existing GTD practice without disrupting it.

5. **Business workflows last (Phase 3)**
   - Only after the core system is stable and you're comfortable with it.

---

## 🎯 Ready to Start?

Just say **"Let's build Workflow 1.1"** and I'll guide you through it step by step!

---

*— End of Plan —*
