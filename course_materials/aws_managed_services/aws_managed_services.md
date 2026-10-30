
# Topic and Queue - An Overview
---


- **Purpose of SNS**
  - SNS is a **notification-focused**, event-driven service.
  - It’s used to react to events across your application and infrastructure—anything operationally or functionally important (e.g., EC2 events, user actions, failed jobs).

- **Push-based delivery model**
  - SNS is **push**, not pull: when a message is published, SNS immediately sends it to all configured subscribers.
  - Supported endpoints include:
    - HTTP/HTTPS endpoints
    - Lambda functions
    - Email
    - Mobile push / SMS
    - SQS queues
  - Example: An **S3 file upload** can publish to SNS, which then triggers a **Lambda** to process the file right away.

- **Use for critical, time-sensitive events**
  - SNS is valuable for **fast visibility** into important events.
  - In the context of **Auto Scaling**:
    - CloudWatch alarms can publish to SNS when thresholds are breached.
    - Auto Scaling actions (scale out/in) can also send success/failure notifications.
    - These can go to email or other channels to know **when scaling kicked in and what happened**.

- **SNS vs SQS vs Amazon MQ**
  - **SNS**:
    - Publish–subscribe model using **topics** and **subscribers**.
    - **Push-based** delivery.
  - **SQS**:
    - **Queue** service, **pull-based**.
    - Consumers (e.g., Java/Python programs) **poll** for messages.
    - Messages are stored until retrieved, enabling decoupling and buffering.
  - **Amazon MQ**:
    - Managed broker supporting **standard messaging protocols/APIs** (compatible with Apache ActiveMQ-style middleware).
    - Targeted at **enterprise migrations** where existing apps are tightly coupled to traditional messaging systems, so they can move with minimal code change.

- **Operational characteristics**
  - SNS, SQS, and Amazon MQ are all **managed services**.
  - They can be provisioned and integrated via **AWS Console, CLI, or APIs**, reducing operational overhead while simplifying communication patterns in cloud-native and migrated applications.

---

# SNS Feature illustration

---

The video explains how SNS topics enable flexible publish–subscribe messaging patterns, and how its features ensure reliability, correctness, selective delivery, and security.

**1. Core Model: Topics and Publish–Subscribe**

- Publishers (AWS services, internal apps, third-party systems) send messages to an **SNS topic**, not directly to consumers.
- The topic then **fanouts** messages to one or many subscribers:
  - Application-to-application: Lambda, SQS, HTTP/HTTPS endpoints, etc.
  - Application-to-person: Mobile push, SMS, email.

This decouples producers and consumers and supports both system automation and human notifications from the same mechanism.

**2. Architectural Patterns**

- **Fanout (app-to-app)**  
  - One message (e.g., a price update) can trigger multiple workflows in parallel:
    - Lambda for real-time processing
    - SQS for buffering/batch processing
    - HTTP endpoints for external systems
- **Notifications (app-to-person)**  
  - The same topic can send alerts or updates to:
    - Mobile/push notifications
    - SMS
    - Email

**3. Reliability & Correctness Features**

- **FIFO topics (ordered delivery)**
  - Guarantee **message order** and **exactly-once processing** within a FIFO topic.
  - Example: price updates to wholesale/retail systems must not arrive out of order (no old higher-priced update after a new lower-priced one).
  - Trade-off: stricter guarantees → potentially reduced throughput.

- **Message deduplication**
  - Protects against duplicate production from retries or network issues.
  - Works via:
    - Content-based deduplication (hash of the message body).
    - Explicit **deduplication ID**: messages with same ID in a time window are treated as duplicates and delivered once.

- **Message grouping**
  - Preserve order **per group** (e.g., per product ID), while different groups can be processed in parallel.
  - Balances ordering guarantees with scalability.

**4. Selective Delivery with Filter Policies**

- JSON **subscription filter policies** let each subscriber define what they want to receive.
- Rules:
  - Different attributes in the policy act like **AND**.
  - Multiple values within one attribute act like **OR**.
- Capabilities:
  - Filter on store, event type, customer interest, etc.
  - Use numeric filters (e.g., `price > 100`).
  - Drop messages missing required attributes.
- Result: subscribers only receive relevant messages, reducing noise and processing cost.

**5. HTTP/HTTPS Reliability: Retries & Backoff**

- For HTTP/HTTPS subscribers, SNS supports **configurable retry policies**:
  - Immediate retries (initial quick attempts)
  - Pre–back-off delay
  - Exponential backoff phase
  - Fixed-interval retries
- This helps temporarily unhealthy endpoints recover without being overloaded or losing messages.

**6. Security & Access Control**

- **Topic policies** control:
  - Who is allowed to **publish** to the topic (e.g., only a specific S3 bucket or service).
  - What SNS is allowed to do when delivering to targets (e.g., permission to send to a specific SQS queue).
- This enforces **least privilege**, ensuring only authorized publishers and delivery actions are permitted.

---

# SNS Demo

--- 

**1. Creating the SNS Topic**

