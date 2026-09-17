// Data source grounded strictly in Assignment 1 PDF for Arjun Malhotra (VP Sales)
// Week: 21 September 2026 - 25 September 2026

const tasks = [
  {
    id: 1,
    title: "Send Updated Vendor List",
    owner: "Arjun Malhotra",
    waitingOn: "Raghav Sethi",
    deadline: "Wednesday morning",
    status: "Overdue",
    priority: "High",
    source: "Email Thread 1 & Monday Sync",
    evidence: "Arjun promised the list at Monday sync, postponed it twice, and Raghav checked in Wednesday 8:45 AM. It is still not sent."
  },
  {
    id: 2,
    title: "Assign Mumbai Office Lease Renewal Signatory",
    owner: "Unassigned",
    waitingOn: "Facilities / Leadership sign-off",
    deadline: "Friday, 25 September (End of Day)",
    status: "Unassigned",
    priority: "High",
    source: "Email Thread 5 & Voice Note 1",
    evidence: "Facilities sent reminders stating signature is due Friday EOD. Raghav emailed Thursday 4:45 PM asking who is handling it."
  },
  {
    id: 3,
    title: "Resolve Q3 Campaign Deck Review Conflict",
    owner: "Neha Kapoor & Arjun Malhotra",
    waitingOn: "Rescheduling confirmation",
    deadline: "Thursday, 24 September, 9:30 AM",
    status: "Conflict",
    priority: "Medium",
    source: "Email Thread 2 & Calendars",
    evidence: "Neha scheduled the review for Thursday 9:30 AM, which overlaps with Arjun's Board Prep Session (9:00–10:00 AM). Recommend moving to 10:00 AM."
  },
  {
    id: 4,
    title: "July Expense Variance Report",
    owner: "Divya Rao",
    waitingOn: "None (Delivered)",
    deadline: "Wednesday evening",
    status: "Completed",
    priority: "Medium",
    source: "Email Thread 4",
    evidence: "Divya emailed the report on Wednesday at 6:00 PM. Arjun confirmed receipt at 6:10 PM."
  },
  {
    id: 5,
    title: "Meridian Logistics Client Call",
    owner: "Priya Nair & Arjun Malhotra",
    waitingOn: "None (Conducted)",
    deadline: "Wednesday, 23 September, 3:00 PM",
    status: "Completed",
    priority: "Medium",
    source: "Email Thread 3 & Calendar",
    evidence: "Call was rescheduled from Monday, confirmed for Wednesday 3:00 PM, and held successfully."
  }
];

const meetings = [
  { day: "Mon 21 Sep", time: "9:00–9:35 AM", title: "Leadership Sync", with: "Neha, Raghav, Divya" },
  { day: "Mon 21 Sep", time: "2:00–2:30 PM", title: "1:1 with Neha", with: "Neha Kapoor" },
  { day: "Tue 22 Sep", time: "11:00 AM–12:00 PM", title: "Internal Budget Review", with: "Raghav, Divya" },
  { day: "Wed 23 Sep", time: "3:00–3:30 PM", title: "Call — Meridian Logistics", with: "Priya Nair (Client)" },
  { day: "Thu 24 Sep", time: "9:00–10:00 AM", title: "Board Prep Session (Conflict at 9:30)", with: "Divya Rao" },
  { day: "Thu 24 Sep", time: "4:00–5:00 PM", title: "Hiring Panel — Sales Associate", with: "Panel" },
  { day: "Fri 25 Sep", time: "10:00–10:30 AM", title: "Facilities Check-in", with: "Raghav Sethi" }
];

const rawDataSummary = {
  syncTranscript: "Leadership Sync (Mon 9:00 AM): Arjun discussed Q3 deck with Neha, promised vendor list to Raghav by Tuesday, asked Divya for July expense report by Wednesday, and noted Mumbai lease paperwork needs an owner.",
  voiceNotes: [
    "Voice Note 1 (Mon 6:40 PM): Note to self to get Raghav the vendor list tomorrow morning, and mentioned someone needs to own the Mumbai lease.",
    "Voice Note 2 (Wed 8:15 AM): Reminder that Divya's expense report is needed by Wednesday evening, and to lock in Meridian call time with Priya."
  ],
  emailThreads: [
    "Thread 1 (Vendor List): Raghav asked Mon 9:50 AM -> Arjun postponed to Tue morning -> Raghav followed up -> Arjun postponed to Wed morning -> Raghav followed up Wed 8:45 AM (Pending).",
    "Thread 2 (Q3 Deck): Neha shifted review to Thursday 9:30 AM and sent the draft Thursday at 8:00 AM.",
    "Thread 3 (Meridian Call): Priya asked to reschedule -> Arjun proposed Wed 3 PM -> Confirmed & held.",
    "Thread 4 (Expense Report): Divya promised for Wed evening -> Sent Wed 6:00 PM -> Arjun acknowledged.",
    "Thread 5 (Mumbai Lease): Facilities reminders on Mon & Thu (deadline Friday EOD) -> Raghav asked Thu 4:45 PM who is signing."
  ]
};

module.exports = {
  tasks,
  meetings,
  rawDataSummary
};