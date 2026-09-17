/**
 * Data Pack — Assignment 1: Executive Productivity Agent
 * Week: Monday, 21 September 2026 – Friday, 25 September 2026
 * Agent built for: Arjun Malhotra (VP Sales)
 * Grounded strictly in the provided Data Pack. No invented information.
 */

const people = [
  {
    name: "Arjun Malhotra",
    role: "VP Sales (the agent's user)",
    email: "arjun.malhotra@veridian-corp.example",
    isUser: true,
    initials: "AM"
  },
  {
    name: "Neha Kapoor",
    role: "Marketing Lead",
    email: "neha.kapoor@veridian-corp.example",
    isUser: false,
    initials: "NK"
  },
  {
    name: "Raghav Sethi",
    role: "Ops Manager",
    email: "raghav.sethi@veridian-corp.example",
    isUser: false,
    initials: "RS"
  },
  {
    name: "Divya Rao",
    role: "Finance",
    email: "divya.rao@veridian-corp.example",
    isUser: false,
    initials: "DR"
  },
  {
    name: "Priya Nair",
    role: "Meridian Logistics (external client)",
    email: "priya.nair@meridianlogistics.example",
    isUser: false,
    initials: "PN"
  },
  {
    name: "Facilities",
    role: "Internal distribution list",
    email: "facilities@veridian-corp.example",
    isUser: false,
    initials: "FAC"
  }
];

const meetingTranscript = {
  title: "Leadership Sync",
  date: "Monday, 21 September 2026",
  time: "9:00–9:35 AM",
  attendees: ["Arjun Malhotra", "Neha Kapoor", "Raghav Sethi", "Divya Rao"],
  dialogue: [
    {
      speaker: "Arjun Malhotra",
      text: "Let's keep this quick. Neha, where are we on the Q3 campaign deck?"
    },
    {
      speaker: "Neha Kapoor",
      text: "Draft is 80% done. I'll send it to Arjun for review by Wednesday."
    },
    {
      speaker: "Arjun Malhotra",
      text: "Good. Also, remind me — I told Raghav I'd send him the updated vendor list. I'll get that to him by end of day tomorrow."
    },
    {
      speaker: "Raghav Sethi",
      text: "Appreciated. Separately, the Mumbai office renewal paperwork needs someone to sign off this week. Not sure whose desk that's on right now."
    },
    {
      speaker: "Divya Rao",
      text: "I think that's supposed to be Facilities, but I haven't seen anyone pick it up."
    },
    {
      speaker: "Arjun Malhotra",
      text: "Okay, flag it, don't assume. Divya, can you also pull the July expense variance report before Thursday's board prep?"
    },
    {
      speaker: "Divya Rao",
      text: "Yes, I'll have it ready Wednesday evening."
    },
    {
      speaker: "Arjun Malhotra",
      text: "One more thing — client call with Meridian Logistics got pushed. I need to reconfirm the new time with their team myself."
    },
    {
      speaker: "Neha Kapoor",
      text: "Also, just a reminder, the campaign deck review — I said Wednesday, but realistically Thursday morning is safer."
    },
    {
      speaker: "Arjun Malhotra",
      text: "Noted. Let's close here."
    }
  ]
};

