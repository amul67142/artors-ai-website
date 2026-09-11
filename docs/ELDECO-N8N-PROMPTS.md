# n8n builder prompts — Eldeco presales

Paste these into n8n's "What do you want to automate?" box, **one at a time, in
order**. Build in stages: AI builders produce a much better graph from three
focused prompts than from one long one, and you can check each stage before the
next depends on it.

## Why three workflows, not one

A phone call takes minutes and its result arrives as a webhook from Ringg. An n8n
execution cannot sit open waiting for that — and should not, because a restart
would lose every call in flight. The webhook starts a **new** execution, so the
natural seam is:

| | Workflow | Trigger |
|---|---|---|
| **A** | Intake → first contact → place the call | Meta / Google lead |
| **B** | Call result → route → book | Ringg webhook |
| **C** | Retry sweep for unanswered calls | Schedule, every 30 min |

They share state through the **`Leads`** sheet. That sheet is the memory between
them, which is the other reason it is written before anything else happens.

---

## Prompt 1 — Workflow A: intake and first contact

```
Build a lead intake and first-contact workflow for a real estate developer.

TRIGGER
Two entry points into the same flow:
1. A Facebook Lead Ads trigger.
2. A Webhook node named "google-lead" for Google lead form submissions.

STEPS
1. A Code node that normalises either payload into one object:
   lead_id (generate a UUID), created_at (ISO), name, phone (convert to E.164
   with +91 if it has no country code), email, source ("facebook" or "google"),
   campaign, project, status ("new"), attempts (0).

2. A Google Sheets node that looks up the phone number in a sheet called
   "Leads" to check whether this person already enquired in the last 7 days.

3. An IF node on that result:
   - If found: update the existing row's created_at and campaign, then stop.
     Do not contact them again.
   - If not found: continue.

4. A Google Sheets "append row" node writing the normalised object to "Leads".
   This must happen BEFORE any message is sent.

5. An IF node checking whether the current time in Asia/Kolkata is between
   09:00 and 20:00. If it is outside those hours, stop — a separate scheduled
   workflow will pick it up. If inside, continue.

6. A WhatsApp Business Cloud node sending an approved template message to the
   lead's phone, with their name and project name as variables.

7. A Wait node for 90 seconds.

8. An HTTP Request node, POST to
   https://prod-api.ringg.ai/ca/api/v0/calling/outbound/individual
   with headers "X-API-KEY" (credential placeholder) and
   "Content-Type: application/json", and this JSON body:
     name, mobile_number (the E.164 phone), agent_id (placeholder),
     from_number_id (placeholder), and custom_args_values containing
     lead_id, callee_name, project, campaign and source.

9. A Google Sheets update node setting status to "calling", attempts to 1 and
   last_attempt_at to now, matching on lead_id.

Add error handling so that if the WhatsApp or HTTP node fails, the workflow
continues and writes the error into the Leads row rather than stopping.
```

---

## Prompt 2 — Workflow B: the call comes back

```
Build a workflow that processes the result of an AI voice call for a real
estate developer.

TRIGGER
A Webhook node named "call-result" receiving Ringg AI's
"all_processing_completed" event. The payload includes: status, sub_status,
call_duration, recording_url, transcript (an array of {bot} / {user} objects),
custom_args_values (which contains our lead_id), and a custom analysis object
with the fields our agent was configured to extract.

STEPS
1. A Switch node on sub_status — NOT on status, because an unanswered call
   still arrives with status "completed". Three outputs:
   - "ACCEPTED" → answered branch
   - "no answer" or "busy line" → no-answer branch
   - anything else → failed branch

ANSWERED BRANCH
2. A Code node that reads lead_id out of custom_args_values, flattens the
   transcript array into a single string, and pulls the custom analysis fields
   (intent, budget, config, location, timeline, purpose, loan_needed, summary)
   into top-level values, defaulting any missing field to empty.

3. An HTTP Request node that downloads recording_url and a Google Drive upload
   node that saves it to a folder, returning a permanent link. Ringg's
   recording URLs expire after 24 hours, so this must happen now or the
   recording is lost.

4. A Google Sheets append node writing to a sheet called "Outcomes":
   lead_id, called_at, call_status, duration_s, intent, budget, config,
   location, timeline, purpose, loan_needed, summary, recording_url, and the
   permanent Drive link, and the first 5000 characters of the transcript only.

5. A Google Sheets update node setting the matching "Leads" row status to the
   classified intent.

6. An IF node: if intent is "qualified", send a WhatsApp message to the sales
   manager with the lead's name, phone, budget, configuration and the summary.

7. An IF node: if intent is "qualified" or "interested", send the lead a
   WhatsApp template containing a Cal.com booking link so they can pick a site
   visit slot.

NO-ANSWER OR BUSY BRANCH
8. A Google Sheets update node setting status to "no_answer".
9. A WhatsApp template message telling them we tried to reach them and asking
   for a good time, including the Cal.com link.

FAILED BRANCH
10. Send an alert to an internal Slack or email address. Do not message the
    lead.
```