- In the AWS Console, the flow starts by:
  - Navigating to **Amazon SNS → Topics → Create topic**.
  - Creating a **standard topic** named `content-topic`.
- Key configuration points highlighted:
  - **Encryption (SSE)**:
    - Can be enabled with your own KMS key or an AWS-managed key.
    - Left **disabled** here to keep the demo simple.
  - **Access policies**:
    - Control **who can publish** to the topic.
    - Important for governance and preventing unauthorized or noisy publishers.
  - **Delivery retry settings**:
    - Especially relevant for **HTTP/HTTPS** endpoints.
    - Configurable via **JSON policies** defining retry behavior.
  - **Delivery status logging**:
    - Lets you see whether messages were delivered successfully.
    - Helps debug failures (why a message didn’t arrive).
  - **Tagging**:
    - Add key–value tags to organize and manage topics (e.g., cost allocation, ownership).

**2. Creating and Confirming a Subscription**

- After creating the topic, the video shows how to:
  - Create a **subscription** by choosing:
    - The **topic ARN** (the `content-topic` just created).
    - A **protocol** (here, `email`).
    - A **target** (a test email address).
- Additional subscription options mentioned:
  - **Subscription filters**:
    - Allow selective delivery based on message attributes.
  - **Redrive (dead-letter queue)**:
    - Failed deliveries can be routed to an **SQS dead-letter queue** for later analysis or retry.
- **Confirmation process**:
  - Initially, the subscription is **“Pending confirmation”**.
  - An email is sent with a **“Confirm subscription”** link.
  - After clicking it, the console shows the status as **“Confirmed”**.
  - For **HTTP/HTTPS endpoints**, confirmation must be handled programmatically:
    - The endpoint receives a confirmation request and must respond with HTTP **200** to confirm.

**3. Publishing and Verifying a Test Message**

- With the topic and subscription ready, the video publishes a message:
  - Adds a **subject** (e.g., “Test message”).
  - Notes that **TTL (time-to-live)** applies only to **mobile endpoints**, not email.
  - Demonstrates **target-specific message formatting**:
    - You can provide **JSON** with protocol-specific payloads plus a **default** message.
- Delivery verification:
  - The test email arrives in the inbox containing the published message.
  - This confirms the end-to-end flow:
    1. Topic created  
    2. Subscription added and confirmed  
    3. Message published  
    4. Notification successfully delivered

Overall, the exercise shows SNS as a simple but powerful, decoupled integration layer—tying together applications and users via topics, subscriptions, and configurable security, reliability, and logging controls.

---

# SQS

---

**1. Core SQS Queue Behavior**

- A queue is configured with:
  - **Retention period** (e.g., 1 day): how long messages can remain in the queue before expiring.
  - **Visibility timeout** (e.g., 30 seconds): how long a message is hidden after a consumer retrieves it, giving time to process and delete it.
- A **producer** sends messages to an SQS queue named `content`.
- **Consumers** (e.g., EC2 instances in any language using AWS SDKs) poll SQS for messages to process.

**2. Elastic Scaling with Auto Scaling Groups**

- As message volume rises, a single consumer cannot keep up.
- Consumers are run in an **Auto Scaling group**:
  - Scale **out** when message load increases.
  - Scale **in** when load decreases.
- This is presented as a **general scaling pattern**, not just for web servers or HTTP traffic.

**3. Real-World Scenario: Accounting Invoices**

- Example: an accounting firm where customers upload invoices to S3.
  - Normal days: steady load.
  - Quarter-end: sharp spike in invoice volume.
- Problem: **format-dependent processing**.
  - If a customer changes invoice layout (fields move, extra columns, etc.), consumer code may:
    - Throw errors.
    - Fail to delete messages.
    - Cause a **backlog** in the main queue.

**4. Handling Failures with Dead-Letter Queues (DLQs)**

- To prevent “bad” messages from blocking good ones:
  - A **dead-letter queue** (ReDrive queue) is configured.
  - Messages that repeatedly fail processing are moved from the main queue to the **DLQ**.
- This isolates problematic messages and keeps the primary “happy path” flowing.

**5. Two-Path Architecture: Happy Path & Exception Path**

- The system is split into two independently scalable paths:
  - **Happy Path**:
    - Auto Scaling group of consumers reading from the **main SQS queue**.
    - Handles normal, correctly formatted invoices.
  - **Exception Path**:
    - Separate consumer group reading from the **DLQ**.
    - Focuses on diagnosing why messages failed.
    - After analysis, this path can:
      - Use **SNS** to **notify customers** about the formatting issue.
      - Remove or resolve the message from the DLQ.
- This creates an **automated feedback loop** with minimal human intervention, keeping the core system healthy while exceptions are handled systematically.

**6. Cost Awareness and SQS Pricing**

- **Pay-per-use model**:
  - You pay per **request**, not per running server.
- **Standard vs FIFO queues**:
  - **Standard**:
    - Cheaper.
    - Very high throughput.
    - Best-effort ordering, at-least-once delivery.
  - **FIFO**:
    - More expensive.
    - Lower throughput.
    - Guarantees ordering and exactly-once processing.
