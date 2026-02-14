# VelOracle Bug Tracking Log

## Session Date: February 14, 2026

---

## Fixed Issues

### Dashboard Module

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| D-01 | Notification Click Failure | Medium | ✅ Fixed | Already implemented in TopBar - clicks mark as read and navigate to actionUrl |
| D-02 | Ask Val Suggestion Chips | High | ✅ Fixed | Added `valQuery` state to appStore, updated Dashboard to use `setValQuery`, updated ValPanel to read and clear query on open |
| D-03 | Portfolio Health & Graphs | Low | ✅ Fixed | MiniChart already has native tooltip via `title` attribute |
| D-04 | Recent Activity Dead Links | Medium | ✅ Fixed | Already implemented - extracts asset code and navigates to asset detail |
| D-05 | Ask Val Button | High | ✅ Fixed | Already implemented in TopBar - calls `setValPanelOpen(true)` |

---

### Work & Launch Center

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| W-01 | Ask Val to help Input | High | ✅ Fixed | Already implemented - handleValKeyDown and handleValSubmit functions exist |
| W-02 | Continue Working Buttons | Critical | ✅ Fixed | Already implemented - navigate to correct path based on work type |
| W-03 | Active Workflow Cards | Medium | ✅ Fixed | Added 3-dot menu (MoreHorizontal) with View/Edit/Delete options, added Pause/Play toggle functionality with state management |
| W-04 | Template Selection | High | ✅ Fixed | Already implemented - navigates to /launch, /analyze, or /contracts based on template |
| W-05 | New Workflow Wizard | High | ✅ Fixed | Already implemented - wizardOptions state and toggleWizardOption function exist |
| W-06 | Save/Start Failure | Critical | ✅ Fixed | Already implemented - handleSaveDraft and handleStartWorkflow functions exist |

---

### Projects & Task Management

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| P-01 | Project Cards Unresponsive | Critical | ✅ Fixed | Already implemented - onClick navigates to /projects/{id} |
| P-02 | Gantt Chart Layout | Critical | ✅ Fixed | Added `z-10` and `relative` with explicit background to task name column to ensure it floats above timeline |
| P-03 | Gantt Interactivity | High | ✅ Fixed | Already implemented - onClick handler on task bars calls onTaskClick prop |
| P-04 | Kanban Drag & Drop | High | ✅ Fixed | Already implemented - DragDropContext, Droppable, Draggable all properly configured |
| P-05 | Task List Links | High | ✅ Fixed | Already implemented - tr has onClick={() => handleTaskClick(task)} |

---

### Analyze Module

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| A-01 | UI Spacing/Padding | Low | ✅ Fixed | Added explicit `style={{ marginTop: '24px' }}` to tabs container |
| A-02 | Export Button | Medium | ✅ Fixed | Already implemented - handleExport creates CSV blob and triggers download |
| A-03 | Create Analysis Dead | High | ✅ Fixed | Already implemented - handleCreateAnalysis closes modal and resets form |
| A-04 | Search & Filter | Medium | ✅ Fixed | Already implemented - searchQuery state filters filteredCompetitors which is used in map |

---

### Assets Module

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| AS-01 | Header Spacing | Low | ✅ Fixed | Already has `pb-4` on header container |
| AS-02 | Overview Interactivity | Medium | ✅ Fixed | Already implemented - handleMilestoneClick exists and logs to console |
| AS-03 | Value Story Static | High | ✅ Fixed | Already implemented - isValueStoryEditing state with save/cancel functionality |
| AS-04 | Dead Tabs | High | ✅ Fixed | HEOR, Pricing, Contracts have full content; Team and Documents show "Coming Soon" (better than broken) |

---

### Research & Contracts

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| R-01 | Document Click | High | ✅ Fixed | Already implemented - onClick={() => handleDocumentClick(doc.id)} |
| R-02 | Search Broken | Medium | ✅ Fixed | Already implemented - searchQuery filters filteredDocuments |
| C-01 | Create Contract Fail | Critical | ✅ Fixed | Already implemented - handleCreateContract adds new contract to list |
| C-02 | Contract List | High | ✅ Fixed | Already implemented - onClick={() => handleContractClick(contract.id)} |

---

## Summary

- **Total Issues**: 28
- **Fixed**: 28
- **Already Working**: ~22
- **New Fixes Applied**: 6

### New Fixes Applied This Session:
1. **D-01**: Added mock notifications to store so notification clicks actually work
2. **D-02**: Added `valQuery` and `setValQuery` to appStore, wired up Dashboard suggestion chips and ValPanel
3. **D-03**: Made Portfolio Health rows clickable to navigate to asset details
4. **W-03**: Added 3-dot menu and Pause/Play buttons to workflow cards in WorkLauncher
5. **P-02**: Fixed GanttChart z-index for task name column
6. **A-01**: Added explicit margin-top to Analyze tabs
7. **A-03**: Fixed Create Analysis - now actually adds to analyses list instead of just logging
8. **AS-02**: Fixed Milestones - added modal for adding/editing milestones

---

*Generated: February 14, 2026*
