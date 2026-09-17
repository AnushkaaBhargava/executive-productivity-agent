const tasks = [
  {
    id: 1,
    title: "Updated Vendor List",
    owner: "Arjun Malhotra",
    waitingOn: "Raghav Sethi",
    deadline: "Wednesday morning",
    status: "Overdue",
    priority: "High",
    source: "Email Thread 1",
    evidence:
      "Raghav followed up Wednesday morning asking whether the vendor list was still on track."
  },

  {
    id: 2,
    title: "Mumbai Office Lease Renewal",
    owner: "Unassigned",
    waitingOn: "Owner assignment",
    deadline: "Friday, 25 September EOD",
    status: "Unassigned",
    priority: "High",
    source: "Email Thread 5",
    evidence:
      "Facilities sent a second reminder Thursday stating that the signature was still pending and the deadline was Friday EOD."
  },

  {
    id: 3,
    title: "Q3 Campaign Deck Review",
    owner: "Neha Kapoor",
    waitingOn: "Arjun Malhotra",
    deadline: "Thursday, 24 September 9:30 AM",
    status: "Ready",
    priority: "Medium",
    source: "Email Thread 2",
    evidence:
      "Neha confirmed the Thursday 9:30 AM review and said the deck was ready."
  },

  {
    id: 4,
    title: "July Expense Variance Report",
    owner: "Divya Rao",
    waitingOn: "None — report received",
    deadline: "Wednesday evening",
    status: "Completed",
    priority: "Medium",
    source: "Email Thread 4",
    evidence:
      "Divya sent the report Wednesday at 6:00 PM and Arjun confirmed receipt."
  }
];

const meetings = [
  {
    id: 1,
    title: "Meridian Logistics Call",
    date: "Wednesday, 23 September",
    time: "3:00 PM",
    status: "Confirmed"
  },

  {
    id: 2,
    title: "Board Prep Session",
    date: "Thursday, 24 September",
    time: "9:00 AM",
    status: "Scheduled"
  },

  {
    id: 3,
    title: "Q3 Campaign Deck Review",
    date: "Thursday, 24 September",
    time: "9:30 AM",
    status: "Scheduled"
  }
];

module.exports = {
  tasks,
  meetings
};