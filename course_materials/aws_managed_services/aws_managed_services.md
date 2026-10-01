
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