- **Request billing & payload chunking**:
  - Each **64 KB** chunk of payload counts as **one request**.
  - Example: a **256 KB** message is billed as **4 requests**.
- The video stresses understanding these details to avoid cost surprises while scaling.

---

# Overview of CloudWatch

--- 

**1. What CloudWatch Is and Why It Exists**

- CloudWatch is AWS’s **central monitoring service** for:
  - Metrics (CPU, memory, I/O, etc.)
  - Logs (application logs, system logs)
- It integrates with **most AWS services**—both managed services and infrastructure (like EC2).
- Goal: a **single, unified monitoring model** instead of separate tools and approaches per service.

**2. Default vs Advanced Monitoring**

- **Default (free) monitoring**:
  - Provided out-of-the-box for many services (e.g., EC2, databases).
  - Metrics typically collected at about **5-minute intervals**.
  - Good for basic visibility when you don’t need very fine-grained detail.
- **Advanced (paid) monitoring**:
  - Higher-frequency metrics, sometimes down to **seconds**.
  - Lets you **detect issues faster** (e.g., sharp CPU spikes).
  - Costs vary by resource and metric resolution.

**3. Centralized Dashboards and Log Organization**

- CloudWatch offers **dashboards** to view data from many resources together:
  - EC2, databases, and other services on a single screen.
- Logs are grouped into **log groups**, which you can structure flexibly:
  - Per-instance groups (e.g., one log group per EC2 instance).
  - Per-application or per-database groups (e.g., one for each of five databases).
- This helps keep logs **organized, targeted, and manageable**.

**4. Extending Logs Beyond CloudWatch**

- Logs in CloudWatch can be **exported to S3**, which enables:
  - **Athena** queries over historical logs stored in S3.
  - Feeding logs into a **search engine** (e.g., Elasticsearch/OpenSearch) via triggers.
  - Loading into **Redshift** or other data warehouses for deeper analytics.
- This turns CloudWatch into a **front door** for a broader analytics ecosystem.

**5. Automation with Alarms and Alerts**

- CloudWatch **alarms** watch metrics against thresholds and can:
  - Trigger scaling actions for **Auto Scaling Groups** (e.g., CPU utilization too high → add instances).
  - Fire actions on databases or other services, like starting data extraction or maintenance jobs.
- This enables **event-driven operations**: metrics → alarms → automated actions or notifications.

**6. “No-Effort” and Custom Monitoring**

- Many metrics are **available by default** with almost no setup, giving you baseline visibility.
- For **custom workloads**, you can use the **CloudWatch agent on EC2** to:
  - Collect additional metrics and **custom log files** from many instances.
  - Centralize them in CloudWatch for unified analysis and alerting.

---

# CloudWatch Demo

---

The video presents CloudWatch as a full operational hub for AWS: from raw metrics and logs to automated responses, tracing, and dashboards, all via the (new) console interface.

**1. Alarms: Metrics → Action (Elasticity & Health)**  
- Alarms watch metrics such as:
  - EC2 CPU, network, or Application Load Balancer/target group metrics (e.g., pending requests).
- They:
  - Trigger **scaling policies** (add/remove instances).
  - Provide a **state view** (OK/ALARM/INSUFFICIENT_DATA) for quick health checks.

**2. Logs & “Self-Defending” Infrastructure**

- **Log groups** are the main organizing unit.
- Operational controls:
  - **Retention settings** to avoid unbounded log growth.
  - **Subscription filters** to stream logs or trigger automation.
- Pattern with **CloudTrail logs**:
  - Detect events like **EC2 instance creation** via filters.
  - Invoke **Lambda** to enforce policy (e.g., terminate unauthorized instances).
  - This creates a form of **self-defending infrastructure**.

**3. CloudWatch Logs Insights: Querying at Scale**

- Used to run queries against logs, especially **VPC Flow Logs**.
- Example query:
  - Find top 20 source IPs with **rejected TCP connections** → spot brute-force or scanning behavior.
- These analytics can be automated:
  - Lambda calls **CloudWatch Logs Insights APIs**.
  - Based on results, apply mitigations:
    - Update **VPC/EC2 Network ACLs**.
    - Adjust **WAF rules** dynamically.

**4. Metrics, Dashboards, and Events (EventBridge)**

- **Metrics + Dashboards**:
  - Visualize performance across many services in one place.
  - Dashboards can be auto-refreshed, but refresh frequency has **cost implications**.
- **EventBridge** (evolving from CloudWatch Events):
  - Handles scheduled events (cron-like) and event routing.
  - Supports:
    - Cross-service integrations.
    - **Third-party** and **cross-account** event flows.
  - Used to wire CloudWatch insights into broader workflows.

**5. Tracing, Containers, and Synthetic Monitoring**

- **ServiceLens / AWS X-Ray**:
  - Distributed tracing across microservices.
  - Example: simple Python Flask app with X-Ray instrumentation to visualize request paths and latencies.
