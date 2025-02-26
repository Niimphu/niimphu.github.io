class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<nav class="navbar">
				<div class="left">
					<a href="index.html">Home</a>
					<a href="cv.html">CV</a>
					</div>
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
