# PostHog Self-driving setup report

## Summary

PostHog Self-driving has been configured for the Organiq React web app. Session Replay and Error Tracking were already enabled; Support was enabled in this run. Health checks, error-tracking responders, and the Support-ticket responder are enabled, and two Replay Vision monitors now send corroborated findings to the inbox.

Fresh scouts and monitors are picked up within about 30 minutes. Findings will appear in the [Self-driving inbox](https://us.posthog.com/project/588428/inbox).

## AI data processing

Approved by the wizard's organization-level consent gate.

## GitHub

GitHub was already connected before this setup. No repository or GitHub source changes were requested because no connected tool was selected.

## Products enabled

| Product | Status | Web SDK check |
|---|---|---|
| Session Replay | Already enabled | Clean: the `posthog-js` initialization does not disable recording and masks inputs. |
| Error Tracking | Already enabled | Clean: the initialization does not disable exception capture. |
| Support (Conversations) | Enabled in this run | An inbound support channel is still required before tickets can arrive. |

## Signal sources

| Source product | Source type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | Left at its server-default enabled state; no row is needed for scouts to reach the inbox. |
| `health_checks` | `health_issue` | Enabled (source id `01a066ac-c20e-7491-b16b-fc05ec30c594`). |
| `error_tracking` | `issue_created` | Enabled (source id `01a066ac-c26e-7302-8381-982210937df2`). |
| `error_tracking` | `issue_reopened` | Enabled (source id `01a066ac-c16c-7804-96f9-30a0ca6f1c2d`). |
| `error_tracking` | `issue_spiking` | Enabled (source id `01a066ac-c158-76a2-868a-f96550e84abd`). |
| `conversations` | `ticket` | Enabled (source id `01a066ac-c16d-7330-bbd5-f8f8bab04977`). |
| `session_replay` | `session_analysis_cluster` | Deliberately skipped: this retired route is replaced by the Replay Vision scanners below. |
| `replay_vision` | scanner findings | Self-authorized by each scanner's `emits_signals: true`; no source row is required. |

The persisted source inventory was verified after setup: all five created responder rows are enabled.

## Connected tools

No external tool was selected in the connected-tools prompt, so no warehouse source or connected-tool responder was added. GitHub remains connected at the integration level but GitHub Issues was not enabled as a Self-driving source.

## Scout troop

**Enabled (5 of 27):**

| Scout | Reason |
|---|---|
| `general` | Covers cross-product correlations and surfaces without a dedicated specialist. |
| `product-analytics` | Covers core product-flow regressions in the browser app. |
| `web-analytics` | Covers acquisition, landing-page, attribution, and traffic-health changes. |
| `web-vitals` | Covers page-level Core Web Vitals regressions. |
| `health-checks` | Prioritizes actionable PostHog setup-health issues. |

**Disabled (22 of 27):**

| Scout or group | Reason |
|---|---|
| `ai-observability`, `apm`, `logs`, `mcp-tool-calls`, `tasks` | No confirmed use of the respective telemetry surface. |
| `anomaly-detection`, `observability-gaps`, `insight-alerts`, `inbox-validation` | Kept off on this new, low-data configuration to avoid overlapping or premature checks. |
| `conversations`, `customer-analytics`, `data-pipelines`, `data-warehouse` | No active support-channel, accounts, pipeline, or warehouse workflow was confirmed. |
| `csp-violations` | No CSP reporting was found. |
| `error-tracking` | Covered by the enabled native Error Tracking responders. |
| `experiments`, `feature-flags`, `surveys` | Not evidenced as active in this repository; surveys also have no configured survey data. |
| `replay-vision`, `session-replay` | Replay is covered by the two signal-emitting Replay Vision monitors below. |
| `revenue-analytics` | No payment or revenue instrumentation was found. |
| `skills-store` | Not a product surface for this application. |

Scout budget verified: **100 runs/day**, **0 used today**, **100 remaining**. The project banner says scouts are in early access and additional runs can be requested through `team-self-driving@posthog.com`.

## Custom scouts

No custom scout was created. Two project-specific candidates were proposed but not accepted when the interactive selection was cancelled:

- **Property connection completion** — a focused monitor for the Search Console property-selection and consent flow.
- **Content-generation completion** — a focused monitor for article-generation attempts that fail or do not return content.

These are reasonable future candidates, but the repository currently relies chiefly on autocapture/pageviews and mock data rather than explicit success/failure event pairs for these domain flows. The enabled product and web scouts cover the generic behavior in the meantime. If a future custom scout becomes noisy, set its config's `emit` value to `false` to keep it in dry-run mode.

## Replay Vision scanners

A scanner is an LLM that reviews individual session recordings on a schedule and pushes observed defects to the inbox. It is the only part of this setup that spends Replay Vision quota. Findings have half weight and need independent corroboration before becoming an inbox report.

| Monitor | Status | Watches | Query scope | Sampling | Estimate |
|---|---|---|---|---:|---:|
| Content generation breakage | Created | Visible generation failures: unrecovered spinners, missing content or SEO sections, and failed download/edit actions. | URLs containing `/content-generation`, the product's article-creation completion flow. | 50% | 0 observations/month, 0 credits/month |
| Organiq user frustration | Created | Visible struggle while connecting Search Console, using SEO tools, generating content, or finding recommendations. | Sessions containing `$rageclick` only; deliberately not URL-scoped to keep it distinct from the breakage monitor. | 100% | 0 observations/month, 0 credits/month |

Replay Vision quota was verified before creation: 2,500 credits remain in the current period and neither monitor projects cost from the current recording sample. No recordings were found in the preceding seven days, so both monitors are armed and will begin work when recorded sessions arrive.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support ticket responder has tickets to process.
- [ ] Generate real browser traffic after deployment and confirm Session Replay recordings arrive; this activates the monitors' current zero-cost estimates.
- [ ] Replace the mock-only frontend flows with real backend telemetry and add explicit, non-PII success/failure events for property connection and content generation before reconsidering the two custom scouts.
- [ ] Enable a connected-tool responder later only if the relevant tool is intentionally selected for Self-driving review.

## Files modified or created

| Path | Change |
|---|---|
| `posthog-self-driving-report.md` | Created this setup report. |

No application source files or environment files were modified.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scouts draw from the verified daily run budget, cluster findings into reports, and place immediately actionable work in the [Self-driving inbox](https://us.posthog.com/project/588428/inbox).