- **Container Insights**:
  - Observability for containerized workloads (e.g., ECS/EKS clusters).
- **Synthetics**:
  - Synthetic canaries that proactively hit URLs or endpoints.
  - Detect issues before real users are impacted.

**6. Cost Awareness & Right-Sizing Observability**

- The video cautions about **over-monitoring**:
  - Frequent dashboard refreshes and heavy use of advanced features can add cost.
- Recommendation:
  - Tune retention, refresh intervals, and query frequency.
  - Balance **actionable visibility** with **cost control**.

Overall, CloudWatch is framed as a layered observability and automation platform: collect (metrics/logs), analyze (Insights, tracing), decide (alarms, queries), and act (Lambda, EventBridge, ACL/WAF updates) to keep AWS workloads healthy, secure, and cost-efficient.

--- 

# RDS with Elasticache

--- 

### 1. From Traditional DBAs to Managed RDS

- Historically, DBAs handled:
  - Health checks, patching, backups, recovery
  - Security configuration
  - Log review and performance monitoring
- **Amazon RDS** is introduced as a managed service that:
  - Standardizes these tasks via the AWS console (instances, clusters, snapshots, events).
  - Integrates with **CloudWatch** for monitoring.
  - Offloads a large portion of routine operational work.

---

### 2. Creating and Configuring an RDS MySQL Instance

The video creates a **MySQL RDS instance** and explains key decisions:

- **Engine & Licensing**
  - Choose engine (e.g., MySQL) and licensing model:
    - Open-source engines vs commercial “Bring Your Own License” (BYOL).

- **Compute & Storage**
  - **Instance size**: CPU/RAM sizing and the need for **vertical scaling** in relational systems.
  - **Storage**:
    - SSD-backed volumes.
    - IOPS tradeoffs (performance vs cost).

- **Networking & Security**
  - VPC and subnet selection.
  - **Public access** vs private.
  - Security groups (e.g., allowing MySQL on port **3306**).

- **Reliability & Maintenance Settings**
  - **Backups**:
    - Automated backup retention (0–35 days).
    - Backup windows in UTC.
  - **Monitoring**:
    - Enhanced monitoring with finer-grain metrics.
    - Log export to **CloudWatch Logs**.
  - **Maintenance**:
    - Maintenance windows.
    - Automatic minor version upgrades.

These show how RDS bakes in operational best practices with tunable knobs.

---

### 3. High Availability and Scaling: Multi-AZ & Read Replicas

- **Multi-AZ (High Availability)**
  - Synchronous replication between **primary** and **standby** in the same region.
  - Used for **failover**, not for read scaling:
    - The standby does **not** serve reads.
  - Protects against instance / AZ failures.

- **Read Replicas (Scaling & Cross-Region Resilience)**
  - **Asynchronous** replication from primary to read replicas.
  - Good for **read scaling** and **cross-region** redundancy.
  - Involves replication lag (Δt); data is eventually consistent, not instant.
  - Example: creating a **cross-region read replica** in us-east-1 (N. Virginia):
    - Initial data transfer uses a **snapshot**, then ongoing replication.

---

### 4. Application Integration Workflow

The video then connects the database to actual applications:

- **SQL Client Access**
  - Connect to the RDS MySQL instance using standard SQL tools.
  - Load a dataset (~300,000 records) to simulate real workload.

- **Access from an EC2 Application**
  - EC2-hosted Python app using `mysql-connector` to:
    - Connect to RDS via its endpoint.
    - Run queries against the loaded dataset.

---

### 5. Offloading Load with ElastiCache (Redis) – Cache-Aside Pattern

To improve performance and reduce database load:

- **ElastiCache (Redis)** is introduced.
- Implements a **cache-aside** pattern:
  - App checks **Redis** first.
  - On cache miss:
    - Fetch from RDS.
    - Store result in Redis for future requests.
- Concepts covered:
  - **TTL** and **LRU** eviction to control cache size and staleness.
  - Serialization (e.g., using **pickle**) to store objects in Redis.

This shows how RDS + ElastiCache together improve scalability and response times.

---

### 6. Cross-Region Recovery and Promoting Replicas

- The primary RDS instance is **deleted** to simulate region-level impact.
- The previously created **cross-region read replica** is promoted to a **standalone database**.
- Key operational point:
  - The app must be prepared to **switch endpoints** (DNS/connection strings) to the new primary in the other region.
  - This is crucial for disaster recovery strategies.

---

### 7. Overall Architecture Goal

The video’s overarching message:

- Use **managed services**:
  - **RDS** for automated relational database operations (backups, patching, HA, monitoring).
  - **ElastiCache (Redis)** for performance and load reduction.
- Combine them to build:
  - **Resilient** (Multi-AZ, cross-region replicas).
  - **Scalable** (read replicas, cache).
  - **Operationally streamlined** architectures.
- Let teams focus on **application logic** instead of low-level database infrastructure and maintenance.

---

# Introduction to Serverless

---

The video explains serverless computing in AWS, focusing on Lambda functions, how they’re deployed, how they’re priced, and how they’re orchestrated with Step Functions.