const calendars = {
  "Arjun Malhotra": [
    { day: "Mon 21 Sep", time: "9:00–9:35 AM", event: "Leadership Sync", type: "meeting", attendees: ["Arjun Malhotra", "Neha Kapoor", "Raghav Sethi", "Divya Rao"] },
    { day: "Mon 21 Sep", time: "2:00–2:30 PM", event: "1:1 with Neha", type: "meeting", attendees: ["Arjun Malhotra", "Neha Kapoor"] },
    { day: "Mon 21 Sep", time: "4:00–5:00 PM", event: "Blocked", type: "focus" },
    { day: "Tue 22 Sep", time: "11:00 AM–12:00 PM", event: "Internal Budget Review", type: "meeting", attendees: ["Arjun Malhotra", "Raghav Sethi", "Divya Rao"] },
    { day: "Tue 22 Sep", time: "3:00–3:30 PM", event: "Blocked", type: "focus" },
    { day: "Wed 23 Sep", time: "3:00–3:30 PM", event: "Call — Meridian Logistics", type: "client_call", attendees: ["Arjun Malhotra", "Priya Nair"] },
    { day: "Wed 23 Sep", time: "6:00–6:15 PM", event: "Blocked", type: "focus" },
    { day: "Thu 24 Sep", time: "9:00–10:00 AM", event: "Board Prep Session", type: "board_prep", attendees: ["Arjun Malhotra", "Divya Rao"] },
    { day: "Thu 24 Sep", time: "4:00–5:00 PM", event: "Hiring Panel — Sales Associate", type: "interview" },
    { day: "Fri 25 Sep", time: "10:00–10:30 AM", event: "Facilities Check-in", type: "meeting", attendees: ["Arjun Malhotra", "Raghav Sethi"] },
    { day: "Fri 25 Sep", time: "1:00–2:00 PM", event: "Blocked", type: "focus" }
  ],
  "Neha Kapoor": [
    { day: "Mon 21 Sep", time: "10:00–11:00 AM", event: "Blocked", type: "focus" },
    { day: "Mon 21 Sep", time: "2:00–2:30 PM", event: "1:1 with Arjun", type: "meeting", attendees: ["Neha Kapoor", "Arjun Malhotra"] },
    { day: "Tue 22 Sep", time: "1:00–2:00 PM", event: "Campaign Vendor Call", type: "call" },
    { day: "Wed 23 Sep", time: "10:00–10:30 AM", event: "Deck Prep", type: "work" },
    { day: "Wed 23 Sep", time: "1:00–3:00 PM", event: "Blocked", type: "focus" },
    { day: "Thu 24 Sep", time: "9:30–10:00 AM", event: "Deck Review with Arjun", type: "meeting", attendees: ["Neha Kapoor", "Arjun Malhotra"], isConflict: true },
    { day: "Fri 25 Sep", time: "11:00 AM–12:00 PM", event: "Blocked", type: "focus" }
  ],
  "Raghav Sethi": [
    { day: "Mon 21 Sep", time: "9:00–9:35 AM", event: "Leadership Sync", type: "meeting" },
    { day: "Mon 21 Sep", time: "1:00–2:00 PM", event: "Blocked", type: "focus" },
    { day: "Tue 22 Sep", time: "11:00 AM–12:00 PM", event: "Internal Budget Review", type: "meeting" },
    { day: "Tue 22 Sep", time: "3:30–4:00 PM", event: "Ops Standup", type: "meeting" },
    { day: "Wed 23 Sep", time: "9:00–11:00 AM", event: "Blocked", type: "focus" },
    { day: "Thu 24 Sep", time: "2:00–3:00 PM", event: "Blocked", type: "focus" },
    { day: "Fri 25 Sep", time: "10:00–10:30 AM", event: "Facilities Check-in", type: "meeting" },
    { day: "Fri 25 Sep", time: "3:00–4:00 PM", event: "Blocked", type: "focus" }
  ],
  "Divya Rao": [
    { day: "Mon 21 Sep", time: "2:30–3:00 PM", event: "Budget Prep", type: "work" },
    { day: "Mon 21 Sep", time: "4:00–5:00 PM", event: "Blocked", type: "focus" },
    { day: "Tue 22 Sep", time: "9:00–9:15 AM", event: "Quick Call with Arjun", type: "call" },
    { day: "Tue 22 Sep", time: "11:00 AM–12:00 PM", event: "Internal Budget Review", type: "meeting" },
    { day: "Wed 23 Sep", time: "1:00–2:00 PM", event: "Blocked", type: "focus" },
    { day: "Thu 24 Sep", time: "9:00–10:00 AM", event: "Board Prep Session", type: "meeting" },
    { day: "Thu 24 Sep", time: "2:00–3:00 PM", event: "Blocked", type: "focus" },
    { day: "Fri 25 Sep", time: "10:00–11:00 AM", event: "Blocked", type: "focus" }
  ]
};

