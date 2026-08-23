# 09. Out-of-Scope Items

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Explicitly Excluded Features

To maintain quality and ensure successful completion within the 5-month timeline, the following items are formally declared out of scope for the MVP:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        OUT-OF-SCOPE BOUNDARIES                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Payment Processing    │ No direct financial transactions / gateways │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. Full OTA Management   │ Aggregation & redirection only; no ticketing│
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Advanced Anti-Cheat   │ Basic GPS geofencing; no kernel mock checks │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 4. AI Travel Assistant   │ Conversational LLM deferred to roadmap      │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 5. Real-Time Chat        │ No direct 1-on-1 socket-based chat          │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 6. Social Following      │ No friend graphs or follower activity feeds │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Rationale for Exclusions

1. **Financial Transactions:** Nomadix acts as a discovery, planning, and aggregation platform. Implementing real financial settlement introduces complex compliance, banking, and security burdens unnecessary for academic project validation.
2. **Full OTA Booking Operations:** Focus is placed on data normalization, search, comparison, and provider redirection.
3. **Advanced Anti-Fraud:** Standard mobile GPS coordinates and Haversine distance verification are sufficient for project evaluation without low-level device attestation.
4. **AI & Social Chat:** These features are preserved in the future roadmap to avoid diluting development efforts away from the core travel continuum.
