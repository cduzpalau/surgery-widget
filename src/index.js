/**
 * SurgeryWidget - Versioned WxCC Agent Desktop Widget
 */

import { Desktop } from "@wxcc-desktop/sdk";

const VERSION = "1.0.1";
const TAG = `[surgery-widget_v${VERSION}]`;

class SurgeryWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            helloVisible: false,
            agentSubStatus: "Unknown"
        };
    }

    async connectedCallback() {
        console.log(`${TAG} Widget connected`);
        this.render();
        await this.initSDK();
    }

    disconnectedCallback() {
        console.log(`${TAG} Widget disconnected - cleaning up listeners`);
        Desktop.agentStateInfo.removeAllEventListeners();
    }

    async initSDK() {
        console.log(`${TAG} Initializing SDK...`);
        try {
            // SDK v2.0+ requires async init with widget name and provider
            await Desktop.config.init('surgery-widget', 'cisco');
            console.log(`${TAG} ✅ SDK Initialized`);
            
            // Subscribe to agent state changes
            this.subscribeToAgentStateEvents();
            
            // Set initial state
            if (Desktop.agentStateInfo.latestData) {
                this.updateAgentStatus(Desktop.agentStateInfo.latestData.status);
            }
            
            this.updateStatus('SDK Ready');
        } catch (error) {
            console.error(`${TAG} ❌ SDK Init Failed:`, error);
            this.updateStatus(`SDK Error: ${error.message}`);
        }
    }

    subscribeToAgentStateEvents() {
        // Listen to channel state changes (Available, Idle, etc)
        Desktop.agentStateInfo.addEventListener("eAgentChannelStateChanged", (event) => {
            console.log(`${TAG} Agent State Changed (eAgentChannelStateChanged):`, Desktop.agentStateInfo.latestData?.status);
            this.updateAgentStatus(Desktop.agentStateInfo.latestData?.status);
        });

        // Listen to general updates (profile, idle codes, etc)
        Desktop.agentStateInfo.addEventListener("updated", (event) => {
            console.log(`${TAG} Agent state info updated (updated):`, Desktop.agentStateInfo.latestData?.status);
            this.updateAgentStatus(Desktop.agentStateInfo.latestData?.status);
        });
    }

    updateAgentStatus(status) {
        // Extract subStatus (aux code name) if available, otherwise fallback to general status
        const subStatus = Desktop.agentStateInfo.latestData?.subStatus || status || "Unknown";
        this.state.agentSubStatus = subStatus;
        const statusField = this.shadowRoot.getElementById('agent-status-field');
        if (statusField) {
            statusField.value = subStatus;
        }
    }

    toggleHelloWorld() {
        this.state.helloVisible = !this.state.helloVisible;
        const msg = this.shadowRoot.getElementById('hello-message');
        if (msg) {
            msg.style.display = this.state.helloVisible ? 'block' : 'none';
        }
        console.log(`${TAG} Hello World toggled: ${this.state.helloVisible}`);
    }

    async setAvailable() {
        console.log(`${TAG} Attempting to set agent state to Available...`);
        try {
            // Using the recommended auxCodeIdArray: "0" to clear sub-statuses
            await Desktop.agentStateInfo.stateChange({
                state: "Available",
                auxCodeIdArray: "0"
            });
            console.log(`${TAG} ✅ State change request sent`);
        } catch (error) {
            const detail = error.data?.message || error.message;
            console.error(`${TAG} ❌ State change failed:`, detail, error.data);
            alert(`Failed to change state: ${detail}`);
        }
    }

    updateStatus(message) {
        const el = this.shadowRoot.getElementById('connection-status');
        if (el) {
            el.textContent = message;
            el.className = 'status-badge ' + (message.includes('Ready') ? 'ready' : 'error');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f4f7f9;
                    color: #333;
                    box-sizing: border-box;
                    padding: 16px;
                }

                .card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 12px;
                }

                h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #005eb8;
                }

                .status-badge {
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: #eee;
                }

                .status-badge.ready {
                    background: #e6f4ea;
                    color: #1e7e34;
                }

                .status-badge.error {
                    background: #fce8e6;
                    color: #d93025;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #666;
                }

                input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    background: #f9f9f9;
                    font-size: 1rem;
                    color: #333;
                }

                .actions {
                    display: flex;
                    gap: 12px;
                }

                button {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-primary {
                    background: #005eb8;
                    color: white;
                }

                .btn-primary:hover {
                    background: #004a91;
                }

                .btn-secondary {
                    background: #e1e7ed;
                    color: #333;
                }

                .btn-secondary:hover {
                    background: #d1d9e2;
                }

                #hello-message {
                    display: none;
                    background: #eef9ff;
                    border-left: 4px solid #005eb8;
                    padding: 12px;
                    margin-top: 10px;
                    font-weight: 500;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .version {
                    margin-top: auto;
                    font-size: 0.7rem;
                    color: #bbb;
                    text-align: right;
                }
            </style>

            <div class="card">
                <div class="header">
                    <h2>Surgery Widget</h2>
                    <span id="connection-status" class="status-badge">Connecting...</span>
                </div>

                <div class="field-group">
                    <label for="agent-status-field">Agent Substatus</label>
                    <input type="text" id="agent-status-field" readonly value="Unknown">
                </div>

                <div class="actions">
                    <button class="btn-secondary" id="toggle-hello">Toggle Hello</button>
                    <button class="btn-primary" id="set-available">Go Available</button>
                </div>

                <div id="hello-message">👋 Hello World! Welcome to the surgery widget.</div>
            </div>

            <div class="version">v${VERSION}</div>
        `;

        this.shadowRoot.getElementById('toggle-hello').addEventListener('click', () => this.toggleHelloWorld());
        this.shadowRoot.getElementById('set-available').addEventListener('click', () => this.setAvailable());
    }
}

customElements.define('surgery-widget', SurgeryWidget);
console.log(`${TAG} Widget loaded`);
