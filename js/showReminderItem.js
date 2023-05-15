var PMOClick = window.PMOClick || {};


PMOClickReminderItem = {

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
    },

    User: {
        LogInName: null,
        ID: null,
        DisplayName: null,
        Email: null
    },

    GlobalVariables: {
        // QuickLaunchNav : null,
        QuickLaunchSideNav: null,
        QuickLaunchSubSideNav: null,
        CurrentReminder: null,

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

        Reminders: {
            HE: "תזכורות",
            EN: "Reminders"
        },

    },


    Init: function () {
        var reminderId = PMOClick.Methods.GetURLParameter("ID");
        PMOClickReminderItem.GlobalVariables.CurrentReminder = JSON.parse(PMOClick.Methods.GetSessionStorage("ReminderItem-"+reminderId));
        PMOClickReminderItem.Load();
    },

    Load: function () {
        PMOClickReminderItem.Methods.DrawReminderDetails();
    },


    Methods: {
      DrawReminderDetails : function(){
          $('.RemEventDate').append(PMOClick.Methods.FormatDateString(PMOClickReminderItem.GlobalVariables.CurrentReminder.EventDate,false));
          $('.RemEndDate').append(PMOClick.Methods.FormatDateString(PMOClickReminderItem.GlobalVariables.CurrentReminder.EndDate,false));
          $('.reminderTitleText').text(PMOClickReminderItem.GlobalVariables.CurrentReminder.Title);
      }

    }




}
PMOClickReminderItem.Init();