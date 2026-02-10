function runScript(timesArray = null) {
  // Default times if none provided
  const defaultTimes = [
    '8:00-8:45',
    '8:45-9:30',
    '9:30-10:15',
    '10:15-11:00',
    '11:00-11:45',
    '11:45-12:30',
    '12:30-13:15',
    '13:15-14:00',
    '14:00-14:45',
    '14:45-15:30',
  ];

  // Use custom times if provided, otherwise use default
  const times = timesArray || standardTimes;

  const table = document.querySelector('table.table');
  if (!table) {
    console.error('Table not found');
    return;
  }

  const headerCells = table.querySelectorAll('thead tr th');

  headerCells.forEach((cell, index) => {
    if (index !== 0 && times[index - 1]) {
      cell.textContent = times[index - 1];
      cell.style.cssText =
        'writing-mode: horizontal-tb; text-align: center;';
    }
  });

  console.log('Timetable modified with custom times');
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "runScript") {
    runScript();
  } else if (msg.action === "runCustomScript" && msg.times) {
    runScript(msg.times);
  }
});

///