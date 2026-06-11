const template = document.createElement("template");

template.innerHTML = `
    <style>
        .card {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            max-width: clamp(100px, 100%, 300px);
        }
        h2 {
            margin-top: 0;
            font-size: 1.2rem;
        }

        p {
            margin-bottom: 0;
        }
    </style>

    <div class="card">
        <h2 id="title"></h2>
        <p id="content"></p>
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