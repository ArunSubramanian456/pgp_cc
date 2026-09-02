
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

### Network, Gateway Load Balancer

---

Network Load Balancer (NLB) and Gateway Load Balancer (GWLB) are Elastic Load Balancing services focused on **network-layer** traffic, prioritizing performance and packet inspection over application-aware routing.

**Network Load Balancer (NLB)**

- **Layer & protocols**
  - Operates at **Layer 4 (Transport)** of the OSI model.
  - Handles **TCP and UDP**, making it suitable for games, voice calls, and other latency‑sensitive or high‑throughput workloads.

- **Core structure (similar to ALB)**
  - Uses **listeners** on configurable ports.
  - Routes to **target groups** that typically contain EC2 instances.
  - Same basic building blocks as ALB, but different behavior and capabilities.

- **Connection behavior & performance**
  - Once a client connection is established to a target EC2 instance, that **same instance is used for the life of the connection**.
  - Only when the connection closes/drops and a new one is made might traffic go to a different instance.
  - This avoids per‑request re‑selection and round‑robin overhead, boosting performance.
  - Recommended for very high throughput scenarios, e.g. **around 1M requests per second**.

- **Target selection**
  - Uses a **Flow Hash** algorithm (e.g., combining source IP, destination IP, ports) to decide which instance gets the connection.
  - This keeps flows stable and efficient.

- **What it does *not* do**
  - No **path-based routing** or host-based routing.
  - No built‑in **authentication flows**.
  - It’s not “application aware”; it’s meant for **raw transport-level load balancing**.

---

**Gateway Load Balancer (GWLB)**

- **Purpose & pattern**
  - Designed for **inline traffic inspection** using the “**bump in the wire**” model.
  - Intercepts packets, sends them to security appliances, drops malicious traffic, and passes clean traffic onward.

- **Traffic flow**
  1. Traffic is intercepted via a **Gateway Load Balancer endpoint** (an ENI).
  2. Packets are forwarded to **security appliances** (vendor or open-source: firewalls, IDS/IPS, etc.).
  3. Malicious traffic can be terminated; approved packets are re‑injected into the path and delivered to the application server.
  4. Responses typically go back **without re-inspection**, for efficiency.

- **Use case**
  - Ideal for centralizing and scaling **network security** functions without changing application code or network topology much.

---

**Choosing between them**

- Use **ALB** when you need **HTTP-aware, path/host-based routing, and auth**.
- Use **NLB** when you need **TCP/UDP, extreme performance, or low latency**.
- Use **GWLB** when you need **inline security inspection** with third‑party or custom appliances.

This ties into your current load balancer module as the “network-focused” side of the ELB family, complementing ALB’s application-layer capabilities.

---

### Open Systems Interface (OSI) Mental Model

---
The OSI model is a 7-layer framework for how data moves across networks—from an app on one device to an app on another. It’s a **mental model**, not a product, but it helps you reason about where things happen (e.g., where ALB works, where TCP works, where encryption lives).

---

## The 7 Layers, with clean examples

### 7. Application Layer – “What the user actually uses”
- **What it is:** The interface between the network and user applications.
- **Think:** “What does the user think they’re doing?”
- **Examples:**
  - Using a web browser to open `https://example.com`
  - Sending an email via Gmail
  - Making an HTTP GET request in your code
- **Protocols:** HTTP, HTTPS, SMTP, FTP, DNS, WebSocket
- **Intuition:** When you type a URL and hit Enter, you’re interacting at Layer 7. Application logic lives here.

---

### 6. Presentation Layer – “Translator & formatter”
- **What it is:** Transforms data so applications can understand it; handles formats and encryption.
- **Think:** “Make it readable or secure.”
- **Examples:**
  - Converting data into JSON, XML, or HTML for an API response
  - Encrypting/decrypting data with TLS/SSL
  - Character encoding like UTF‑8 vs ASCII
- **Protocols/Tech:** TLS/SSL, data serialization (JSON, XML), compression (gzip)
- **Intuition:** Like a translator plus a security guard: it makes sure both sides speak the same “format” and that data may be encrypted.

*(In practice, layers 5–7 blur together in modern systems.)*

---

### 5. Session Layer – “Manage conversations”
- **What it is:** Manages sessions—long-lived logical conversations between two endpoints.
- **Think:** “Which conversation is this part of?”
- **Examples:**
  - Your web app knowing you’re “logged in” via a session cookie
  - A remote desktop session that can pause and resume
  - A video conference call that stays established while you talk
- **Protocols/Concepts:** Session tokens, cookies, some aspects of RPC frameworks
- **Intuition:** Like a meeting organizer: starts, tracks, and ends conversations so both sides know which data belongs to which “session.”

---

### 4. Transport Layer – “Reliable delivery between two endpoints”
- **What it is:** End‑to‑end data delivery between two hosts, including reliability and ordering.
- **Think:** “Slice data into segments, ensure they all arrive, in order.”
- **Examples:**
  - TCP ensuring packets are retried if lost and reassembled correctly
  - UDP sending video packets for a live stream without worrying about perfect reliability
- **Protocols:** TCP, UDP
- **Intuition:** Like a courier service:
  - **TCP:** Registered mail—tracks every letter, resends if lost, ensures order.
  - **UDP:** Postcards—fast and simple, may be lost, no tracking, but good enough for streaming.

---

### 3. Network Layer – “Find the path between networks”
- **What it is:** Routing packets from one network to another using logical addresses.
- **Think:** “Given these two IPs, how do we get from here to there?”
- **Examples:**
  - Your laptop (192.168.1.10) sending a packet to a server (54.23.x.x) on the internet
  - Routers deciding which next hop to send packets to
- **Protocols:** IP (IPv4, IPv6), ICMP (ping), routing protocols (BGP, OSPF)
- **Intuition:** Like a GPS/road system: IP address = destination address; routers = intersections that choose the next road.

---

### 2. Data Link Layer – “Communication on the same local network”
- **What it is:** Moves frames between devices on the same physical network (same switch or Wi‑Fi).
- **Think:** “Send data to that device on this LAN.”
- **Examples:**
  - Your laptop talking to your Wi‑Fi router using Wi‑Fi frames
  - A switch forwarding Ethernet frames based on MAC addresses
- **Protocols/Tech:** Ethernet, Wi‑Fi (802.11), ARP
- **Intuition:** Like apartment delivery:
  - IP is the street address (Layer 3),
  - MAC address is the **apartment number** (Layer 2) used inside the building (LAN).

---

### 1. Physical Layer – “Raw bits over a medium”
- **What it is:** The actual physical transmission of bits (0s and 1s).
- **Think:** “Electric signal / radio wave / light on fiber.”
- **Examples:**
  - Electrical pulses on an Ethernet cable
  - Radio waves from your Wi‑Fi antenna
  - Light pulses in a fiber‑optic cable
- **Tech:** Cables, NICs, fiber, Wi‑Fi radios, voltage levels
- **Intuition:** Like the physical road or wires themselves that carry the cars/letters.

---

## One concrete end‑to‑end story

Imagine you open `https://shop.example.com/orders` in your browser:

1. **Application (7)**: Browser forms an HTTPS request: `GET /orders HTTP/1.1` with cookies, headers.
2. **Presentation (6)**: Request is encoded in HTTP text, then encrypted using TLS.
3. **Session (5)**: Your login session is represented with a cookie; the connection may be kept alive across multiple requests.
4. **Transport (4)**: TCP splits the encrypted data into segments, ensures reliable, ordered delivery to the server’s IP: `203.0.113.10:443`.
5. **Network (3)**: IP routes packets across the internet from your public IP to `203.0.113.10` via multiple routers.
6. **Data Link (2)**: On each link (your Wi‑Fi to router, router to ISP switch, etc.), Ethernet/Wi‑Fi frames move the packets hop by hop using MAC addresses.
7. **Physical (1)**: Actual signals go over Wi‑Fi radio, copper, and fiber.

On the server side, all of this unwinds in reverse, and at Layer 7 your web app finally sees: “User requested `/orders` with this cookie.”

---

# Feature and Cost Analysis

---

TThe feature and cost analysis video walks through how **target groups** and **load balancers** are configured and what that means for behavior and pricing, so you can choose and tune ELB services properly.

---

## 1. Target Group Features

**a. Target type (what can receive traffic)**  
When you create a target group, you pick a **target type**:

- **EC2** – the common case; each instance is a target.
- **Lambda** – for serverless backends.
- **Load Balancer** – to **chain** load balancers (e.g., NLB in front → ALB behind).
- **IP** – for hybrid setups, routing to on-prem / other clouds where AWS can’t manage the instances directly.

Constraints and basics:

- Target groups are **scoped to a single VPC**; they can’t span VPCs.
- You must choose **protocol + port** that match how the application actually listens.

---

**b. Health checks (protecting user experience)**  
Health checks decide which targets are considered healthy:

- Configure:
  - Protocol: **HTTP / HTTPS**
  - Path: e.g. `/health`
  - Interval & timeout
  - Healthy / unhealthy thresholds
  - Success codes (single or ranges, e.g. `200–299`)

Why tuning matters:

- **Too lenient** → unhealthy instances stay “healthy” and keep serving bad responses.
- **Too strict** → healthy instances flap in/out, causing instability.

---

**c. Registration, tags, and operational attributes**

- **Registering targets**:
  - At creation or later.
  - Manually or via automation (e.g., autoscaling).
- **Tags**:
  - Ownership, environment (dev/prod), cost reporting.

Key target-group attributes:

- **Deregistration delay (draining)**  
  - How long to keep existing connections alive after a target is removed, so in‑flight requests finish gracefully.
- **Slow start duration**  
  - Gradually ramps traffic to new targets so they can warm up (caches, JIT, etc.).
- **Load balancing algorithm**  
  - Examples: **round-robin**, **least outstanding requests** – control how requests are distributed.
- **Stickiness**  
  - Important for stateful / legacy apps that rely on session affinity.
  - Implemented via:
    - Application cookies, or
    - Load balancer–generated cookies.
  - Timeouts should roughly match session duration.

---

## 2. Load Balancer Features

**a. Core LB setup & integrations**

- **Naming & tagging** for management and cost allocation.
- **Authentication integration**:
  - Offload OAuth / OIDC flows (e.g., “Sign in with Google”) to the load balancer.
  - Integrate with AWS security services and identity providers.
- **Caching/CDN integration**:
  - Integrate with caching layers (e.g., CloudFront) to reduce global latency.

---

**b. Networking & availability**

- **Multi–Availability Zone deployment**:
  - Nodes placed across AZs with **ENIs** in subnets.
- **Attributes**:
  - **Cross-zone load balancing** – spread traffic across all healthy targets in all AZs.
  - **Desync mitigation** – controls how strictly the LB handles malformed HTTP (trade-off between RFC strictness, security, and availability).

Security & correctness:

- **Rule-based routing**:
  - Ordered conditions and actions.
  - Depends on correct **listener ports** and **security group** rules.
- Supports:
  - **Weighted traffic splits** (e.g., 90/10) between target groups.
  - **Target-group stickiness** and progressive delivery (e.g., canary deployments).

---

## 3. Cost Model (how you pay)

Two big components:

1. **Fixed hourly fee**  
   - Per load balancer (ALB/NLB/GWLB hour) just to have it running.

2. **Usage-based (LCU-style) charges**  
   - Billed on the **maximum** of four metrics:
     - **Rule evaluations**
     - **New connections**
     - **Active connections**
     - **Processed bytes**

Implications:

- Complex rule sets and heavy traffic can increase **rule evaluations**.
- Spiky connection patterns can push **new connections** high.
- Streaming / long-lived connections increase **active connections**.
- High data volume raises **processed bytes**.

Monitoring these metrics is essential for:

- Understanding which dimension is driving cost.
- Estimating expenses under variable workloads.
- Deciding if you should optimize rules, connection reuse, or data transfer.

---

In summary:  
- **Target group features** control *what* you send traffic to and how safely (health checks, draining, stickiness).  
- **Load balancer features** control *how* traffic is routed, secured, and made highly available.  
- **Cost** is driven by the LB type you choose plus how intensively you use rules, connections, and bandwidth.

---

# Differences between EC2 Session Affinity and Target Group Stickiness

## Scope of Routing:
- **Session Affinity (Target Stickiness)**: Keeps a user locked to a single EC2 instance, container, or IP address inside a specific target group.
- **Target Group Stickiness**: Keeps a user locked to one specific pool/group of targets (e.g., sticking to Target Group A instead of shifting to Target Group B during a weighted rollout).

## Layer/Mechanism:
- **Session Affinity**: Can use application cookies, load-balancer generated cookies (ALB), or source IP routing (NLB) to find the exact compute resource.
- **Target Group Stickiness**: Managed at the load balancer listener/routing rule level using stickiness configurations across weighted target groups.

## Primary Use Case:
- **Session Affinity**: Preserving local server-side states like shopping carts or in-memory user sessions when apps are not fully stateless.
- **Target Group Stickiness**: Managing canary or blue/green deployments so a user doesn't bounce between different versions of an application mid-session

---

# Use cases [101-104]

---
The “use cases” video shows how you can use **Application Load Balancers and target groups as a control plane for gradual cloud adoption and modernization**, rather than doing a big-bang rewrite.

### 1. Simple lift-and-shift to the cloud
- Start with an existing on‑prem app you don’t want to rewrite.
- Deploy it to a couple of EC2 instances and put an **ALB in front**:
  - Port 80 listener → default rule → **single target group** with those 2 instances.
  - Minimal code change: add a **health check endpoint**.
- Result: you get a first “cloud foothold” plus easier deployment, scaling, and management, without redesigning the app.

### 2. Incremental modernization with path-based routing
- Keep the old app running, but build a **new “order service”** as a separate service:
  - New target group for `order-service`.
  - **Path-based routing**: `ALB` routes `/order/*` to the new target group, everything else to the legacy app.
- The legacy app stays mostly untouched, while specific capabilities are replaced and tested in isolation.

### 3. Canary releases with ALB
- Instead of blue‑green’s all‑at‑once cutover, **Canary Release** sends only a slice of traffic to the new version first:
  - Example: for `/order/*`, send **90%** of traffic to the old version’s target group, **10%** to the new version’s target group.
- Benefits:
  - Test new version under **real production load**.
  - Slowly ramp traffic up while watching **EC2 + ALB metrics**.
  - Can **roll back quickly** if issues appear.
- Constraints / downsides:
  - Requires **backward compatibility**, especially in DB schema and contracts.
  - You run and manage **multiple versions** at once.
  - Longer test window and **higher infra cost** during overlap.

### 4. Moving from stateful monolith to more cloud-native
- Many legacy apps depend on **in‑memory session state** (e.g., shopping carts) → need stickiness.
- Modernization step:
  - Move session data into a **central cache** (e.g., Redis/Elasticache) so app instances become more **stateless**.
  - This reduces or removes the need for strict session stickiness and makes scaling & deployments easier.

### 5. Internal services and hybrid patterns
- **Internal-only services**:
  - Put backend services behind an **internal (private) load balancer**, accessible only within the VPC.
- **Hybrid integration**:
  - Register **on‑prem IPs** as targets in a target group.
  - Use VPN/Direct Connect to integrate, e.g., a dispatch system still running in the data center.
  - ALB/NLB then route traffic to those on‑prem IP targets as if they were just more backend servers.

### 6. Overall pattern: Strangler Pattern via load balancing
- The video ties all these together as **“baby steps” modernization**:
  - Start with lift‑and‑shift.
  - Introduce new services behind new target groups.
  - Use **routing rules and weighted splits** to gradually move functionality and traffic.
- This is essentially the **Strangler Pattern**: over time, the old monolith is surrounded and replaced by new services, with the load balancer acting as the switchboard that controls the evolution.

---

# Introduction to IAM

--- 

The “Introduction to IAM” video explains **why IAM exists** and how it fits into AWS’s overall security model, then defines identity, access, and least privilege.

### 1. Shared Responsibility Model: who secures what?

- **Goal:** Avoid security gaps from wrong assumptions—AWS and the customer each have clearly defined roles.
- **AWS (“security OF the cloud”)**:
  - Secures the **global infrastructure**: data centers, Regions, physical hardware.
  - Handles physical security (perimeter controls, access control, environmental systems).
  - Keeps underlying hardware/software patched and highly available.
  - Data center locations are not publicly disclosed; access is strongly limited (analogy: a house with three rooms where no one has keys to all rooms).
- **Customer (“security IN the cloud”)**:
  - Secures **what you run and store** on AWS:
    - OS configuration, applications, firewalls.
    - Data at rest and in transit (e.g., to/from EC2).
  - Manages **user access control** and **compliance** with laws and regulations.

Core message: security is a **partnership**—AWS gives you a secure base, but you must configure and operate securely on top of it.

---

### 2. What is IAM in this context?

IAM (Identity and Access Management) is the **core service** that helps customers fulfill their side of the Shared Responsibility Model.

- **Identity**:
  - A unique digital representation of a person or system.
  - Verified and described by attributes like:
    - Username, password.
    - Email, employee ID.
    - Team/role membership (e.g., “DevOps”, “Finance”).
- **Access**:
  - Defined via **policies** that say *who* can do *what* in an AWS account.
  - Example: “This role can read from S3 bucket X, but cannot delete objects.”

---

### 3. Key security principles: least privilege and AAA

- **Least privilege**:
  - Start from **default deny**.
  - Grant only the **minimum permissions** needed to perform a task.
  - Reduces blast radius if a user is compromised or makes a mistake.

- **IAM underpins:**
  - **Authentication** – verifying *who* is calling (user, role, service).
  - **Authorization** – deciding *what* they’re allowed to do (based on policies).
  - **Auditing** – tracking *who did what, when*:
    - Crucial for compliance, incident investigation, and detecting misuse.

---

# IAM Concepts and Accessing IAM

---

“IAM Concepts and Accessing IAM” explains the core mental model of AWS access control—how services, resources, actions, and principals fit together—and how users actually interact with IAM via different access paths.

---

## 1. Services, resources, and actions: the IAM mental model

