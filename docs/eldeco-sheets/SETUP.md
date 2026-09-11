# Setting up the two sheets — step by step

Do this before touching n8n. Everything else reads these, and if the columns do
not exist yet the workflow builder invents its own names — which you then spend
longer correcting than creating them properly took.

Ten minutes, no n8n knowledge needed.

---

## Step 1 — Make the spreadsheet

1. Open **sheets.new** in your browser.
2. At the top left, click **Untitled spreadsheet** and name it:
   **`Eldeco Presales`**

## Step 2 — Set up the first tab

1. At the bottom left, right-click the tab called **Sheet1** → **Rename**
2. Type **`Leads`** and press Enter
3. Click cell **A1** (top left)
4. Copy the block below and paste it into A1.
   It will spread itself across the columns automatically.

```
lead_id	created_at	name	phone	email	source	campaign	project	status	attempts	last_attempt_at	assigned_to
```

## Step 3 — Set up the second tab

1. At the bottom left, click the **+** to add a new tab
2. Rename it **`Outcomes`** (right-click → Rename)
3. Click cell **A1**
4. Paste this block:

```
lead_id	called_at	call_status	duration_s	intent	budget	config	location	timeline	purpose	loan_needed	summary	recording_url	drive_link	transcript_excerpt
```

## Step 4 — Make the headers stay put

On **both** tabs:

1. Click row **1** (the number down the left) to select the whole row
2. Menu: **View → Freeze → 1 row**
3. Then **Format → Text → Bold**

Now the headers stay visible when the sales team scrolls.

## Step 5 — Copy the link

Click **Share** (top right) → **Copy link**. Keep it somewhere — n8n needs it,
and so does Eldeco's sales team.

---

## That is it. What you just built

**`Leads`** — every enquiry that ever arrives, one row each. Written the moment
a lead lands, before any message goes out, so nothing is ever lost to a failed
WhatsApp send or a Ringg outage.

**`Outcomes`** — one row per completed call. What was said, what they want, and
whether they are worth a sales manager's hour.

They are kept apart on purpose. `Leads` is the permanent record; `Outcomes` is
the working sheet. If they were one tab, a later step would overwrite the
original capture and you would lose the audit trail.

---

## What goes in each column

### Leads

| Column | What it holds | Filled by |
|---|---|---|
| `lead_id` | A unique code for this enquiry | n8n, automatically |
| `created_at` | When it arrived | n8n |
| `name` | Their name | The ad form |
| `phone` | With +91 on the front | n8n tidies this up |
| `email` | If the form collected one | The ad form |
| `source` | `facebook` or `google` | n8n |
| `campaign` | Which ad brought them | The ad form |
| `project` | Which Eldeco project | The ad form |
| `status` | `new` → `calling` → `qualified` / `no_answer` / `unreachable` | n8n, as things progress |
| `attempts` | How many times we have called. **Never goes past 3** | n8n |
| `last_attempt_at` | When we last tried | n8n |
| `assigned_to` | Which sales manager owns it | n8n, once qualified |

### Outcomes

| Column | What it holds |
|---|---|
| `lead_id` | Matches the row in `Leads` |
| `called_at` | When the call happened |
| `call_status` | `ACCEPTED`, `no answer`, `busy line` |
| `duration_s` | Length in seconds |
| `intent` | `qualified` · `interested` · `not_interested` · `wrong_number` · `callback_later` |
| `budget` | What they said they can spend |
| `config` | 2BHK, 3BHK, villa, commercial |
| `location` | Where they want to buy |
| `timeline` | `immediate` · `3_months` · `6_months_plus` |
| `purpose` | `end_use` or `investment` |
| `loan_needed` | yes / no |
| `summary` | Two lines for the salesperson to open the call with |
| `recording_url` | Ringg's link — **expires after 24 hours** |
| `drive_link` | Our permanent copy of the recording |
| `transcript_excerpt` | The start of the conversation |

**Any of these can be blank.** If the buyer never mentioned a budget, the cell
stays empty — the agent is instructed never to guess. An invented budget sends
a real buyer to the wrong sales desk, or bins them entirely.

---

## Next, in n8n

1. Open n8n → **Credentials** → **Add credential** → **Google Sheets** → sign in
   with the same Google account that owns this spreadsheet
2. Create a new workflow, open **Settings**, set **Timezone** to **Asia/Kolkata**
   — do this before adding any node. Get it wrong and calls go out at 3am while
   nothing in the logs looks broken
3. Then follow Prompt 1 in `ELDECO-N8N-PROMPTS.md`, and stop after the
   "append to Leads" step. The WhatsApp and calling nodes come later, once those
   accounts exist

**The first thing to prove:** send the same fake lead through twice. One row the
first time, no new row the second. If that works, the part where leads go missing
forever is already behind you.