---

## Prompt 3 — Workflow C: retries and the out-of-hours queue

```
Build a scheduled workflow that retries unanswered leads for a real estate
developer.

TRIGGER
A Schedule trigger running every 30 minutes.

STEPS
1. An IF node that stops immediately unless the current time in Asia/Kolkata
   is between 09:00 and 20:00.

2. A Google Sheets node reading all rows from a sheet called "Leads".

3. A Code node that filters to rows needing action:
   - status is "new" (these arrived out of hours and were never contacted), or
   - status is "no_answer" AND attempts is less than 3 AND last_attempt_at is
     more than 3 hours ago for attempt 2, or more than 24 hours ago for
     attempt 3.

4. A Loop Over Items node over that filtered list.

5. Inside the loop, an HTTP Request node that starts an outbound AI voice call,
   same shape as the intake workflow.

6. A Google Sheets update node incrementing attempts and setting
   last_attempt_at to now.

7. After the loop, a second Code node that finds rows where status is
   "no_answer" and attempts is 3 or more, sets their status to "unreachable",
   and sends a single WhatsApp summary of those to the sales manager so a human
   can decide whether to chase.

Never call the same lead more than 3 times in total.
```

---

## What the builder will get wrong

Expect a scaffold, not a finished workflow. Budget an hour or two of hand-fixing
for each of these — none of it is the builder being bad, it is the builder not
having access to the things only you have:

- **Credentials.** Every Google, Meta and WhatsApp node needs connecting by hand.
- **The Ringg call.** n8n has no Ringg node, so it produces a generic HTTP Request.
  The endpoint and header in Prompt 1 are verified against their docs, but
  `agent_id` and `from_number_id` come from your own Ringg workspace — fill those
  in by hand.
- **Custom Analysis must exist first.** Workflow B reads fields that Ringg only
  returns if the agent has them configured under Advanced Settings → Custom
  Analysis. Set those up and run their **Test Analysis** before wiring B, or the
  columns arrive empty and it looks like an n8n bug.
- **Sheet column mapping.** It will guess column names. Create both sheets with the
  exact headers from `ELDECO-PRESALES.md` §3b first, then point the nodes at them.
- **The WhatsApp template names.** Templates must exist and be Meta-approved before
  these nodes will send anything. Submit them on day one.
- **Timezone handling.** Builders are unreliable here and the failure is silent. Set
  the workflow timezone to `Asia/Kolkata` in settings, then test the working-hours
  IF at 8am and 9pm deliberately.

## Test it in this order

1. **Workflow A with your own number.** Confirm the row lands in `Leads` before
   any message goes out — pull the WhatsApp credential temporarily to prove the
   append still happens when the send fails.
2. **Workflow B by posting a fake webhook** with a made-up transcript. Check the
   classifier returns nulls where the transcript is silent rather than inventing.
3. **Workflow C with the clock moved** — set `last_attempt_at` back by hand and
   watch it pick the row up. Then confirm it stops dead at three attempts.
4. Only then point real ad spend at it.
