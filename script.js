function runScript(timesArray) {
  var defaultTimes = [
    '8:00-8:45',
    '8:45-9:30',
    '9:30-10:15',
    '10:15-11:00',
    '11:00-11:45',
    '11:45-12:30',
    '12:30-13:15',
    '13:15-14:00',
    '14:00-14:45',
    '14:45-15:30'
  ];

  var times = timesArray || defaultTimes;

  var tables;

  if (window.location.href.includes('myu.hti-o.edu.eg')) {
    tables = document.querySelectorAll('table.table');
  } else {
    tables = document.querySelectorAll('table[name*="CoursesTableForm"]');
  }

  if (!tables.length) {
    console.error('Table not found');
    return;
  }

  function setCellTime(cell, timeText) {
    var coloredTime = cell.querySelector('font font[color]') || cell.querySelector('font[color]');
    if (coloredTime) {
      coloredTime.textContent = timeText;
      return;
    }

    var html = cell.innerHTML;
    if (/<br\s*\/?>/i.test(html)) {
      // Keep label/period markup and replace only content after the last line break.
      cell.innerHTML = html.replace(/^(.*<br\s*\/?>)[^<]*$/i, '$1' + timeText);
      return;
    }

    var lines = cell.textContent.split('\n').map(function(line) { return line.trim(); }).filter(Boolean);
    if (lines.length > 1) {
      lines[lines.length - 1] = timeText;
      cell.textContent = lines.join('\n');
    } else {
      cell.textContent = timeText;
    }
  }

  function clearCellTime(cell) {
    var coloredTime = cell.querySelector('font font[color]') || cell.querySelector('font[color]');
    if (coloredTime) {
      coloredTime.textContent = '';
      return;
    }

    var html = cell.innerHTML;
    if (/<br\s*\/?>/i.test(html)) {
      cell.innerHTML = html.replace(/^(.*<br\s*\/?>)[^<]*$/i, '$1');
    }
  }

  tables.forEach(function(table) {
    var headerCells;
    if (window.location.href.includes('myu.hti-o.edu.eg')) {
      headerCells = table.querySelectorAll('thead tr th');
    } else {
      headerCells = table.querySelectorAll('tbody tr:first-child th');
    }

    headerCells.forEach(function(cell, index) {
      if (index === 0) return;
      if (times[index - 1]) {
        setCellTime(cell, times[index - 1]);
        cell.style.cssText += 'writing-mode: horizontal-tb; text-align: center; transform: rotate(0deg);';
      } else {
        clearCellTime(cell);
      }
    });
  });

  console.log('Timetable modified with custom times');
}

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.action === 'runScript') {
    runScript();
  } else if (msg.action === 'runCustomScript' && msg.times) {
    runScript(msg.times);
  }
});