var PMOClick = window.PMOClick || {};


PMOClickTest = {

    User: {
        LogInName: null,
        ID: null,
        DisplayName: null,
        Email: null
    },    

    // Create an instance of the current context.
    SharePointReady: function () {
        clientContext = SP.ClientContext.get_current();
        webSite = clientContext.get_web();
        site = clientContext.get_site();
        rootWeb = site.get_rootWeb();
        currentUser = webSite.get_currentUser();

        clientContext.load(webSite);
        clientContext.load(site);
        clientContext.load(rootWeb);
        clientContext.load(currentUser);
        clientContext.executeQueryAsync(PMOClickTest.onRequestSucceeded, PMOClickTest.onRequestFailed);
    },

    onRequestSucceeded: function () {
        PMOClick.CONSTANTS.SITESERVERRELATIVEURL = site.get_url();
        PMOClick.CONSTANTS.SITECONTEXT = webSite.get_url();        
        //User Info
        PMOClickTest.User.ID = currentUser.get_id();
        PMOClickTest.User.DisplayName = currentUser.get_title();
        PMOClickTest.User.LogInName = currentUser.get_loginName();
        PMOClickTest.User.Email = currentUser.get_email();
        

        PMOClickTest.Init();
    },
    onRequestFailed: function (sender, args) {
        //console.log('Error: ' + args.get_message());
        PMOClickTest.Methods.PopUpMessage(args.get_message());
    },    

    Init: function () {
        var firstName = PMOClick.User.DisplayName;
        $('#greetingDiv').text(" שלום "+firstName+", מה עושים היום?");
    },

    Load: function () {
    },
    
    Methods: {

    }
}
PMOClickTest.SharePointReady()