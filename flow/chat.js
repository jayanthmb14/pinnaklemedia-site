/*
 * Live chat, dressed as PinnakleFlow. The chat provider renders a <chat-widget> element with an open shadow root:
 * its colours are CSS variables on the host (set here, so the same script works on any page), and everything else (gradient bubble and
 * header, Flow fonts, corners, avatar, wording, no third-party "Powered by" line) is applied here. The provider
 * re-renders on open/close, so the tweaks are re-applied by a MutationObserver. The SMS consent text is left as is.
 */
(function () {
  var ME = document.currentScript && document.currentScript.src;
  var AVATAR = new URL("assets/brand/icon-dark-square.svg", ME || document.baseURI).href;
  var VARS = {
    "--chat-widget-primary-color": "#0F8A5F", "--chat-widget-active-color": "#0F8A5F", "--chat-widget-bubble-color": "#0F8A5F",
    "--chat-widget-button-color": "#0F8A5F", "--chat-widget-sender-message-color": "#0F8A5F", "--chat-widget-header-color": "#0F8A5F",
    "--chat-widget-header-darken-color": "#0B6B49", "--chat-widget-background-color": "#F7FAF7",
    "--chat-widget-received-message-color": "#EEF4EE", "--chat-widget-received-message-text-color": "#0E1A14",
    "--chat-widget-welcome-message-text-color": "#0E1A14", "--chat-widget-system-message-text-color": "#4C5A52",
    "--chat-widget-font-family": "'Geist',system-ui,-apple-system,'Segoe UI',sans-serif", "--ion-font-family": "'Geist',system-ui,sans-serif",
    "--ion-color-primary": "#0F8A5F", "--color": "#0F8A5F",
  };
  var TEXT = {
    prompt: "Hi! Questions about PinnakleFlow? Ask us here.",
    heading: "Chat with PinnakleFlow",
    sub: "Ask about setup, pricing or the $1 start. We reply here, or by text if you leave your number.",
  };

  var CSS = [
    ":host{--flow-grad:linear-gradient(135deg,#0F8A5F 0%,#2EC48A 100%);--flow-deep:linear-gradient(135deg,#0B6B49 0%,#0F8A5F 55%,#2EC48A 100%)}",
    "*{font-family:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif}",
    /* launcher bubble */
    ".lc_text-widget--bubble{background:var(--flow-grad)!important;box-shadow:0 14px 34px -12px rgba(15,138,95,.75)!important;transition:transform .35s cubic-bezier(.2,.8,.2,1)}",
    ".lc_text-widget--bubble:hover{transform:translateY(-2px) scale(1.04)}",
    /* teaser prompt */
    ".lc_text-widget_prompt--msg-bubble{background:#fff!important;border:1px solid #DCE6DD!important;border-radius:18px!important;box-shadow:0 18px 40px -16px rgba(14,26,20,.28)!important}",
    ".lc_text-widget_prompt--prompt-text{color:#0E1A14!important;font-weight:500!important;font-size:15px!important;line-height:1.4!important}",
    ".lc_text-widget_prompt--prompt-close{background:#0E1A14!important}",
    /* window */
    ".lc_text-widget--box{border-radius:22px!important;overflow:hidden!important;border:1px solid #DCE6DD!important;box-shadow:0 34px 70px -24px rgba(14,26,20,.42)!important;background:#F7FAF7!important}",
    ".lc_text-widget--header-wrapper,.lc_text-widget_heading--root{background:var(--flow-deep)!important}",
    ".lc_text-widget_heading--content{font-family:'Bricolage Grotesque','Geist',system-ui,sans-serif!important;font-weight:700!important;letter-spacing:-.02em!important;font-size:19px!important}",
    ".lc_text-widget_sub-heading,.lc_text-widget_sub-heading--root{background:#fff!important;color:#0E1A14!important;border:1px solid #DCE6DD!important;border-radius:16px!important;line-height:1.45!important}",
    ".circular-image{border:2px solid #fff!important;background:#0E1A14}",
    /* form */
    ".lc_text-widget--formContainer,.lc_text-widget--form{background:transparent!important}",
    "input,textarea{border-radius:12px!important;border-color:#C4D4C6!important;color:#0E1A14!important}",
    "input:focus,textarea:focus{border-color:#0F8A5F!important;box-shadow:0 0 0 3px rgba(46,196,138,.22)!important;outline:none!important}",
    ".lc_send_button--container button,button[type=submit]{background:var(--flow-grad)!important;border-radius:999px!important;font-weight:600!important;box-shadow:0 10px 24px -12px rgba(15,138,95,.8)!important}",
    ".lc_legal-text,.lc_legal-msg{color:#4C5A52!important}",
    ".lc_legal-text a,.lc_legal-msg a{color:#0B6B49!important}",
    /* no third-party branding line */
    ".lc_text-widget--agency-branding{display:none!important}",
  ].join("\n");

  function set(el, text) {
    if (el && el.textContent.trim() !== text) el.textContent = text;
  }

  function dress(root) {
    if (!root.querySelector("style[data-flow]")) {
      var s = document.createElement("style");
      s.setAttribute("data-flow", "");
      s.textContent = CSS;
      root.appendChild(s);
    }
    root.querySelectorAll("img.circular-image").forEach(function (img) {
      if (img.src !== AVATAR) img.src = AVATAR;
    });
    set(root.querySelector(".lc_text-widget_prompt--prompt-text"), TEXT.prompt);
    set(root.querySelector(".lc_text-widget_heading--content"), TEXT.heading);
    set(root.querySelector(".lc_text-widget_sub-heading--root") || root.querySelector(".lc_text-widget_sub-heading"), TEXT.sub);
  }

  function watch(host) {
    Object.keys(VARS).forEach(function (k) { host.style.setProperty(k, VARS[k]); });
    var root = host.shadowRoot;
    if (!root) return false;
    dress(root);
    var busy = false;
    new MutationObserver(function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () {
        dress(root);
        busy = false;
      });
    }).observe(root, { childList: true, subtree: true });
    return true;
  }

  var tries = 0;
  (function find() {
    var host = document.querySelector("chat-widget");
    if (host && watch(host)) return;
    if (++tries < 120) setTimeout(find, 250);
  })();
})();