const emailThreads = [
  {
    id: 1,
    subject: "Vendor List",
    topic: "Updated Vendor List from Arjun to Raghav",
    emails: [
      {
        index: 1,
        timestamp: "Mon 21 Sep, 9:50 AM",
        from: "raghav.sethi@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Following up from the sync — can you send the updated vendor list today?"
      },
      {
        index: 2,
        timestamp: "Mon 21 Sep, 5:40 PM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "raghav.sethi@veridian-corp.example",
        body: "Running behind, will send first thing tomorrow morning instead."
      },
      {
        index: 3,
        timestamp: "Tue 22 Sep, 9:15 AM",
        from: "raghav.sethi@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "No worries, whenever you get a chance today works."
      },
      {
        index: 4,
        timestamp: "Tue 22 Sep, 6:30 PM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "raghav.sethi@veridian-corp.example",
        body: "Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure."
      },
      {
        index: 5,
        timestamp: "Wed 23 Sep, 8:45 AM",
        from: "raghav.sethi@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Just checking — still good for this morning?"
      }
    ]
  },
  {
    id: 2,
    subject: "Q3 Campaign Deck",
    topic: "Q3 Campaign Deck draft and review scheduling between Neha and Arjun",
    emails: [
      {
        index: 1,
        timestamp: "Mon 21 Sep, 11:00 AM",
        from: "neha.kapoor@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Deck's coming together, still targeting Wednesday for your review."
      },
      {
        index: 2,
        timestamp: "Tue 22 Sep, 4:15 PM",
        from: "neha.kapoor@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Heads up — shifting the review to Thursday morning instead of Wednesday, need one more day on the data slides."
      },
      {
        index: 3,
        timestamp: "Wed 23 Sep, 10:00 AM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "neha.kapoor@veridian-corp.example",
        body: "Understood, Thursday morning works. What time exactly?"
      },
      {
        index: 4,
        timestamp: "Wed 23 Sep, 10:20 AM",
        from: "neha.kapoor@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Let's say 9:30 AM Thursday, before your board prep block."
      },
      {
        index: 5,
        timestamp: "Thu 24 Sep, 8:00 AM",
        from: "neha.kapoor@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Deck is ready, attaching the draft ahead of our 9:30 review."
      }
    ]
  },
  {
    id: 3,
    subject: "Call Reschedule",
    topic: "Rescheduling external client call with Priya Nair (Meridian Logistics)",
    emails: [
      {
        index: 1,
        timestamp: "Mon 21 Sep, 1:00 PM",
        from: "priya.nair@meridianlogistics.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Our scheduled call this week got bumped from our side — can you propose a new time? We're flexible Tuesday–Thursday afternoons."
      },
      {
        index: 2,
        timestamp: "Tue 22 Sep, 3:00 PM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "priya.nair@meridianlogistics.example",
        body: "Apologies for the delay — how about Wednesday 3:00 PM?"
      },
      {
        index: 3,
        timestamp: "Tue 22 Sep, 5:45 PM",
        from: "priya.nair@meridianlogistics.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Wednesday 3 PM works on our end, confirmed."
      },
      {
        index: 4,
        timestamp: "Wed 23 Sep, 1:30 PM",
        from: "priya.nair@meridianlogistics.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Quick check — still on for 3 PM today?"
      },
      {
        index: 5,
        timestamp: "Wed 23 Sep, 2:00 PM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "priya.nair@meridianlogistics.example",
        body: "Yes, confirmed, see you at 3."
      }
    ]
  },
  {
    id: 4,
    subject: "Expense Variance Report",
    topic: "July Expense Variance Report prepared by Divya Rao for Arjun's board prep",
    emails: [
      {
        index: 1,
        timestamp: "Mon 21 Sep, 2:30 PM",
        from: "divya.rao@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Starting on the July variance numbers, targeting Thursday morning for board prep as discussed."
      },
      {
        index: 2,
        timestamp: "Tue 22 Sep, 9:00 AM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "divya.rao@veridian-corp.example",
        body: "Actually, can I get it by Wednesday evening instead? Want time to review before Thursday."
      },
      {
        index: 3,
        timestamp: "Tue 22 Sep, 9:40 AM",
        from: "divya.rao@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Wednesday evening is tight but doable, I'll prioritize it."
      },
      {
        index: 4,
        timestamp: "Wed 23 Sep, 6:00 PM",
        from: "divya.rao@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "Report attached, sent as promised."
      },
      {
        index: 5,
        timestamp: "Wed 23 Sep, 6:10 PM",
        from: "arjun.malhotra@veridian-corp.example",
        to: "divya.rao@veridian-corp.example",
        body: "Got it, thank you — exactly what I needed before tomorrow."
      }
    ]
  },
  {
    id: 5,
    subject: "Mumbai Office Lease Renewal",
    topic: "Authorized signature required for Mumbai office renewal by Friday 25 Sep EOD",
    emails: [
      {
        index: 1,
        timestamp: "Mon 21 Sep, 10:15 AM",
        from: "facilities@veridian-corp.example",
        to: "All Staff",
        body: "Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September."
      },
      {
        index: 2,
        timestamp: "Tue 22 Sep, 11:00 AM",
        from: "raghav.sethi@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example, divya.rao@veridian-corp.example",
        body: "Following up from the sync — has anyone confirmed who's signing off on the Mumbai renewal? Don't think it's been assigned."
      },
      {
        index: 3,
        timestamp: "Wed 23 Sep, 9:30 AM",
        from: "divya.rao@veridian-corp.example",
        to: "raghav.sethi@veridian-corp.example, arjun.malhotra@veridian-corp.example",
        body: "Not on my end — I believe this typically sits with Facilities directly, not us."
      },
      {
        index: 4,
        timestamp: "Thu 24 Sep, 4:00 PM",
        from: "facilities@veridian-corp.example",
        to: "All Staff",
        body: "Second reminder: signature is still pending. Deadline is Friday, 25 September, end of day."
      },
      {
        index: 5,
        timestamp: "Thu 24 Sep, 4:45 PM",
        from: "raghav.sethi@veridian-corp.example",
        to: "arjun.malhotra@veridian-corp.example",
        body: "This is now one day out and still unowned — can you confirm who's handling it?"
      }
    ]
  }
];

