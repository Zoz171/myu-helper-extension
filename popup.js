document.getElementById("toggle").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    action: "runScript"
  });
});

document.getElementById("ctoggle").addEventListener("click", async () => {
  const timeInput = document.getElementById("time").value;
  
  // Parse the textarea input to an array
  let customTimes;
  try {
    // Try to parse as JSON if it's in array format
    customTimes = JSON.parse(timeInput);
  } catch (e) {
    // If not valid JSON, try to parse line by line
    customTimes = timeInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove quotes and brackets if present
        return line.replace(/['"\[\],]/g, '').trim();
      })
      .filter(line => line.length > 0);
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    action: "runCustomScript",
    times: customTimes
  });
});