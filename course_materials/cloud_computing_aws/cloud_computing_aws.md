
# Cloud Computing on aws - Introduction

---

- **Why AWS and the cloud?**  
  - AWS is used as the main lens because it’s the pioneer and current market leader in cloud computing.  
  - Most major ideas you learn via AWS also apply to other providers like Microsoft Azure and Google Cloud, even though names and interfaces differ.  
  - The goal is to understand *why* companies move to the cloud (scalability, flexibility, evolving with business growth), not just how to press buttons.

- **Concepts over interfaces:**  
  - Cloud provider consoles and UIs change often, but the underlying architectural concepts stay stable.  
  - The course emphasizes “big picture” understanding so you can reason about systems, not memorize screens.

- **Course plan / narrative:**  
  - You’ll briefly cover the history of Amazon and AWS, since their story is tightly linked to modern cloud computing.  
  - Then you follow a realistic scenario: an e‑commerce website currently running on:
    - a rented hosting machine, or  
    - a physical server in a company building.  
  - Step by step, you “move” this website into the cloud, configure it, and then iteratively improve the architecture using key AWS services.

- **Focus on Infrastructure as a Service (IaaS):**  
  - The main operating model used is **IaaS**—getting a virtual machine in the cloud—because it maps directly to the traditional idea of “a server” and makes migration easier to understand.  
  - **Platform as a Service (PaaS)** and **serverless** are mentioned as important alternatives but are intentionally left for later, after you grasp the IaaS foundation.

---

# History of AWS

---

AWS grew out of Amazon’s need to handle massive, highly variable traffic as it scaled from a 1994 online bookstore into a huge e-commerce platform. Peaks like Black Friday forced Amazon to build internal systems that could scale up and down quickly, not just grow steadily.

Around 2000, Amazon tried to productize its infrastructure via “merchant.com,” a platform other retailers (like Target) could use to sell online. This exposed that Amazon’s internal tech was a tightly coupled, undocumented “mishmash” that didn’t translate well into an external product. To fix this, Amazon invested heavily in decoupling systems, defining clean APIs, and improving documentation—turning its infrastructure into something that outside users could reliably consume.

By mid-2003, Amazon realized that building and operating highly scalable, flexible web infrastructure was a core competency they could offer as a standalone service. AWS is described as first launching in 2004, but its modern form is tied to a 2006 relaunch that included Elastic Compute Cloud (EC2), a foundational cloud-computing service initially aimed at existing Amazon clients. EC2 opened to public beta in 2007 and became generally available in late 2008, once Amazon was confident enough to attach formal SLAs. Early flagship services also included:

- S3 (Simple Storage Service) for object storage  
- SQS (Simple Queue Service) for messaging

The story concludes by placing AWS in the broader cloud market, where major competitors like Google, Microsoft (entering seriously around 2010), IBM, and Alibaba later emerged. Despite this competition, AWS held a leading market share—roughly 33–45% by the end of 2020, depending on how it’s measured—and generated about $35–$40 billion in revenue that year, establishing it as a massive, standalone technology business rather than just a side operation of Amazon’s retail arm.

---

# Moving to Cloud - Storage

---

- **Initial “garage” setup**  
  - One physical server does everything: web pages, customer data, payments, shipping.  
  - Founders spend huge effort on backups, upgrades, monitoring, and keeping a spare server, instead of improving the product.

- **First cloud step: move server to a VM (e.g., AWS EC2)**  
  - You replace the physical box with a virtual machine in the cloud.  
  - Provider handles hardware, power, physical security.  
  - You can quickly “resize” (e.g., 16GB → 64GB RAM) without buying new hardware.  
  - Benefits: less risk, more flexibility, likely lower cost, and better user experience during traffic spikes.

- **Recognizing one instance is not enough**  
  - A single VM is still a single point of failure.  
  - Doesn’t scale well for fast growth, global users, or advanced monitoring/security needs.

- **Critical shift: separate compute from storage & data**  
  - **Compute**: web/app servers stay on EC2 and become disposable and horizontally scalable.  
  - **Database**: moved off the app server to a dedicated DB server or managed service like **RDS** (pay per use, backups, snapshots).  
  - **Static assets** (images, etc.): moved to **S3** or similar object storage.  
  - Frequently changing business data remains in the database.

