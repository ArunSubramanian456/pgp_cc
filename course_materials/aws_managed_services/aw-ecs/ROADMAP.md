# Roadmap: ECS on Fargate

11 lessons in total (lesson 6 was split in two on 2026-10-22), about 25 to 30 minutes each, covering every goal in [MISSION.md](MISSION.md). First shared 2026-10-21. Rule from lesson 6 on: stay inside ECS, with other AWS services only as black boxes unless already known from the course (SQS, SNS, RDS, ElastiCache).

| # | Lesson | Example app | Mission goal it covers | Status |
|---|---|---|---|---|
| 1 | [Building blocks](lessons/0001-ecs-building-blocks.html): cluster, task definition, task, service | Forecast API | Name and explain each building block | ✓ Done |
| 2 | [Reading a task definition](lessons/0002-reading-a-task-definition.html) | Nightly MILP planner | Read a Fargate task definition | ✓ Done |
| 3 | [Networking for Fargate](lessons/0003-networking-for-fargate.html): VPC, subnets, security groups, ALB | Forecast API | Sketch the network path | ✓ Done |
| 4 | [Running one job well](lessons/0004-running-jobs.html): RunTask, lifecycle, exit codes, scheduling | Nightly MILP planner | Choose an app's shape (scheduled or standalone task) | ✓ Done |
| 5 | [Running many jobs](lessons/0005-running-many-jobs.html): fan-out, concurrency, Spot with retries, comparing results against a baseline | Scenario Lab | Choose an app's shape (fan-out) | ✓ Done (quiz 7/8; leaned too far into Step Functions, kept as is) |
| 6 | [Deploying a service safely](lessons/0006-deploying-a-service.html): rolling updates, health checks and grace period, circuit breaker and alarm rollback, blue/green, linear, canary | Forecast API | Run an always-on app safely | ✓ Done (quiz 8/8) |
| 7 | [Scaling a service](lessons/0007-scaling-a-service.html): Service Auto Scaling (target tracking on CPU or requests per task), workers scaling on SQS queue depth, handling messages delivered twice | Forecast API, solve-on-demand worker | Run an always-on app safely; choose an app's shape (queue worker) | ✓ Done (quiz 8/8) |
| 8 | [Images and secrets](lessons/0008-images-and-secrets.html): ECR repositories, image tags that can't be overwritten, lifecycle cleanup, image scanning, config vs secrets | Retraining job, agent assistant, forecast API | Get ready for deploy day | ✓ Done (quiz 7/8) |
| 9 | [Debugging and observability](lessons/0009-debugging-and-observability.html): logs, Container Insights, ECS Exec (a shell inside a running task), a "task won't start" playbook | Agent code sandbox, inference API + sidecar | Debug a task that won't start | ✓ Done (quiz 8/8) |
| 10 | [Choosing compute and cost](lessons/0010-choosing-compute-and-cost.html): Fargate vs Spot vs Managed Instances vs EC2 (for GPUs), Express Mode, ARM/Graviton, rough cost reasoning | Mix of all apps | Choose between Fargate, Managed Instances, EC2 and Express Mode | ✓ Done (quiz 8/8) |
| 11 | [Capstone design](lessons/0011-capstone-agent-assistant.html): you design one app end to end and we review it like an architecture review, plus a first look at infrastructure-as-code | Agentic data-exploration assistant (user's choice) | Brings everything together | ✓ Done (design reviewed part by part) |
| 12 | [Infrastructure as code: a first look](lessons/0012-infrastructure-as-code-first-look.html): the capstone sandbox in CDK (Python) | Agentic assistant (capstone) | Brings everything together | Delivered 2026-10-24 (scores pending) |

**Optional, later:** hands-on lessons once you have an AWS account (deploying and breaking things). Not counted above, since the mission is concepts-only for now.

**Fast track (offered):** 10 → 11, folding the key parts of 7 to 9 into the capstone review. The full path is the default and is recommended, because lessons 6, 7 and 9 cover where most real-world problems show up.
