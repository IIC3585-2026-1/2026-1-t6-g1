const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
            display: block;
            max-width: clamp(100px, 100%, 300px);
            heigth: 100%;
        }

        .card {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            width: 100%;
            box-sizing: border-box;
            height: 100%;
        }

        h2 {
            margin-top: 0;
            font-size: 1.2rem;
        }

        p {
            margin-bottom: 20px;
        }
    </style>

    <div class="card">
        <h2 id="title"></h2>
        <p id="content"></p>
        <slot></slot>
    </div>
`;

class MyCard extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(
            template.content.cloneNode(true)
        );
    }

    connectedCallback() {
        const title = this.getAttribute("title") || "";
        const content = this.getAttribute("content") || "";

        this.shadowRoot.querySelector("#title").textContent = title;
        this.shadowRoot.querySelector("#content").textContent = content;
    }
}

customElements.define("my-card", MyCard);