- **Resulting architecture & scaling**  
  - Multiple EC2 instances can be created/destroyed freely while sharing:  
    - A common database (e.g., RDS)  
    - Common storage for static assets (e.g., S3)  
  - Snapshots and managed storage make replication and disaster recovery easier.

- **Storage options overview**  
  - **Instance storage**: tied to a specific VM (ephemeral).  
  - **S3 (object storage)**: durable, scalable, ideal for static assets.  
  - **EFS (file system)**: shared file system for multiple instances.  
  - **EBS (block storage)**: virtual disks attached to EC2 instances.  
  - Choosing the right mix of these lets the platform evolve and scale smoothly over time.

---

# Moving to Cloud - Security and Scaling

---

- **Why evolve the architecture?**  
  Three core drivers: **security**, **scalability**, and **performance** as the business and traffic grow.

- **Protecting sensitive data with a VPC**  
  - The public web server must be reachable over the internet, but the **database holds sensitive data** (orders, sales, customer details, credit cards).  
  - Exposing the DB with a **public IP** is risky.  
  - Solution: put the DB (and other sensitive components) in a **Virtual Private Cloud (VPC)** using **private IPs**.  
  - Access to these private resources is only from inside the data center / over **VPN**, not directly from the internet.  
  - Users can hit the **web/compute layer**, but **cannot reach the data layer directly**.

- **Offloading and scaling storage & databases**  
  - As load grows, a single EC2 instance becomes slow → bad user experience.  
  - Use **managed database services** so AWS handles scaling and operations.  
  - Use **Amazon S3** for storage: effectively **elastic and pay‑as‑you‑go** (you pay for 2 TB if you use 2 TB, 10 TB if you use 10 TB, no upfront over‑provisioning).

- **Scaling compute with multiple instances and ELB**  
  - To handle more traffic, add **more EC2 instances**.  
  - Introduce an **Elastic Load Balancer (ELB)** to distribute traffic across instances.  
  - Only the **load balancer** is public; EC2 instances sit in the **private subnets inside the VPC**, improving security.

- **Resilience using Availability Zones (AZs)**  
  - Place instances in **multiple AZs** so if one zone is hit by a fire, earthquake, or outage, others keep the site running.  
  - Result: better **high availability**; at worst, degraded performance instead of full downtime.

- **Auto Scaling to match demand and cost**  
  - Define rules, e.g.:  
    - “If CPU > 80% for 5 minutes, add an instance.”  
  - Use **scheduled scaling** for known peaks (e.g., **Diwali**, **Black Friday**), so capacity is ready in advance.  
  - This balances **performance** with **cost optimization**.

- **Global reach and performance: Route 53 + CloudFront**  
  - **Route 53** provides global **DNS** routing so users across regions can reach your app efficiently.  
  - **CloudFront** (CDN) caches content closer to users to reduce latency.

- **Learning path (compute → managed → serverless)**  
  - Start with **compute, storage, networking basics** (EC2, S3, VPC).  
  - Move into **managed services** (managed databases, load balancers).  
  - Eventually progress to **serverless** architectures for even less operational overhead.

---

# AWS Global infrastructure (Regions and Zones)

AWS Global Infrastructure is organized so your applications can be fast, resilient, and placed where they’re needed, using three main building blocks: Regions, Availability Zones, and specialized Zones.

- **Regions**
  - A Region is a broad geographic area (like a country or state) containing multiple data centers.
  - Regions are **isolated from each other** so that an issue in one Region doesn’t automatically impact others.
  - Choosing a Region is both a **geography** decision (where your users/data are) and a **resilience** decision (how you design for disaster recovery).

- **Availability Zones (AZs)**
  - An AZ is one or more **discrete data centers** within a Region.
  - Each AZ has **redundant power, networking, and connectivity**.
  - Data centers are built on **low‑risk land**, with strong **physical security** (fences, guards, cameras), and robust **support systems** (backup power, cooling, fire protection) before servers and storage are installed.
  - Multiple AZs in a Region are connected by **high‑bandwidth, low‑latency, fully redundant fiber**, with **encrypted traffic** between them.
  - This connectivity supports **synchronous replication** and lets you spread applications across AZs for **high availability and fault isolation**.
  - AZs are physically separated (often ~60 miles / 100 km) to reduce shared risk from events like power grid failures or natural disasters.

