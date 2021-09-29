
function loadSettings() {

    var gettingItem = browser.storage.local.get();
    gettingItem.then((atikon_settings) => {

        document.querySelector("#popup-content #job_id").value = atikon_settings.job_id ?? '';
    });

    document.querySelector("#popup-content #job_id").addEventListener("keyup", (e) => {

        let atikon_settings = {};
        atikon_settings['job_id'] = e.target.value;

        browser.storage.local.set(atikon_settings);
    });
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        function collectPerformance(tabs) {
            const job_id = document.querySelector("#popup-content #job_id").value;

            browser.tabs.sendMessage(tabs[0].id, {
                command: "collectPerformance",
                job_id: job_id
            });
        }

        function reportError(error) {
            console.error(error);
        }

        if (e.target.classList.contains("performance")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(collectPerformance)
                .catch(reportError);
        }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/atikon.js"})
    .then(loadSettings)
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