**1. What “Serverless” Really Means**

- Teams **deploy code**, not servers or runtimes.
- The cloud provider (AWS) handles:
  - Infrastructure and OS
  - Execution environment/runtime
  - Elasticity/scaling behavior
  - Much of the operational overhead and versioning
- The practical focus is on **functions** as the main serverless unit.

**2. Functions vs Applications, and AWS Lambda**

- An **application** is made of multiple modules/classes.
- **Functions** are the smallest unit of work inside those modules.
- AWS’s serverless compute service is **AWS Lambda**.
- Clarification: the name “Lambda” is unrelated to:
  - Lambda architecture
  - Language-level lambda expressions

**3. Ways to Deploy Lambda Functions**

Lambda supports different workflows, from simple to fully automated:

- **In-console editing**
  - Write and edit simple functions directly in the AWS Console editor.
- **IDE-based development**
  - Develop in an IDE (e.g., Eclipse), then push code to Lambda.
- **Packaging with dependencies**
  - For functions needing third-party libraries:
    - Package code + dependencies (ZIP/container image).
    - Deploy via **CLI** or tooling, details differ by language.
- **CI/CD pipelines**
  - Mature setups use CI/CD to:
    - Build artifacts.
    - Package them properly.
    - Automatically deploy to Lambda as part of a pipeline.

**4. Pricing: Pay for Execution, Not Servers**

Because Lambda runs on ephemeral, provider-managed containers, traditional EC2-style pricing (per instance-hour) doesn’t fit. Instead, pricing is based on:

- **Execution time** (duration per invocation).
- **Allocated memory** during execution.
- **Number of invocations**.
- **Data processed** (stored/transferred where applicable).

At the time discussed, there may be:
- A **free tier** (e.g., first 1 million requests free).
- Beyond that, charges in **fine-grained increments** of time and requests.

**5. Composing Functions with AWS Step Functions**

- Lambda functions are small, discrete units; many real workflows span multiple steps.
- **AWS Step Functions** provide orchestration using **state machines**:
  - Chain multiple Lambdas and services into end-to-end workflows.
  - Support branching, retries, and long-running processes.
- Positioned as core tooling for:
  - **Distributed applications**
  - **Microservices architectures**

Overall, the video frames serverless (Lambda + Step Functions) as a shift from managing servers to managing **code and workflows**, with AWS handling infrastructure, scaling, and much of the operational complexity, and pricing aligned to actual function usage.

---

# Packing a Function & Dependencies

---

The video explains how to reliably *package* serverless functions (mainly for AWS Lambda) so that they have everything they need to run at invocation time, across different runtimes.

---

### 1. Why Packaging Matters for Serverless

- Lambda functions run inside **ephemeral, runtime-specific containers** created by AWS.
- These containers **do not install dependencies on the fly**.
- Therefore, your **deployment package** (usually a `.zip` or `.jar`) must be:
  - **Self-contained**: includes function code + all required libraries.
  - **Ready-to-run** the moment it is loaded into the container.

This makes packaging a reliability discipline: mistakes in packaging often surface as runtime failures.

---

### 2. Runtime Differences, Same Goal

- Packaging details differ by language/runtime (Python vs Java, etc.), but the **core objective is identical**:
  - Ensure the runtime has **all code and dependencies** available and readable.
- A key operational risk: **file permissions**.
  - Overly restrictive read permissions (e.g., only owner can read: `-r--------`) can cause failures when Lambda tries to load files.
  - You must ensure files are **globally readable** where needed.
  - AWS docs provide:
    - Required permission patterns.
    - Example commands (including recursive chmod).
    - Notes on platform differences (e.g., macOS specifics).

---

### 3. Python Packaging Scenarios

**Scenario A: Only Using Built-In AWS SDKs**

- If your function only uses AWS-managed SDKs (e.g., to talk to Kinesis, SES, DynamoDB) that the Lambda runtime already includes:
  - **No extra bundling** is required.
  - You can:
    - Write code directly in the Lambda console UI.
    - Deploy without additional packaging steps.
  - This is ideal for “pure cloud-native” functions with **zero external dependencies**.

**Scenario B: External Libraries or AWS CLI Usage**

- When you need third-party or OS-level tools (e.g., image processing libraries, AWS CLI usage):
  - You must create an **explicit deployment package**:

    1. Create a **project directory**.
    2. Put your `.py` files at the **root** of that directory.
    3. Use `pip` to install dependencies **into that same directory** (no virtualenv inside Lambda):
       - e.g., `pip install <lib> -t .`
    4. Ensure correct **file permissions** (globally readable as needed).
    5. **Zip the contents** (not the parent directory itself, depending on docs).
    6. Upload the `.zip`:
       - Directly through the Lambda console, or
       - Via S3 and point Lambda at the S3 object.

This guarantees that when Lambda mounts your code, all required Python modules are available.

---

### 4. Java Packaging Strategies

For Java, you have two main approaches:

