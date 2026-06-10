# How to Build Your Widget UI

## 🎯 Current State

Right now, your widget shows a **blank canvas**:

```
┌─────────────────────────────┐
│      SDK Ready ✓           │
├─────────────────────────────┤
│                             │
│      🎨 Blank Canvas        │
│                             │
└─────────────────────────────┘
```

This is coming from the `render()` method in `src/index.js`.

---

## 📝 Where to Make Changes

**File to edit:** `src/index.js`

**Method to modify:** `render()`

**Current code:**
```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            /* CSS styles */
        </style>
        
        <div id="status" class="status">Initializing...</div>
        <div class="canvas">🎨 Blank Canvas</div>  ← This is what you see
    `;
}
```

---

## 🚀 How to Add Your UI

### Option 1: Simple Text Change

**Change this:**
```javascript
<div class="canvas">🎨 Blank Canvas</div>
```

**To this:**
```javascript
<div class="canvas">
    <h1>My Custom Widget</h1>
    <p>Hello from WxCC!</p>
</div>
```

### Option 2: Add Real Content

Replace the entire `render()` method:

```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: sans-serif;
                background: #fff;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .header {
                background: #049fd9;
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .content {
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            
            .button {
                background: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .button:hover {
                background: #218838;
            }
        </style>
        
        <div class="header">
            <h2>Agent Dashboard</h2>
        </div>
        
        <div class="content">
            <p>Welcome to your custom widget!</p>
            <button class="button" id="myButton">Click Me</button>
            <div id="output"></div>
        </div>
    `;
}
```

### Option 3: Dynamic Content (Using SDK Data)

This shows agent information from the SDK:

```javascript
render() {
    // Get agent state from SDK (if available)
    const agentState = this.desktop?.agentStateInfo?.latestData?.state || 'Unknown';
    
    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: sans-serif;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .card {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
            }
            
            .label {
                font-weight: bold;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
            }
            
            .value {
                font-size: 18px;
                color: #000;
                margin-top: 5px;
            }
            
            .status-badge {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                background: #28a745;
                color: white;
                font-size: 14px;
            }
        </style>
        
        <div class="card">
            <div class="label">Agent Status</div>
            <div class="value">
                <span class="status-badge">${agentState}</span>
            </div>
        </div>
        
        <div class="card">
            <div class="label">SDK Ready</div>
            <div class="value">${this.sdkReady ? '✅ Yes' : '❌ No'}</div>
        </div>
        
        <div class="card">
            <div class="label">Widget Info</div>
            <div class="value">WxCC Widget Fresh v1.0.0</div>
        </div>
    `;
}
```

---

## 🔄 Workflow: Edit → Build → Test

### Step 1: Edit the Code

Open `src/index.js` and modify the `render()` method:

```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            /* Your CSS here */
        </style>
        
        <div>
            <!-- Your HTML here -->
            <h1>My Widget</h1>
        </div>
    `;
}
```

### Step 2: Build

```bash
npm run build
```

This compiles `src/index.js` → `dist/wxcc-widget-fresh.js`

### Step 3: Test

**If using local dev server:**
```bash
npm run serve
# Refresh your Agent Desktop browser
```

**If widget is already loaded in Desktop:**
- Just refresh the browser (F5)
- The new version will load automatically

---

## 🎨 Adding Interactivity

### Example: Click Button to Show Agent State

**1. Add button in render():**
```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            .button {
                background: #049fd9;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
        
        <button id="showStateBtn" class="button">Show Agent State</button>
        <div id="stateDisplay"></div>
    `;
    
    // Add event listener after render
    this.setupEventListeners();
}
```

**2. Add method to handle clicks:**
```javascript
setupEventListeners() {
    const button = this.shadowRoot.getElementById('showStateBtn');
    const display = this.shadowRoot.getElementById('stateDisplay');
    
    if (button) {
        button.addEventListener('click', () => {
            const state = this.desktop?.agentStateInfo?.latestData;
            display.textContent = JSON.stringify(state, null, 2);
        });
    }
}
```

**3. Call it from connectedCallback:**
```javascript
connectedCallback() {
    console.log('[WxCC Widget Fresh] Widget connected');
    this.render();  // This now calls setupEventListeners()
    this.initSDK();
}
```

**Complete example:**

```javascript
class WxccWidgetFresh extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.desktop = null;
        this.sdkReady = false;
    }

    connectedCallback() {
        console.log('[WxCC Widget Fresh] Widget connected');
        this.render();
        this.initSDK();
    }

    initSDK() {
        console.log('[WxCC Widget Fresh] Initializing SDK...');
        
        try {
            Desktop.config.init();
            this.desktop = Desktop;
            this.sdkReady = true;
            console.log('[WxCC Widget Fresh] ✅ SDK Ready!');
        } catch (error) {
            console.error('[WxCC Widget Fresh] ❌ SDK Error:', error);
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                    font-family: sans-serif;
                }
                
                .button {
                    background: #049fd9;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-bottom: 15px;
                }
                
                .button:hover {
                    background: #037fa8;
                }
                
                .output {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    white-space: pre-wrap;
                }
            </style>
            
            <h2>Agent State Viewer</h2>
            <button id="showStateBtn" class="button">Show Agent State</button>
            <div id="stateDisplay" class="output">Click the button to view agent state</div>
        `;
        
        // Setup click handler
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const button = this.shadowRoot.getElementById('showStateBtn');
        const display = this.shadowRoot.getElementById('stateDisplay');
        
        if (button) {
            button.addEventListener('click', () => {
                if (this.desktop?.agentStateInfo?.latestData) {
                    const state = this.desktop.agentStateInfo.latestData;
                    display.textContent = JSON.stringify(state, null, 2);
                } else {
                    display.textContent = 'SDK not ready or no state available';
                }
            });
        }
    }
    
    getDesktop() {
        return this.desktop;
    }
}

customElements.define('wxcc-widget-fresh', WxccWidgetFresh);
console.log('[WxCC Widget Fresh] Widget loaded');
```

---

## 📋 Common Patterns

### 1. Display Data on Load

```javascript
initSDK() {
    Desktop.config.init();
    this.desktop = Desktop;
    this.sdkReady = true;
    
    // Display data immediately after SDK is ready
    this.displayAgentInfo();
}

displayAgentInfo() {
    const state = this.desktop?.agentStateInfo?.latestData;
    const display = this.shadowRoot.getElementById('agentInfo');
    
    if (display && state) {
        display.textContent = `Current State: ${state.state}`;
    }
}
```

### 2. Listen for State Changes

```javascript
initSDK() {
    Desktop.config.init();
    this.desktop = Desktop;
    this.sdkReady = true;
    
    // Listen for state changes
    this.desktop.agentStateInfo.addEventListener('eAgentStateChange', (event) => {
        console.log('State changed:', event);
        this.updateStateDisplay(event.data);
    });
}

updateStateDisplay(newState) {
    const display = this.shadowRoot.getElementById('stateDisplay');
    if (display) {
        display.textContent = `New State: ${newState.state}`;
    }
}
```

### 3. Button to Change State

```javascript
render() {
    this.shadowRoot.innerHTML = `
        <style>
            .state-button {
                background: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
        
        <h3>Change Agent State</h3>
        <button id="availableBtn" class="state-button">Go Available</button>
        <button id="idleBtn" class="state-button">Go Idle</button>
    `;
    
    this.setupEventListeners();
}

setupEventListeners() {
    this.shadowRoot.getElementById('availableBtn')?.addEventListener('click', () => {
        this.desktop?.agentStateInfo.setAgentState('Available');
    });
    
    this.shadowRoot.getElementById('idleBtn')?.addEventListener('click', () => {
        this.desktop?.agentStateInfo.setAgentState('Idle');
    });
}
```

---

## 🎯 Quick Reference

### To Change UI:

1. **Edit** `src/index.js` → `render()` method
2. **Build** `npm run build`
3. **Test** Refresh browser in Agent Desktop

### To Add Interactivity:

1. Add HTML elements with IDs in `render()`
2. Create `setupEventListeners()` method
3. Call it from `render()`
4. Use `this.shadowRoot.getElementById()` to access elements

### To Use SDK Data:

1. Access via `this.desktop`
2. Check `this.sdkReady` first
3. Use optional chaining: `this.desktop?.agentStateInfo?.latestData`

---

## 💡 Pro Tips

### 1. Always Check if SDK is Ready

```javascript
if (this.sdkReady && this.desktop) {
    // Safe to use SDK
    const state = this.desktop.agentStateInfo.latestData;
}
```

### 2. Use Template Literals for Dynamic Content

```javascript
render() {
    const agentName = this.desktop?.agentContact?.latestData?.name || 'Unknown';
    
    this.shadowRoot.innerHTML = `
        <div>
            <h2>Welcome, ${agentName}!</h2>
        </div>
    `;
}
```

### 3. Re-render When Data Changes

```javascript
initSDK() {
    Desktop.config.init();
    this.desktop = Desktop;
    
    this.desktop.agentStateInfo.addEventListener('eAgentStateChange', () => {
        this.render();  // Re-draw UI with new data
    });
}
```

### 4. Separate CSS and HTML for Clarity

```javascript
render() {
    const styles = `
        <style>
            .card { background: white; padding: 20px; }
            .button { background: blue; color: white; }
        </style>
    `;
    
    const html = `
        <div class="card">
            <button class="button">Click Me</button>
        </div>
    `;
    
    this.shadowRoot.innerHTML = styles + html;
}
```

---

## 🚀 Next Steps

### Start Simple:
1. Change the "Blank Canvas" text to something else
2. Build and test

### Add Content:
3. Add a header with your widget name
4. Add some information cards
5. Build and test

### Make it Interactive:
6. Add buttons
7. Add click handlers
8. Display SDK data
9. Build and test

### Polish:
10. Add better styling
11. Add animations
12. Handle edge cases
13. Final testing

---

**Remember:** After every change, run `npm run build` then refresh your browser! 🎯