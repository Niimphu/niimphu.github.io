class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<nav class="navbar">
				<a href="index.html">Home</a>
				<div class="right">
					
				</div>
			</nav>
		`;
	  }
	}
	
customElements.define('custom-header', Header);

{/* <div class="dropdown">
	<button class="dropbtn">Mini Apps</button>
	<div class="dropdown-content">
		<a href="animalese.html">Animalese Generator</a>
		<a href="#">Untrue Random</a>
	</div>
</div> */}
