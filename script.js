function runScript(timesArray = null) {
  // Default times if none provided
  const defaultTimes = [
    '8:00 - 8:45',
    '8:45 - 9:30',
    '9:40 - 10:25',
    '10:25 - 11:10',
    '11:20 - 12:05',
    '12:05 - 12:50',
    '1:00 - 1:45',
    '1:45 - 2:30',
    '2:40 - 3:25',
    '3:25 - 4:10',
  ];

  // Use custom times if provided, otherwise use default
  const times = timesArray || defaultTimes;

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