- **Services vs. resources**
  - **Service** = broad capability (e.g., EC2, S3, RDS) – like the **car**.
  - **Resources** = specific items inside a service that you manage – like the **engine, transmission, wheels**.
  - Example:
    - Service: **EC2**
    - Resource: **a specific EC2 instance** (e.g., `i-0123456789abcdef0`).
  - Permissions must be applied at the **resource** level, because that’s what you actually want to protect.

- **Service categories**
  - Services are grouped functionally:
    - **Compute** (EC2, Lambda)
    - **Storage** (S3, EBS)
    - **Database** (RDS, DynamoDB)
    - **Networking** (VPC, ELB)
  - They act as **building blocks**:
    - Simple: compute + database.
    - Complex: dozens of services combined in larger environments.

- **Amazon Resource Names (ARNs)**
  - **ARNs** uniquely identify resources and are used in IAM for access control.
  - They encode:
    - Service (e.g., `ec2`)
    - Region (e.g., `us-east-1`)
    - Account ID
    - Resource type & ID (e.g., instance ID)
  - This precision lets policies say: “Allow this action on **this exact resource**.”

- **Actions / operations**
  - **Actions** are the allowed operations on resources:
    - View, create, modify, delete, tag, etc.
  - Each service defines its own actions.
    - Example: IAM has ~40 user-focused actions.
  - Hierarchy:
    - **Service → Resources → Actions**
    - IAM’s job: control **which principals** can perform **which actions** on **which resources**.

---

## 2. Principals, credentials, and requests

- **Principals (the “who”)**
  - Entities that make requests to AWS:
    - AWS accounts
    - **IAM users**
    - **IAM roles**
    - **AWS services** acting on your behalf
  - Credential styles:
    - **Root user / IAM users**: long‑lived (permanent) credentials.
    - **Roles**: **temporary credentials**, assumed when needed (more secure, recommended).

- **Requests (what actually happens)**
  - A **request** to AWS includes:
    - Principal (who)
    - Resource (what it’s targeting)
    - Action (what it wants to do)
    - Additional data (e.g., tags, parameters)
  - Examples:
    - Tag an EC2 instance.
    - “John Doe requests `ec2:RunInstances`.”

- **Authentication vs. authorization**
  - **Authentication**: verify *who* is calling (passwords, access keys, etc.).
  - **Authorization**: decide *what* they’re allowed to do, using **policies**.
  - AWS uses **default deny**:
    - Everything is denied unless a policy **explicitly allows** it.
    - This supports **least privilege**.

- **Workloads**
  - A **workload** = a collection of resources and applications delivering business value.
  - Scale:
    - Small business: a few resources.
    - Enterprise: thousands of resources and many workloads.
  - Consistent IAM practices are critical as this scale grows.

---

## 3. How people and systems access IAM

IAM is the **common control layer** no matter how you interact with AWS:

- **Console (web UI)**
  - Example: Bob logs into the AWS Management Console with a username/password and MFA.
  - Ideal for **interactive**, human-driven tasks.

- **CLI (Command Line Interface)**
  - Uses **access key ID + secret access key**.
  - Best for **automation** and scripting (e.g., CI/CD pipelines, admin scripts).

- **SDKs / APIs**
  - Applications use AWS SDKs (Python, Java, JS, etc.) to call AWS programmatically.
  - Good for building apps that integrate deeply with AWS services.

In all cases, IAM is evaluating **who** is calling, **which resource** they’re targeting, **which action** they’re requesting, and **whether any policy allows it**, under a default-deny, least-privilege model.

---

# IAM Core Features

---

The “IAM Core Features” video outlines the main building blocks of IAM and how they work together as a stable, foundational access control system in AWS.

**1. IAM as a stable foundation**
- IAM’s core concepts don’t change often, even if small features are added.
- It’s the **central access control layer** integrated with virtually every AWS service.

---

## 2. Core IAM building blocks

**a. Groups – permission containers for users**
- **User groups** are “containers” for users who need similar permissions.
- Example: a **“developers” group** with access to specific services/resources.
- You assign policies to the group once, instead of managing permissions per individual.
- This makes permission management more scalable and easier to audit.

**b. Users – individual identities**
- **IAM users** are distinct digital identities:
  - Usually represent **people**, sometimes specific **systems**.
- Each has its own credentials:
  - Username/password (for console access).
  - Access keys (for CLI/SDK access).
- This enables controlled **authentication** and **authorization** per person or system.

**c. Root user – special, permanent account owner**
- Created when the AWS account is created.
- Cannot be deleted.
- Has **full, unrestricted permissions**.
- Must be protected very carefully (strong password, MFA, minimal usage).

**d. Roles – permissioned identities without long-term keys**
- **Roles** are identities with a set of permissions that:
  - Can be assumed by users, services (like EC2, Lambda), or other AWS accounts.
  - Use **temporary credentials** (no permanent access keys to share).
- Enables secure access without sharing passwords or long-lived keys.

**e. Policies – the heart of IAM**
- **Policies** define **allow/deny rules**:
  - Which actions are allowed or denied.
  - On which resources.
- Example: allow read/write/manage on specific EC2 instances.
- Can be attached to:
  - Users
  - Groups
  - Roles
  - Sometimes directly to services (via service-linked roles).
- Policies implement **least privilege** and are the core of authorization logic.

---

## 3. Security, compliance, and integration

**a. MFA (Multi-Factor Authentication)**
- Adds an extra “lock” on top of password/access key.
- Especially critical for the **root user** (treated as mandatory best practice).
- Reduces risk of account takeover.

**b. Compliance, auditing, and least privilege**
- IAM enables:
  - **Fine-grained control** over who can access what.
  - **Least privilege**: only grant the minimum permissions needed.
  - **Auditing**: understanding who did what and when (ties into logging services).
- This supports regulatory compliance and post-incident analysis.

**c. Integrated and global, with no extra cost**
- IAM is **integrated with all AWS services out of the box**, so you don’t maintain separate access systems per service.
- It’s **global** (not region-bound like EC2) and **free**—you pay for the resources you protect, not for IAM itself.

Overall, the video frames IAM as a stable, universal control plane: groups, users, roles, and policies define access; MFA and auditing harden security; and IAM’s global, no-cost nature makes it the default way to manage permissions across your AWS environment.

---

# IAM Identity Center

---
The IAM Identity Center video explains how AWS structures identities and permissions so users get **exactly the access they need—no more, no less**—and how Identity Center helps manage this at scale across accounts and applications.

---

## 1. Principals and the root user

- **Users as principals**
  - A **user** is a principal that can sign in and make requests.
  - Principals include:
    - The **root user**
    - **IAM users**
    - **Roles** (when assumed)
- **Root user**
  - Created automatically with the AWS account.
  - Has **full access to all services and resources**.
  - Very powerful and high‑risk:
    - Best practice: **do not use root for daily tasks**.
    - Instead, create **IAM users** with only the permissions they need.
    - Even an “admin” IAM user is **not equal to root** (root has special capabilities like closing the account, changing billing, etc.).

---

## 2. IAM users and IAM Identity Center

- **IAM users**
  - Represent **humans or workloads**.
  - Can have:
    - Console credentials (username/password).
    - Programmatic credentials (access keys).
  - Used for direct identity management within a single AWS account or smaller environments.

- **IAM Identity Center**
  - Centralized solution for managing user access:
    - Across **multiple AWS accounts**.
    - To **external SaaS apps** (e.g., Salesforce, Microsoft 365).
    - To **custom on‑prem applications**.
  - Typically enabled from the **main/root account** to control a broader, “global” workforce identity set.
  - Lets you manage who can access **which accounts and apps**, using one central identity system instead of lots of per‑account IAM users.

---

## 3. Groups: scaling permission management

- **Groups** = collections of IAM users.
  - Example: an **admins** group with elevated permissions.
- You attach policies to the **group**, and users **inherit** those permissions.
- Benefits:
  - Easier administration and consistent access.
  - Simple job changes:
    - Moving someone from “developers” to “testers” = change their group membership.
    - Old permissions are removed, new ones granted automatically.
- Important boundary:
  - **Groups themselves cannot authenticate.**
  - Only **principals** (users, roles, etc.) can sign in; groups just organize permissions.

---

## 4. Roles: assumable identities with temporary credentials

- **Roles** hold permissions but **do not** have long‑term credentials.
- They are **assumed** to obtain **temporary security tokens**.
- Common use cases:
  - **People** assuming roles for admin or cross-account work.
  - **AWS services** (e.g., an EC2 instance running an app) assuming a role to access S3, DynamoDB, etc.
- This avoids sharing long‑lived keys and supports more secure, short‑lived access.

---

## 5. Policies: how permissions are expressed

- **Policies** are JSON documents with **Allow** / **Deny** statements.
- Guided by **least privilege**:
  - Default is **deny**.
  - Explicitly **allow only what’s necessary**.

Types of policies:

1. **Identity-based policies**
   - Attached to users, groups, and roles.
   - Subtypes:
     - **AWS managed policies** – predefined by AWS.
     - **Customer managed policies** – created and maintained by you; can be reused and composed.
     - **Inline policies** – attached directly to a single user/group/role and live only there.
   - Best practice:
     - Prefer **managed policies** (AWS or customer managed) for reuse and consistency.
     - Use **inline policies** only when you absolutely need one-off, tightly coupled permissions.

