const initEvents = async() => {
    try {
        //Get all current user reminders (Events)
        //Attention : Change ParticipantsPickerOWSUSER to ParticipantsPickerOWSUSER
       // const requestUriReminders = buildSearchQuery(`querytext='contentclass=STS_ListItem_Events AND (Author="${encodeURIComponent(spContextObject.User.DisplayName)}" OR ParticipantsPicker:"${encodeURIComponent(spContextObject.User.DisplayName)}") AND Path:"${spContextObject.CONSTANTS.WEBAPPLICATIONURL}"'`, "&rowlimit=500", "&selectproperties='Title,Description,EventDateOWSDATE,EndDateOWSDATE,Location,ParticipantsPicker,CategoryOWSCHCS,ListItemId,Path,Author,SPSiteURL'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
       const requestUriReminders = buildSearchQuery(`querytext='contentclass=STS_ListItem_Events AND (Author="${encodeURIComponent(spContextObject.User.DisplayName)}" OR Author:"${encodeURIComponent((spContextObject.User.LogInName).split("i:0#.w|")[1])}" OR ParticipantsPicker:"${encodeURIComponent(spContextObject.User.DisplayName)}" OR ParticipantsPicker:"${encodeURIComponent((spContextObject.User.LogInName).split("i:0#.w|")[1])}") AND Path:"${spContextObject.CONSTANTS.WEBAPPLICATIONURL}"'`, "&rowlimit=500", "&selectproperties='Title,Description,EventDateOWSDATE,EndDateOWSDATE,Location,ParticipantsPickerOWSUSER,CategoryOWSCHCS,ListItemId,Path,Author,SPSiteURL'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'"); 
       const remindersData = await getData(requestUriReminders);
        for (r of remindersData.PrimaryQueryResult.RelevantResults.Table.Rows) {
            let reminder = {
                Title: r.Cells[2].Value,
                Description: r.Cells[3].Value,
                Location: r.Cells[6].Value,
                ListItemId: r.Cells[7].Value,
                Path: r.Cells[8].Value,
                Author: r.Cells[9].Value,
                SPSiteUrl: r.Cells[10].Value,
                EventDate: r.Cells[4].Value,
                EndDate: r.Cells[5].Value,
                ParticipantsPicker: r.Cells[12].Value,
                Category: r.Cells[13].Value
            }
            personalDataObject.GlobalVariables.AllUserReminders.push(reminder);
        }
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }

    drawReminders();

    var calendar = new Calendar();
    personalDataObject.GlobalVariables.Events.EventsArray = personalDataObject.GlobalVariables.AllUserReminders.sort((firstItem, secondItem) => new Date(firstItem.EventDate) - new Date(secondItem.EventDate));;
    //Get the first item that equal today or gather from today and display it
    if (personalDataObject.GlobalVariables.Events.EventsArray.length > 0) {
        personalDataObject.GlobalVariables.Events.currentEventIndex = personalDataObject.GlobalVariables.Events.EventsArray.findIndex(x => new Date(x.EventDate) >= new Date());
        drawEvents(personalDataObject.GlobalVariables.Events.currentEventIndex);
    } else {
        drawEvents(-1);
    }
}

const drawEvents = (index) => {
    if ((index >= 0) && (index < personalDataObject.GlobalVariables.Events.EventsArray.length)) {
        var isPersonal = (isNullOrEmpty(personalDataObject.GlobalVariables.Events.EventsArray[index].ParticipantsPicker) && personalDataObject.GlobalVariables.Events.EventsArray[0].Author === spContextObject.User.DisplayName);
        let eventDate = `<div class='${(isPersonal)? "personal" : "unit"}'>${formatDateHE(personalDataObject.GlobalVariables.Events.EventsArray[index].EventDate)}</div>`;
        let eventTitle = `<div>${personalDataObject.GlobalVariables.Events.EventsArray[index].Title}</div>`;
        document.getElementById('reminderStartDate').innerHTML = eventDate;
        document.getElementById('reminderDescription').innerHTML = eventTitle;
    } else {
        console.log();
    }
}

const toggleCalendar = (el) => {
    let acc = document.getElementById("accordion__container__events");
    var panel = acc.nextElementSibling;
    //if (panel.style.maxHeight) {
    //    panel.style.maxHeight = null;
    //} else {
    panel.style.maxHeight = "fit-content"; //panel.scrollHeight + "px";
    //}
    const calendar = document.getElementById("calendarContainer");
    calendar.classList.toggle("displayCalendar");
}

const highlightEvents = (numDisable) => {
    //for (var j = 0; j < personalDataObject.GlobalVariables.AllUserReminders.length; j++) {
    for (const reminder of personalDataObject.GlobalVariables.AllUserReminders) {
        var currentEventDate = new Date(reminder.EventDate);
        var currentDay = days[numDisable + currentEventDate.getDate() - 1];
        if (currentEventDate.getMonth() == month) {
            var isPersonal = (isNullOrEmpty(reminder.ParticipantsPicker) && reminder.Author.includes(spContextObject.User.DisplayName));
            //Check if the element contains class, if not Enter the condition
            if (currentDay.classList.length > 0) {
                if (currentDay.classList.contains("boderUnderPersonalAndUnit")) {
                    continue;
                } else if (currentDay.classList.contains("boderUnderPersonal")) {
                    if (isPersonal) {
                        continue;
                    } else {
                        currentDay.classList.add("boderUnderPersonalAndUnit");
                        currentDay.classList.remove("boderUnderPersonal");
                    }
                } else if (currentDay.classList.contains("boderUnderUnit")) {
                    if (isPersonal) {
                        currentDay.classList.add("boderUnderPersonalAndUnit");
                        currentDay.classList.remove("boderUnderUnit");
                    } else {
                        continue;
                    }
                } else {
                    if (isPersonal) {
                        currentDay.className += "boderUnderPersonal";
                    } else {
                        currentDay.className += "boderUnderUnit";
                    }
                }
            } else {
                if (isPersonal) {
                    currentDay.className = "boderUnderPersonal";
                } else {
                    currentDay.className = "boderUnderUnit";
                }
            }
        }
    }
}

const nextEvent = () => {
    if (personalDataObject.GlobalVariables.Events.currentEventIndex < personalDataObject.GlobalVariables.Events.EventsArray.length - 1) {
        personalDataObject.GlobalVariables.Events.currentEventIndex++;
        drawEvents(personalDataObject.GlobalVariables.Events.currentEventIndex);
    }
}

const prevEvent = () => {
    if (personalDataObject.GlobalVariables.Events.currentEventIndex > 0) {
        personalDataObject.GlobalVariables.Events.currentEventIndex--;
        drawEvents(personalDataObject.GlobalVariables.Events.currentEventIndex);
    }
}
initEvents();