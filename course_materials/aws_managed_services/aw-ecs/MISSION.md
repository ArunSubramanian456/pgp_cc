# Mission: Running my own app on AWS ECS with Fargate

## Why
I'm an AI/ML data scientist (forecasting, LP/MILP optimisation in supply chain, agentic ML workflows). I want to be able to put my models, solvers and agents into production on AWS without running servers myself. For now I'm learning the concepts, with no AWS account yet, so that on the day I do deploy I already know what every piece does and can design it on purpose.

## Success looks like
- I can name and explain each ECS building block (cluster, task definition, task, service) and how they fit together on Fargate
- I can read a Fargate task definition and say what every field does (image, CPU/memory, roles, ports, logs, secrets)
- I can sketch the network path for a public web app: ALB -> target group (ip) -> tasks in a VPC
- For any forecasting / optimisation / agentic app, I can choose the right ECS shape (service, scheduled or standalone task, queue worker, sidecar) and justify it
- I can choose between Fargate, ECS Managed Instances, EC2 launch type and Express Mode for a given app, and explain why
- When I get an account, I can deploy a sample image and debug a task that won't start

## Constraints
- Concepts only for now: no AWS account, so no hands-on deploys yet
- Has built Docker images before; doesn't need Docker basics
- Examples must rotate through many app ideas from the user's domain (forecasting, MILP/LP, supply chain, agentic AI). Never fix on one app. See the idea bank in NOTES.md

## Out of scope
- EKS / Kubernetes
- Docker fundamentals
- CI/CD pipelines (for now)
