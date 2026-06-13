const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
            display: block;
        }

        .goal-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 14px;
        }

        
        .goal-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #333;
        }

        .goal-pct {
            font-weight: 600;
        }

        .progress-bg {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #e0e6e1;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            background: var(--bar-color, #3f6b4f);
            transition: width 0.3s ease;
        }
    </style>

    <div class="goal-row">
        <div class="goal-meta">
            <span class="goal-name" id="name"></span>
            <span class="goal-pct" id="pct"></span>
        </div>
        <div class="progress-bg">
            <div class="progress-fill" id="fill"></div>
        </div>
    </div>
`;

class MyProgressBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.name = this.shadowRoot.querySelector("#name");
        this.pct = this.shadowRoot.querySelector("#pct");
        this.fill = this.shadowRoot.querySelector("#fill");
    }

    static get observedAttributes() {
        return ["name", "value", "color"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute("name") ?? "";
        const value = Number(this.getAttribute("value") ?? 0);
        const color = this.getAttribute("color") ?? "";

        this.name.textContent = name;
        this.pct.textContent = `${value}%`;
        this.fill.style.width = `${value}%`;

        if (color) {
            this.fill.style.setProperty("--bar-color", color);
        }
    }
}

customElements.define("my-progress-bar", MyProgressBar);