const voiceNotes = [
  {
    id: 1,
    title: "Voice Note 1 — Monday Cab Memo",
    timestamp: "Monday 21 Sep, 6:40 PM",
    context: "Recorded in cab by Arjun Malhotra for himself",
    transcript: "Quick note to self — need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning, remind me. Also still haven't heard back on the Mumbai lease thing, someone needs to own that, I don't think it's me.",
    commitments: [
      "Send updated vendor list to Raghav (slipped from Monday to Tuesday morning)",
      "Resolve Mumbai lease ownership (Arjun notes 'someone needs to own that, I don't think it's me')"
    ]
  },
  {
    id: 2,
    title: "Voice Note 2 — Wednesday Morning Memo",
    timestamp: "Wednesday 23 Sep, 8:15 AM",
    context: "Recorded by Arjun Malhotra for himself",
    transcript: "Reminder — expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep. Also Meridian call — I owe Priya a time, need to lock that in today.",
    commitments: [
      "Ensure July expense variance report arrives Wednesday evening (Delivered by Divya at 6:00 PM)",
      "Lock in Meridian call time with Priya (Note: Arjun actually proposed Wed 3 PM on Tuesday at 3:00 PM and Priya confirmed Tuesday at 5:45 PM; reconfirmed Wednesday at 2:00 PM)"
    ]
  }
];

