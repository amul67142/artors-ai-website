/**
 * /work — the proof page. Artors has no client case studies yet; this
 * page publishes one demonstration end to end and says so plainly.
 * The recording file and the n8n screenshot are slots until supplied
 * (docs/PLAN.md §7); the transcript below is the scripted demo call.
 */

export const work = {
  label: "Work",
  statement: "No logo wall yet. One system, shown end to end instead.",
  intro:
    "Artors is new. Rather than ask you to trust a list of names, here is a demonstration run of one of our systems: the recording, the full transcript, and the workflow that produced it. Every client build is published the same way, with the client's permission.",
  honesty: "Labelled as a demonstration, because that is what it is. Real client runs replace it here as they go live.",

  run: {
    title: "Clinic receptionist, one call",
    summary: ["5 steps", "85 seconds", "0 human minutes"],
    transcript: [
      { t: "00:00", who: "Caller", text: "Hi, I need to move my appointment to next week." },
      { t: "00:04", who: "Agent", text: "Of course. You're with Dr. Mehra on Thursday at five. Which day suits you?" },
      { t: "00:11", who: "Caller", text: "Tuesday evening, if that's possible." },
      { t: "00:14", who: "Agent", text: "Tuesday 4:30 is open. Shall I book it?" },
      { t: "00:19", who: "Caller", text: "Yes, perfect." },
      { t: "00:22", who: "Agent", text: "Done. Tuesday 4:30. The confirmation is on your WhatsApp. Anything else I can help with?" },
      { t: "00:27", who: "Caller", text: "No, that's all. Thanks." },
    ],
    actions: ["Calendar updated", "WhatsApp confirmation sent", "CRM record closed"],
    flowTitle: "The workflow behind the call",
    flow: [
      { label: "Inbound call", sub: "Voice" },
      { label: "Caller identified", sub: "CRM lookup" },
      { label: "Intent captured", sub: "Reschedule" },
      { label: "Slot booked", sub: "Calendar", highlight: true },
      { label: "Confirmed & logged", sub: "WhatsApp · CRM" },
    ],
  },

  siteLine: "This site runs on the systems we sell. The consultation popup, the form delivery, the follow-up — case study zero.",
} as const;