2. **Resource-based policies**
   - Attached directly to resources (e.g., S3 bucket policies).
   - Control who can access that resource and how.

---

In summary, the video shows how:

- **Root**, **IAM users**, **groups**, **roles**, and **policies** form the core identity and access structure.
- **IAM Identity Center** adds a centralized, scalable layer for managing user access across many AWS accounts and external/internal applications.
- All of this is governed by **least privilege** and clear separation of who can sign in (principals) vs. how permissions are organized (groups, roles, policies).
---

# Resource based and inline policy

---

Resource-based and inline policies are two ways of expressing permissions in AWS, but they attach in different places and are used for different purposes. The video explains both, plus their JSON structure and best practices.

---

## 1. Resource-based policies

**What they are**

- A **resource-based policy** is attached **directly to the resource**, not to a user/group/role.
- The **resource itself** specifies:
  - **Who** can access it (which principals).
  - **What** actions they can perform.
- The resource becomes the **central point of control**.

**Key characteristics**

- They are **inline to the resource**:
  - Not “managed” separately.
  - You cannot detach and reuse them in multiple places.
  - To change them, you **edit the policy on the resource** itself.
- Only **some AWS services** support resource-based policies (e.g., S3 buckets, some queues, some KMS keys), so they are **specialized**, not universal.

**Primary use case: cross-account access**

- Major scenario: **secure sharing between AWS accounts**.
  - Example: An S3 bucket in Account A grants specific permissions to a role/user in Account B.
- This keeps:
  - Control with the **resource owner**.
  - Explicit governance over which **external principals** can do **what**.

**Identity-based vs resource-based view**

- **Identity-based policy**:  
  “User X is granted access to Resource Y” → like a **key** that opens a lock (permission travels with the identity).
- **Resource-based policy**:  
  “Resource Y allows access to User X” → like a **biometric lock** that knows which fingerprints are allowed (permission anchored at the resource).

---

## 2. Inline policies (best practices and usage)

**What inline policies are**

- **Inline policies** are policies that live **directly inside** a single identity (user, group, or role).
- They are not reusable:
  - If you delete the identity, the inline policy goes with it.
  - You can’t share that same policy across multiple identities.

**Best practices from the video**

- Use **inline policies sparingly**:
  - Prefer **managed policies** (AWS-managed or customer-managed) whenever the same permission needs to be shared across multiple users/groups/roles.
  - This avoids duplication and inconsistent updates.
- Follow **least privilege**:
  - Grant the minimum required access.
- Perform **periodic review and auditing**:
  - Clean up outdated or over-broad inline policies.
- **Test carefully**:
  - Policy changes can have side effects (unexpected denies/allows), so you should verify behavior.
- When inline policies are tied to **IAM users with access keys**, regularly **rotate keys** as part of good security hygiene.

---

## 3. Common JSON structure for all policies

All IAM policy types (identity-based, resource-based, inline, managed) share the **same basic JSON structure**:

- Top-level JSON with optional elements, plus:
  - One or more **`Statement`** entries.
- Each **statement**:
  - Expresses:
    - **Effect**: `Allow` or `Deny`
    - **Action(s)**: what operation(s) (e.g., `s3:GetObject`, `ec2:StartInstances`)
    - **Resource(s)**: which ARN(s)
    - Optionally **Condition**: extra constraints

**Evaluation model**

- Multiple statements in a policy are combined with a **logical OR**:
  - If **any** applicable statement allows an action (and no explicit deny overrides it), the action can be permitted.
- This enables **fine-grained control** by composing multiple statements.

**JSON literacy**

- Because policies are **plain JSON**, basic JSON skills are essential:
  - Understanding **booleans**, **arrays**, **nested objects**.
- The video uses a “John” example (with a fictitious photography club) purely to:
  - Teach how to read and reason about JSON structure,
  - Before applying that understanding to real IAM policy documents.

---

# Understanding a Policy Structure

--- 

The “Understanding Policy Structure” video explains **how IAM policies are built, how AWS evaluates them, and how governance tools like permission boundaries keep access under control over time**.

---

## 1. Policy JSON structure

The video uses a real IAM policy to show how structure maps to behavior.

- **Version**
  - A policy language identifier (commonly `2012-10-17`).
  - Indicates which policy syntax/rules apply.
  - Kept current by AWS; tooling sets it for you—no need to tweak it manually in normal use.

- **Statement (array)**
  - The **core of the policy**—an array of one or more statements.
  - Each **statement** is an independent rule (permission or restriction).
  - To understand a policy, you must examine **every statement**.

Each **statement** contains:

- **Effect**
  - `Allow` or `Deny`.
  - `Deny` overrides any `Allow` if both apply.

- **Action**
  - The API operation(s) the statement touches.
  - Can be:
    - Explicit operations (e.g., `s3:GetObject`, `ec2:StartInstances`), or
    - Wildcards (e.g., `s3:*` or `iam:Create*`)—which should be used carefully.

- **Resource**
  - Which resources the statement applies to, usually via **ARNs**.
  - Can be:
    - **Specific** (one bucket or instance).
    - **Patterned** (a set of resources via wildcards).

**Evaluation model**

- Within a policy, AWS evaluates all matching statements with a **logical OR**:
  - If any applicable statement **allows** an action (and no explicit deny applies), the policy contributes an allow.
- Combined with other policies, you get the final decision:
  - Start from **default deny** → add **allows** from any policy/statement → apply **denies** (which win).

The video reinforces **least privilege**:
- Grant only what is needed.
- Regularly **review and test** policies to keep them tight and compliant.

---

## 2. Identity-based vs resource-based policies

- **Identity-based policies**
  - Attached to **users, groups, or roles**.
  - Describe what that principal can do to which resources.

- **Resource-based policies**
  - Attached directly to a **resource** (e.g., S3 bucket policy).
  - Describe who can access the resource and how.

The video notes:

- Some fields are **mandatory/optional** depending on:
  - Whether it’s identity-based or resource-based.
  - Which AWS service you’re working with.
- Therefore, **service documentation** is your reference for exact requirements and supported actions/resources.

---

## 3. Permission boundaries: capping maximum permissions

A key governance concept:

- **Permission boundary**
  - A JSON document that **looks like a policy**, but:
    - It **does not grant permissions by itself**.
    - It defines the **maximum allowed permissions** a user or role can ever have.
  - Effective permissions = **intersection** of:
    - What identity/role policies **allow**, and
    - What the **permission boundary** allows.

Example from the video:

- User **Arnold** has an identity policy that allows `iam:CreateUser`.
- Arnold’s **permission boundary** only allows S3, CloudWatch, and EC2 operations.
- Result: Arnold **cannot** actually create IAM users, because `iam:CreateUser` is outside the boundary.
- So even explicit allows in a policy are useless if they exceed the boundary.

This lets organizations centrally enforce “you can never go beyond this line,” regardless of how individual policies are written.

---

## 4. Governance and managed policy changes

The video closes with real-world governance points:

- **AWS-managed policies** can **change over time**:
  - Example: `CloudWatchFullAccess` might gain new permissions in a future update.
- Customers must:
  - Periodically review such changes.
  - Assess them against **organizational rules and compliance requirements**.
  - Adjust their own controls (permission boundaries, SCPs, custom policies) if needed.

This all feeds back into the **Shared Responsibility Model**:

- AWS secures and evolves the **infrastructure and platform**.
- Customers must:
  - Centrally manage **identities, groups, roles, and policies**.
  - Ensure **authentication, authorization, and compliance** match their risk posture.
  - Use constructs like **least privilege, policy reviews, and permission boundaries** to keep access safe and auditable at scale.

---

# Auto-Scaling Principles

---

Auto Scaling makes your application’s compute capacity **elastic instead of fixed**, so it can react automatically to changing load and certain failures, instead of relying on manual instance management.

---

## 1. Problem: load balancing alone isn’t enough

- You start with:
  - A **load balancer** → routes traffic to
  - A **target group** → has some **EC2 instances**.
- This spreads requests, but:
  - If traffic **spikes**, a fixed number of instances can be overwhelmed.
  - If traffic **drops**, those same instances can sit mostly idle and **waste money**.

You need something that can **change the number of instances** as demand changes.

---

## 2. Auto Scaling Group (ASG): dynamic instance management

An **Auto Scaling Group** manages how many EC2 instances you have.

- Uses **metrics + rules** to decide when to add/remove instances.
- Example with CPU:
  - If **CPU > 80%** → **scale out** (e.g., add 1 or 2 instances).
  - If **CPU < 30%** → **scale in** (terminate some instances).
- You configure:
  - Which **metric** (CPU, requests, custom metric, etc.).
  - **Thresholds** (e.g., 80% / 30%).
  - **Step size** (how many instances to add/remove per event).

These thresholds and steps are **application-specific**—they must match your workload and traffic patterns.

---

## 3. ASG limits, minimum size, and self-healing

Key concepts:

