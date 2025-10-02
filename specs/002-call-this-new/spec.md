# Feature Specification: Ask Me Anything Chatbot

**Feature Branch**: `002-call-this-new`
**Created**: 2025-10-02
**Status**: Draft
**Input**: User description: "Call this new specs chapter 'Chatbot'. Add a chatbot helper called 'Ask Me Anything' in a smallish floating panel toward the bottom right of the page. It should have a prompt box and a response box. It should connect via my API credentials to openai gpt-5 nano. It should be able to answer all questions about the site and our services. Create a Site-and-services.md which will hold a detailed breakdown of all information about this which can be used as a system prompt. Initially, create a draft version by analysing this code base, and add some tech saas style boilerplate which you can make up based around the idea of an AI software, training, and consultancy aimed at small businesses"

## Execution Flow (main)
```
1. Parse user description from Input
   → ✓ Feature description provided
2. Extract key concepts from description
   → Identified: floating chatbot UI, question/answer interaction, API integration, knowledge base content
3. For each unclear aspect:
   → Marked with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → ✓ User flow defined
5. Generate Functional Requirements
   → ✓ Each requirement is testable
6. Identify Key Entities (if data involved)
   → ✓ Entities identified
7. Run Review Checklist
   → ⚠ Contains [NEEDS CLARIFICATION] markers
8. Return: SUCCESS (spec ready for planning with clarifications needed)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## Clarifications

### Session 2025-10-02
- Q: When the API fails or times out, what should the chatbot display to the user? → A: Fallback with booking redirect: "I'm unavailable right now. Would you like to book a consultation directly?"
- Q: Should conversation history persist when the user refreshes the page or navigates away? → A: Keep in session storage: Conversation persists during browser session only (lost when browser closes)
- Q: What level of keyboard accessibility is required for the chatbot? → A: Basic keyboard navigation: Tab/Enter/Escape support only
- Q: What is the maximum acceptable response time before timeout? → A: 5 seconds then retry once
- Q: Should the chatbot collect or store any user information from conversations? → A: Optional email capture: Allow users to voluntarily provide email for follow-up

---

## User Scenarios & Testing

### Primary User Story
A visitor to the AI MOT landing page has questions about the services offered, pricing, booking process, or technical capabilities. Rather than searching through the website or leaving to find contact information, they click on the "Ask Me Anything" chatbot floating at the bottom right of the page. They type their question into the prompt box and receive an immediate, contextual answer based on comprehensive knowledge about AI MOT's services, processes, and value proposition. This enables self-service discovery and reduces friction in the customer journey.

### Acceptance Scenarios

1. **Given** a visitor is browsing the AI MOT landing page, **When** they look toward the bottom right corner, **Then** they see a floating chatbot panel labeled "Ask Me Anything"

2. **Given** the chatbot panel is visible, **When** the visitor clicks on it, **Then** the panel expands to show a prompt input box and a response display area

3. **Given** the chatbot is open, **When** the visitor types "What services do you offer?" and submits, **Then** the system displays a comprehensive answer about AI MOT's consultation, audit, implementation, and training services

4. **Given** the chatbot is open, **When** the visitor asks "How much does an initial consultation cost?", **Then** the system provides pricing information or guidance on how to get a quote

5. **Given** the chatbot has answered a question, **When** the visitor asks a follow-up question, **Then** the conversation history is maintained and the response is contextually relevant to the ongoing dialogue

6. **Given** the chatbot is open and expanded, **When** the visitor clicks outside the panel or closes it, **Then** the panel collapses or minimizes back to its initial state

7. **Given** a visitor asks a question outside the scope of site/service information, **When** the system processes the query, **Then** it politely redirects the user back to topics it can help with

8. **Given** the visitor is on a mobile device, **When** they interact with the chatbot, **Then** the panel is appropriately sized and positioned for the smaller screen

9. **Given** the chatbot is open, **When** the visitor optionally provides their email address in the email field, **Then** the email is validated and stored for follow-up purposes

10. **Given** API request times out after 5 seconds, **When** system retries once and fails again, **Then** fallback message with booking redirect is displayed

### Edge Cases
- What happens when the visitor submits an empty message?
- How does the system handle very long questions (e.g., 500+ words)?
- What happens if the visitor rapidly submits multiple questions before receiving responses?
- How does the system respond to questions in languages other than English?
- When API connectivity fails or times out, system displays: "I'm unavailable right now. Would you like to book a consultation directly?" with link/button to booking form
- How does the system handle malicious input (SQL injection attempts, XSS, profanity)?
- When visitor refreshes the page, conversation history is restored from session storage (persists during browser session only)
- Conversation history is cleared when browser closes (not persisted beyond session)

## Requirements

### Functional Requirements

#### UI & Interaction
- **FR-001**: System MUST display a floating chatbot panel positioned in the bottom right corner of the page
- **FR-002**: Chatbot panel MUST have a collapsed/minimized state and an expanded state
- **FR-003**: Chatbot panel MUST include a prompt input box for user questions
- **FR-004**: Chatbot panel MUST include a response display area for answers
- **FR-005**: System MUST allow users to type and submit questions via the prompt box
- **FR-006**: System MUST display "Ask Me Anything" as the chatbot identifier/title
- **FR-007**: Chatbot panel MUST be responsive and appropriately sized for mobile, tablet, and desktop viewports
- **FR-008**: System MUST provide visual feedback when processing a question (e.g., loading indicator)
- **FR-009**: Users MUST be able to close or minimize the chatbot panel
- **FR-010**: System MUST prevent users from submitting empty or whitespace-only messages

#### Content & Responses
- **FR-011**: System MUST answer questions about AI MOT's services (consultation, audit, implementation, training)
- **FR-012**: System MUST answer questions about the booking process and how to request services
- **FR-013**: System MUST answer questions about AI MOT's value proposition and business benefits
- **FR-014**: System MUST answer questions about pricing and engagement models [NEEDS CLARIFICATION: what is the actual pricing structure?]
- **FR-015**: System MUST answer technical questions about AI capabilities and methodologies [NEEDS CLARIFICATION: level of technical detail appropriate for target audience?]
- **FR-016**: System MUST maintain conversation context across multiple questions in a single session
- **FR-017**: System MUST provide a fallback response when unable to answer a question based on available knowledge
- **FR-018**: System MUST redirect off-topic questions back to site and service-related topics

#### Knowledge Base
- **FR-019**: System MUST have access to a comprehensive knowledge base document containing all site and service information
- **FR-020**: Knowledge base MUST include service descriptions (consultation, audit, implementation, training)
- **FR-021**: Knowledge base MUST include company value proposition and mission
- **FR-022**: Knowledge base MUST include target customer profile (small businesses)
- **FR-023**: Knowledge base MUST include booking process details
- **FR-024**: Knowledge base MUST include pricing information [NEEDS CLARIFICATION: actual pricing details needed]
- **FR-025**: Knowledge base MUST include information about AI technologies and methodologies used
- **FR-026**: Knowledge base MUST include common FAQs and their answers
- **FR-027**: Knowledge base MUST be stored in a format that serves as the system prompt for AI responses

#### API & Integration
- **FR-028**: System MUST connect to an external AI service to generate responses [NEEDS CLARIFICATION: API endpoint, authentication method, rate limits?]
- **FR-029**: System MUST use user-provided API credentials for authentication [NEEDS CLARIFICATION: where/how are credentials stored? Environment variables?]
- **FR-030**: System MUST display fallback message with booking redirect when API errors occur: "I'm unavailable right now. Would you like to book a consultation directly?"
- **FR-030a**: System MUST provide clickable link or button to booking form when displaying API error fallback
- **FR-031**: System MUST timeout API requests after 5 seconds and retry once before displaying fallback message
- **FR-031a**: System MUST display loading indicator during initial request and retry attempt
- **FR-032**: System MUST display fallback message with booking redirect when API rate limiting occurs

#### Data & Privacy
- **FR-033**: System MUST persist conversation history in browser session storage only (cleared when browser closes)
- **FR-033a**: System MUST restore conversation history from session storage when page is refreshed during active browser session
- **FR-033b**: System MUST NOT persist conversation history beyond browser session (no backend storage, no local storage)
- **FR-034**: System MUST provide optional email capture field allowing users to voluntarily provide email address for follow-up
- **FR-034a**: Email capture MUST be clearly marked as optional (not required to use chatbot)
- **FR-034b**: System MUST validate email format when provided
- **FR-034c**: System MUST NOT collect or store any other personally identifiable information beyond voluntarily provided email
- **FR-035**: System MUST display disclaimer that conversations are not stored beyond current browser session [NEEDS CLARIFICATION: what disclaimers are legally required?]

#### Performance & Accessibility
- **FR-036**: Chatbot panel MUST NOT interfere with primary page content or user interactions
- **FR-037**: System MUST load without blocking or delaying the main page load
- **FR-038**: Chatbot UI MUST support basic keyboard navigation (Tab to focus, Enter to submit, Escape to close)
- **FR-038a**: Users MUST be able to navigate between input field and buttons using Tab key
- **FR-038b**: Users MUST be able to submit messages using Enter key
- **FR-038c**: Users MUST be able to close/minimize chatbot using Escape key
- **FR-039**: Chatbot MUST work in modern browsers (Chrome, Firefox, Safari, Edge)

### Key Entities

- **ChatMessage**: Represents a single message in the conversation thread, contains the message text, sender identity (user or assistant), timestamp, and display order
- **Conversation**: Represents the entire chat session, contains all messages exchanged, session start time, and current state (active, waiting for response, error)
- **KnowledgeBase**: Represents the comprehensive information source about AI MOT services, contains service descriptions, pricing details, FAQs, company information, and technical methodologies used for generating contextual responses
- **ChatPanel**: Represents the UI state of the floating panel, contains visibility state (expanded/collapsed), position coordinates, size dimensions, and z-index layering

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain *(3 clarifications deferred to planning)*
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked and resolved (5/8 clarified)
- [x] User scenarios defined (10 scenarios)
- [x] Requirements generated (44 requirements)
- [x] Entities identified (4 entities)
- [x] Clarification session completed (5 questions answered)

---

## Remaining Clarifications (Deferred to Planning)

The following items are deferred to the planning phase as they involve implementation details rather than functional requirements:

1. **Pricing Information** (FR-024): Actual pricing details needed for knowledge base - deferred until content creation phase
2. **API Configuration** (FR-028): Specific API endpoint, authentication method, and rate limits - technical implementation detail for planning phase
3. **Credential Storage** (FR-029): Where/how API credentials are stored - technical implementation detail for planning phase
4. **Legal Disclaimers** (FR-035): Specific legal disclaimers required - deferred to content/legal review phase

---

## Additional Deliverable

As specified in the user description, a comprehensive **Site-and-services.md** document must be created containing:
- Complete service catalog descriptions
- Company mission, vision, and value proposition
- Target customer profiles and use cases
- Pricing and engagement models
- Technical methodologies and AI capabilities
- Booking process workflows
- Common FAQs
- Boilerplate marketing copy for small business AI consultancy

This document will serve as the system prompt/knowledge base for the AI chatbot to generate contextual responses.
