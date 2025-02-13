class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<nav class="navbar">
				<ul>
					<li><a href="index.html">Home</a></li>
					<li><a href="Animalese.html">Animalese</a></li>
				</ul>
			</nav>
		`;
	  }
	}
	
customElements.define('custom-header', Header);
