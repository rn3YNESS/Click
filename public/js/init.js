const masterPageScripts = [
    `/_catalogs/masterpage/Click/public/js/navigation.js`,
    `/_catalogs/masterpage/Click/controllers/favorites.js`,
    `/_catalogs/masterpage/Click/controllers/search.js`,
    `/_catalogs/masterpage/Click/controllers/siteMap.js`,
    `/_catalogs/masterpage/Click/controllers/listAndDoclibMap.js`,
    `/_catalogs/masterpage/Click/controllers/linkItems.js`,
    `/_layouts/15/clientforms.js`,
    `/_layouts/15/clientpeoplepicker.js`,
    `/_layouts/15/autofill.js`
    /*
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/public/js/navigation.js`: `${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/public/js/navigation.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/favorites.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/favorites.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/search.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/search.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/siteMap.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/siteMap.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/listAndDoclibMap.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/listAndDoclibMap.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/linkItems.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/linkItems.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_layouts/15/clientforms.js`:`${_spPageContextInfo.webServerRelativeUrl}/_layouts/15/clientforms.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_layouts/15/clientpeoplepicker.js`:`${_spPageContextInfo.webServerRelativeUrl}/_layouts/15/clientpeoplepicker.js`,
    (_spPageContextInfo.webServerRelativeUrl === "/")?`/_layouts/15/autofill.js`:`${_spPageContextInfo.webServerRelativeUrl}/_layouts/15/autofill.js`
*/];

const pageScripts = [{
    page: 'default.aspx',
    scripts: [
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/personalData.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/personalData.js`,
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/todayReminders.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/todayReminders.js`,
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/tasks.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/tasks.js`,
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/docs.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/docs.js`,
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/events.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/events.js`,
        (_spPageContextInfo.webServerRelativeUrl === "/")?`/_catalogs/masterpage/Click/controllers/reminder.js`:`${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/controllers/reminder.js`
    ]
},
{
    page: 'Dashboard.aspx',
    scripts: [
        (_spPageContextInfo.webServerRelativeUrl === '/')?`/_catalogs/masterpage/Click/util/charts-bars.js` : `${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/util/charts-bars.js`,
        (_spPageContextInfo.webServerRelativeUrl === '/')?`/_catalogs/masterpage/Click/util/charts-lines.js` : `${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/util/charts-lines.js`,
        (_spPageContextInfo.webServerRelativeUrl === '/')?`/_catalogs/masterpage/Click/util/charts-pie.js` : `${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/Click/util/charts-pie.js`,
    ]
}];

const handelMissingDataBeforeSharePointReady = () => {

    if (isNullOrEmpty(spContextObject.User.DisplayName)) {
        spContextObject.User.DisplayName = _spPageContextInfo.userDisplayName;
    }
    if (isNullOrEmpty(spContextObject.User.LogInName)) {
        spContextObject.User.LogInName = _spPageContextInfo.userLoginName;
    }
    if (isNullOrEmpty(spContextObject.User.ID)) {
        spContextObject.User.ID = _spPageContextInfo.userId;
    }
    if (isNullOrEmpty(spContextObject.CONSTANTS.WEBAPPLICATIONURL)) {
        spContextObject.CONSTANTS.WEBAPPLICATIONURL = `${window.location.protocol}//${window.location.host}`;
    }
    if (isNullOrEmpty(spContextObject.CONSTANTS.SITECONTEXT)) {
        if (window.location.href.includes("Pages")) {
            spContextObject.CONSTANTS.SITECONTEXT = window.location.href.split("/Pages")[0];
        }
    }
}

/*readyState Holds the status One of five values:
                        uninitialized - Has not started loading yet
                        loading - Is loading
                        loaded - Has been   loaded
                        interactive - Has loaded enough and the user can interact with it
                        complete - Fully loaded*/
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        console.log(`${new Date()} :DOM ready`);
        //Handle with missing data before sharepoint ready
        handelMissingDataBeforeSharePointReady();
        //Check Elemrnt exist
        if(!isNullOrEmpty(document.getElementById('userDisplayName'))){
            document.getElementById('userDisplayName').textContent = spContextObject.User.DisplayName;
        }        
        initMasterPageScripts();
        initPageScripts();
    }
};

const initMasterPageScripts = () => {
    addScripts(masterPageScripts);
}

const initPageScripts = () => {
    const a = window.location.href.split('/');
    const currentPage = a[a.length - 1];
    const currentPageScripts = pageScripts.filter(x => x.page == currentPage);
    if (!isEmpty(currentPageScripts)) {
        addScripts(currentPageScripts[0].scripts);
    }
}

const addScripts = (scriptsToLoad) => {
    for (scriptSrc of scriptsToLoad) {
        //console.log(`${(new Date())} : add script ${scriptSrc} to the dom`)
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    }
}