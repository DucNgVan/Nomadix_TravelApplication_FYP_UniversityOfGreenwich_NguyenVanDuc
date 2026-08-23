# 04. Project Objectives & Success Measures

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Day 1 Objectives

The goal of Day 1 is to establish a clear and controlled foundation for the Nomadix project, answering 8 fundamental questions:

1. **What problem does Nomadix solve?**  
   Resolves the fragmented travel lifecycle by unifying search, planning, GPS check-in, quizzes, and community Q&A into one app.
2. **Who will use Nomadix?**  
   Independent travelers (primary), experienced travel contributors (secondary), and system administrators.
3. **What is the main purpose of Nomadix?**  
   To provide an integrated smart travel ecosystem connecting discovery, planning, physical exploration, gamified learning, and verified community knowledge.
4. **What are the core modules?**  
   Six modules: Authentication & Profile, Smart Booking Search, Itinerary Planner, Gamification, Community Q&A, and Verified Travel Experience.
5. **What functionality is included in the project?**  
   All core MVP workflows across the 6 modules plus optional should-have enhancements (Redis caching, advanced filters).
6. **What functionality is excluded?**  
   Financial payment processing, full OTA reservation lifecycle, advanced anti-fraud AI, real-time traveler chat, and complex ML recommendation engines.
7. **What is the Minimum Viable Product (MVP)?**  
   A cohesive flow proving a traveler can search, plan, physically visit a landmark, verify via GPS, complete a quiz, earn a badge, and display a verified badge in community Q&A.
8. **What makes Nomadix different from existing travel applications?**  
   Location-verified travel experience combined with gamification and community credibility.

---

## 2. Project Success Measures

```text
┌─────────────────────────────────────────────────────────────┐
│                   SUCCESS EVALUATION CRITERIA               │
├─────────────────┬───────────────────────────────────────────┤
│ 1. Functional   │ Core workflows execute without errors     │
├─────────────────┼───────────────────────────────────────────┤
│ 2. Technical    │ Multi-tech stack integration & stability  │
├─────────────────┼───────────────────────────────────────────┤
│ 3. Usability    │ Frictionless user journey without manuals │
├─────────────────┼───────────────────────────────────────────┤
│ 4. Performance  │ Quantifiable Redis caching latency gains  │
└─────────────────┴───────────────────────────────────────────┘
```

### Performance Benchmark Goal (Redis Caching)
* Demonstrate measurable latency reduction between cold external API requests and warm Redis cache hits during Month 5 testing:
  $$\text{Response Time}_{\text{Redis}} \ll \text{Response Time}_{\text{External API}}$$

---

## 3. Definition of Done (DoD) Checklist for Day 1

- [x] Problem statement finalized and documented.
- [x] Project vision & mission finalized.
- [x] Core objectives and evaluation criteria defined.
- [x] Target users and personas identified.
- [x] Six core functional modules defined.
- [x] MVP boundaries and 19-step scenario established.
- [x] Out-of-scope boundaries demarcated.
- [x] Project constraints documented.
- [x] Day 1 deliverables organized and committed.
