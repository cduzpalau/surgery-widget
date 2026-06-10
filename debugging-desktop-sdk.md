# Debugging Desktop SDK - Console Guide

## 🎯 Purpose

Your widget now has a built-in `debugDesktop()` method that helps you explore all available Desktop SDK modules, properties, and methods.

---

## 🚀 How to Use

### Quick Method (Easiest!) ⭐

Your widget automatically makes the Desktop SDK available globally when it loads. Just type in console:

```javascript
Desktop.debugWidget();
```

That's it! One simple command to see everything.

---

### What You'll See

When you run `Desktop.debugWidget()`, you'll see organized, collapsible groups showing:

```
🖥️ Desktop SDK Debug Info
  1️⃣ All Modules: ['config', 'agentStateInfo', 'agentContact', 'actions', 'dialer', ...]
  
  ▼ 2️⃣ config
      Properties: ['clientLocale', 'SERVICE', ...]
      Methods: ['init', 'cleanup']
      Client Locale: en-US
  
  ▼ 3️⃣ agentStateInfo
      Properties: ['latestData', 'idleCodes', 'teams', ...]
      Methods: ['stateChange', 'addEventListener', ...]
      Current State: {subStatus: "Available", agentName: "Victor's Agent 1", ...}
      Idle Codes: [{id: "1643", name: "Break", isDefault: true}, ...]
  
  ▼ 4️⃣ agentContact
      Properties: ['taskMap', 'taskSelected', 'interactionIds', ...]
      Methods: ['addEventListener', 'vteamTransfer', 'pauseRecording', ...]
      Task Map: Map(0) {}
      Selected Task: null
  
  ▼ 5️⃣ actions
      Properties: ['lastReqTs', 'lastReqN', ...]
      Methods: ['getToken', 'getIdleCodes', 'getWrapUpCodes', ...]
  
  ▼ 6️⃣ dialer (if available)
      Properties: [...]
      Methods: ['startOutdial', 'updateCadVariables', ...]
  
  ▼ 7️⃣ screenpop (if available)
      Properties: [...]
      Methods: [...]
  
  ▼ 8️⃣ logger (if available)
      Properties: [...]
      Methods: ['info', 'warn', 'error', ...]

💡 Tip: Desktop is now available as window.Desktop
💡 Try: Desktop.agentStateInfo.latestData
💡 Try: Desktop.config.clientLocale
```

**Note:** The output uses `console.group()` to create collapsible sections. Click the ▼ arrows to expand/collapse each section!

---

**You'll see organized output like:**

```
🖥️ Desktop SDK Debug Info
  1️⃣ All Modules: ['config', 'agentStateInfo', 'agentContact', 'actions', 'dialer', ...]
  
  2️⃣ config
    Properties: ['clientLocale', 'SERVICE', ...]
    Methods: ['init', 'cleanup']
    Client Locale: en-US
  
  3️⃣ agentStateInfo
    Properties: ['latestData', 'idleCodes', 'teams', ...]
    Methods: ['stateChange', 'addEventListener', ...]
    Current State: {subStatus: "Available", agentName: "Victor's Agent 1", ...}
    Idle Codes: [{id: "1643", name: "Break", isDefault: true}, ...]
  
  4️⃣ agentContact
    Properties: ['taskMap', 'taskSelected', 'interactionIds', ...]
    Methods: ['addEventListener', 'vteamTransfer', 'pauseRecording', ...]
    Task Map: Map(0) {}
    Selected Task: null
  
  5️⃣ actions
    Properties: ['lastReqTs', 'lastReqN', ...]
    Methods: ['getToken', 'getIdleCodes', 'getWrapUpCodes', ...]
  
  6️⃣ dialer
    Properties: [...]
    Methods: ['startOutdial', 'updateCadVariables', ...]
  
  7️⃣ screenpop
    Properties: [...]
    Methods: [...]
  
  8️⃣ logger
    Properties: [...]
    Methods: ['info', 'warn', 'error', ...]

💡 Tip: Desktop is now available as window.Desktop
💡 Try: Desktop.agentStateInfo.latestData
💡 Try: Desktop.config.clientLocale
```

---

## 🔍 Exploring After Debug

After running `debugDesktop()`, the Desktop object is available globally. You can explore directly:

### Example 1: Check Current Agent State

```javascript
Desktop.agentStateInfo.latestData
```

**Result:**
```javascript
{
  subStatus: "Available",
  agentName: "Victor's Agent 1",
  agentId: "...",
  teamName: "...",
  idleCode: {...}
}
```

### Example 2: Get Client Locale

```javascript
Desktop.config.clientLocale
```

**Result:**
```
"en-US"
```

### Example 3: Check Current Tasks

```javascript
Desktop.agentContact.taskMap
```

**Result:**
```
Map(0) {}  // Empty if no active tasks
```

### Example 4: Get Idle Codes

```javascript
Desktop.agentStateInfo.idleCodes
```

**Result:**
```javascript
[
  {id: "1643", name: "Break", isDefault: true},
  {id: "1644", name: "Meeting", isDefault: false}
]
```

### Example 5: List All Actions Methods

```javascript
Object.keys(Desktop.actions).filter(k => typeof Desktop.actions[k] === 'function')
```

**Result:**
```javascript
["getToken", "getIdleCodes", "getWrapUpCodes", "getMediaTypeQueue", ...]
```

---

## 🛠️ Common Use Cases

### Use Case 1: Find Available Methods on a Module

```javascript
// See all methods on agentContact
Object.keys(Desktop.agentContact)
  .filter(k => typeof Desktop.agentContact[k] === 'function')
```

### Use Case 2: Check What Data is Available

