var PMOClick = window.PMOClick || {};


PMOClickHome = {

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
        //QuickLaunchSideNav: null,
        //QuickLaunchSubSideNav: null,
        //  Id: null,
        MyReminders: null,
        AllMyReminders: null,
        MyTasks: null,
        MyDocs: null,
        numTasks: {
            Waiting:
            {
                All: 0,
                First: 0
            },
            Opening:
            {
                All: 0,
                First: 0
            },
            Doing:
            {
                All: 0,
                First: 0
            }
        }
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
        // QuickLaunchNavigation: {
        //     EN: "QuickLaunchNavigation"
        // },

        // QuickLaunchSideNav: {
        //     EN: "QuickLaunchSideNav"
        // },

        // QuickLaunchSubSideNav: {
        //     EN: "QuickLaunchSubSideNav"
        // },
        Reminders: {
            HE: "תזכורות",
            EN: "Reminders"
        },
        MyTasks: {
            HE: "מעקב משימות"
        }
    },

    TasksStatus: {
        DOING: {
            Text: 'מתבצע',
            Color: 'yellow'
        },
        OPEN: {
            Text: 'לא התחילה',
            Color: 'green',
        },
        WAITING: {
            Text: 'ממתין למישהו אחר',
            Color: 'red'
        },
        COMPLETED: {
            Text: 'הושלם',
            Color: 'null'
        },
        REJECTED: {
            Text: 'נדחה',
            Color: 'null'
        }
    },

    Init: function () {
        //Hide Scroll
        $('#s4-workspace').css('overflow', 'hidden');
        // //get all current user reminders
        PMOClickHome.GlobalVariables.AllMyReminders = PMOClick.Methods.GetListItemsREST(null,PMOClickHome.Lists.Reminders.HE, "$Select=ParticipantsPicker/Id,*", "&$filter=(ParticipantsPicker eq " + PMOClick.User.ID + " and IsActive1 eq 1)", "&$expand=ParticipantsPicker", null, null);

        //Get all reminders assigned to me   
        var ds = new Date(new Date().setHours(0, 0, 0, 0));
        var de = new Date(new Date().setHours(23, 59, 59, 0));
        var startingPoint = ds.toISOString();
        var endPoint = de.toISOString();    
        PMOClickHome.GlobalVariables.MyReminders = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL,PMOClickHome.Lists.Reminders.HE, "$Select=ParticipantsPicker/Id,*", "&$filter=ParticipantsPicker eq " + PMOClick.User.ID + " and (EventDate ge '" + startingPoint + "' and EventDate le '" + endPoint + "') and IsActive1 eq 1", "&$expand=ParticipantsPicker", null, null);
        //Get My Tasks
        PMOClickHome.GlobalVariables.MyTasks = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='AssignedTo:{"+encodeURIComponent(PMOClick.User.DisplayName)+"}'",null, "&rowlimit=500", "&selectproperties='Title,ItemID,Path,StatusOWSCHCS,Priority,DueDateOWSDATE'", null, null);
        //PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL,PMOClickHome.Lists.MyTasks.HE, null, "$filter=AssignedToId eq " + PMOClick.User.ID, "&$orderby=Created desc", null);
        PMOClickHome.Load();
    },

    Load: function () {
        // PMOClickHome.Methods.DrawQuickLaunch(PMOClickHome.GlobalVariables.QuickLaunchNav);
        // PMOClickHome.Methods.DrawQuickLaunchSide(PMOClickHome.GlobalVariables.QuickLaunchSideNav, PMOClickHome.GlobalVariables.QuickLaunchSubSideNav);
        PMOClickHome.Methods.DrawReminders(PMOClickHome.GlobalVariables.MyReminders, new Date());
        //Write User DisplayName
        $('.userDisplayName').text(PMOClick.User.DisplayName);

        PMOClickHome.Methods.InitAccordiion();
        PMOClickHome.Methods.InitEvents();
        PMOClickHome.Methods.InitTasks();
        PMOClickHome.Methods.InitDocs();
    },


    Methods: {

        DrawReminders: function (myReminders, dateP) {
            $('.personalR')[0].innerHTML = "";
            $('.unitR')[0].innerHTML = "";
            $('#personalReminderCount').html("");
            $('#unitReminderCount').html("");
            $('#allRemindersToday').hide();
            $('#allUnitRemindersToday').hide();
            var personlReminderCounter = 0;
            var personalReminderCounterTotal=0;
            var unitReminderCounter = 0;
            var unitReminderCounterTotal = 0;

            if (myReminders.value.length > 0) {
                $.each(myReminders.value, function (index, value) {
                    PMOClick.Methods.SetToSessionStorage("ReminderItem-" + value.Id, JSON.stringify(value));
                    var fotmatDate = PMOClick.Methods.FormatDateString(value.EventDate);
                    var day = fotmatDate.split(" ")[0];
                    var month = fotmatDate.split(" ")[1];
                    //Draw Personal
                    if (value.ParticipantsPicker.length == 1) {
                        if (personlReminderCounter < 3) {
                            var personalCube = "<div class='interactiveCube interactiveCubePersonal'>" +
                                "<div class='interactiveCubeInnerRight interactiveCubeInnerPersonal'>" +
                                //Month
                                "<div style='height:20%; width:100%; color:#ffffff; font-weight:bold;text-align:center; font-size:20px;'>" + month + "</div>" +
                                //Day
                                "<div style='height:70%; width:100%; color:#ffffff; font-size:72px; text-align:center;'>" + day + "</div>" +
                                //Icon
                                "<div style='height:10%; width:100%; color:#ffffff;'></div>" +
                                "</div>" +
                                "<div class='interactiveCubeInnerLeft'>" +
                                "<div style='height:80%; width:100%; color:#ffffff;'><p style='font-size:20px;'>" + value.Title + "</p></div>" +
                                "<div style='height:20%; width:100%;text-align:left;'>" +
                                "<button type='button' onclick='PMOClick.Methods.OpenInDialog(\"תזכורת אישית\", 900,700, false, true, false, \"" + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/Lists/Reminders/DispForm.aspx?ID=" + value.Id + "\", null, null)' style='color:#3bd5b5; margin-left:20px; border-radius:15px; height:20px; width:40px; margin-bottom:15px; padding-bottom:5px; padding-top:0; border-color:transparent;'>מידע נוסף</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                            $('.personalR').append(personalCube);
                            personlReminderCounter++;
                            personalReminderCounterTotal++;
                        }
                        else{personalReminderCounterTotal++;}
                    }
                    //Draw Unit
                    else {
                        if (unitReminderCounter < 6) {
                            var unitCube = "<div class='interactiveCube interactiveCubeUnit'>" +
                                "<div class='interactiveCubeInnerRight interactiveCubeInnerUnit'>" +
                                //Month
                                "<div style='height:20%; width:100%; color:#ffffff; font-weight:bold;text-align:center; font-size:20px;'>" + month + "</div>" +
                                //Day
                                "<div style='height:70%; width:100%; color:#ffffff; font-size:72px; text-align:center;'>" + day + "</div>" +
                                //Icon
                                "<div style='height:10%; width:100%; color:#ffffff;'></div>" +
                                "</div>" +
                                "<div class='interactiveCubeInnerLeft'>" +
                                "<div style='height:80%; width:100%; color:#ffffff;'><p style='font-size:20px;'>" + value.Title + "</p></div>" +
                                "<div style='height:20%; width:100%;text-align:left;'>" +
                                "<button type='button' onclick='PMOClick.Methods.OpenInDialog(\"תזכורת יחידתית\", 900,700, false, true, false, \"" + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/Lists/Reminders/DispForm.aspx?ID=" + value.Id + "\", null, null)' style='color:#8b6bfd; margin-left:20px; border-radius:15px; height:20px; width:40px; margin-bottom:15px; padding-bottom:5px; padding-top:0; border-color:transparent;'>מידע נוסף</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                            $('.unitR').append(unitCube);
                            unitReminderCounter++;
                            unitReminderCounterTotal++;
                        }
                        else{unitReminderCounterTotal++;}
                    }
                });
                $('#personalReminderCount').append(personlReminderCounter + "/" + personalReminderCounterTotal);
                $('#unitReminderCount').append(unitReminderCounter + "/" + unitReminderCounterTotal);
                if(personalReminderCounterTotal>3){
                    $('#allRemindersToday').show();
                }
                if(unitReminderCounterTotal>6){
                    $('#allUnitRemindersToday').show();
                }
            }

            var fotmatDate = PMOClick.Methods.FormatDateString(dateP);
            var day = selectedRemiderDay = fotmatDate.split(" ")[0];
            var month = selectedReminderMonth = fotmatDate.split(" ")[1];
            if (personlReminderCounter == 0) {

                //Personal
                var personalCube = "<div class='interactiveCube interactiveCubePersonal' style='width:1134px;'>" +
                    "<div class='interactiveCubeInnerRight interactiveCubeInnerPersonal'>" +
                    //Month
                    "<div style='height:20%; width:100%; color:#ffffff; font-weight:bold;text-align:center; font-size:20px;'>" + month + "</div>" +
                    //Day
                    "<div style='height:70%; width:100%; color:#ffffff; font-size:72px; text-align:center;'>" + day + "</div>" +
                    //Icon
                    "<div style='height:10%; width:100%; color:#ffffff;'></div>" +
                    "</div>" +
                    "<div class='interactiveCubeInnerLeft'>" +
                    "<div style='height:80%; width:100%; color:#ffffff;'><p style='font-size:36px;text-align:center;margin-top:50px;'> אין תזכורות </p></div>" +
                    "<div style='height:20%; width:100%;text-align:left;'>" +
                    //"<button type='button' onclick='PMOClick.Methods.OpenInDialog(\"תזכורת אישית\", 900,700, true, true, false, \"http://devpmoclick/Lists/Reminders/DispForm.aspx?ID=" + value.Id + "\", null, null)' style='color:#3bd5b5; margin-left:20px; border-radius:15px; height:20px; width:40px; margin-bottom:15px; padding-bottom:5px; padding-top:0; border-color:transparent;'>מידע נוסף</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                $('.personalR').append(personalCube);
                $('#personalReminderCount').html("");
                $('#personalReminderCount').append("0/0");
            }
            if (unitReminderCounter == 0) {
                //Unit
                var unitCube = "<div class='interactiveCube interactiveCubeUnit' style='width:1134px;'>" +
                    "<div class='interactiveCubeInnerRight interactiveCubeInnerUnit'>" +
                    //Month
                    "<div style='height:20%; width:100%; color:#ffffff; font-weight:bold;text-align:center; font-size:20px;'>" + month + "</div>" +
                    //Day
                    "<div style='height:70%; width:100%; color:#ffffff; font-size:72px; text-align:center;'>" + day + "</div>" +
                    //Icon
                    "<div style='height:10%; width:100%; color:#ffffff;'></div>" +
                    "</div>" +
                    "<div class='interactiveCubeInnerLeft'>" +
                    "<div style='height:80%; width:100%; color:#ffffff;'><p style='font-size:36px;text-align:center;margin-top:50px;'>אין תזכורות</p></div>" +
                    //"<div style='height:80%; width:100%; color:#ffffff;'><p style='font-size:20px;'>" + value.Title + "</p></div>" +
                    "<div style='height:20%; width:100%;text-align:left;'>" +
                    //"<button type='button' onclick='PMOClick.Methods.OpenInDialog(\"תזכורת יחידתית\", 900,700, true, true, false, \"http://devpmoclick/Lists/Reminders/DispForm.aspx?ID=" + value.Id + "\", null, null)' style='color:#8b6bfd; margin-left:20px; border-radius:15px; height:20px; width:40px; margin-bottom:15px; padding-bottom:5px; padding-top:0; border-color:transparent;'>מידע נוסף</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                $('.unitR').append(unitCube);
                $('#unitReminderCount').html("");
                $('#unitReminderCount').append("0/0");
            }
        },

        Search: function () {
            event.preventDefault();
            var queryString = $('#search-input').val();
            var location = "http://devPMOClickHome/_layouts/15/osssearchresults.aspx?u=http%3A%2F%2FdevPMOClickHome&k=" + queryString;
            link = location;
            $('#search-input').attr("value", '');
            window.location.href = link;
            return;
        },

        IeVersion: function () {
            //Set defaults
            var value = {
                IsIE: false,
                TrueVersion: 0,
                ActingVersion: 0,
                CompatibilityMode: false
            };

            //Try to find the Trident version number
            var trident = navigator.userAgent.match(/Trident\/(\d+)/);
            if (trident) {
                value.IsIE = PMOClickHome.BrowserDetails.IsIE = true;
                //Convert from the Trident version number to the IE version number
                value.TrueVersion = PMOClickHome.BrowserDetails.TrueVersion = parseInt(trident[1], 10) + 4;
                //alert("True Version "+value.TrueVersion);
            }

            //Try to find the MSIE number
            var msie = navigator.userAgent.match(/MSIE (\d+)/);
            if (msie) {
                value.IsIE = PMOClickHome.BrowserDetails.IsIE = true;
                //Find the IE version number from the user agent string
                value.ActingVersion = PMOClickHome.BrowserDetails.ActingVersion = parseInt(msie[1]);
                //alert("Acting Version "+value.ActingVersion );
            } else {
                //Must be IE 11 in "edge" mode
                value.ActingVersion = PMOClickHome.BrowserDetails.ActingVersion = value.TrueVersion;
                //alert("Acting Version "+value.ActingVersion );
            }

            //If we have both a Trident and MSIE version number, see if they're different
            if (value.IsIE && value.TrueVersion > 0 && value.ActingVersion > 0) {
                //In compatibility mode if the trident number doesn't match up with the MSIE number
                value.CompatibilityMode = PMOClickHome.BrowserDetails.CompatibilityMode = value.TrueVersion != value.ActingVersion;
                //alert("Compatibility Mode  "+value.CompatibilityMode );
            }
            return value;
        },

        InitAccordiion: function () {
            var coll = document.getElementsByClassName("collapsible");
            var i;
            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    if (this.classList.contains("collapsible")) {
                        this.classList.toggle("active");
                        this.classList.remove("collapsible");
                    }
                    else
                        if (this.classList.contains("active")) {
                            this.classList.toggle("collapsible");
                            this.classList.remove("active");
                        }
                    var content = this.parentElement.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    }
                    else {
                        content.style.display = "block";
                    }
                });
            }
        },

        GetColorByStatus: function (status) {
            var color = null;
            switch (status) {
                case PMOClickHome.TasksStatus.WAITING.Text:
                    color = PMOClickHome.TasksStatus.WAITING.Color;
                    break;
                case PMOClickHome.TasksStatus.DOING.Text:
                    color = PMOClickHome.TasksStatus.DOING.Color;
                    break;
                case PMOClickHome.TasksStatus.OPEN.Text:
                    color = PMOClickHome.TasksStatus.OPEN.Color;
                    break;
                default:
                    color = 'rgb(53,94,126)';
                    break;
            }
            return color;
        },

        DrawTask: function (htmlDivTask, status) {
            switch (status) {
                case PMOClickHome.TasksStatus.WAITING.Text:
                    $('.waitingTasks').append(htmlDivTask);
                    PMOClickHome.GlobalVariables.numTasks.Waiting.First++;
                    break;
                case PMOClickHome.TasksStatus.DOING.Text:
                    $('.doingTasks').append(htmlDivTask);
                    PMOClickHome.GlobalVariables.numTasks.Doing.First++;
                    break;
                case PMOClickHome.TasksStatus.OPEN.Text:
                    $('.openTasks').append(htmlDivTask);
                    PMOClickHome.GlobalVariables.numTasks.Opening.First++;
                    break;
            }
        },

        GetCountTaskStatus: function (status) {
            switch (status) {
                case PMOClickHome.TasksStatus.WAITING.Text:
                    PMOClickHome.GlobalVariables.numTasks.Waiting.All++;
                    return PMOClickHome.GlobalVariables.numTasks.Waiting.First;
                case PMOClickHome.TasksStatus.DOING.Text:
                    PMOClickHome.GlobalVariables.numTasks.Doing.All++;
                    return PMOClickHome.GlobalVariables.numTasks.Doing.First;
                case PMOClickHome.TasksStatus.OPEN.Text:
                    PMOClickHome.GlobalVariables.numTasks.Opening.All++;
                    return PMOClickHome.GlobalVariables.numTasks.Opening.First;
            }
        },

        GetTextDate: function (date, currentDate) {
            //debugger;
            console.log(date.toISOString());
            if(date.toISOString()!='1969-12-31T22:00:00.000Z'){ //if !(date)
            dateDiff = PMOClickHome.Methods.Datediff(date, currentDate)
            if (dateDiff >= 0)
                return dateDiff + " ימים";
            else
                return "מתעכב ב " + dateDiff * -1 + " ימים";
            }
            else return "לא צוין תאריך יעד";
        },

        TitleGroupTask: function () {
            $('.openTasksGroupText')[0].innerText += '(' + PMOClickHome.GlobalVariables.numTasks.Opening.First + '/' + PMOClickHome.GlobalVariables.numTasks.Opening.All + ')';
            $('.doingTasksGroupText')[0].innerText += '(' + PMOClickHome.GlobalVariables.numTasks.Doing.First + '/' + PMOClickHome.GlobalVariables.numTasks.Doing.All + ')';
            $('.waitingTasksGroupText')[0].innerText += '(' + PMOClickHome.GlobalVariables.numTasks.Waiting.First + '/' + PMOClickHome.GlobalVariables.numTasks.Waiting.All + ')';
        },

        GetPriority: function (priority) {
            return priority.substring(priority.indexOf(' ') + 1);
        },

        InitEvents: function () {
            var today = new Date(),
                year = today.getFullYear(),
                month = today.getMonth(),//PMOClick.Methods.GetMonthLiteral(today.getMonth()),
                monthTag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                day = today.getDate(),
                days = document.getElementsByTagName('td'),
                selectedDay,
                setDate,
                daysLen = days.length;
            // options should like '2014-01-01'
            function Calendar(selector, options) {
                this.options = options;
                this.draw();
            }

            Calendar.prototype.draw = function () {
                this.getOptions();
                this.drawDays();
                var that = this,
                    // reset = document.getElementById('reset'),
                    pre = document.getElementsByClassName('pre-button'),
                    next = document.getElementsByClassName('next-button');

                pre[0].addEventListener('click', function () { that.preMonth(); });
                next[0].addEventListener('click', function () { that.nextMonth(); });
                // reset.addEventListener('click', function(){that.reset(); });
                while (daysLen--) {
                    days[daysLen].addEventListener('click', function () { that.clickDay(this); });
                }
            };

            Calendar.prototype.drawHeader = function (e) {
                // var headDay = document.getElementsByClassName('head-day'),
                var headMonth = document.getElementsByClassName('head-month');

                // e?headDay[0].innerHTML = e : headDay[0].innerHTML = day;
                headMonth[0].innerHTML = PMOClick.Methods.GetMonthLiteral(month) + " - " + year;
            };

            Calendar.prototype.drawDays = function () {
                var numDisable = 0;
                var startDay = new Date(year, month, 1).getDay(),
                    //      下面表示这个月总共有几天
                    nDays = new Date(year, month + 1, 0).getDate(),

                    n = startDay;
                //      清除原来的样式和日期
                for (var k = 0; k < 42; k++) {
                    days[k].innerHTML = '';
                    days[k].id = '';
                    days[k].className = '';
                }

                for (var i = 1; i <= nDays; i++) {
                    days[n].innerHTML = i;
                    n++;
                }

                for (var j = 0; j < 42; j++) {
                    if (days[j].innerHTML === "") {

                        days[j].id = "disabled";
                        if (j < 7)
                            numDisable++;
                    } else if (j === day + startDay - 1) {
                        if ((this.options && (month === setDate.getMonth()) && (year === setDate.getFullYear())) || (!this.options && (month === today.getMonth()) && (year === today.getFullYear()))) {
                            this.drawHeader(day);
                            days[j].id = "today";
                            days[j].className = "selected ";
                        }
                    }
                }
                for (var reminders = 0; reminders < PMOClickHome.GlobalVariables.AllMyReminders.value.length; reminders++) {
                    var currentEventDate = new Date(PMOClickHome.GlobalVariables.AllMyReminders.value[reminders].EventDate);
                    var currentDay = days[numDisable + currentEventDate.getDate() - 1];
                    if (currentEventDate.getMonth() == month) {
                        var isPersonal = (PMOClickHome.GlobalVariables.AllMyReminders.value[reminders].ParticipantsPicker.length == 1);
                        //Check if the element contains class, if not Enter the condition
                        if (currentDay.classList.length > 0) {
                            if (currentDay.classList.contains("boderUnderPersonalAndUnit")) {
                                return;
                            }
                            else if (currentDay.classList.contains("boderUnderPersonal")) {
                                if (isPersonal) {
                                    return;
                                }
                                else {
                                    currentDay.classList.add("boderUnderPersonalAndUnit");
                                    currentDay.classList.remove("boderUnderPersonal");
                                }
                            }
                            else if (currentDay.classList.contains("boderUnderUnit")) {
                                if (isPersonal) {
                                    currentDay.classList.add("boderUnderPersonalAndUnit");
                                    currentDay.classList.remove("boderUnderUnit");
                                }
                                else {
                                    return;
                                }
                            }
                            else {
                                if (isPersonal) {
                                    currentDay.className += "boderUnderPersonal";
                                }
                                else {
                                    currentDay.className += "boderUnderUnit";
                                }
                            }
                        }
                        else {
                            if (isPersonal) {
                                currentDay.className = "boderUnderPersonal";
                            }
                            else {
                                currentDay.className = "boderUnderUnit";
                            }
                        }
                    }

                }
            };

            Calendar.prototype.clickDay = function (o) {
                var selected = document.getElementsByClassName("selected"),
                    len = selected.length;
                if (len !== 0) {
                    selected[0].classList.remove("selected");
                }
                o.className += " selected";
                selectedDay = new Date(year, month, o.innerHTML);
                this.drawHeader(o.innerHTML);
                var ds = new Date(new Date(selectedDay).setHours(0, 0, 0, 0));
                var de = new Date(new Date(selectedDay).setHours(23, 59, 59, 0));
                var startingPoint = ds.toISOString();
                var endPoint = de.toISOString();
                PMOClickHome.GlobalVariables.MyReminders = PMOClick.Methods.GetListItemsREST(null,PMOClickHome.Lists.Reminders.HE, "$Select=ParticipantsPicker/Id,*", "&$filter=ParticipantsPicker eq " + PMOClick.User.ID + " and (EventDate ge '" + startingPoint + "' and EventDate le '" + endPoint + "') and IsActive1 eq 1", "&$expand=ParticipantsPicker", null, null);
                PMOClickHome.Methods.DrawReminders(PMOClickHome.GlobalVariables.MyReminders, selectedDay);
            };

            Calendar.prototype.preMonth = function () {
                if (month < 1) {
                    month = 11;
                    year = year - 1;
                } else {
                    month = month - 1;
                }
                this.drawHeader(1);
                this.drawDays();
            };

            Calendar.prototype.nextMonth = function () {
                if (month >= 11) {
                    month = 0;
                    year = year + 1;
                } else {
                    month = month + 1;
                }
                this.drawHeader(1);
                this.drawDays();
            };

            Calendar.prototype.getOptions = function () {
                if (this.options) {
                    var sets = this.options.split('-');
                    setDate = new Date(sets[0], sets[1] - 1, sets[2]);
                    day = setDate.getDate();
                    year = setDate.getFullYear();
                    month = setDate.getMonth();
                }
            };

            // Calendar.prototype.reset = function() {
            //     month = today.getMonth();
            //     year = today.getFullYear();
            //     day = today.getDate();
            //     this.options = undefined;
            //     this.drawDays();
            //     var ds = new Date(new Date(today).setHours(0,0,0,0));
            //     var de = new Date(new Date(today).setHours(23,59,59,0));
            //     var startingPoint = ds.toISOString();
            //     var endPoint = de.toISOString();    
            //     PMOClickHome.GlobalVariables.MyReminders = PMOClick.Methods.GetListItemsREST(PMOClickHome.Lists.Reminders.EN, "$Select=ParticipantsPicker/Id,*", "&$filter=ParticipantsPicker eq "+ PMOClick.User.ID + " and (EventDate ge '"+ startingPoint + "' and EventDate le '"+ endPoint + "')","&$expand=ParticipantsPicker", null, null);        
            //     PMOClickHome.Methods.DrawReminders(PMOClickHome.GlobalVariables.MyReminders);
            // };

            // Calendar.prototype.setCookie = function(name, expiredays){
            //     if(expiredays) {
            //         var date = new Date();
            //         date.setTime(date.getTime() + (expiredays*24*60*60*1000));
            //         var expires = "; expires=" +date.toGMTString();
            //     }else{
            //         var expires = "";
            //     }
            //     document.cookie = name + "=" + selectedDay + expires + "; path=/";
            // };

            // Calendar.prototype.getCookie = function(name) {
            //     if(document.cookie.length){
            //         var arrCookie  = document.cookie.split(';'),
            //             nameEQ = name + "=";
            //         for(var i = 0, cLen = arrCookie.length; i < cLen; i++) {
            //             var c = arrCookie[i];
            //             while (c.charAt(0)==' ') {
            //                 c = c.substring(1,c.length);

            //             }
            //             if (c.indexOf(nameEQ) === 0) {
            //                 selectedDay =  new Date(c.substring(nameEQ.length, c.length));
            //             }
            //         }
            //     }
            // };
            var calendar = new Calendar();
        },

        InitTasks: function () {
            var currentDate = new Date(PMOClick.Methods.GetCurrentDate());
            //$.each(PMOClickHome.GlobalVariables.MyTasks.value, function (index, value) {
            $.each(PMOClickHome.GlobalVariables.MyTasks.PrimaryQueryResult.RelevantResults.Table.Rows, function (index, value) {                
                if (value.Cells[5].Value != PMOClickHome.TasksStatus.COMPLETED.Text && value.Cells[5].Value != PMOClickHome.TasksStatus.REJECTED.Text) {
                    if (PMOClickHome.Methods.GetCountTaskStatus(value.Cells[5].Value) < 5) {
                        var bgColor = PMOClickHome.Methods.GetColorByStatus(value.Cells[5].Value);
                        var date = PMOClickHome.Methods.ParseDate(PMOClick.Methods.ConvertDateToCustomDate(value.Cells[7].Value));
                        var textDate = PMOClickHome.Methods.GetTextDate(date, currentDate);
                        var tempName= value.Cells[2].Value.replace(/"/g, '\\"');
                        var htmlDivTask = '<div class="col-lg-12 ' + bgColor + ' taskContentText">' +
                            '<div class="row spaceRow">' +
                            '<div class="col-lg-6">' + value.Cells[2].Value +
                            '</div>' +
                            '</div>' +
                            '<div class="row spaceRow">' +
                            '<div class="col-lg-8"><span class="boldDaysText">' + textDate + '</span>&nbsp;|&nbsp;<span>' + PMOClickHome.Methods.GetPriority(value.Cells[6].Value) + '</span></div>' +
                            '<div class="col-lg-4 textLeft">' +
                            "<a style='text-decoration: underline; cursor: pointer;' onclick='PMOClick.Methods.OpenInDialog(\"" + tempName + "\", 900,700, false, true, false, \"" + value.Cells[4].Value + "\", null, null)'>פרטים נוספים</a>" +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        PMOClickHome.Methods.DrawTask(htmlDivTask, value.Cells[5].Value);
                    }
                }
            });
            PMOClickHome.Methods.TitleGroupTask();
        },

        InitDocs: function () {
            var displayName = '"' + PMOClick.User.DisplayName + '"';
            var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/_api/search/query?querytext='*'&rowlimit=20&refinementfilters='or((and(CreatedBy:" + displayName + ",isDocument:true)),(and(ModifiedBy:" + displayName + ",isDocument:true)))'&sortlist='LastModifiedTime:descending'&sourceid='e7ec8cee-ded8-43c9-beb5-436b54b31e84'&clienttype='SiteResultsQuery_Docs'"
            PMOClickHome.GlobalVariables.MyDocs = PMOClick.Methods.SPRequestFiles(false, url, "GET", "application/json;odata=verbose", { "Accept": "application/json; odata=verbose" }).query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
            for (var i = 0; i < PMOClickHome.GlobalVariables.MyDocs.length; i++) {
                PMOClickHome.Methods.GetIcon(i);
            }
        },

        GetIcon: function (numDoc) {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/maptoicon(filename='" + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[3].Value + "." + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[31].Value + "', progid='', size=1)",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    PMOClickHome.Methods.DrawDoc(data, numDoc)
                },
                error: function (errMsg) {
                    if (errMsg.responseText) {
                    }
                }
            });
        },

        DrawDoc: function (data, numDoc) {
            var imageSrc = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/images/" + data.d.MapToIcon;
            var path = PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[6].Value;
            var type = PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[31].Value;
            var schemeName = PMOClickHome.Methods.GetSchemeNameForFileExtension(type);
            if(!PMOClick.Methods.isNullOrEmptyString(schemeName)){
                var doc = "<div class='row'>" +
                    "<div class='col-lg-12 pointer' onclick='PMOClick.Methods.OpenWindow(\"" + schemeName + ":ofe|u|" + path + "\")'>" +
                    "<img src='" + imageSrc + "'></img>&nbsp;&nbsp;&nbsp;" +
                    "<span class='docContentText'>" + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[3].Value + "." + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[31].Value + "</span>" +
                    "</div>" +
                    "</div>";
                $('#docs').append(doc);
            }
            else{
                var doc = "<div class='row'>" +
                "<div class='col-lg-12 pointer' onclick='PMOClick.Methods.OpenWindow(\"" + path + "\")'>" +
                "<img src='" + imageSrc + "'></img>&nbsp;&nbsp;&nbsp;" +
                "<span class='docContentText'>" + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[3].Value + "." + PMOClickHome.GlobalVariables.MyDocs[numDoc].Cells.results[31].Value + "</span>" +
                "</div>" +
                "</div>";
                $('#docs').append(doc);
            }
        },

        GetSchemeNameForFileExtension: function (fileExtension) {
            if (!PMOClick.Methods.isNullOrEmptyString(fileExtension)) {
                fileExtension = fileExtension.toLowerCase();
                if (fileExtension === 'doc' || fileExtension === 'docm' || fileExtension === 'docx' || fileExtension === 'dot' || fileExtension === 'dotx') {
                    return 'ms-word';
                }
                else if (fileExtension === 'pot' || fileExtension === 'potm' || fileExtension === 'potx' || fileExtension === 'ppam' || fileExtension === 'pps' || fileExtension === 'ppsm' || fileExtension === 'ppsx' || fileExtension === 'ppt' || fileExtension === 'pptm' || fileExtension === 'pptx') {
                    return 'ms-powerpoint';
                }
                else if (fileExtension === 'odc' || fileExtension === 'xlm' || fileExtension === 'xls' || fileExtension === 'xlsb' || fileExtension === 'xlsm' || fileExtension === 'xlsx' || fileExtension === 'xlt' || fileExtension === 'xltb' || fileExtension === 'xltm' || fileExtension === 'xltx') {
                    return 'ms-excel';
                }
                else if (fileExtension === 'vdw' || fileExtension === 'vdx' || fileExtension === 'vsd' || fileExtension === 'vsdm' || fileExtension === 'vsdx' || fileExtension === 'vsl' || fileExtension === 'vss' || fileExtension === 'vssm' || fileExtension === 'vst' || fileExtension === 'vstm' || fileExtension === 'vsu' || fileExtension === 'vsw' || fileExtension === 'vsx' || fileExtension === 'vtx' || fileExtension === 'vstx') {
                    return 'ms-visio';
                }
                else if (fileExtension === 'mdb' || fileExtension === 'accdb' || fileExtension === 'accdt' || fileExtension === 'accdc' || fileExtension === 'accde' || fileExtension === 'accdr') {
                    return 'ms-access';
                }
                else if (fileExtension === 'mpp' || fileExtension === 'mpt') {
                    return 'ms-project';
                }
                else if (fileExtension === 'pub') {
                    return 'ms-publisher';
                }
                else if (fileExtension === 'xsn') {
                    return 'ms-infopath';
                }
            }
            return '';
        },

        ParseDate: function (str) {
            var mdy = str.split('/');
            return new Date(mdy[2], mdy[1] - 1, mdy[0]);
        },

        Datediff: function (first, second) {
            return Math.round((first - second) / (1000 * 60 * 60 * 24));
        },

        // DeleteListItemFavotite: function (Id) {
        //     PMOClick.Methods.DeleteListItem("/", PMOClickHome.Lists.MyFavorites.HE, Id);
        //     location.reload();
        // },

        
        OpenWindowURL: function (Url) {
            window.open(PMOClick.CONSTANTS.SITESERVERRELATIVEURL + Url, "_self");
        },

        OpenWindowWithData: function () {
            var searchData = $('.searchInput').val();
            var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/pages/searchresults.aspx#k=" + searchData + "#l=1037";
            window.location.href = url;
        }
    }
}