

class SiteHeader extends HTMLElement {
  constructor() {
    super();  
  } 
  
  connectedCallback() {
    
    
    
    
    const shadow = this.attachShadow({ mode: "open" });
    const headerWrapper = document.createElement("header");
    
    
    headerWrapper.innerHTML = `
              
          <svg id="hamburger-symbol" viewbox="0 0 10 10" width="10" height="10">
            <rect fill="#FFFFFF" width="10" height="2" rx="1"></rect>
            <rect fill="#FFFFFF" y="3" width="10" height="2" rx="1"></rect>
            <rect fill="#FFFFFF" y="6" width="10" height="2" rx="1"></rect>
          </svg>

        <h1><a href="./index.html">Matt & Chai</a></h1>
        
        <nav id="links">
          <ul>
            <li><a href="./coding.html">Coding Projects</a></li>
            <li><a href="./coffee.html">Coffee Shops</a></li>
            <li><a href="./books.html">Books</a></li>
            <li><a href="./chai.html">Chai the Cat</a></li>  
          </ul>      
        </nav>
    
    
    `;
    

    shadow.appendChild(headerWrapper);
    
    
    const links = headerWrapper.querySelector("#links");
    const hamburger = headerWrapper.querySelector("#hamburger-symbol");

    const ul = links ? links.children.item(0) : undefined;

    if (hamburger && links) {
      hamburger.addEventListener("click", () => {
        const ul = links.children.item(0);
        ul.style.display = ul.style.display === "block" ? "none" : "block";
        
      }) 
      
    }
    
    document.addEventListener("click", (event) => {
        const target = event.target;
        
        const isLinks = target.nodeName === "SITE-HEADER";
        if (!isLinks) {
          const ul = links.children.item(0);
          ul.style.display = "none";
        }
        
        // console.log("event.target: ", target);
    
    })
    

    
    const style = document.createElement("style");
    style.textContent = `
    
      h1 a {
        text-decoration: none;
        color: inherit;
      }
      
      header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0px;
        padding: 0px;
        position: sticky;
        z-index: 1000;
        background-color: #231f20;
        top: 0px;
      }
      
      #hamburger-symbol:hover {
        cursor: pointer;  
        
      }
      
      
      #hamburger-symbol {
        left: 5px;
        position: absolute;
        width: 20px;
        height: 20px;
        z-index: 101;
      }
      
      h1 {
        font-family:  "Anton", sans-serif;
        text-align: center;
        font-weight: 600;
        font-size: 3em;
        margin: 0px;
        padding: 0px;
        text-transform: uppercase;
        color: white;
        background: url('./misc-assets/colorful-background3.jpg');
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: cover;
      }
      
      #links {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      #links > ul {
        display: none;
        list-style: none;
        position: absolute;
        left: 0;;
      }
      
      
      #links > ul li {
        margin: 5px 0;
        text-align: center;
        display: block;  
        position: relative;
        padding-right: 10px;
        
      }
      
      
      #links > ul li:before {
        display: block;
        height: 50px;
        width: 50px;
        content: '>';
        font-size: 2em;
        color: white;
        border-right: rgba(255,255,255,0.2) 1px solid;
        position: absolute;
      }

      
      #links > ul li a {
         height: 50px;
         padding: 0 2em 0 2em;
         text-decoration: none;
         text-transform: uppercase;
         font-size: 18px;
         line-height: 2.8em;
         color: white;
         overflow: hidden;
         display: block;
         width: 100%;
      }
      
      @keyframes expand {
        0% {width: 100%;}
        25% {width: 105%;}
        50% {width: 110%;}
        75% {width: 115%;}
        100% {width: 120%;}
      
      }
      
      #links > ul li:hover {
        animation-name: expand;
        animation-timing-function: ease-in;
        animation-duration: 0.10s;
        width: 120%;
      
      }
    
      #links > ul li:nth-child(1) {
        background-color: #451952;
      }
      
      #links > ul li:nth-child(2) {
        background-color: #662549;
      }
      
      #links > ul li:nth-child(3) {
        background-color: #AE445A;
      }
      
      #links > ul li:nth-child(4) {
        background-color: #F39F5A;
      }

    `
    shadow.appendChild(style);
    
    

  }
  
}

customElements.define("site-header", SiteHeader);