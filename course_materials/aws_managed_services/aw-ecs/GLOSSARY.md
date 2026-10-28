# AWS ECS on Fargate Glossary

Canonical terms for this workspace. Lessons use these words exactly.

## Core objects

**Task definition**:
A versioned JSON blueprint describing one or more containers plus task-level settings (size, roles, network mode).
_Avoid_: task spec, config file

**Family**:
The name of a task definition; all its revisions share it.

**Revision**:
One immutable, numbered version of a task definition, written `family:revision` (e.g. `api:7`). Different from an image tag, which versions the code.
_Avoid_: version (ambiguous with image tags)

**Task**:
One running copy of a task definition: its containers start, stop and share `localhost` together.
_Avoid_: instance, pod, job (for a single task)

**Standalone task**:
A task run on its own (not by a service) that runs until it exits and is not replaced. Used for run-and-exit work like a nightly MILP.

**Service**:
Keeps a desired count of tasks from one task definition revision running, replacing any that stop.

**Desired count**:
The number of tasks a service keeps running; autoscaling moves it between a min and max.

**Cluster**:
A logical grouping of services and standalone tasks; on Fargate, just a namespace/boundary.

**Sidecar**:
A helper container in the same task as an app container (log router, telemetry agent, proxy); bound to it 1:1.

## Compute

**Fargate**:
Serverless compute for ECS tasks: each task gets its own isolated, right-sized environment; no servers to manage.

## Running jobs

**Container override**:
A per-run change (command, environment) passed to RunTask for one container, without registering a new revision. All overrides together are ≤ 8,192 characters, so pass IDs and keep large inputs in S3.

**Exit code**:
How a container's process ended. `0` = success (by your own contract), `1` = application error, `137` = SIGKILL (often out of memory), `143` = SIGTERM (e.g. a Spot interruption).

**clientToken**:
An idempotency key on RunTask. A retry with the same token and parameters (within 24h) returns the original task instead of starting a second one.

## Many jobs

**Map state**:
A Step Functions state that runs the same steps once per item in a list. Inline mode: ≤ 40 at once. Distributed mode: ≤ 10,000 child workflows.

**MaxConcurrency**:
The Map's cap on iterations running at once. Set it from the Fargate vCPU quota: (quota − other usage) ÷ vCPU per task.

**.sync (Run a Job)**:
A Step Functions integration pattern (`ecs:runTask.sync`) that starts the task and waits until it stops.

**Idempotent job**:
A job that leaves the same final state whether it runs once or several times, e.g. by writing to an output key that depends only on run_id and scenario_id.

**Essential container**:
A container marked `"essential": true` in the task definition. If it stops, ECS stops the whole task. If a non-essential container (`"essential": false`) stops, the rest of the task keeps running.

## Services in production (lesson 6)

**Deployment**:
What ECS does when a service gets a new task definition revision (or a forced new deployment): it replaces the old tasks with new ones. Its rollout state is IN_PROGRESS, then COMPLETED or FAILED.

**Rolling update**:
The default deployment strategy. ECS swaps tasks in batches, bounded by `minimumHealthyPercent` and `maximumPercent`.

**Health check grace period**:
`healthCheckGracePeriodSeconds`: how long after a task starts ECS ignores failed load balancer health checks. Default 0.

**Deregistration delay**:
A target group setting: how long a task that's leaving keeps finishing in-flight requests before it's stopped. Default 300 s.

**Deployment circuit breaker**:
Marks a deployment FAILED when new tasks keep failing to start or to pass health checks, and can roll back to the last COMPLETED deployment.

**Container health check**:
The `healthCheck` in a container definition: a command ECS runs inside the container, where exit 0 = healthy. Its startup allowance is `startPeriod`. The only health check a worker with no load balancer can have.
_Avoid_: health check (on its own, when the ALB's target group health check could be meant)

## Scaling (lesson 7)

**Service Auto Scaling**:
Changes a service's `desiredCount` between a min and a max, driven by a policy. Done by Application Auto Scaling, a separate AWS service. Attaches only to services.

**Target tracking**:
A scaling policy that keeps one metric near a target value, scaling roughly in proportion: new count ≈ current × (metric ÷ target).

**Backlog per task**:
Messages visible in the queue ÷ running tasks. The metric to scale queue workers on. Target = acceptable wait ÷ time per message.

**Task scale-in protection**:
A flag a service task sets on itself (`$ECS_AGENT_URI/task-protection/v1/state`) so scale-in and deployments skip it while it's busy. Expires after 120 minutes by default.

## Images and secrets (lesson 8)

**Image tag**:
A human label on an image in an ECR repository, e.g. `retrain:2026-10-24-a1b2c3d`. Movable by default.
_Avoid_: version (ambiguous with revisions)

**Image digest**:
`@sha256:…`, a hash of the image's content. It can never point at a different image.

**Tag immutability**:
A repository setting (`IMMUTABLE`, or `IMMUTABLE_WITH_EXCLUSION` for filtered exceptions) that rejects pushing a tag that already exists (`ImageTagAlreadyExistsException`).

**Software version consistency**:
A service resolves the tag to a digest once per deployment and uses that digest for every later task. Standalone tasks don't: they resolve the tag at every start.

**Lifecycle policy**:
ECR rules that expire (delete) or archive images by tag status, count or age. They don't know what ECS is running.

## Debugging (lesson 9)

**stopCode / stoppedReason**:
On a stopped task: `stopCode` is the broad category (e.g. `TaskFailedToStart`, `EssentialContainerExited`); `stoppedReason` is the detail, starting with an error category such as `ResourceInitializationError` or `CannotPullContainerError`. Visible for about an hour.

**Log stream**:
One per container per task in CloudWatch Logs, named `<prefix>/<container name>/<task ID>`. No stream usually means the container never started.

**Container Insights**:
A cluster setting (`disabled`, `enabled`, `enhanced`) that collects CPU, memory, disk and network metrics per cluster, service and task, including `RunningTaskCount`. Running tasks only.

**ECS Exec**:
A shell or command inside a running container through Systems Manager, with no SSH or open ports. Only for tasks started after it's enabled; needs `ssmmessages` permissions on the task role.

**Container restart policy**:
`restartPolicy` on a container: ECS restarts that container in place, without replacing the task, if it has run at least `restartAttemptPeriod` seconds (default 300).

## Compute (lesson 10)

**Capacity provider**:
Where a task physically runs: `FARGATE`, `FARGATE_SPOT`, a Managed Instances provider, or an EC2 Auto Scaling group. Chosen with `capacityProviderStrategy` (`base` = first N tasks there, `weight` = split of the rest).

**Fargate Spot**:
Fargate on spare capacity, up to 70% cheaper, reclaimable with a 2-minute warning and SIGTERM. For interruptible, retry-safe work.

**Managed Instances**:
ECS compute where AWS launches, patches and replaces EC2 instances in your account. Pay EC2 price + a management fee. For GPUs, > 32 vCPU / 244 GB, privileged containers or specific instance types.

**Express Mode**:
A shortcut that creates a complete Fargate web service (task definition, service, HTTPS ALB, auto scaling, logs, alarms) from an image and two roles. Not a separate compute type.

**CPU architecture**:
`X86_64` (default) or `ARM64` (Graviton, ~20% cheaper on Fargate), set in `runtimePlatform`. Baked into the image at build time; a mismatch gives `exec format error`.
_Avoid_: "Linux distro" as the thing that must match
