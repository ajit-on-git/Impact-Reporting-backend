AI Impact Reporting Generator
An end-to-end full-stack application that calculates the environmental footprint of e-commerce orders. It combines Life Cycle Assessment (LCA) logic with Gemini AI to generate human-readable sustainability statements.

---

Architecture Overview
The system follows a classic MERN-adjacent architecture (MongoDB, Express, React, Node) with a dedicated service layer for sustainability logic and AI integration.

1. High-Level Flow:

\*.Frontend (React): User inputs product details (material, weight, distance, quantity).

\*.Backend (Node/Express): Validates data and passes it to the impactService.

\*.Impact Service: Runs mathematical models to calculate plastic saved (grams) and carbon avoided.

\*.AI Service (Gemini): Takes the raw numbers and generates a concise, natural-language impact statement.

\*.Persistence (MongoDB): Stores the order details along with the generated impact report for future auditing.

\*.Response: The calculated metrics and AI statement are returned to the frontend for visualization.

2. Component Breakdown:

\*Controller: Manages the request lifecycle and orchestrates service calls.

\*Sustainability Logic (impactService.js): Contains emission factors for materials (PET, HDPE, etc.), transport modes (Air, Truck, Rail, Ocean), and End-of-Life (EOL) scenarios.

\*AI Layer (aiService.js & impactPrompt.js): Interfaces with the gemini-2.5-flash model to translate data into narrative.

---

Sustainability Logic & Calculations:

The generator uses real-world environmental constants to ensure credibility.

\*Plastic Saved Calculation:

Calculates the difference between a "Baseline" (standard) product weight and the "New" eco-friendly weight, adjusted for:

\*PCR Ratio: Post-Consumer Recycled content (virgin plastic reduction).

\*Manufacturing Scrap: Waste generated during production.

\*Reuse Factor: Multiplier for multi-use products.

\*Carbon Avoided Calculation:

Uses the following formula to estimate CO2 reduction:

Total Carbon Avoided =
Material Production Emissions

- Transport Emissions
- End-of-Life Emissions

---

AI Prompt Design:

The AI prompt is engineered using Structured prompting and Constraint-Based principles to ensure the output is professional and data-driven, avoiding "greenwashing" (marketing exaggeration).

The Prompt Structure (src/prompts/impactPrompt.js)
The prompt is built dynamically using three specific data points:

1.Context Setting: Tells the AI it is a "Sustainability Reporting Assistant."

2.Data Injection: Passes the exact calculated grams of plastic and kg of carbon.

3.Strict Constraints:

- Length: Maximum 2 sentences.
- Tone: Precise and human-readable.
- Negative Constraint: "Avoid marketing language or exaggerations."
- Output Format: "Do not include additional commentary."

Why this works:
By providing the AI with pre-calculated, hard data and strict formatting rules, we prevent "hallucinations." The AI isn't calculating the impact—it is simply narrating the verified calculations performed by the backend.

Key Features:

LCA Integration: Beyond simple math, it considers the entire lifecycle (Production → Transport → Disposal).

Dynamic Visuals: The frontend includes a CSS-based distribution bar to visualize End-of-Life scenarios (Landfill vs. Recycling).

Fail-Safe Mechanism: If the Gemini API is unavailable, the aiService uses a template-based fallback to ensure the user still receives a report.

Audit Trail: Every AI interaction is logged locally in src/logs/ai_logs.txt with timestamps for debugging and transparency.