- **Fat/uber JAR**:
  - Bundle application classes **and all dependencies** into a single large `.jar`.
  - Deploy that single jar as the Lambda artifact.

- **JAR + dependencies directory (ZIP)**:
  - Have a primary, small jar (e.g., “S3 interact” ~5.4 KB).
  - Package it together with a `/lib` or similar directory containing dependency jars.
  - Zip the main jar + dependency directory and deploy the resulting `.zip`.

Again, the runtime must see all required classes on its classpath at invocation time.

---

### 5. Language-Agnostic Rule

Across Python, Java, and other runtimes, the unifying principle is:

> **Deploy code and all dependencies together in a single deployment artifact that the Lambda runtime can execute immediately.**

- The format (`.zip`, `.jar`, fat jar, etc.) and build steps vary by language.
- Permissions and packaging layout must follow AWS documentation.
- But the goal never changes: **no missing libraries, no runtime downloads, no surprises at invocation.**

---

# Lambda Invocation types

---

The video explains how Lambda *invocation type* (synchronous vs asynchronous) shapes business process flow, responsiveness, and error handling—not just technical behavior.

---

### 1. Two Invocation Types: Synchronous vs Asynchronous

- **Synchronous invocation**
  - Caller **waits for the result**.
  - Used when the response is needed immediately to continue the workflow.
- **Asynchronous invocation**
  - Caller **fires and doesn’t wait** (fire-and-forget).
  - Lambda runs later; the caller doesn’t directly see success/failure.
  - Requires separate handling of **state** and **results** (e.g., via state machines or follow-up processes).

These semantics determine whether a business process is blocking or non-blocking and how you design error flows.

---

### 2. On-Demand Invocation (Caller Controls the Mode)

When you invoke Lambda **directly**, you can choose the invocation type:

1. **Application code → Lambda**
   - Example: a web app on **Elastic Beanstalk** offloads business logic to Lambda functions.
   - This supports:
     - Moving toward **microservices** and **cloud-native** designs.
     - A web tier that calls discrete functions for specific tasks.
   - The application decides:
     - **Synchronous**: must wait for Lambda’s result before responding to the user.
     - **Asynchronous**: can trigger work and continue; results are handled later.
       - Implies:
         - Tracking state elsewhere (e.g., a **state machine** via Step Functions).
         - Integrating results through an alternate process path.

2. **Manual invocation (e.g., AWS CLI)**
   - For testing or ad-hoc runs.
   - You explicitly choose sync or async behavior in the CLI/API.

---

### 3. Event-Driven Integrations (Mode is Predefined)

When other AWS services invoke Lambda as **event sources**, the invocation type is **fixed** by the service; you cannot override it.

Examples:

- **S3 events → Lambda**
  - Always **asynchronous**.
  - S3 does *not* wait to know if:
    - Lambda succeeded
    - Failed
    - Errored
    - Timed out

- **Cognito triggers → Lambda**
  - Always **synchronous**.
  - Authentication needs an immediate allow/deny decision, so Cognito waits for Lambda’s result.

- **Poll-based services (Kinesis, SQS)**
  - Treated as **synchronous** in behavior:
    - Lambda polls messages, processes them, and the poll/process loop **depends on** that work completing.
    - The processing result affects how the polling workflow continues (e.g., delete from queue, retry, etc.).

---

### 4. Why Invocation Semantics Matter

Choosing—and understanding—invocation type early is critical because it determines:

- Whether callers **block** or continue immediately.
- How and where you **track state** and **correlate results**.
- How you design **error handling**, retries, and compensating actions.
- The broader **business process structure**:
  - Inline request–response vs.
  - Event-driven, eventually consistent workflows.

In short, invocation type is a core design decision for Lambda-based systems, directly shaping end-to-end process behavior and architecture.

---

# Lambda Console Demo

---

The video is a hands-on walkthrough of creating and configuring a basic AWS Lambda function in the console (using Node.js), using it to teach core Lambda, IAM, and configuration concepts.

**1. Choosing a Runtime and Creation Path**

- Node.js/JavaScript is used because it supports **inline editing** in the console, making iteration fast.
- Contrast:
  - **Java** typically needs pre-built **JAR** artifacts uploaded.
  - **Node.js/Python** can be edited and tested directly in the UI, ideal for learning.
- Three console entry points:
  - **Author from scratch** (used in the demo).
  - **Blueprints** (predefined templates).
  - **Serverless Application Repository** (marketplace-like, partner/community apps).
- The demo builds a minimal **echo function**: returns the same input it receives.

**2. IAM Execution Role: Permissions to Run**

- Lambda runs on AWS-managed infra but still needs **explicit IAM permissions**.
- Without an execution role, the function **cannot run**.
- The demo:
  - Creates a reusable **“Lambda-multi role”** from a template that grants:
    - Basic privileges like **CloudWatch Logs** access.
  - Then extends this role in **IAM** with additional policies (e.g., `AmazonS3FullAccess`) so the function can:
    - Use the AWS SDK to access S3.
- Key idea: **execution role** = what the function is allowed to do in AWS.

