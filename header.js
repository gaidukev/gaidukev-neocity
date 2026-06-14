

class SiteHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const headerWrapper = document.createElement("header");

    const dayColors = {
      headerBg: "#dcdeff",
      toggleBg: "#192252",
      toggleKnob: "#313467",
      hamburgerFill: "#192252",
      titleColor: "white",
      titleBackground: "url('./background-images/7.jpg')",
      titleBackgroundPosition: "70%",
      navChevronBorder: "rgba(255, 255, 255, 0.2)",
      navLinkText: "black",
      navLink1: "#451952",
      navLink2: "#662549",
      navLink3: "#AE445A",
      navLink4: "#F39F5A"
    };

    const nightColors = {
      headerBg: "#231f20",
      toggleBg: "#451952",
      toggleKnob: "#784288",
      hamburgerFill: "#451952",
      titleColor: "white",
      titleBackground: "url('./misc-assets/colorful-background3.jpg')",
      titleBackgroundPosition: "center",
      navChevronBorder: "rgba(255, 255, 255, 0.2)",
      navLinkText: "white",
      navLink1: "#690089",
      navLink2: "#b40064",
      navLink3: "#EE3C61",
      navLink4: "#F39F5A"
    };

    const colorVariables = (colors) => `
      header {
        --header-bg: ${colors.headerBg};
        --toggle-bg: ${colors.toggleBg};
        --toggle-knob: ${colors.toggleKnob};
        --hamburger-fill: ${colors.hamburgerFill};
        --title-color: ${colors.titleColor};
        --title-background: ${colors.titleBackground};
        --title-background-position: ${colors.titleBackgroundPosition};
        --nav-chevron-border: ${colors.navChevronBorder};
        --nav-link-text: ${colors.navLinkText};
        --nav-link-1: ${colors.navLink1};
        --nav-link-2: ${colors.navLink2};
        --nav-link-3: ${colors.navLink3};
        --nav-link-4: ${colors.navLink4};
      }
    `;

    const createStyles = (isDay) => {
      const colors = isDay ? dayColors : nightColors;
      const baseStyles = `
      ${colorVariables(colors)}

      #header-toggle-container {
        --toggle-width: clamp(2.75rem, 9vw, 3.5rem);
        --thumb-size: clamp(1.15rem, 5vw, 1.55rem);
        --toggle-padding: 0.2rem;
        --thumb-travel: calc(var(--toggle-width) - var(--thumb-size) - (2 * var(--toggle-padding)));

        width: var(--toggle-width);
        height: calc(var(--thumb-size) + (2 * var(--toggle-padding)));
        padding: var(--toggle-padding);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        margin: 5px;
        background: var(--toggle-bg);
        flex-shrink: 0;
        display: block;
        box-sizing: border-box;
      }

      .theme-switch-thumb {
        width: var(--thumb-size);
        height: var(--thumb-size);
        border-radius: 50%;
        background: var(--toggle-knob);
        display: flex;
        align-items: center;
        justify-content: center;
        translate: var(--thumb-travel) 0;
        transition: translate 0.3s ease;
      }

      #header-toggle-container.theme-switch-toggled .theme-switch-thumb {
        translate: 0 0;
      }

      .theme-switch-icon {
        width: 72%;
        height: 72%;
        display: block;
        pointer-events: none;
      }

      .theme-switch-icon-moon {
        display: none;
      }

      #header-toggle-container.theme-switch-toggled .theme-switch-icon-sun {
        display: none;
      }

      #header-toggle-container.theme-switch-toggled .theme-switch-icon-moon {
        display: block;
      }

      h1 a {
        text-decoration: none;
        color: inherit;
      }

      header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        width: 100%;
        margin: 0;
        padding: 0 10px;
        position: sticky;
        z-index: 1001;
        top: 0;
        background-color: var(--header-bg);
        box-sizing: border-box;
      }

      h1 {
        font-family: "Anton", sans-serif;
        text-align: center;
        font-weight: 600;
        font-size: 3em;
        margin: 0;
        padding: 0;
        text-transform: uppercase;
        color: var(--title-color);
        background: var(--title-background);
        background-position: var(--title-background-position);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: cover;
        flex-shrink: 0;
      }

      @media only screen and (max-width: 720px) {
        h1 {
          font-size: 2em;
        }

        #links > ul li a {
          font-size: 13px;
          padding: 0.4em 0.65em;
        }
      }

      @media only screen and (max-width: 520px) {
        h1 {
          font-size: 1.6em;
        }
      }

      @media only screen and (max-width: 400px) {
        h1 {
          font-size: 1.35em;
        }

        #links > ul li a {
          font-size: 11px;
          padding: 0.35em 0.5em;
        }
      }

      #links {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        min-width: 0;
      }

      #links > ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: end;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 4px;
      }

      #links > ul li {
        text-align: center;
        display: block;
        position: relative;
        border-radius: 4px;
        overflow: hidden;

        border: 2px solid;
        cursor: pointer;
      }

      #links > ul li:nth-child(1) {
        border-color: var(--nav-link-1);
      }

      #links > ul li:nth-child(2) {
        border-color: var(--nav-link-2);
      }

      #links > ul li:nth-child(3) {
        border-color: var(--nav-link-3);
      }

      #links > ul li:nth-child(4) {
        border-color: var(--nav-link-4);
      }

      #links > ul li a {
        padding: 0.5em 1em;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 15px;
        line-height: 1.4;
        color: var(--nav-link-text);
        display: block;
        white-space: nowrap;
        transition: opacity 0.15s ease;
        position: relative;
      }

      #links > ul li a::after {
        content: '';
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%) scaleX(1);
        transform-origin: center;
        width: calc(100% - 2.5rem);
        height: 1px;
        background: currentColor;
      }

      #links > ul li a:hover::after,
      #links > ul li a:active::after {
        animation: underline-pop 0.35s ease forwards;
      }

      @keyframes underline-pop {
        0%   { transform: translateX(-50%) scaleX(1); }
        40%  { transform: translateX(-50%) scaleX(1.5); }
        100% { transform: translateX(-50%) scaleX(1); }
      }

      #links > ul li a:hover {
        opacity: 0.85;
      }
      `;

      return baseStyles;
    };

    headerWrapper.innerHTML = `
      <h1><a href="./index.html">Matt & Chai</a></h1>

      <nav id="links">
        <ul>
          <li><a href="./coding.html">Code</a></li>
          <li><a href="./play.html">Play</a></li>
          <li><a href="./books.html">Books</a></li>
          <li><a href="./chai.html">Chai the Cat</a></li>
        </ul>
      </nav>

      <button id="header-toggle-container" type="button" aria-label="Toggle day and night mode">
        <span class="theme-switch-thumb">
          <img class="theme-switch-icon theme-switch-icon-sun" src="misc-assets/sun-svgrepo.svg" alt="">
          <img class="theme-switch-icon theme-switch-icon-moon" src="misc-assets/moon-svgrepo.svg" alt="">
        </span>
      </button>
    `;

    shadow.appendChild(headerWrapper);

    const style = document.createElement("style");
    const toggle = headerWrapper.querySelector("#header-toggle-container");

    if (toggle) {
      const isNight = !document.cookie || document.cookie.includes("night");
      style.textContent = createStyles(!isNight);

      if (isNight) {
        toggle.classList.add("theme-switch-toggled");
      }

      toggle.addEventListener("click", () => {
        const switchingToDay = !document.cookie || document.cookie.includes("night");
        toggle.classList.toggle("theme-switch-toggled", !switchingToDay);

        if (switchingToDay) {
          document.cookie = "displaymode=day; path=/; max-age=3600";
          style.textContent = createStyles(true);
        } else {
          document.cookie = "displaymode=night; path=/; max-age=3600";
          style.textContent = createStyles(false);
        }
      });
    }

    shadow.appendChild(style);
  }
}

customElements.define("site-header", SiteHeader);
