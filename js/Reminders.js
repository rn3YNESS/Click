var PMOClick = window.PMOClick || {};


PMOClickReminders = {

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
    },

    GlobalVariables : {
         myTasks : null,
         myDocs : new Array(),
         listFoldersName : new Array(),
         files : new Array()
    },

    CONSTANTS: {
        SITECONTEXT: '',
        SITEABSOLUTEURL: '',
        SITESERVERRELATIVEURL: '',
        WEBABSOLUTEURL: '',
        WEBSERVERRELATIVEURL: '',
        FORMMODE: null,
        TIMER: '',
        CURRENTDATE: null
    },

    Pages: {

    },

    Lists: {
        Reminders : {
            HE : "תזכורות",
            EN: "Reminders"
        }
    },

    Init: function () {  
        //Get all reminders assigned to me
        var myReminders = PMOClick.Methods.GetListItemsREST(null,PMOClickReminders.Lists.Reminders.HE, null, "$filter=ParticipantsPicker -eq "+ PMOClick.User.ID + "-and EventDate -eq "+PMOClick.Methods.ConvertDateToCustomDate(new Date()), expand, orderBy, topItems);
    },

    Load: function () {
      
    },


    Methods: {
    }
}
