# AWS ECS on Fargate Resources

## Knowledge

- [AWS docs: Amazon ECS task definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
  Official definitions of task definition, task and service. Use for: the core mental model (lesson 0001).
- [AWS docs: Amazon ECS Developer Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
  The primary reference for everything ECS. Use for: any detail before trusting memory.
- [AWS docs: Architect for AWS Fargate for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
  What Fargate removes from your plate and the per-task isolation boundary. Use for: "why Fargate" questions.
- [AWS docs: Amazon ECS cluster capacity (best practices)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/capacity-cluster-best-practice.html)
  Capacity providers, Fargate vs Fargate Spot, the 1:1 task-to-compute model. Use for: compute choice lessons.
- [AWS docs: Task definition differences for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
  What Fargate supports, valid CPU/memory combos. Use for: sizing, Fargate limits.
- [AWS docs: Amazon ECS best practices guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-best-practices.html)
  AWS's own opinions on networking, security, scaling. Use for: design decisions.
- [AWS docs: Resources created by ECS Express Mode services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-work.html)
  Lists the ALB, scaling, logs, certs etc. Express Mode builds for you. Use for: the "fast path" lesson and as a checklist of what a production web service needs.
- [AWS docs: ECS Best Practices, Running your application](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/application.html)
  One business purpose per task definition, sidecars, why not to bundle containers. Use for: app design questions.
- [AWS docs: Task networking options for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
  The three ways a Fargate task gets out (public IP, NAT, VPC endpoints). Use for: lesson 3, "task stuck pending".
- [AWS Compute blog: Task Networking in AWS Fargate](https://aws.amazon.com/blogs/compute/task-networking-in-aws-fargate/)
  Public ALB + private task pattern, internal load balancers. Use for: network layout design.
- [AWS docs: ECR interface VPC endpoints](https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html)
  Which endpoints a private image pull needs, and why S3 is one of them. Use for: fully private VPCs.
- [re:Post: Fargate tasks stuck in PENDING](https://repost.aws/knowledge-center/ecs-fargate-tasks-pending-state)
  Troubleshooting checklist. Use for: debugging task startup.
- [AWS docs: Amazon ECS task lifecycle](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-lifecycle-explanation.html)
  Every task state and what happens in it. Use for: debugging any task.
- [re:Post: Why has my Amazon ECS task stopped?](https://repost.aws/knowledge-center/ecs-task-stopped)
  Exit codes 0/1/137/139/143 explained, plus the 1-hour visibility of stopped tasks. Use for: post-mortems.
- [AWS docs: EventBridge Scheduler schedule types](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html)
  Cron/rate/one-time, time zones. Use for: scheduling jobs.
- [AWS docs: ECS idempotency](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_Idempotency.html)
  RunTask clientToken. Use for: safe retries.
- [AWS ECS FAQs](https://aws.amazon.com/ecs/faqs/)
  Short official answers, including Express Mode. Use for: quick comparisons.
- [AWS Containers blog: Extending ECS Express Mode](https://aws.amazon.com/blogs/containers/extending-amazon-ecs-express-mode-to-build-an-optimal-container-environment/)
  Walkthrough of what Express Mode creates and how to customise it. Use for: later, when deploying.
- [AWS docs: Run Amazon ECS or Fargate tasks with Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html)
  The `ecs:runTask.sync` integration, PascalCase parameters, failures → AmazonECS.Unknown, the IAM policy. Use for: lesson 5, orchestrating many tasks.
- [AWS docs: Map workflow state](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html)
  Inline (≤40 concurrent) vs Distributed (≤10,000). Use for: fan-out design.
- [AWS docs: AWS Fargate throttling quotas](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/throttling.html)
  RunTask rate limits on Fargate. Use for: launching many tasks.
- [AWS docs: Fargate service quotas](https://docs.aws.amazon.com/general/latest/gr/eks.html)
  vCPU-based concurrency quota (new-account default 6). Use for: concurrency math.
- [AWS docs: Fargate Spot termination notices](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html)
  Two-minute warning, SIGTERM, TerminationNotice. Use for: Spot design.

- [AWS Containers blog: A deep dive into ECS task health and task replacement](https://aws.amazon.com/blogs/containers/a-deep-dive-into-amazon-ecs-task-health-and-task-replacement/)
  How ECS decides a task is healthy and when it replaces one; why min/max percent matter less on Fargate. Use for: lesson 6, deployments.
- [AWS docs: ECS deployment circuit breaker](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html)
  The two failure stages, threshold, rollback target, SERVICE_DEPLOYMENT_FAILED. Use for: debugging stuck or failed deployments.
- [AWS docs: ECS DeploymentConfiguration API](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeploymentConfiguration.html)
  Every deployment field and default (min/max percent, strategy, alarms, bake time). Use for: exact field names.
- [AWS Containers blog: Gradual deployments with linear and canary](https://aws.amazon.com/blogs/containers/gradual-deployments-in-amazon-ecs-with-linear-and-canary-strategies/)
  Built-in traffic-shifting strategies with alarms and bake time. Use for: choosing a deployment strategy.

- [AWS docs: Automatically scale your Amazon ECS service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
  Policy types, scale-in paused during deployments. Use for: lesson 7, scaling.
- [AWS docs: Use a target metric to scale ECS services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-targettracking.html)
  Target tracking rules (out fast/in slow, no data = no action, multiple policies). Use for: choosing targets.
- [AWS docs: Scale ECS services based on an SQS queue](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-queue.html)
  Backlog per task, target formula, Container Insights requirement, scale-in protection. Use for: queue workers.
- [AWS docs: Task scale-in protection endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-scale-in-protection-endpoint.html)
  ProtectionEnabled, ExpiresInMinutes (1-2,880, default 120). Use for: workers doing long jobs.

- [AWS blog: Announcing software version consistency for ECS services](https://aws.amazon.com/blogs/containers/announcing-software-version-consistency-for-amazon-ecs-services/)
  How services resolve a tag to a digest once per deployment. Use for: lesson 8, the reused-tag trap.
- [AWS docs: ECS container image resolution](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html)
  versionConsistency, digest capture rules. Use for: exact behaviour.
- [AWS docs: ECR tag immutability](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html)
  IMMUTABLE and the _WITH_EXCLUSION variants. Use for: repository setup.
- [AWS docs: ECR lifecycle policy properties](https://docs.aws.amazon.com/AmazonECR/latest/userguide/lifecycle_policy_parameters.html)
  rulePriority, tagStatus, countType (incl. sinceImagePulled, archive). Use for: cleanup rules.
- [AWS docs: ECR image scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
  Basic vs enhanced (Inspector). Use for: vulnerability questions.
- [AWS docs: Secrets Manager secrets as ECS environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)
  ARN syntax with json-key/version, injected at start only. Use for: secrets.
- [re:Post: ResourceInitializationError pulling secrets](https://repost.aws/knowledge-center/ecs-unable-to-pull-secrets)
  Error strings and fixes. Use for: lesson 9 playbook.

- [re:Post: Why has my Amazon ECS task stopped?](https://repost.aws/knowledge-center/ecs-task-stopped) is already listed above; lesson 9's primary source.
- [AWS docs: Amazon ECS stopped tasks error messages](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/stopped-task-error-codes.html)
  Error categories, each linking to a fix-it page. Use for: day-one debugging.
- [AWS docs: Monitor ECS containers with ECS Exec](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html)
  Requirements, limits (new tasks only, root, 20-min idle, no read-only root fs). Use for: shell access.
- [AWS docs: Container Insights for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-container-insights.html)
  enabled vs enhanced; running tasks only. Use for: metrics.
- [AWS blog: Troubleshooting with ECS events in the console](https://aws.amazon.com/blogs/containers/troubleshooting-containerized-workloads-with-amazon-ecs-events-in-the-aws-console/)
  Event capture + Event History tab beats the 1-hour stopped-task limit. Use for: post-mortems.
- [AWS blog: Best practices for resilience on ECS](https://aws.amazon.com/blogs/containers/best-practices-for-resilience-and-availability-on-amazon-ecs/)
  Container restart policies incl. sidecars. Use for: keeping sidecars alive.

- [AWS Fargate pricing](https://aws.amazon.com/fargate/pricing/)
  Per-second vCPU/GB rates, x86 vs ARM, Spot up to 70% off, Savings Plans up to 50%, worked examples. Use for: cost estimates.
- [AWS docs: When to use ECS Managed Instances](https://docs.aws.amazon.com/batch/latest/userguide/when-to-use-ecs-managed-instances.html)
  The checklist (GPU, >32 vCPU/244 GB, privileged, instance types). Use for: compute choice.
- [AWS blog: GPU batch inference on Managed Instances with scale to zero](https://aws.amazon.com/blogs/containers/run-gpu-batch-inference-on-amazon-ecs-managed-instances-with-scale-to-zero/)
  GPU jobs without managing servers; fee structure. Use for: deep-learning workloads.
- [Amazon ECS pricing](https://aws.amazon.com/ecs/pricing/)
  Managed Instances = EC2 price + management fee. Use for: cost comparisons.

- [AWS CDK Developer Guide: What is the AWS CDK?](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
  How CDK turns code into CloudFormation. Use for: lesson 12, IaC.
- [CDK Python aws_ecs module](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_ecs/README.html)
  Task definitions, services, patterns, grant_run. Use for: writing ECS in CDK.
- [AWS docs: Interconnect ECS services (best practices)](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/networking-connecting-services.html)
  Service Connect recommended for service-to-service calls. Use for: multi-service designs.

## Wisdom (Communities)

- [AWS re:Post](https://repost.aws/) (filter by the Amazon Elastic Container Service tag)
  Official AWS Q&A, answered by AWS staff and community experts. Use for: "why won't my task start" style questions.
- [r/aws](https://www.reddit.com/r/aws/)
  Large, active practitioner subreddit. Use for: architecture critique, "Fargate vs X" real-world opinions.
- [aws/containers-roadmap on GitHub](https://github.com/aws/containers-roadmap)
  Public roadmap and issues for ECS/Fargate/EKS. Use for: checking whether a missing feature is known or planned.
- Your PGP course cohort and instructors. Use for: reviewing your architecture sketches.

## Gaps

- No hands-on practice yet (no account). When the user gets an account, add the official ECS getting-started tutorial for Fargate.
