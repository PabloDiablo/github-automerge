// ==UserScript==
// @name        GitHub PR Automerge
// @namespace   urn://https://github.com/PabloDiablo/github-automerge
// @include     *github.com*
// @exclude     none
// @version     1
// @grant    	none
// @description	Adds a button to automerge GitHub PRs
// ==/UserScript==
(function() {
  let _checkerInterval = null;

  function isOpenPullRequest() {
    const prHeaderEl = document.querySelector(".js-pull-header-details");

    return (
      prHeaderEl && prHeaderEl.getAttribute("data-pull-is-open") === "true"
    );
  }

  function isMergeable() {
    return !document.querySelector(".btn-group-merge").hasAttribute("disabled");
  }

  function worker() {
    if (isMergeable()) {
      document.querySelector(".btn-group-merge").click();

      if (_checkerInterval) {
        clearInterval(_checkerInterval);
      }

      setTimeout(function() {
        document.querySelector(".js-merge-commit-button").click();
      }, 1000);
    }
  }

  function build(tag, props, children) {
    const node = document.createElement(tag);

    if (props !== null) {
      Object.keys(props).forEach(function(prop) {
        node.setAttribute(prop, props[prop]);
      });
    }

    if (children && children.length > 0) {
      children.forEach(function(child) {
        const childNode =
          typeof child === "string" ? document.createTextNode(child) : child;

        node.appendChild(childNode);
      });
    }

    return node;
  }

  function startWatching() {
    _checkerInterval = setInterval(worker, 10000);

    worker();
  }

  function stopWatching() {
    if (_checkerInterval) {
      clearInterval(_checkerInterval);
    }
  }

  function onChangeAutomerge(e) {
    const isChecked = e.target.checked;

    if (isChecked) {
      startWatching();
    } else {
      stopWatching();
    }
  }

  function addControls() {
    const mergeBannerEl = document.querySelector("#partial-pull-merging");

    const autoMergeEl = document.createElement("div");

    //     <p>
    //      <input type="checkbox" id="automerge-flag">
    //      <label for="automerge-flag" style="margin-left: 0.25rem;">Automerge PR when checks pass</label>
    //     </p>

    autoMergeEl.appendChild(
      build("p", null, [
        build("input", { type: "checkbox", id: "automerge-flag" }),
        build(
          "label",
          {
            for: "automerge-flag",
            style: "margin-left: 0.25rem;"
          },
          ["Automerge PR when checks pass (DO NOT CLOSE THE TAB)"]
        )
      ])
    );

    mergeBannerEl.appendChild(autoMergeEl);

    document.querySelector("#automerge-flag").onchange = onChangeAutomerge;
  }

  if (isOpenPullRequest()) {
    addControls();
  }
})();