- **Upper and lower limits**
  - Maximum and minimum instance count the ASG is allowed to have overall.
- **Minimum size**
  - Guarantees at least **N instances are always running**.
  - Example: min size = 1 means the ASG ensures **at least one** instance is always contributing to the target group.

**Self-healing:**

- If an **ASG-managed instance** fails or is terminated:
  - The ASG **replaces** it automatically.
- Important limitation:
  - Instances **you created manually** and simply registered in the target group are **not** managed or recovered by the ASG, even if their loss affects overall utilization.

---

## 4. CloudWatch + ASG: who does what?

- **Amazon CloudWatch**:
  - Monitors metrics.
  - Evaluates your thresholds.
  - Raises **alarms** when conditions are met (e.g., CPU > 80% for N minutes).
- **Auto Scaling Group**:
  - Listens to those alarms.
  - Performs the **scaling actions** (launch/terminate instances).

So:
- CloudWatch = **eyes and alarm bell**.
- ASG = **hands that add/remove capacity**.

---

## 5. Making new capacity actually useful: launch configuration

For scaling to work, **new instances must include your application** and be ready to serve traffic.

Two main provisioning approaches:

1. **Custom AMI**
   - Bake OS + application into an Amazon Machine Image.
   - New instances launch already having the app installed.

2. **Bootstrap / user-data script**
   - Start from a more generic AMI.
   - Use user data to install/configure the app at boot.

These details are captured in a **launch configuration / launch template**, which defines how ASG-created instances are built (AMI, instance type, security groups, user data, etc.).

---

## 6. Little's Law

 Little’s Law helps calculate how many instances of compute (EC2 instances) that you need.

- L = λW
- L = number of instances (or mean concurrency in the system)
- λ = mean rate at which requests arrive (req/sec)
- W = mean time that each request spends in the system (sec)
  
For example, at 100 requests per second (rps), if each request takes 0.5 seconds to process, you will need 50 instances to keep up with demand.

---
## 7. Predictive Scaling
Predictive scaling is a feature of AWS Auto Scaling that uses machine learning to analyze historical traffic and usage patterns to forecast future demand for EC2 instances and other AWS resources. Using these forecasts, predictive scaling automatically schedules scaling actions in advance to ensure sufficient capacity will be available to meet the predicted spikes in traffic or usage.

Some critical aspects of predictive scaling include:

- **Load forecasting** - Auto Scaling analyzes a predefined number of days of historical load metric data like CPU utilization and generates forecasts for the next few days on an hourly basis.
- **Scheduled scaling actions** - Based on the load forecasts, Auto Scaling schedules actions to proactively increase or decrease resource capacity, like the number of EC2 instances in an Auto Scaling group. This helps maintain target resource utilization levels set in the scaling policies.
- **Dynamic scaling fallback** - If actual demand exceeds forecasts, dynamic scaling policies can still trigger additional capacity as needed.
By preemptively scaling resources to match predicted loads, predictive scaling enables Auto Scaling to be faster more accurate, and helps keep applications responsive.

According to AWS - Predictive scaling is well suited for the following situations:

- Cyclical traffic, such as high use of resources during regular business hours and low use of resources during evenings and weekends
- Recurring on-and-off workload patterns, such as batch processing, testing, or periodic data analysis
- Applications that take a long time to initialize, causing a noticeable latency impact on application performance during scale-out events
  
---

# Launch Templates

---

Launch templates and launch configurations both define **how EC2 instances are built** for Auto Scaling Groups, but the video makes it clear that **launch templates are the modern, recommended option** and launch configurations are mostly for legacy/backward compatibility.

---

## 1. Why launch templates are preferred

- When you try to create a **launch configuration**, AWS explicitly recommends using **launch templates** instead.
- Message: new work should use **launch templates**, because:
  - They’re where AWS is investing.
  - They support more features and better governance.

---

## 2. What a launch template is and why it matters

A **launch template** is a **reusable blueprint** for launching EC2 instances. It:

- Automates instance launch settings.
- Can simplify **permission management** through IAM-related options.
- Most importantly, lets you **enforce organizational best practices**.

Governance example:

- Standardize on a specific **AMI**:
  - Multiple microservice teams all use the same base OS image.
  - That AMI can already include:
    - Required agents (monitoring, security),
    - Common tooling,
    - Hardening settings.
- This keeps environments consistent and reduces drift.

---

## 3. Building a launch template (walkthrough highlights)

The video walks through creating a template end-to-end:

- **Name & description**
  - You can create **versions** later for controlled changes.
- **Auto Scaling guidance**
  - Ensures required fields (like **AMI**) are filled correctly for unattended scaling.
- **AMI selection**
  - Example: choose an **Ubuntu** AMI.
- **Instance type**
  - Example: `t2.micro`.
  - Note: Auto Scaling can use **multiple instance types** for cost and availability balancing.
- **Key pair**
  - Select a key pair for SSH access (if needed).
- **Networking**
  - Choose **VPC**, subnets, and **security groups** (e.g., allow HTTP and SSH).
- **Storage**
  - Override the AMI’s default root volume (e.g., from **8 GB to 10 GB**).
- **Tags**
  - Treated as **enterprise-critical**:
    - E.g., `Owner`, `Environment`, `CostCenter`.
    - Warning: untagged resources might be candidates for **termination** in some orgs.

---

## 4. Networking details: when custom ENIs help vs. hurt

- **Predefined network interfaces (ENIs)**:
  - Generally **not compatible** with Auto Scaling multiple instances, because:
    - One fixed ENI/IP can’t be shared across many scaled instances.
  - But useful for **single-instance maintenance** scenarios:
    - You want to preserve an IP address so **dependent services don’t break**.
    - E.g., manual maintenance on a server that external systems point to.

---

## 5. Advanced options with an Auto Scaling mindset

Launch templates also expose advanced settings, such as:

- **Spot pricing** (request Spot capacity for cost savings).
- **Monitoring** (enable detailed CloudWatch metrics).
- **Tenancy** (shared vs. dedicated hardware).
- **Licensing** options to stay compliant with software license terms.

All of these can be standardized in the template, so every instance launched via Auto Scaling or manually follows the same rules.

---

## 6. Immutability, versioning, and scope

- **Immutability & versioning**
  - Once created, a specific template **version** is immutable.
  - To change behavior (new AMI, instance type, etc.), you create a **new version**.
  - This:
    - Prevents silent configuration drift.
    - Enables controlled rollouts and easy rollbacks.
- **Usage**
  - The same template can be used by:
    - **Auto Scaling Groups**.
    - **Manual EC2 launches** (on-demand).
- **Regional scope**
  - Launch templates are **regional resources**:
    - You manage them region by region (like EC2 and ASGs themselves).

---

Overall, the video’s message is:

- **Use launch templates** as your standard way to define how instances are launched.
- Leverage them to:
  - Enforce **best practices** (AMI, tags, security settings),
  - Support **Auto Scaling** and manual launches consistently,
  - Manage change safely with **versioning** and avoid configuration drift.

---

# Auto Scaling Group

---

The “Auto Scaling Group Part 1” video shows how ASGs are the **engine of elasticity** in AWS and walks through how their configuration affects cost, capacity, and traffic flow.

---

## 1. ASGs as the mechanism for elasticity

- Auto Scaling Groups (ASGs) automatically **add or remove EC2 instances** so capacity tracks demand.
- The setup is **guided and step-based**:
  - You start by choosing a **launch template** (and even a specific template version).
  - This ensures every new instance is created from a **consistent, repeatable blueprint**.
- One launch template can be reused by **multiple ASGs**:
  - A one‑to‑many relationship that supports **standardization** across applications or environments.

---

## 2. Instance types, cost strategy, and capacity mix

- You can:
  - Stick with the **instance type** defined in the launch template (e.g., `t2.micro`), or
  - **Override** it in the ASG to:
    - Mix multiple instance types,
    - Combine **On-Demand** and **Spot** capacity.

The detailed cost/capacity logic:

- **On-Demand base capacity**
  - Define a base number of instances that will always be **On-Demand**.
- **Above the base**
  - Split additional capacity between:
    - On-Demand, and
    - Spot instances.
- **On-Demand instance selection**
  - ASG tries instance types in the **priority order you set**.
  - This matters if you want to maximize use of **Reserved Instances**:
    - RI discounts are tied to specific instance types.
- **Savings Plans vs RIs**
  - **Savings Plans** are more flexible:
    - Apply to **compute usage** across instance families, not just one exact shape.
  - RIs are more rigid but can be cheaper for fixed shapes.

- **Spot allocation strategies**
  - **Capacity Optimized**:
    - Chooses Spot pools with more available capacity.
    - Better for **longer retention** and fewer interruptions.
  - **Lowest Price**:
    - Chooses cheapest pools.
    - Maximizes savings but with **higher interruption risk**.
  - Choice depends on workload tolerance for interruption vs cost.

---

## 3. Networking and placement

- You choose **subnets across multiple Availability Zones**:
  - ASG then launches instances across AZs for **resilience**.
- Important note:
  - AWS does **not** auto-modify your existing subnets as regions evolve.
  - You must design and maintain your subnet layout yourself.

---

## 4. How instances receive traffic (or work)

