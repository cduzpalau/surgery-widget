# SurgeryWidget - SDK Edition

## 📖 Overview

This is a **production-ready starter template** for building Webex Contact Center widgets with the **Desktop SDK**.

**Key Features:**
- ✅ **Desktop SDK integrated** - `@wxcc-desktop/sdk@2.0.11` working and tested
- ✅ **Blank interface** - Ready for your custom UI
- ✅ **Synchronous initialization** - Simple, no complex async handling
- ✅ **Single .js bundle** - Webpack bundled output
- ✅ **Production ready** - Minified and optimized

## 🎯 What This Template Does

This widget:
1. Initializes the WxCC Desktop SDK (synchronously)
2. Provides a blank canvas for your UI
3. Logs SDK status to console
4. Exposes Desktop SDK for access via console or code

**The interface is intentionally blank** - you'll build the UI based on your requirements.

## 🏗️ Project Structure

```
surgery-widget/
├── src/
│   ├── index.js              # Main widget (SDK-enabled, blank UI)
│   ├── index-full.js         # Full version (with features)
│   └── index-store-only.js   # Simple version ($STORE only)
├── dist/
│   └── surgery-widget.js  # BUNDLED OUTPUT (after build)
├── package.json              # Dependencies (includes SDK 2.0.11)
├── webpack.config.js         # Webpack configuration
├── test.html                 # Local testing page
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@wxcc-desktop/sdk@2.0.11` - Desktop SDK (tested and working)
- `webpack` - Bundler
- `webpack-dev-server` - Dev server

### 2. Build the Widget

```bash
npm run build
```

**Output:** `dist/surgery-widget.js` (single bundled file with SDK included)

### 3. Test Locally

```bash
npm run serve
```

Opens dev server at `http://localhost:5000`

**Note:** SDK will only fully initialize inside WxCC Agent Desktop, not in local testing.

### 4. Deploy to Agent Desktop

1. Upload `dist/surgery-widget.js` to your CDN or web server
2. Add to Desktop Layout JSON (see below)

## 📝 Desktop Layout Configuration

```json
{
  "nav": {
    "label": "SurgeryWidget",
    "icon": "3d-object",
    "iconType": "momentum",
    "navigateTo": "surgery-widget-page",
    "align": "top"
  },
  "page": {
    "id": "surgery-widget-page",
    "widgets": {
      "comp2": {
        "comp": "div",
        "height": "100%",
        "overflow": "scroll"
      },
      "children": [
        {
          "comp": "surgery-widget",
          "script": "http://localhost:5000/surgery-widget.js",
          "wrapper": {
            "title": "SurgeryWidget",
            "maximizeAreaName": "app-maximize-area"
          }
        }
      ]
    },
    "layout": {
      "areas": [["comp2"]],
      "size": {
        "cols": [1],
        "rows": [1]
      }
    }
  }
}
```

**Important:** Replace `http://localhost:5000/surgery-widget.js` with your CDN URL for production.

## 🎨 What You See

When the widget loads in Agent Desktop:

```
┌─────────────────────────────┐
│      SDK Ready ✓           │
├─────────────────────────────┤
│                             │
│      🎨 Blank Canvas        │
│                             │
│                             │
└─────────────────────────────┘
```

**Console Output:**
```
[SurgeryWidget] Widget connected
[SurgeryWidget] Initializing SDK...
[SurgeryWidget] ✅ SDK Ready!
```

## 💻 Accessing the SDK

### From Browser Console

```javascript
// Get the widget element
const widget = document.querySelector('surgery-widget');

// Access Desktop SDK
const Desktop = widget.getDesktop();

// Example: Get agent state
console.log(Desktop.agentStateInfo?.latestData);

// Example: Change agent state
Desktop.agentStateInfo.setAgentState('Available');

// Example: Get current tasks
const tasks = Desktop.actions.getTaskMap();
```

### From Your Widget Code

Edit `src/index.js`:

```javascript
initSDK() {
    Desktop.config.init();
    this.desktop = Desktop;
    this.sdkReady = true;
    
    // Now you can use the SDK
    this.displayAgentInfo();
}

displayAgentInfo() {
    const state = this.desktop.agentStateInfo?.latestData;
    console.log('Agent state:', state);
}
```

## 🔧 Building Your UI

### Step 1: Edit the `render()` Method

Open `src/index.js` and find the `render()` method:

```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            /* Your CSS here */
        </style>
        
        <div>
            <!-- Your HTML here -->
            <h1>Agent Dashboard</h1>
            <div id="agent-info"></div>
        </div>
    `;
}
```

### Step 2: Add Interactivity

```javascript
initSDK() {
    Desktop.config.init();
    this.desktop = Desktop;
    this.sdkReady = true;
    
    // Update UI with agent info
    this.updateAgentInfo();
}

updateAgentInfo() {
    const state = this.desktop.agentStateInfo?.latestData;
    const infoEl = this.shadowRoot.getElementById('agent-info');
    if (infoEl && state) {
        infoEl.textContent = `State: ${state.state}`;
    }
}
```

### Step 3: Rebuild

```bash
npm run build
```

## 📚 Common SDK Methods

### Agent State

```javascript
// Get current state
const state = Desktop.agentStateInfo.latestData;

// Change state
Desktop.agentStateInfo.setAgentState('Available');

// Get idle codes
const idleCodes = Desktop.agentStateInfo.getIdleCodes();
```

### Task Management

```javascript
// Get current tasks
const taskMap = Desktop.actions.getTaskMap();

// Accept task
Desktop.actions.acceptTask(taskId);

// End task
Desktop.actions.endTask(taskId, { wrapUpReason: 'Resolved' });
```

### Screen Pop

```javascript
// Open URL
Desktop.screenpop.openScreenPop({
    url: 'https://crm.example.com/customer/123',
    type: 'tab'
});
```

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies (including SDK 2.0.11) |
| `npm run build` | Build production bundle |
| `npm run dev` | Development mode with watch |
| `npm run serve` | Dev server at localhost:5000 |
| `npm start` | Alias for serve |

## 📦 What Gets Bundled

After `npm run build`:

```
dist/surgery-widget.js       # Bundled widget with SDK
dist/surgery-widget.js.map   # Source map
```

**This file contains:**
- Your widget code
- @wxcc-desktop/sdk (bundled)
- All dependencies
- Minified for production

## 🐛 Troubleshooting

### Widget Not Loading

**Problem:** Widget doesn't appear in Desktop

**Solutions:**
- Verify script URL in layout JSON is correct
- Check browser console for errors
- Ensure CDN/server is accessible (CORS enabled)
- Verify custom element name: `surgery-widget`

### SDK Not Ready

**Problem:** SDK shows as not ready

**Solutions:**
- Ensure you're logged in to Agent Desktop (not just viewing layout editor)
- Check Desktop version compatibility
- Look for specific error in console
- Verify SDK version matches (2.0.11)

### Build Fails

**Problem:** `npm run build` errors

**Solutions:**
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## 🎓 Next Steps

### Level 1: Add Basic UI
- Display agent name and state
- Show current task info
- Add status indicators

### Level 2: Add Interactions
- State change buttons
- Accept/reject task buttons
- Quick actions

### Level 3: Advanced Features
- External API calls
- CRM integration
- Custom workflows
- Analytics

## 📚 Additional Resources

### Official Documentation
- [Desktop SDK Guide](https://developer.webex-cx.com/documentation/guides/desktop)
- [SDK npm Package](https://www.npmjs.com/package/@wxcc-desktop/sdk)
- [Developer Portal](https://developer.webex-cx.com/)

### Sample Code
- [Official Widget Samples](https://github.com/WebexSamples/webex-contact-center-api-samples/tree/main/widget-samples)
- [Desktop JS SDK Sample](https://github.com/WebexSamples/webex-contact-center-api-samples/tree/main/widget-samples/desktop-js-sdk-sample)

## ⚡ Key Points

### Why Synchronous Init?

The SDK initialization in this template is **synchronous** (no `async/await`):

```javascript
// This works with SDK 2.0.11
initSDK() {
    Desktop.config.init();  // Synchronous call
    this.desktop = Desktop;
}
```

**Why?** The SDK's `init()` method works synchronously in Agent Desktop 2.0.11. Using `async/await` caused initialization issues.

### Custom Element Name

The widget is registered as: **`surgery-widget`**

This must match in:
- Code: `customElements.define('surgery-widget', ...)`
- Layout: `"comp": "surgery-widget"`

## 📄 License

MIT

---

**Author:** Victor Vazquez  
**Version:** 1.0.0  
**Last Updated:** December 2025  
**SDK Version:** @wxcc-desktop/sdk@2.0.11  
**Tested:** WxCC Agent Desktop (Production)

**Ready to build! 🚀**