- **Specialized Zone Types**
  - **Local Zones**: Place selected AWS services closer to specific cities or industrial hubs, giving **single‑digit millisecond latency** to end users or on‑premises systems.
  - **Wavelength Zones**: Embed AWS compute and storage **inside 5G networks**, enabling **ultra‑low‑latency mobile edge** applications.

---

# Understanding the real cloud 

--- 

- **Availability zones as the playground**  
  - You deploy apps and databases inside availability zones by combining compute, storage, networking, security, monitoring, etc.  
  - The service catalog in a zone constantly changes: new services and features are added, some are retired, all driven by customer needs and provider roadmaps.

- **Technology stack as layers (the “burger” analogy)**  
  - A stack is made of layered components, each doing its part to host and operate applications.  
  - You pick and combine different cloud services to build these layers.

- **The “real cloud” = APIs**  
  - The core of cloud is the API layer providers build.  
  - These APIs expose all the services needed to manage data-center-like capabilities programmatically.  
  - The focus isn’t on whether APIs are “nice,” but that they give you the capabilities to build and run infrastructure.

- **Different ways to consume the APIs (not just coding)**  
  - **Web Management Console**  
    - Easiest to start with; very convenient UI.  
    - UI changes a lot over time, but core workflows remain, like in ecommerce sites → you should focus on *what you’re trying to do* rather than exact screen layouts.
  - **SDKs**  
    - Libraries in many languages.  
    - More stable than the console.  
    - Best for automation and embedding cloud operations into your own apps or workflows (e.g., granting access that auto-expires in 8 hours).
  - **CLI (Command Line Interface)**  
    - Good for scripting, automation, monitoring, and operations.  
    - Commands are stable, so scripts can keep running for years, giving high ROI.
  - **Third-party tools**  
    - Many tools exist, but under the hood they usually call the same SDKs/CLIs/APIs.

- **Console evolution and stable anchors**  
  - AWS console examples (2012–2018) show huge growth in services and multiple UI redesigns.  
  - Core services (like EC2) persist even while the look and feel change.  
  - You should rely on stable console anchors:  
    - Global search  
    - Services menu  
    - Region selector (including compliance-driven choices, like keeping data in US regions for HIPAA).

Overall, the lesson reframes cloud as a fast-evolving API-powered platform, where you assemble layered stacks using services accessed through consoles, SDKs, CLIs, or tools—focusing on stable workflows and capabilities rather than specific UI details.

---

# EC2 - Core Features

---

1. **Virtual machines & placement**
   - “Virtual machine,” “virtual server,” and “instance” are used interchangeably.
   - Placement matters: you choose a **region** and **availability zone (AZ)**, and then AWS launches your instance in a specific AZ.
   - Region choice is critical for **regulatory compliance** (e.g., health care data must stay in certain geographic locations).

2. **Tags**
   - **Tags = key–value labels** on instances (e.g., `stack=production`, `owner=DbAdmin`).
   - Used for **organization, ownership, environment tracking**, and **filtering** in the console when you have many instances.

3. **Instance types**
   - Instance type = the **hardware profile** (vCPU, memory, storage, networking).
   - Grouped into families:
     - **General purpose**
     - **Compute optimized**
     - **Memory optimized**
     - **Storage optimized**
   - There are **current** and **previous generation** instances; older ones remain available for a long time to support gradual migration.

4. **AMI (Amazon Machine Image) / Operating system**
   - You pick an **AMI** to define the OS and base software for the instance.
   - Can be:
     - Standard Linux/Windows images
     - AWS or third‑party AMIs from the **Marketplace**
   - Key to **lift‑and‑shift**: you can create an AMI from an on‑prem server and launch that same image in AWS with minimal changes.

5. **Storage – EBS volumes**
   - EC2 storage is typically **EBS volumes**, which behave like **disks attached to a laptop/server**.
   - Best practice: use **multiple volumes** (e.g., separate volume for database data vs. OS) for performance, backup, and management flexibility.

6. **Networking – VPC, subnets, ENIs**
   - Instances run inside a **VPC** (your private virtual network in AWS).
   - **Subnets** live inside a VPC and each subnet maps to a **single AZ**.
   - Each instance gets an **Elastic Network Interface (ENI)**:
     - Has a **primary ENI** that cannot be removed.
     - You can attach **multiple ENIs** for scenarios like traffic isolation, multi‑homed network setups, or distributed databases.

