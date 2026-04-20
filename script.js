const standardTimes = [
  '8:00 - 8:45',   // Period 1
  '8:45 - 9:30',   // Period 2
  '9:40 - 10:25',  // Period 3
  '10:25 - 11:10', // Period 4
  '11:20 - 12:05', // Period 5
  '12:05 - 12:50', // Period 6
  '1:00 - 1:45',   // Period 7
  '1:45 - 2:30',   // Period 8
  '2:40 - 3:25',   // Period 9
  '3:25 - 4:10',   // Period 10
];

const ramadanTimes = [
  '8:00 - 8:35',   // Period 1
  '8:35 - 9:10',   // Period 2
  '9:20 - 9:55',   // Period 3
  '9:55 - 10:30',  // Period 4
  '10:40 - 11:15', // Period 5
  '11:15 - 11:50', // Period 6
  '12:00 - 12:35', // Period 7
  '12:35 - 1:10',  // Period 8
  '1:20 - 1:55',   // Period 9
  '1:55 - 2:30',   // Period 10
];

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

function runScript(timesArray = null) {
  // Default times if none provided
  

  // Use custom times if provided, otherwise use default
  const times = timesArray || standardTimes;

let table;
let headerCells;

// if(window.location.href.contains("myu")) -> table = document.querySelector('table')
  if (window.location.href.includes("myu.hti-o.edu.eg")) {
    table = document.querySelector('table.table');
    headerCells = table.querySelectorAll('thead tr th');

  }else{
    table = document.querySelector('table[name*="CoursesTableForm"]');
    headerCells = table.querySelectorAll('tbody tr th');
  }

  if (!table) {
    console.error('Table not found');
    return;
  }


  headerCells.forEach((cell, index) => {
    if (index !== 0 && times[index - 1]) {
      cell.textContent = times[index - 1];
      cell.style.cssText +=
        'writing-mode: horizontal-tb; text-align: center;transform: rotate(0deg); ';
    }
  });

  console.log('Timetable modified with custom times');
}

const originalRows = new Map();
let lastAppliedTimes = null; // track last times used

function applyTrainingSchedule() {
  const TARGET_SLOT_INDEX = 4; // 0-based, after the day-name cell

  let table, headerCells;
  if (window.location.href.includes("myu.hti-o.edu.eg")) {
    table = document.querySelector('table.table');
    headerCells = table.querySelectorAll('thead tr th');
  } else {
    table = document.querySelector('table[name*="CoursesTableForm"]');
    headerCells = table.querySelectorAll('tbody tr th');
  }
  if (!table) return;

  // Highlight 5th header
  if (headerCells[TARGET_SLOT_INDEX + 1]) {
    headerCells[TARGET_SLOT_INDEX + 1].style.background = '#FFD700';
    headerCells[TARGET_SLOT_INDEX + 1].style.color = '#412402';
  }

  let masterCell = null;

  table.querySelectorAll('tbody tr').forEach((row, i) => {
    if (!originalRows.has(i)) originalRows.set(i, row.innerHTML);

    // 1. Check the day name to exclude Friday ("الجمعة")
    const dayCell = row.querySelector('td, th'); 
    const dayText = dayCell ? dayCell.textContent.trim() : "";
    if (dayText.includes("جمعة") || dayText.includes("Friday")) {
      masterCell = null; // Stop merging
      return;            // Skip processing this row entirely
    }

    const cells = [...row.querySelectorAll('td, th')].slice(1); // skip day-name cell

    // Find which cell sits at TARGET_SLOT_INDEX
    let colPos = 0;
    let targetCell = null;

    for (const cell of cells) {
      const colspan = parseInt(cell.getAttribute('colspan') || 1);
      
      // If we find the exact 1-period slot
      if (colPos === TARGET_SLOT_INDEX && colspan === 1) {
        targetCell = cell;
        break;
      } 
      // If a class spans across period 5, we shouldn't merge it
      else if (colPos <= TARGET_SLOT_INDEX && (colPos + colspan) > TARGET_SLOT_INDEX) {
        targetCell = null;
        break;
      }
      colPos += colspan;
    }

    // 2. Combine the cells using rowspan
    if (targetCell) {
      if (!masterCell) {
        // First valid row: Designate this as the master cell
        masterCell = targetCell;
        masterCell.style.background = '#FFD700';
        masterCell.style.color = '#412402';
        
        // These two properties guarantee centering for inline-block elements
        masterCell.style.verticalAlign = 'middle';
        masterCell.style.textAlign = 'center';
        masterCell.setAttribute('rowspan', 1);
        
        // 3. Put big font vertical text "نشاط" at the center
        // Using an inline-block span ensures it respects the td's centering perfectly
        masterCell.innerHTML = `
          <span style="
            display: inline-block;
            writing-mode: vertical-rl;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
          ">نشاط</span>
        `;
      } else {
        // Subsequent rows: Increment master cell's rowspan and remove the redundant cell
        let currentSpan = parseInt(masterCell.getAttribute('rowspan') || 1);
        masterCell.setAttribute('rowspan', currentSpan + 1);
        targetCell.remove();
      }
    } else {
      // If the slot isn't empty (e.g. a class overlaps it), break the master cell chain
      masterCell = null;
    }
  });
}


function resetTable(timesToReapply = null) {
  let table, headerCells;
  if (window.location.href.includes("myu.hti-o.edu.eg")) {
    table = document.querySelector('table.table');
    headerCells = table.querySelectorAll('thead tr th');
  } else {
    table = document.querySelector('table[name*="CoursesTableForm"]');
    headerCells = table.querySelectorAll('tbody tr th');
  }
  if (!table) return;

  // Restore header styles
  headerCells.forEach(th => {
    th.style.background = '';
    th.style.color = '';
    th.style.fontWeight = '';
  });

  // Restore rows
  table.querySelectorAll('tbody tr').forEach((row, i) => {
    if (originalRows.has(i)) row.innerHTML = originalRows.get(i);
  });
  originalRows.clear();

  // Re-apply times to headers if provided
  if (timesToReapply) {
    runScript(timesToReapply);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "runScript") {
    resetTable();
    lastAppliedTimes = null;
    runScript();
  } else if (msg.action === "runCustomScript" && msg.times) {
    resetTable();
    lastAppliedTimes = msg.times;
    runScript(msg.times);
  } else if (msg.action === "applyTrainingSchedule") {
    // Reset to default times first, then apply training layout
    lastAppliedTimes = null;
    runScript(); // resets headers to defaultTimes
    applyTrainingSchedule();
  }
});

// chrome.runtime.onMessage.addListener((msg) => {
//   if (msg.action === "runScript") {
//     runScript();
//   } else if (msg.action === "runCustomScript" && msg.times) {
//     runScript(msg.times);
//   }
// });

///