**3. Console Layout: Designer vs Code**

- **Designer view**:
  - Shows **triggers** (event sources) and **target resources** the function interacts with.
  - Visual overview of integrations (e.g., S3 trigger, DynamoDB, etc.).
- **Code/config view**:
  - Shows the handler code and its configuration.
  - Explains the Node.js handler signature (`event`, `context`, `callback`) and how input/output flow works.

**4. Configuration Essentials**

- **Environment variables**:
  - Avoid hardcoding values (e.g., bucket names, table names).
  - Example use cases:
    - S3-triggered PDF-to-text workflow.
    - DynamoDB table configuration.
  - Can be encrypted with **KMS** for sensitive values.
- **Memory & CPU**:
  - Memory size is configurable; **CPU scales with memory**.
  - Tuning memory can improve performance, not just capacity.
- **Timeouts**:
  - Max: **5 minutes**; default: **3 seconds**.
  - Too-low timeouts cause functions to fail mid-work.
  - The video shows a **real timeout debugging example** to stress correct timeout configuration.

**5. Operational & Security Controls**

- **VPC integration**:
  - Option to run Lambda in a VPC for compliance / isolation and access to private resources.
- **Tracing with X-Ray**:
  - Can be enabled for distributed tracing and performance insight.
- **Concurrency controls**:
  - Default unreserved concurrency quota (e.g., **1000** concurrent executions).
  - Ability to set **limits** for specific functions (emergency throttling or isolation).
- **CloudTrail logging**:
  - Records who invoked/configured functions and when.
  - Supports audit, compliance, and forensic analysis.

Overall, the video uses a simple Node.js echo function to teach how to create a Lambda, assign and extend its IAM role, configure runtime and environment settings, and apply operational controls—foundational skills for building real serverless applications on AWS.

---

# DevOps on AWS

---

The video explains how AWS services can automate a consistent software delivery lifecycle: **write code, commit it, build it, and deploy it**.

- **CodeCommit** stores source code in a managed Git repository, supporting familiar workflows such as branches and local Git use.
- **CodeBuild** builds the code and creates deployable artifacts. Build steps vary by language, but the goal is the same.
- **CodeDeploy** deploys those artifacts to targets such as EC2 instances, Elastic Beanstalk, or Docker-based environments.
- **CodePipeline** orchestrates the stages so a code commit can automatically trigger a build and deployment.

Pipelines can support promotion from development to staging and production, with safeguards such as deploying only to instances selected by tags and adding manual approval gates. They can also connect to existing tools such as Jenkins.

Overall, the video presents these services as a way to make software delivery repeatable, automated, and controlled across environments.

---

# Operations Workflow Details

---
The video demonstrates an end-to-end AWS delivery workflow for a Java web application, showing how source code moves from a development environment through build and deployment to production.

- **Prepare the development environment:** Use a local machine or an EC2 instance as a cloud-based dev machine. Git connects to the repository over SSH. The example code is supplied as a tarball, which can be downloaded or copied to EC2.
- **Authorize repository access:** IAM roles and permissions allow the development environment to push code to the repository.
- **Build the application:** A build service pulls the source and runs it in an environment suited to the language and project. The build output is a deployable artifact, stored in S3.
- **Deploy to a target:** A deployment service retrieves the artifact and deploys it to EC2 instances, tagged groups of instances, or container platforms such as ECS or EKS. The target could also be behind a load balancer.
- **Manage deployment risk:** Blue-green deployments keep the current version intact while the new version is deployed, making rollback easier. In-place deployments update existing infrastructure and carry more risk.

The main takeaway is that a **Git push can trigger an automated, repeatable pipeline** from source code through build and deployment to production.

---

# Workflow steps

---

## Setup EC2 Dev Server

1. **Launch an EC2 development server** named `dev-server`, using a stable Ubuntu LTS image, a lightweight instance, and consistent VPC settings.
2. **Configure access** by allowing SSH (port 22) and Tomcat testing (port 8080) in its security group.
3. **Prepare the instance**: connect with SSH and a PEM key, update packages, and install the AWS CLI.
4. **Attach an IAM role** so the instance can access CodeCommit, CodeDeploy, CodePipeline, CloudWatch, and S3 without storing credentials on the server. In practice, grant only the permissions the workflow needs.
5. **Set up the workspace** by using `/opt` for the codebase and assigning ownership to the `ubuntu` user.

This prepares the EC2 instance to serve as a development environment for an AWS CI/CD workflow.

##  CodeCommit Repo, Opsroot User

1. Create a CodeCommit repository named `helloworld`.
2. Review optional services such as CodeGuru Reviewer and their costs before enabling them.
3. Avoid using the root account for repository access; create a dedicated IAM user instead.
4. Grant that user only the permissions needed—use least privilege rather than broad admin access.
5. Sign in as the IAM user and verify the repository’s access options are available.

## Setup SSH, GitClone

### Connect to CodeCommit over SSH

1. **Check that Git is installed**
```bash
git --version
```
If it isn’t installed, install Git using your operating system’s package manager.

