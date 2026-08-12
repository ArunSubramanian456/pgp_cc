
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


