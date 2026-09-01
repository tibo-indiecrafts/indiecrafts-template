/** Runs before paint to set data-theme from localStorage, else prefers-color-scheme. Kept tiny + string-literal so it can be injected as a nonce'd inline script. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("app-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;}catch(e){}})();`;