- **Load balancing is optional**:
  - Example: a **message-queue consumer** fleet:
    - ASG scales consumers based on queue depth.
    - No load balancer needed; they pull work from the queue.
- When you **do** use a load balancer:
  - You must attach the **correct target group** to the ASG:
    - Otherwise, the ASG may launch instances that **never receive traffic**.

---

## 5. Health checks and monitoring

- **Health checks**
  - **EC2 health checks**:
    - Look at instance-level health (e.g., instance status checks).
  - **ELB health checks**:
    - Use load balancer health (e.g., HTTP `/health` endpoint).
    - More app-aware if you’re behind a load balancer.
- **Health check grace period**
  - Time window after an instance launches during which health checks are **ignored**.
  - Prevents new instances from being marked unhealthy while still booting / starting services.

- **Monitoring**
  - Standard monitoring is available by default.
  - **Advanced monitoring** options exist but are left disabled in the walkthrough for simplicity.

---

The “Auto Scaling Group Part 2” video explains how **ASG sizing and policies turn elasticity into a controlled, business-aware system** instead of blind automation.

---

## 6. Core sizing parameters: min, desired, max

Auto Scaling Groups use three key numbers:

- **Minimum capacity**
  - The **safety baseline**: the fewest instances you will ever run.
  - Protects reliability during failures (e.g., Spot interruptions) by ensuring you don’t drop below a certain footprint.

- **Desired capacity**
  - The **target steady state** the ASG tries to maintain.
  - The gap between **desired** and **minimum** is an intentional **buffer**:
    - Small traffic variations are absorbed by this buffer instead of triggering instant scale‑out.
    - This helps avoid user-visible delays while new instances launch and warm up.

- **Maximum capacity**
  - An **artificial upper limit**:
    - Prevents runaway scaling and uncontrolled cost during unexpected surges.
  - Relevant for:
    - **DDoS-like spikes**, where it’s hard to separate bad from good traffic.
    - **Legit bursts** (holidays, flash sales), where you still need a cost ceiling.

---

## 7. Setting a defensible maximum capacity

Instead of guessing max capacity, the video suggests a **data-driven method**:

1. Temporarily **enable scale-in protection** for all instances.
   - ASG can scale **out**, but **not in**.
2. Observe behavior over a realistic window (e.g., overnight).
   - Example: you discover the fleet peaked at **250 instances at 3 a.m.**.
3. Turn that observation into a policy:
   - Set `max = observed peak + contingency`, e.g., **275**.
   - You now have **documented evidence** to justify this limit to finance / cost-control teams.

This converts “guessing a number” into a **measurable, auditable decision**.

---

## 8. Scale-in protection: reliability and operations

**Scale-in protection** prevents specific instances from being chosen for termination during scale-in. Uses:

- **Operational safety**
  - Don’t kill the instance an engineer is SSH’d into for debugging.
- **Stateful systems**
  - For systems like **NoSQL clusters**, random scale-in can mean:
    - Data loss,
    - Heavy redistribution,
    - Or major performance impact.
  - Scale-in protection lets you control *which* nodes can be removed, and when.

---

## 9. Scaling policies and the “no scaling” option

The video links behavior to **scaling policy configuration**:

- Example: **Target tracking**
  - Keep average CPU around, say, **80%**, with a **warm-up time** so new instances aren’t over-counted too early.
- Emphasizes that *elasticity doesn’t always require dynamic scaling*:
  - For predictable workloads (e.g., many IoT scenarios with stable patterns), you can choose:
    - **Scaling policy = None**
    - ASG then maintains a **fixed fleet**, only **replacing failed instances**.
  - You still gain **self-healing** without capacity changes.

---

## 10. Notifications, tagging, and final creation

- **SNS notifications**
  - ASG can send messages for:
    - Scale-out and scale-in events.
    - **Failed scaling attempts** (e.g., hit max capacity but still need more).
  - Useful for:
    - Audit trails,
    - On-call alerts,
    - Early warning when limits are constraining demand.

- **Tagging, review, and creation**
  - Tags help track ownership, environment, and costs.
  - Final review before creation ensures:
    - Sizing parameters (min/desired/max),
    - Policies,
    - Notifications
    are correct.
  - When the ASG is created, it launches instances as needed to reach **desired capacity**.

---
## 11. Validating ASG behavior and activity history  
- After creation, you confirm Auto Scaling is working by:
  - Refreshing the console and verifying **current instance count** matches **desired capacity**, staying within min/max.
- **Activity history**:
  - Shows when instances were **added or removed**.
  - Acts as an **audit trail** to explain *what the group did and when*.

---

## 12. Multiple scaling policies and metric choices  
- An ASG can have **multiple scaling policies** at once:
  - Not just CPU, but also:
    - **Network metrics** (e.g., `NetworkIn`),
    - **Load balancer request counts**, etc.
- This lets the group react to **different kinds of pressure** (compute vs. traffic vs. network).

---

## 13. Policy types: simple, step, and anomaly-based  
- **Simple scaling**
  - One CloudWatch alarm → one scaling action.
  - Example: “If alarm fires, add **2 instances**” or “add **10%** capacity.”

- **Step scaling**
  - Multiple actions for different metric ranges:
    - Small breach → **small** scale-out.
    - Bigger breach / persistent issue → **larger** scale-out.
  - More nuanced response than simple scaling.

- **CloudWatch alarm setup example**
  - Metric: ASG `NetworkIn`.
  - Evaluation period: **5 minutes** to avoid reacting to brief spikes.
  - Configure:
    - Comparison operator (e.g., `GreaterThanThreshold`).
    - Threshold value.
    - Handling of **missing data** (treat as good/bad/ignore).

- **Anomaly detection**
  - Alternative to fixed thresholds.
  - CloudWatch learns a **baseline pattern** and flags **abnormal** behavior.
  - Useful when “normal” varies over time and a single static threshold is hard to pick.

---

## 14. Notifications and scheduled actions  
- **SNS notifications**
  - Two complementary signals:
    - **CloudWatch alarms** → “Something is wrong / unusual.”
    - **ASG notifications** → “Here’s what scaling actually did about it.”
  - Helps operations:
    - Correlate incidents with scaling actions.
    - Spot cases where scaling **couldn’t** happen (e.g., hit max).

- **Scheduled actions**
  - Scale **proactively** for predictable patterns.
  - Examples:
    - Scale up before a factory shift starts.
    - Scale down at night.
  - Use recurrence / cron-like schedules—similar to setting recurring calendar events.

---

## 15. Immutable infrastructure and safe rollouts  
- **Updating a launch template version**:
  - Does **not** change existing instances automatically.
  - New version is used **for future launches**.

- **Instance refresh**
  - Controlled rollout mechanism:
    - Gradually **replaces existing instances** with ones from the new template version.
    - Honors a **minimum healthy percentage** to maintain availability (e.g., keep ≥ 90% healthy).

- **Target group health vs. instance status**
  - An instance being “running” is **not the same** as being ready to serve traffic.
  - Target group health states:
    - **Unhealthy** – failing health checks; not receiving traffic.
    - **Healthy** – passing checks; serving traffic.
    - **Draining** – finishing existing requests; no new traffic.
  - Load balancers use these states to:
    - Route traffic only to **healthy** targets during rolling upgrades.
    - Protect users from partially initialized or failing instances.

---

## 16. ASGs as refresh and replacement engines  
- The video shows that when an instance is terminated, the Auto Scaling group **refreshes** capacity by launching a replacement.  
- ASGs are positioned as the practical way to **rebuild compute automatically**, keeping the environment in its intended state without manual instance recreation.

---

## 17. Demonstrating self‑healing with a forced failure  
- To make self‑healing visible, the demo **manually terminates** an instance that is managed by the ASG.  
- Strong warning: **never do this in production** just to “test” – it’s for learning / non‑prod.  
- Goal: show that when an instance or app fails, the ASG should react to **restore service automatically**.

---

## 18. Activity history and console integration  
- The **Activity history** tab records:
  - Instance terminations,
  - New launches,
  - Reasons for each action.  
- This gives an **audit trail** explaining what the ASG is doing and why.  
- The console view is becoming more integrated:
  - From the ASG page you can jump to related areas like **load balancers**.
  - Even if the UI changes over time, the **elasticity concept remains the same**.

---

## 19. Health checks and capacity reconciliation  
- Core mechanism:
  - **EC2 health checks** detect an instance as **terminated / stopped / unhealthy**.  
  - The ASG compares **actual instance count** to **desired capacity**.
  - When capacity is below desired, it **launches a new instance**.  
- Verification steps in the demo:
  - In the EC2 list, a **new instance** appears with a **new IP address**.
  - In the **target group**, you see:
    - Updated **target IDs**,
    - Health states confirming the new instance is now healthy and serving traffic.

---

## 20. Cleanup behavior  
- Deleting the **Auto Scaling group**:
  - Terminates all **instances managed by that ASG**.
  - Does **not** delete:
    - The target group,
    - The load balancer.  
- Termination is **asynchronous**:
  - It can take a short time for all instances to be shut down and the group to fully disappear.

--- 

# Storage on AWS

--- 

