const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: Arial, sans-serif;
        }

        .slider-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .slider-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(
                to right,
                #1976d2 0%,
                #1976d2 var(--progress, 50%),
                #ccc var(--progress, 50%),
                #ccc 100%
            );
            outline: none;
            margin: 0;
            accent-color: #1976d2;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #1976d2;
            cursor: pointer;
            border: none;
        }

        input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #1976d2;
            cursor: pointer;
            border: none;
        }

        .s-val {
            font-size: 13px;
            color: #555;
            white-space: nowrap;
            min-width: 3.5em;
            text-align: right;
        }

        .labels {
            position: relative;
            height: 1.5em;
            margin-top: 6px;
            font-size: 0.9rem;
            color: #333;
        }

        .labels span {
            position: absolute;
            transform: translateX(-50%);
            white-space: nowrap;
        }

        .labels span:first-child {
            transform: translateX(0%);
        }

        .labels span:last-child {
            transform: translateX(-100%);
        }

    </style>
    
    <div class="slider-row">
        <input type="range" id="range"/>
        <span class="s-val" id="display"> </span>
    </div>

    <div class="labels" id="labels"></div>
`;

class MySlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.range = this.shadowRoot.querySelector("#range");
        this.display = this.shadowRoot.querySelector("#display");
        this.labelsContainer = this.shadowRoot.querySelector("#labels");
    
        this.labelMap = new Map();
        this.onInput = this.onInput.bind(this);
    }

    connectedCallback() {
        this.min = parseInt(this.getAttribute("min") ?? 0);
        this.max = parseInt(this.getAttribute("max") ?? 3000);
        this.unit = this.getAttribute("unit") ?? "";

        const step = Number(this.getAttribute("step") ?? 100);
        const value = Number(this.getAttribute("value") ?? this.min);
        
        this.range.min = this.min;
        this.range.max = this.max;
        this.range.step = step;
        this.range.value = value;
        
        if (this.getAttribute("labels")) this.buildLabelMap();

        this.updateProgress(value);
        this.updateDisplay(value);
        this.range.addEventListener("input", this.onInput);
    }

    disconnectedCallback() {
        this.range.removeEventListener("input", this.onInput);
    }

    onInput(e) {
        const val = Number(e.target.value);
        this.updateProgress(val);
        this.updateDisplay(val);

        this.dispatchEvent(
            new CustomEvent("change", {
                detail: {
                    value: val,
                    label: this.labelMap.get(val) ?? null
                },
                bubbles: true,
                composed: true
            })
        );W
    }

    // Construye this.labelMap a partir del atributo "labels" (JSON)
    buildLabelMap() {
        this.labelMap = new Map();
        const labelsAttr = this.getAttribute("labels");

        try {
            const obj = JSON.parse(labelsAttr);
            Object.entries(obj).forEach(([pos, text]) => {
                this.labelMap.set(Number(pos), text);
            });
            return;
        } catch (e) {
            console.error("mi-slider: 'labels' no es JSON válido", e);
        }
    }

    updateDisplay(value) {
        if (this.unit) {
            this.display.textContent = `${value}${this.unit}`;
        } else if (this.labelMap.has(value)) {
            this.display.innerHTML = this.labelMap.get(value);
        } else {
            this.display.textContent = `${value}`;
        }
    }

    updateProgress(value) {
        const percent = ((value - this.min) / (this.max - this.min)) * 100;
        this.range.style.setProperty("--progress", `${percent}%`);
    }
};

customElements.define("my-slider", MySlider);