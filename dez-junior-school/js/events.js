/* =========================================================
   DEZ JUNIOR SCHOOL — SCHOOL CALENDAR EVENTS
   This is the ONE place to edit events. They appear on the
   Calendar page and the "Upcoming Events" cards on the home page.

   Each event:
     date:      'YYYY-MM-DD'   (first day)
     end:       'YYYY-MM-DD'   (optional, last day of a multi-day event)
     title:     name shown to visitors
     time:      optional, e.g. '9:00 AM – 12:00 PM'
     place:     optional, e.g. 'Main Hall'
     category:  'term' | 'exam' | 'event'
     sample:    true  -> shows a "Sample" tag. DELETE this part once the
                date is real. Only the Visiting Day entry is confirmed.
   ========================================================= */
window.DEZ_EVENTS = [
  { date:'2026-10-24', title:'Visiting Day', place:'Dez Junior School', category:'event' },
  { date:'2026-11-16', end:'2026-11-20', title:'End of Term III Examinations', category:'exam', sample:true },
  { date:'2026-11-28', title:"Parents' Meeting", time:'9:00 AM – 12:00 PM', place:'Main Hall', category:'event', sample:true },
  { date:'2026-12-04', title:'Term III Closing Day', category:'term', sample:true },
  { date:'2027-02-01', title:'Term I Opening Day', category:'term', sample:true },
  { date:'2027-02-05', title:"New Pupils' Orientation", time:'9:00 AM', place:'Main Hall', category:'event', sample:true },
  { date:'2027-03-13', title:'Inter-House Sports Day', time:'8:00 AM – 4:00 PM', place:'School Grounds', category:'event', sample:true }
];