7. **Security – security groups & key pairs**
   - **Security groups** are **stateful virtual firewalls**:
     - Rules specify **protocol, port, and source** (e.g., allow SSH from your office IP only).
   - **Key pairs**:
     - Used for **SSH authentication** (PEM file for Linux) instead of passwords.
     - Private key is **downloaded once**; AWS only keeps the public key.

---
# Elastic Load Balancers

----

Elastic Load Balancers (ELB) sit in front of your application servers and intelligently distribute incoming traffic so no single backend instance is overwhelmed, improving both availability and scalability.

Key points from the video:

- **Core purpose & analogy**
  - A load balancer distributes user requests across multiple backend servers (“targets”) so traffic isn’t skewed to just a few.
  - Like a restaurant host seating guests evenly so some tables aren’t overloaded while others sit empty.

- **Traffic, targets, and flexibility**
  - “Traffic” = requests from browsers/devices; “targets” = typically a fleet of servers (e.g., EC2 instances), not just one.
  - It uses algorithms to decide which server handles each connection and keeps a registry of eligible targets.
  - You can add/remove backend servers over time, allowing dynamic scaling.

- **Scalability and high availability**
  - The load balancer itself must scale with varying request rates and must not become a single point of failure.
  - AWS ELB:
    - Distributes traffic to targets (e.g., EC2) across multiple Availability Zones.
    - Uses **health checks** so only healthy instances receive traffic.
    - Is implemented in a distributed, multi-AZ way to improve resilience.

- **Internal vs internet-facing**
  - **Internet-facing ELB**: entry point for external clients (users on the internet).
  - **Internal ELB**: used for service-to-service communication inside your VPC, keeping internal APIs highly available without public exposure.

- **Deployment strategies**
  - ELBs can support **canary deployments** by sending only a portion of traffic to a new version of a service, enabling gradual rollouts and safer releases.

- **Security features**
  - Can inspect traffic at the packet/connection level to block malicious TCP traffic before it reaches your apps.
  - Can integrate with identity providers and handle OAuth-based authentication at the load balancer layer, offloading auth from your application code.

- **Service family**
  - “Elastic Load Balancer” is an umbrella term for multiple AWS load balancing services, each tailored to different use cases, and AWS continues to evolve these offerings over time.
  - Application LB, Network LB, Gateway LB


---

# Application Load Balancers

---

Application Load Balancer (ALB) is a Layer 7 (HTTP/HTTPS) load balancer in AWS designed to route web traffic intelligently using application-level data, while maintaining high availability.

Core ideas:

- **Layer 7 / HTTP-aware**
  - Operates at the application layer (HTTP/HTTPS), so it understands URLs, headers, methods, cookies, etc.
  - This lets it make smarter routing decisions than a simple TCP load balancer.

- **Listener, rules, and target groups**
  - A **listener** (e.g., port 80/443) receives incoming requests.
  - **Rules** evaluate parts of the request (path, host, headers, etc.).
  - Based on rules, ALB forwards traffic to different **target groups** (collections of EC2 instances, IPs, Lambda, containers).

- **Advanced routing**
  - **Path-based routing** (e.g., `/api/*` → API service, `/images/*` → image service).
  - **Host-based routing** (e.g., `api.example.com` vs `app.example.com`).
  - Supports microservices and monolith-splitting by directing different request types to different backends.

- **Integration with containers & microservices**
  - Works tightly with ECS / EKS:
    - Can target **IP addresses and ports**, enabling dynamic port mapping.
    - Multiple tasks/containers on one instance can register as separate targets.
  - Ideal for service-oriented backends where services scale independently.

- **Health checks & high availability**
  - Health checks use HTTP responses (e.g., `200`/`204` = healthy, `500` = unhealthy).
  - Unhealthy instances are removed from rotation, protecting users from bad responses.
  - Health endpoints can implement **back pressure**: when overloaded, an instance can temporarily report “unhealthy” to shed load, then return to “healthy” once it recovers.
  - Each target group has its own health checks (e.g., `/health` endpoint).
  - Only healthy targets receive requests; unhealthy ones are automatically avoided.
  - Like other ELBs, it’s deployed across multiple AZs for resilience.

- **Security and TLS termination**
  - Can **terminate SSL/TLS** at the load balancer, offloading certificate management from your app servers.
  - Integrates with **Security Groups**, AWS WAF, and IAM/ACM for certificates.
  - Supports features like **redirects** (HTTP→HTTPS) and fixed-response rules.

