# Prowider Mini Lead Distribution System

A full-stack lead generation and distribution system designed to handle real-world backend challenges including concurrent requests, data integrity, and strict business rules. 

## 🚀 Live Demo
**Live URL:** [Insert your Vercel URL here]

---

## 🛠 Tech Stack
* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS v3
* **Backend:** Next.js API Routes (Node.js)
* **Database:** PostgreSQL (hosted on Supabase)
* **ORM:** Prisma
* **Real-time Updates:** SWR (HTTP Polling)

---

## 🧠 Architecture & Implementation Details

### 1. Lead Allocation Algorithm
The system distributes leads based on a strict two-step process:
1. **Mandatory Assignment:** The system first identifies the required providers based on the `serviceId` mapping. It checks that these providers have a `quota > 0`.
2. **Fair Round-Robin (Pool Allocation):** To fill the remaining slots (up to exactly 3 total), the system queries the remaining eligible providers in the service's pool. 
   * To ensure fairness and persistence across server restarts, the query filters for providers with `quota > 0` and orders them by `lastAssignedAt ASC`. 
   * This guarantees that the provider who has waited the longest since their last lead always receives priority.

### 2. Concurrency Handling
When multiple leads are generated simultaneously (e.g., via the "Generate 10 Leads Instantly" testing tool), the system prevents race conditions and quota violations using database-level controls:
* **ACID Transactions:** The entire allocation process (duplicate checking, provider selection, lead creation, and assignments) is wrapped in a single PostgreSQL `$transaction`. If any step fails, the entire transaction rolls back cleanly.
* **Atomic Operations:** Quotas are decremented using database-level atomic operations (Prisma's `decrement: 1`) rather than reading the value into application memory and subtracting. This ensures that concurrent requests cannot accidentally push a provider's quota below zero.
* **Unique Constraints:** The rule preventing the same phone number from requesting the same service twice is enforced via a composite unique constraint `@@unique([phone, serviceId])` at the database schema level.

### 3. Webhook Idempotency
To handle simulated payment webhooks reliably, the system uses an idempotent design:
* The webhook payload must include a unique `eventId`.
* Before resetting a provider's quota, the system attempts to insert this `eventId` into a dedicated `WebhookEvent` table.
* The `id` column in this table is the primary key. If a duplicate webhook is received (e.g., network retry), PostgreSQL throws a unique constraint violation (`P2002`).
* The API catches this specific error, skips the quota reset, and returns a `200 OK` to satisfy the payment gateway without duplicating the business logic.

---

## 🚦 System Features

* **`/request-service` (Customer Form):** Public interface for lead submission with database-enforced duplicate prevention.
* **`/dashboard` (Provider Dashboard):** Real-time dashboard that automatically polls the database and updates provider quotas and assigned leads without manual page refreshes. Visual indicators show remaining capacity.
* **`/test-tools` (Evaluation Panel):** Specialized tools to test idempotency, trigger simultaneous load tests, and manually fire webhooks.

---

## 💻 Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd prowider-assignment