```javascript
// See current agent data
console.log('Agent:', Desktop.agentStateInfo.latestData);
console.log('Tasks:', Desktop.agentContact.taskMap);
console.log('Locale:', Desktop.config.clientLocale);
```

### Use Case 3: Test a Method Before Coding

```javascript
// Test getting idle codes
Desktop.actions.getIdleCodes().then(codes => {
  console.log('Idle codes:', codes);
});
```

### Use Case 4: Monitor State Changes

```javascript
// Add a temporary listener to see state changes
Desktop.agentStateInfo.addEventListener('eAgentStateChange', (event) => {
  console.log('🔥 STATE CHANGED:', event.data);
});

// Now change your state in Desktop UI and watch console!
```

### Use Case 5: Test State Change

```javascript
// Test changing to Available
Desktop.agentStateInfo.stateChange({
  state: 'Available'
}).then(result => {
  console.log('✅ Changed to Available:', result);
}).catch(error => {
  console.error('❌ Error:', error);
});
```

---

## 📋 Quick Reference Commands

```javascript
// Run the debug function
Desktop.debugWidget();

// Explore modules directly
Desktop.config
Desktop.agentStateInfo
Desktop.agentContact
Desktop.actions
Desktop.dialer

// Get specific data
Desktop.agentStateInfo.latestData.subStatus  // Current state
Desktop.agentStateInfo.idleCodes              // Idle codes
Desktop.agentContact.taskMap                  // Current tasks
Desktop.config.clientLocale                   // Browser locale

// Test methods
await Desktop.actions.getIdleCodes()
await Desktop.actions.getWrapUpCodes()
await Desktop.agentStateInfo.stateChange({state: 'Available'})
```

---

## 🐛 Troubleshooting

### Desktop is Undefined

**Problem:**
```javascript
Desktop.debugWidget();
// Uncaught ReferenceError: Desktop is not defined
```

**Solution:**
- Wait a few seconds after page load
- Look for "[WxCC Widget Fresh] ✅ SDK Ready!" in console
- Make sure the widget is loaded on the current page
- Check that `npm run serve` is running
- Hard refresh browser: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

### Desktop Exists But debugWidget is Undefined

**Problem:**
```javascript
console.log(Desktop);  // Shows object
Desktop.debugWidget(); // TypeError: Desktop.debugWidget is not a function
```

**Solution:**
- The widget didn't initialize properly
- Check console for SDK initialization errors
- Look for "[WxCC Widget Fresh] 💡 Try: Desktop.debugWidget()" message
- If missing, the widget crashed during initialization

### Can't Find a Method

**Problem:** You know a method exists but can't find it.

**Solution:**
```javascript
// Search all modules for a method name
Object.keys(Desktop).forEach(module => {
  if (Desktop[module] && typeof Desktop[module] === 'object') {
    const methods = Object.keys(Desktop[module])
      .filter(k => typeof Desktop[module][k] === 'function');
    if (methods.length > 0) {
      console.log(`${module}:`, methods);
    }
  }
});
```

### Widget Not Loading

**Check these:**
1. Is `npm run build` completed successfully?
2. Is `npm run serve` still running?
3. Can you access `http://localhost:5000/wxcc-widget-fresh.js` in browser?
4. Is the widget configured in your Desktop Layout JSON?
5. Are you on the correct page in Agent Desktop?

---

## 💡 Pro Tips

1. **Save Desktop globally:** After running `debugDesktop()`, you can use `Desktop` directly without the widget reference.

2. **Use console.table():** For better formatting:
   ```javascript
   console.table(Desktop.agentStateInfo.idleCodes);
   ```

3. **Copy to clipboard:** 
   ```javascript
   copy(Desktop.agentStateInfo.latestData);
   // Now paste anywhere with Ctrl+V
   ```

4. **Pretty print JSON:**
   ```javascript
   console.log(JSON.stringify(Desktop.agentStateInfo.latestData, null, 2));
   ```

5. **Monitor property changes:**
   ```javascript
   // Check state every 2 seconds
   setInterval(() => {
     console.log('Current state:', Desktop.agentStateInfo.latestData.subStatus);
   }, 2000);
   ```

---

## 📚 Related Documentation

- [Official Desktop SDK Docs](https://developer.webex.com/webex-contact-center/docs/desktop)
- [SDK Sample Code](https://github.com/WebexSamples/webex-contact-center-api-samples/tree/main/widget-samples/desktop-js-sdk-sample)
- Your widget README: [README.md](./README.md)

---

## 📊 Understanding the Output

### Console Groups

The debug output uses `console.group()` to organize information into collapsible sections:

```javascript
console.group('🖥️ Desktop SDK Debug Info');  // Main group
  console.log('All Modules:', [...]);
  
  console.group('2️⃣ config');              // Nested group
    console.log('Properties:', [...]);
  console.groupEnd();                        // Close nested group
  
console.groupEnd();                          // Close main group
```

**Tips:**
- Click the **▼** arrow to collapse/expand sections
- Click the **▶** arrow on collapsed sections to expand them
- This keeps console output clean and organized

### The "undefined" Return Value

When you run `Desktop.debugWidget()`, you'll see:
```javascript
Desktop.debugWidget();
undefined
```

**This is normal!** The `undefined` is just the return value of the function. The actual debug output appears **above** it in the console. Look for the grouped sections with:
- 🖥️ Desktop SDK Debug Info
- 2️⃣ config
- 3️⃣ agentStateInfo
- etc.

**If you're filtering the console**, make sure your filter doesn't hide the debug output. Clear any active filters to see everything.

---

## 🎯 Next Steps

Once you've explored the Desktop SDK:

1. **Find interesting methods** you want to use
2. **Test them in console** first
3. **Add them to your widget** once confirmed working
4. **Build new features** based on what you discovered!

Happy debugging! 🚀