Storage on AWS is framed as a fundamental building block for any real application, and the video compares four main options—Instance Store, EBS, EFS, and S3—through how they affect durability, scalability, and architecture.

## 1. Instance Store (ephemeral local storage)  
   - Local disks physically attached to an EC2 instance.  
   - **Ephemeral**: data is lost when the instance stops, is terminated, or fails.  
   - Example risk: storing user profile pictures on instance storage in an Auto Scaling group—when instances scale in, those files disappear.  
   - Conclusion: fine for temporary data (caches, scratch space), **not** for durable user data.

## 2. Elastic Block Store (EBS) – persistent block volumes  
   - Attachable **block storage** for EC2, like virtual hard drives.  
   - Can start, say, at 100 GB and **extend or add volumes later** as data grows.  
   - Constraints:
     - A volume can be **attached to only one EC2 instance at a time** (for most common volume types).
     - Volume and instance must be in the **same Availability Zone**.  
   - Good for OS disks, databases, and single-instance apps needing durable storage.

## 3. Elastic File System (EFS) – shared file system  
   - **Shared file storage** that multiple EC2 instances can mount **read/write** at the same time.  
   - No need to predefine size; it **auto-scales** from bytes to terabytes, and you pay for what you use.  
   - Behaves like a network file system, but:
     - **Does not manage concurrency** for you—your application must handle locking/contention.  
   - Good for shared content, web servers behind a load balancer, or shared config/assets.

## 4. Amazon S3 – object storage  
   - Stores data as **objects** (files) in buckets—more like Dropbox/Google Drive than a disk.  
   - You upload/download whole objects (or use multipart APIs), not block-level writes.  
   - Very flexible access:
     - Use from **EC2, Lambda, on-prem apps** via APIs/SDKs.
     - Integrates with **CloudFront** for global content delivery.
     - Triggers **events** for automation (e.g., process a file as soon as it’s uploaded), reducing the need for cron polling.
   - Can be scripted via AWS CLI for operational tasks.  
   - Fine-grained **permissions** enable controlled sharing and uploads.  
   - Acts as a central “glue” in data pipelines:
     - Example: Kinesis → process/transform → store in S3 → load into Redshift.  
   - For higher resilience, you can configure **cross-region replication**, but you must set it up explicitly.

## Overall:  
- **Instance Store** – fast, ephemeral, for temporary data.  
- **EBS** – durable block storage for one instance (per AZ).  
- **EFS** – shared, auto-scaling file system for many instances.  
- **S3** – highly durable, integrated object storage, central to many application and data architectures.

---

# Introduction to EBS

---

Elastic Block Store (EBS) is introduced as the **primary block storage for EC2**, designed to hold both applications and their long-lived data in enterprise environments.

Key points:

- **Why EBS matters**
  - Enterprise systems are built on **applications + the data they depend on**.
  - Different storage types serve different needs; **EBS is the “disk” behind EC2** that works for:
    - OS + application installation.
    - Durable, long-term data (databases, analytics, HPC).

- **Volumes, root disks, and layout**
  - An **EBS volume** is like a **disk**; it must be **attached to an instance** (e.g., EC2) to be useful.
  - The first attached disk is the **root volume**:
    - Holds the **operating system**.
    - Cannot be **detached** while in use, but can be **replaced** (e.g., move from HDD to SSD).
  - You can attach **multiple volumes** to one instance:
    - Dev/test: often put OS + app + data on one root volume for convenience.
    - Production: usually **separate app and data** onto different volumes for performance, manageability, and safety.

- **Workloads and retention**
  - Typical EBS-backed workloads:
    - **Databases**, **analytics**, **HPC** – all need fast, consistent, persistent storage.
  - Example: e‑commerce
    - A customer returning after a year should have their data loaded **as quickly** as a frequent user.
  - Dev environments also rely on EBS to **mirror production-like storage characteristics**.

- **What “block storage” means**
  - When you **format** a disk, it’s divided into fixed-size **blocks**.
  - Data is stored and accessed in **blocks**, which:
    - Can lead to partially filled blocks (unused space),
    - Are read/written as whole units.
  - Concepts like **fragmentation** and **defragmentation** matter for how data is laid out and accessed.
  - AWS hides the underlying physical disks and exposes a huge, logically separated **block-storage system** to instances as EBS volumes.

- **Core operational concepts**
  - **Formatting & file systems**: preparing a volume (ext4, NTFS, etc.) so OS and apps can use it.
  - **Attaching / detaching**: linking a volume to/from an EC2 instance.
  - **Mounting**: making a formatted volume part of the OS directory tree (root is auto-mounted).
  - **IO / IOPS**: IO operations and IO operations per second—key performance metrics for EBS.
  - **Freezing / thawing IO**: pausing writes to take a **consistent snapshot**, then resuming.
  - **Crash consistency vs application consistency**:
    - Crash-consistent: like capturing disk state at power loss; in-flight operations may be mid-write.
    - Application-consistent: app (e.g., DB) is quiesced/flushed first, making restores safer and cleaner.

Overall, the video positions EBS as **foundational, durable block storage** behind EC2, and gives just enough block-storage and ops vocabulary so you can reason about layout, performance, and recovery in real workloads.

--- 

# EBS Feature Analysis

---

The EBS Feature Analysis video walks through **what EBS is good at, how volume types differ, and how snapshots protect and move data**, all tied to reliability, performance, and cost trade-offs.

---

## 1. Core EBS characteristics and reliability constraints

- **Block storage for EC2**
  - EBS exposes **raw block devices** to EC2:
    - You get fine-grained control over data layout and access patterns.
    - You choose the file system and formatting (ext4, XFS, NTFS, etc.).
  - Well-suited for **primary, real-time storage** such as:
    - Databases
    - Analytics engines
    - Other mission-critical workloads needing low-latency access.

- **Same-AZ requirement**
  - An EC2 instance and its EBS volume **must be in the same Availability Zone**.
  - Cross-AZ dependencies are avoided because:
    - If the volume’s AZ has issues, an instance in another AZ relying on that volume would effectively fail too.
  - Keeping them co-located reduces risk of **cascading failures**.

---

## 2. Lifecycle independence and safety

- **Volumes can outlive instances**
  - By default or configuration, an EBS volume can **persist after the EC2 instance stops or is terminated**.
  - Whether a volume is deleted on instance termination depends on a **specific setting**.
- Why this matters:
  - Protects against **operational mistakes**:
    - Example: a faulty script terminates your DB instance.
    - Even if the app’s state isn’t perfectly consistent, the EBS disk is still there, giving you a recovery path.
  - Decouples **compute lifecycle** from **data lifecycle**.

---

## 3. Choosing the right EBS volume type (“2P approach”)

EBS offers multiple volume types; picking the right one is about **Performance + Price**:

- Common metrics:
  - **IOPS** – read/write operations per second.
  - **Throughput** – amount of data per second (MB/s or Mbps).
  - **Allocated capacity (GB/TB)** – also influences cost and performance ceilings.

**Volume families and typical uses:**

1. **General Purpose SSD (gp2/gp3)**
   - Balanced price/performance.
   - Typical use:
     - Boot volumes.
     - Mid-size databases.
     - Dev/test environments.
   - Good default for many workloads.

2. **Provisioned IOPS SSD (io1/io2)**
   - You explicitly provision **high, consistent IOPS**.
   - Designed for:
     - IO-intensive, latency-sensitive workloads (e.g., large production databases).
   - Higher cost, but predictable performance.

3. **Throughput-optimized HDD (st1)**
   - HDD volumes tuned for **high, sequential throughput**.
   - Best for:
     - Big, streaming workloads like log processing, ETL, big data scans.

4. **Cold HDD (sc1) / Magnetic**
   - Lowest cost, lower performance.
   - Good for:
     - Infrequently accessed data.
   - “Magnetic” may still appear in the console UI even if it’s less prominent in newer docs.

**2P approach:**
- Pick volume type based on:
  - **Performance** you truly need (IOPS + throughput).
  - **Price** you’re willing to pay.
- Avoid over-provisioning high-end SSD for workloads that are mostly cold or sequential.

---

## 4. Snapshots: protection and data mobility

- **Snapshots** are **point-in-time copies** of an EBS volume:
  - Stored in S3-backed snapshot storage (managed by AWS).
  - Useful for:
    - Backup / restore.
    - Cloning environments.
    - Moving data **within or across regions** (as long as compliance allows).

- **Incremental behavior**
  - First snapshot: **full copy** (e.g., 10 GB).
  - Subsequent snapshots: **only changed blocks** (e.g., next 4 GB, then 2 GB).
  - Total stored data is the union of referenced blocks.
- Cost implications:
  - Deleting a snapshot **does not necessarily free all its size**:
    - If later snapshots still reference blocks first captured in that snapshot, those blocks stay.
    - Data is removed only when **no remaining snapshot references those blocks**.
  - Hence, snapshot billing is about the **unique data blocks** still referenced across the entire snapshot chain.

---

Overall, the video frames EBS as **primary, durable, block-level storage** for EC2 where you carefully pick volume type by performance/price, rely on volume–instance co-location for reliability, use persistence settings to protect against accidental data loss, and use snapshots as a safety net and migration tool—while understanding their incremental, reference-based cost model.