2. **Generate an SSH key pair**
```bash
mkdir -p ~/.ssh
ssh-keygen -t rsa -b 2048 -f ~/.ssh/Codecommit_RSA
```
Set a passphrase when prompted. The public key is `~/.ssh/Codecommit_RSA.pub`; the private key is `~/.ssh/Codecommit_RSA`. Keep the private key secret.

3. **Register the public key with IAM**
```bash
cat ~/.ssh/Codecommit_RSA.pub
```
Copy the output and add it to the IAM user’s **Security credentials → SSH keys for AWS CodeCommit**. Note the SSH key ID AWS assigns; you’ll use it as the SSH username.

4. **Configure SSH**
   
Create or edit `~/.ssh/config` and add this entry, replacing the key ID with your own:
```sshconfig
Host git-codecommit.*.amazonaws.com
  User YOUR_SSH_KEY_ID
  IdentityFile ~/.ssh/Codecommit_RSA
```
Restrict access to the private key and config file:
```bash
chmod 600 ~/.ssh/Codecommit_RSA ~/.ssh/config
```

5. **Test the connection and clone the repository**
   
Replace the region with the one where your repository is hosted:
```bash
ssh git-codecommit.us-west-2.amazonaws.com
```
Accept the host prompt and enter your key passphrase. After successful authentication, clone the repository using its SSH URL from the CodeCommit console:
```bash
git clone <repository-SSH-URL>
```
An empty repository may produce a warning; that simply means it has no commits yet.


## Code Setup, GitPush

### 1. Prepare a temporary directory on the EC2 instance
```bash
sudo mkdir -p /opt/temp
sudo chown ubuntu:ubuntu /opt/temp
```
This provides an isolated staging area and lets the `ubuntu` user write to it.

### 2. Transfer the archive

**From your laptop**, replace the key file and EC2 public IP:
```bash
scp -i your.pem HelloWorld-CodeBase.tar.gz ubuntu@PUBLIC-IP:/opt/temp/
```

Alternatively, **on EC2**, download from a URL:
```bash
cd /opt/temp
wget 'FULL-ARCHIVE-URL'
```

### 3. Extract and copy the code on EC2
```bash
cd /opt/temp
tar -xzf HelloWorld-CodeBase.tar.gz
rm -rf /opt/temp/HelloWorld/.git
rsync -a /opt/temp/HelloWorld/ /opt/helloworld/
```
Check the extracted directory’s capitalization: Linux paths are case-sensitive. Remove the archive’s `.git` directory so its old repository history does not replace the target repository’s history. The trailing slash on `HelloWorld/` copies its contents into `/opt/helloworld/`.

### 4. Stage and commit the files
```bash
cd /opt/helloworld
git status
git add .
git status
git commit -m "First commit"
```
Review `git status` before committing to confirm the intended files are staged.

### 5. Push to the remote repository
```bash
git push origin master
```
This publishes the commit to the remote `master` branch. Use your team’s designated branch instead if it differs; the repository must already be configured as `origin`.



## CodeBuild Project Setup

CodeBuild creates a temporary Docker-based environment to fetch source, run commands defined in `buildspec.yml`, and produce artifacts such as JARs or WARs for later deployment. It supports multiple source providers and managed build images, while CloudWatch logs and events can provide visibility and trigger SNS notifications.

1. **Create an S3 artifact bucket** in the desired region. Optionally add a lifecycle rule to remove old build artifacts and control storage costs.
2. **Create a CodeBuild project** and select the source provider (for example, CodeCommit), repository, and branch. Use a production or staging branch if you don’t want every development branch to trigger builds.
3. **Choose the build environment** to match your project’s requirements—for example, an Ubuntu managed image with JDK 8. Pin an image version for predictable builds; use clone depth `1` to fetch only the latest commit.
4. **Set the service role and project options.** The IAM role must let CodeBuild access its source and upload artifacts to S3. Configure compute size, timeout, and any environment variables as needed.
5. **Configure build instructions and outputs.** Keep `buildspec.yml` in the repository root, unless the project specifies another location. Set the artifact destination to S3; choose “no artifacts” if the build publishes directly elsewhere, such as ECR.
6. **Enable CloudWatch Logs** to review build output. Optionally configure build notifications through CloudWatch Events/EventBridge and SNS, or use a build badge for public projects.
7. **Create and run the project**, then check the build logs and S3 bucket to verify that it completed and produced the expected artifact.

## Running the build manually

1. **Check the artifact bucket** so you can confirm afterward that the build created a new object.
2. In CodeBuild, open the project and choose **Start build**. Review the build settings, including the timeout and any optional environment variables, then confirm.
3. **Monitor the build** in the console: submission and queueing, environment setup, source/dependency downloads, pre-build commands, and build commands. Review logs there, or configure SNS notifications for updates.
4. After completion, check the build status and details, then verify the expected artifact (such as `HelloWorld.tar.gz`) is in S3.
5. Remember: starting a build this way is manual; commits won’t trigger builds automatically unless you configure a trigger or pipeline.