// Grounded tasks & commitments derived with 100% fidelity to the data pack
const tasks = [
  {
    id: 1,
    title: "Send Updated Vendor List to Raghav",
    owner: "Arjun Malhotra",
    waitingOnUser: true,
    waitingPerson: "Raghav Sethi",
    deadline: "Wednesday morning (23 Sep)",
    status: "Overdue",
    priority: "Critical",
    category: "Deliverable",
    source: "Email Thread 1 & Leadership Sync & Voice Note 1",
    evidence: "Arjun promised the list at Monday sync, postponed it to Tuesday morning (Mon 5:40 PM), postponed again to Wednesday morning (Tue 6:30 PM). Raghav checked in Wednesday 8:45 AM ('still good for this morning?'). No record of delivery exists.",
    suggestedAction: "Draft immediate response to Raghav with the updated vendor list attachment."
  },
  {
    id: 2,
    title: "Assign Signatory for Mumbai Office Lease Renewal",
    owner: "Unassigned",
    waitingOnUser: true,
    waitingPerson: "Facilities & Raghav Sethi",
    deadline: "Friday, 25 September EOD",
    status: "Unassigned",
    priority: "Critical",
    category: "Corporate Risk",
    source: "Email Thread 5 & Voice Note 1",
    evidence: "Facilities sent 2 reminders (Mon 10:15 AM, Thu 4:00 PM) stating an authorized signature is required by Friday EOD. Divya clarified it usually sits with Facilities. Raghav escalated directly to Arjun on Thu 4:45 PM: 'This is now one day out and still unowned — can you confirm who's handling it?'",
    suggestedAction: "Confirm owner immediately or delegate formally to Facilities during Friday's 10:00 AM check-in."
  },
  {
    id: 3,
    title: "Resolve Calendar Conflict: Q3 Campaign Deck Review",
    owner: "Arjun Malhotra & Neha Kapoor",
    waitingOnUser: true,
    waitingPerson: "Neha Kapoor",
    deadline: "Thursday, 24 September, 9:30 AM",
    status: "Schedule Conflict",
    priority: "High",
    category: "Calendar Overlap",
    source: "Email Thread 2 & Calendars (Arjun & Neha)",
    evidence: "Neha scheduled the review for Thursday 9:30 AM ('before your board prep block'), but Arjun's calendar already has Board Prep Session from 9:00 AM to 10:00 AM with Divya. Neha sent the draft deck on Thu 8:00 AM.",
    suggestedAction: "Reschedule Deck Review to Thursday 10:00 AM (immediately following Board Prep) where both Arjun and Neha are available."
  },
  {
    id: 4,
    title: "July Expense Variance Report for Board Prep",
    owner: "Divya Rao",
    waitingOnUser: false,
    waitingPerson: "Completed",
    deadline: "Wednesday, 23 September, evening",
    status: "Completed",
    priority: "Medium",
    category: "Report",
    source: "Email Thread 4",
    evidence: "Divya delivered the report on Wednesday 23 Sep at 6:00 PM. Arjun replied at 6:10 PM: 'Got it, thank you — exactly what I needed before tomorrow.'",
    suggestedAction: "No action needed. Report is in Arjun's hands for Board Prep."
  },
  {
    id: 5,
    title: "Meridian Logistics Client Call",
    owner: "Arjun Malhotra & Priya Nair",
    waitingOnUser: false,
    waitingPerson: "Completed",
    deadline: "Wednesday, 23 September, 3:00 PM",
    status: "Completed",
    priority: "Medium",
    category: "Client Meeting",
    source: "Email Thread 3 & Calendar",
    evidence: "Priya requested a reschedule Monday. Arjun proposed Wednesday 3:00 PM. Priya confirmed Tuesday 5:45 PM and reconfirmed Wednesday 1:30 PM. Arjun confirmed at 2:00 PM. Held Wed 3:00–3:30 PM.",
    suggestedAction: "Call completed."
  }
];

// Calendar conflicts identified by temporal audit
const calendarConflicts = [
  {
    id: "conflict-1",
    day: "Thursday, 24 September 2026",
    time: "9:30–10:00 AM",
    severity: "High",
    conflictType: "Direct Double-Booking",
    event1: {
      name: "Board Prep Session",
      owner: "Arjun Malhotra & Divya Rao",
      time: "9:00–10:00 AM",
      calendar: "Arjun Malhotra"
    },
    event2: {
      name: "Deck Review with Arjun",
      owner: "Neha Kapoor",
      time: "9:30–10:00 AM",
      calendar: "Neha Kapoor (and proposed in Thread 2 Msg 4)"
    },
    cause: "Neha proposed 9:30 AM assuming it was before the board prep block ('Let\\'s say 9:30 AM Thursday, before your board prep block'), but Arjun\\'s Board Prep is scheduled 9:00–10:00 AM.",
    recommendedResolution: "Push Deck Review to 10:00–10:30 AM Thursday. Neha is free from 10:00 AM onward; Arjun is free after Board Prep until 4:00 PM."
  }
];

module.exports = {
  people,
  meetingTranscript,
  calendars,
  emailThreads,
  voiceNotes,
  tasks,
  calendarConflicts
};