---

# EBS - LifeCycle, Encryption and Best Practices

---

The “EBS Lifecycle, Encryption and Best Practices” video explains how to run EBS in a **production- and compliance-ready way**, focusing on backups, lifecycle policies, encryption, and operational hygiene.

---

### 1. Snapshots and why manual backup doesn’t scale

- **Snapshots** are the practical way to create **point‑in‑time, recoverable copies** of EBS volumes.
- In large environments:
  - Many apps → many databases → many volumes.
  - **Manual snapshotting** is:
    - Inconsistent,
    - Labor‑intensive,
    - Error‑prone.
- Conclusion: you need **automation** to:
  - Reduce human error,
  - Keep backups consistent,
  - Prove you’re meeting internal and regulatory requirements.

---

### 2. Compliance lens (e.g., GDPR)

Using GDPR as an example, the video links regulations to concrete backup expectations:

- Organizations must:
  - Protect **integrity and confidentiality** of data.
  - **Regularly back up** data.
  - Store backups **securely** to avoid loss and unauthorized access.
  - Have **documented retention and disposal policies**:
    - How long backups are kept,
    - How and when they’re securely deleted.
- Key idea: compliance is about **governance and repeatability**, not just “having backups somewhere.”

---

### 3. Lifecycle policies: automating backup & retention

**Lifecycle policies** operationalize all this:

- Define **backup frequency**:
  - E.g., hourly, daily, weekly snapshots.
- Define **retention rules**:
  - By age (e.g., keep 30 days),
  - Or by count (e.g., keep last 10 snapshots).
- Control **archival** of older snapshots to cheaper tiers.
- Enable **cross‑region copying**:
  - Protect against Region‑level issues,
  - Support DR strategies (subject to compliance constraints).
- Allow **controlled sharing** with specific AWS accounts.

Governance and safety:

- Track **policy changes** (who changed what, when).
- Restrict updates to **authorized operators only**.
- **Monitor** policy execution so missed / failed backups are visible.

---

### 4. Encryption for EBS volumes and snapshots

Encryption is explained specifically in the context of EBS and snapshots:

- Supports **root and data volumes**.
- Provides protection:
  - **At rest** (on the physical media),
  - **In transit** between instance and storage,
  - **Within snapshots**.
- Uses **KMS‑managed data keys**:
  - KMS generates and manages keys used to encrypt volume data.

Operational cautions:

- When **sharing encrypted snapshots**:
  - You must also share or grant access to the **KMS key**.
  - You should question **whether sharing is truly necessary**, since it widens your security perimeter.
- Mismanaging keys or sharing too broadly can undermine encryption guarantees.

---

### 5. EBS best practices (pulled together)

The video finishes with a set of recommended practices:

- **Requirements‑driven volume selection**:
  - Match volume type (gp, io, st1, sc1, etc.) to performance and durability needs.
- **Right‑sizing**:
  - Avoid over‑provisioning capacity and performance (IOPS/throughput) beyond what workloads need.
- **Encryption by default**:
  - Encrypt volumes and snapshots, especially those containing sensitive or regulated data.
- **Tagging**:
  - Use tags for:
    - Ownership and environment (prod/dev),
    - Cost allocation,
    - Backup/lifecycle targeting (e.g., which volumes a policy should apply to).
- **Snapshot automation**:
  - Use lifecycle policies or backup services to automate snapshot creation, retention, and deletion.
- **Monitoring & dashboards**:
  - Watch EBS metrics (IOPS, throughput, latency, burst credits).
  - Track backup success/failure and lifecycle policy runs.

Overall, the video positions EBS as **flexible, highly available, workload‑optimized block storage** whose real production strength comes from combining the right volume types with **encrypted, automated, policy‑driven snapshots and solid governance**.

---

# EFS Introduction

---

Elastic File System (EFS) is introduced as a **shared, elastic file system** that many EC2 instances can mount at the same time, letting multiple servers work on the same files and directories without duplicating data.

Key points:

- **Shared file system architecture**
  - EFS is a **network file system** that multiple EC2 instances can mount concurrently.
  - Ideal for workloads where many servers need the **same directory tree** (e.g., shared content, configs, user uploads).

- **Mount targets & VPC integration**
  - To use EFS in a VPC, you create **mount targets**—one per **Availability Zone** that needs access.
  - Even if an AZ has many subnets (6–10), you only need **one mount target per AZ**.
  - Each mount target:
    - Lives in a subnet,
    - Uses an IP from that subnet’s CIDR (manual or automatic assignment).
  - Connectivity is standard VPC networking: route tables, subnets, security groups.

- **NFS and security groups**
  - EFS uses **NFS** on **port 2049**.
  - EC2 instances need security group rules allowing **inbound 2049** from appropriate internal sources (e.g., the VPC CIDR like `172.31.0.0/16`).
  - Security groups control **who can connect** to EFS.

- **Elastic capacity and cost model**
  - EFS **auto-scales** with the amount of data stored—no need to pre-size volumes.
  - You pay for **actual data stored**, unlike pre-provisioned EBS capacity.

- **Lifecycle management for cost optimization**
  - Lifecycle rules can move data to **infrequent access (IA)** storage:
    - Based on “days since last access” (e.g., 7 or 15 days).
  - This reduces cost for older, colder files while keeping them accessible.

- **Performance modes & throughput**
  - **Performance modes (chosen at creation, cannot be changed later):**
    - **General Purpose** – default for most workloads (web apps, CMS, shared home dirs).
    - **Max I/O** – for highly concurrent, big‑data or analytics workloads.
    - Changing modes later requires **migrating** to a new file system.
  - **Throughput options:**
    - **Bursting**:
      - Baseline throughput scales with file system size.
      - Uses a **credit model** to allow temporary bursts above baseline.
    - **Provisioned throughput**:
      - You explicitly set the throughput level,
      - Pay more for guaranteed performance.

- **Scope and access control**
  - EFS is **region-scoped** (no native cross-region file system).
  - Access control combines:
    - **Security groups**: who can connect to the mount targets.
    - **EFS file system policies (JSON)**: what actions/operations are allowed (e.g., read‑only vs read/write).
  - Enables patterns like:
    - A **read-only shared static content** file system mounted by many web servers.

Overall, EFS is positioned as **shared, elastic file storage** for EC2 fleets: simple to mount across instances, automatically scalable in size, tunable for performance and cost via lifecycle rules and modes, and secured through both network controls and IAM-style policies.

---

# EFS - Hands On

---

Elastic File System (EFS) Hands‑on shows, step by step, how to **build and safely use a shared file system across EC2 instances in multiple AZs**, including networking, policies, mounting, and teardown.

Key points:

1. Environment and networking setup  
   - Create a **dedicated security group** that:
     - Allows **NFS (TCP 2049)**.
     - Restricts access to the **VPC CIDR** only (e.g., `172.31.0.0/16` in the default VPC).  
   - Attach this SG to **two EC2 instances in different AZs** so both can mount the same EFS file system in read/write mode.

2. Creating the EFS file system  
   - Use the **customized workflow** to highlight important choices:
     - Name and **tags** for management and cost tracking.
     - Disable automatic backups and lifecycle for the demo (not best practice for prod).
     - Choose **General Purpose** performance mode.
     - Select **Bursting** throughput mode.
     - Optionally enable **encryption with KMS** keys.  
   - EFS automatically creates **mount targets** (and underlying ENIs):
     - You need a mount target in **each AZ** where instances may run.
     - This is especially important for **Auto Scaling Groups** that might launch instances in any AZ.
   - Assign the **restrictive security group** to the mount targets and add targets for any missing AZs.

3. Access control with file system policies  
   - EFS supports **file system policies (JSON)** on top of SGs:
     - Preset examples: deny root, enforce read‑only, or require encrypted transport.  
   - The demo configures a **custom JSON policy** that:
     - Allows root access.
     - Allows read/write.
     - Allows unencrypted transport (for demo simplicity).  
   - This shows how policy choices can **dramatically change security posture**.

4. Mounting from EC2 instances  
   - Use the **console-provided NFS mount command** (DNS-based endpoint).  
   - Common issues & fixes:
     - Ensure the **local mount directory exists** (`mkdir /efs` or similar).
     - Install **NFS utilities** on Ubuntu (`nfs-common` package).  
   - After mounting on both instances, they see the **same directory tree**.

5. Validating shared storage and concurrency caveats  
   - From instance A, create or append to a file on the mounted EFS path.  
   - From instance B, read/append the **same file** and see changes, proving **cross-instance visibility**.  
   - Limitation:
     - EFS **does not handle application-level locking**.
     - Apps must implement their own concurrency control to avoid write conflicts.

6. Unmounting and clean teardown  
   - **Unmount** the file system from each instance once testing is done.  
   - **Delete** the EFS file system:
     - This is **irreversible**—data is lost once deleted.
     - Deletion also removes **mount targets and their ENIs**.  
   - The demo reinforces:
     - How to operate EFS safely (security groups + policies),
     - And how to **cleanly deprovision** shared storage when it’s no longer needed.

---
