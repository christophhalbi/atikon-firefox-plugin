(function() {
    /**
    * Check and set a global guard variable.
    * If this content script is injected into the same page again,
    * it will do nothing next time.
    */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function openIntranetPerformance(job_id) {

        let url;

        if (job_id) {
            url = new URL('https://intranet.atikon.at/intranet/performance/add_to_job');

            url.searchParams.append('job_id', job_id);
        }
        else {
            url = new URL('https://intranet.atikon.at/intranet/performance/add_to_performance');
        }

        // jira
        const issueKeyReg = /https:\/\/atikon\.atlassian\.net\/browse\/(.*)$/;
        const currentUrl = new URL(location.href);
        const currentUrlWithoutParams = currentUrl.protocol + '//' + currentUrl.host + currentUrl.pathname;

        const match = currentUrlWithoutParams.match(issueKeyReg);

        if (match) {
            url.searchParams.append('jira_issue', match[1] ?? '');
        }
        else if (currentUrl.searchParams.has('selectedIssue')) {
            url.searchParams.append('jira_issue', currentUrl.searchParams.get('selectedIssue'));
        }

        window.open(url, '_blank');
    }

    /**
    * Listen for messages from the background script.
    */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "collectPerformance") {
            openIntranetPerformance(message.job_id);
        }
    });

})();
