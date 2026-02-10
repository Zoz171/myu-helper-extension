// Mode radios: send either `standardTimes` or `ramadanTimes` when selection changes
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

function sendTimesToPage(times, useRunScript = false) {
  return chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (!tab) return;
    if (useRunScript) {
      chrome.tabs.sendMessage(tab.id, { action: 'runScript' });
    } else {
      chrome.tabs.sendMessage(tab.id, { action: 'runCustomScript', times });
    }
  });
}

document.querySelectorAll('input[name="timeMode"]').forEach(r => {
  r.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'fixed') {
      // use standard fixed times
      sendTimesToPage(standardTimes);
    } else if (val === 'ramadan') {
      // use ramadan times (send via custom route to ensure consistent format)
      sendTimesToPage(ramadanTimes);
    }
  });
});

// Toggle the custom format dropdown area
const ctoggle = document.getElementById("ctoggle");
const customArea = document.getElementById("customArea");
ctoggle.addEventListener("click", () => {
  const isHidden = customArea.hasAttribute('hidden');
  if (isHidden) {
    customArea.removeAttribute('hidden');
    ctoggle.setAttribute('aria-expanded', 'true');
  } else {
    customArea.setAttribute('hidden', '');
    ctoggle.setAttribute('aria-expanded', 'false');
  }
});

// Apply custom times (parses JSON or line-separated values)
document.getElementById("applyCustom").addEventListener("click", async () => {
  const timeInput = document.getElementById("time").value;
  let customTimes;
  try {
    customTimes = JSON.parse(timeInput);
  } catch (e) {
    customTimes = timeInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/['"\[\],]/g, '').trim())
      .filter(line => line.length > 0);
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "runCustomScript", times: customTimes });
});