- **Authentication & offloading features**
  - ALB can handle **OAuth-style login flows** (e.g., “Sign in with Google”) directly.
  - This offloads user authentication from application code, reducing boilerplate and letting developers focus on business logic.
  - Can integrate with identity providers (Cognito, OIDC, etc.) to handle **user authentication** at the edge.
  - This offloads auth logic from your applications and centralizes it at the ALB.

- **Observability**
  - Emits **CloudWatch metrics**, **access logs**, and supports **request tracing headers**, which is useful for debugging microservices.

- **Cross-zone load balancing**
  - Helps even out load across all instances in all AZs, not just per-AZ.
  - Also helps keep serving traffic when instances in one AZ fail.
  - But it does **not** remove the impact of a full AZ outage—capacity still needs to be balanced across zones.

---

# System Architecture - Reverse Proxy vs Api Gateway vs Application Load Balancers 
---

**Reference** - https://www.youtube.com/watch?v=-R5ak7-LiVY

## System Architecture Overview
In modern backend system design, reverse proxies, load balancers, and API gateways form a progressive spectrum of edge management components. While these tools sit between clients and backend applications, they address distinct challenges related to CPU offloading, horizontal scaling, and microservice governance.

## Core Infrastructure Components
- **Reverse Proxy:** Acts as an edge buffer on behalf of backend servers. Its primary responsibility is handling resource-heavy network edge tasks before traffic reaches the core application logic.

  - SSL/TLS Termination: Offloads CPU-intensive cryptographic handshakes and validation from backend servers.

  - Caching & Compression: Serves static or repeated responses directly from memory and applies algorithms like Gzip or Brotli to diminish bandwidth usage.

  - Edge Security: Hides internal server IP addresses, mitigating direct exposure to scans, probes, or malicious traffic.

- **Load Balancer:** Extends reverse proxy capabilities by adding intelligent traffic distribution and state monitoring across server pools.

  - Traffic Distribution: Routes requests across multiple instances using algorithms like Round-Robin, Least Connections, or Weighted Distribution to optimize capacity utilization.

  - High Availability: Uses active health-check pings to identify failing or unresponsive instances, automatically removing them from the pool without interrupting user connections.

  - OSI Layer Routing: Operates at either Layer 4 (TCP/UDP transport level for ultra-high throughput without payload inspection) or Layer 7 (HTTP/HTTPS application level for content-aware routing).

- **API Gateway:** Sits at the highest level of abstraction, acting as a centralized policy enforcement layer designed for microservice architectures.

  - Centralized Governance: Handles cross-cutting concerns like JWT validation, API key authentication, and permission checks in one location rather than duplicating logic across every service.

  - Traffic Management: Enforces rate-limiting quotas, request throttling, and billing tier restrictions at the platform perimeter.

  - Service Abstraction: Manages API versioning, request/response transformations (e.g., JSON to XML), and telemetry logging across multiple teams.

## Layer 4 vs. Layer 7 Balancing
- **Layer 4 (Transport Level):** Focuses strictly on IP addresses, TCP/UDP connections, and ports. Because it avoids inspecting HTTP payloads, it offers maximum speed, sub-millisecond latency, and ultra-high throughput.

- **Layer 7 (Application Level):** Inspects the HTTP payload, headers, cookies, and URL paths. It enables intelligent content-based routing (e.g., directing /users and /payments to different backend clusters) at the cost of slight parsing overhead.

## Layered Production Pattern
Rather than choosing a single technology, enterprise production systems layer these components sequentially:

  - CDN: Globally distributed edge reverse proxies cache static assets and terminate TLS closest to the user.

  - API Gateway: Enforces perimeter policies, authenticates users, and validates rate limits.

  - Load Balancers: Distribute sanitized requests across internal server clusters dedicated to specific microservices.

  - Internal Proxies: Sidecars (e.g., Envoy or NGINX) manage internal service-to-service communications and intra-mesh security.

## Selection Criteria
- Choose a Reverse Proxy when running a monolith that requires basic edge optimizations (SSL termination, static caching, IP masking).

- Add a Load Balancer when horizontally scaling across multiple servers to ensure high availability and load distribution.

- Adopt an API Gateway when managing complex microservices, external APIs, or multi-tenant systems requiring centralized security and policy enforcement.
---


