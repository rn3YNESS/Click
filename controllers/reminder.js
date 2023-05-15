const reminderObject = {
    Lists: {
        Reminders: {
            HE: 'לוח שנה',
            EN: "Calendar"
        }
    }
}

const editReminder = () => {
    const lockIcons = document.querySelectorAll(".lockIcon");
    const remFields = document.querySelectorAll(".remField, .click__btn");
    for (const lockIcon of lockIcons) {
        lockIcon.src = "/_catalogs/masterpage/click/public/images/lock-5-16.png";
        lockIcon.title = "פתוח לעריכה";
    }
    for (const remField of remFields) {
        remField.disabled = false;
    }

    document.getElementById("remTitle").focus();
}

const convertDate = (element) => {
    element.name = Date.parse(element.value);
}

const updateReminder = async() => {
    const id = document.getElementById('remId').value;
    const title = document.getElementById('remTitle').value;
    //const ParticipantsPicker = document.getElementById('remAttendee').value;
    var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["remAttendee_TopSpan"];
    const ParticipantsPicker = isNullOrEmpty(_PeoplePickerOject) ? null : await getUserInfo(_PeoplePickerOject);
    const location = document.getElementById('remPlace').value;
    const eventDate = new Date(parseInt(document.getElementById('remEventDate').name));
    const dueDate = new Date(parseInt(document.getElementById('remEndDate').name));
    const category = document.getElementById('remCategory').value;
    const description = document.getElementById('remDiscription').value;
    //Title,Description,EventDateOWSDATE,EndDateOWSDATE,Location,CategoryOWSCHCS,ParticipantsPickerOWSUSER,Category

    const listItem = {
        __metadata: { "type": getListItemType(reminderObject.Lists.Reminders.EN) },
        Title: title,
        Location: location,
        Description: description,
        EventDate: eventDate,
        EndDate: dueDate,
        Category: category,
        //ParticipantsPickerId: { "results": ParticipantsPicker } //ParticipantsPicker
    };
    await updateListItem(reminderObject.Lists.Reminders.HE, id, listItem);
    const index = personalDataObject.GlobalVariables.AllUserReminders.findIndex(object => {
        return (object.ListItemId === id && object.Title === document.getElementById('remId').title);
    });
    updateReminderInGlobalScope(index, listItem)
    closeModal();
}

const updateReminderInGlobalScope = async(index, listItem) => {
    personalDataObject.GlobalVariables.AllUserReminders[index] = {...personalDataObject.GlobalVariables.AllUserReminders[index], ...listItem };
    var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["remAttendee_TopSpan"];
    const ParticipantsPicker = isNullOrEmpty(_PeoplePickerOject) ? null : await getUserInfo(_PeoplePickerOject);

    selectedDay = new Date(personalDataObject.GlobalVariables.AllUserReminders[index].EventDate);

    if (personalDataObject.GlobalVariables.AllUserReminders.length > 0) {
        const reminders = personalDataObject.GlobalVariables.AllUserReminders.filter(x => {
            const a = (new Date(x.EventDate)).setUTCHours(0, 0, 0, 0);
            const b = (new Date(selectedDay)).setUTCHours(0, 0, 0, 0);
            return a === b;
        });

        //Clear reminders area
        document.getElementById('personalR').innerHTML = "";
        document.getElementById('unitR').innerHTML = "";


        const personalReminders = reminders.filter(x => isNullOrEmpty(x.ParticipantsPicker));
        if (personalReminders.length > 0) {
            drawReminder(personalReminders, 'personalR', 'personal');
        } else {
            drawNonReminder(selectedDay, 'personalR', 'personal');
        }
        const unitReminders = reminders.filter(x => !isNullOrEmpty(x.ParticipantsPicker));
        if (unitReminders.length > 0) {
            drawReminder(unitReminders, 'unitR', 'unit');
        } else {
            drawNonReminder(selectedDay, 'unitR', 'unit');
        }

        highlightEvents(1);
    }
}

const initHtmlElementWithAttr = (fieldId, fieldProperty, value) => {
    if (document.getElementById(fieldId)) {
        if (value) { //not null, undefined, or blank variable
            document.getElementById(fieldId)[fieldProperty] = value;
        }
    }
}

const renderDisplyName = (userDisplayName) => {
    const fullName = userDisplayName.split(" ");
    let element = "";
    for (let index = 0; index < fullName.length; index++) {
        element += fullName[index].substring(0, 1);
    }
    const fn = `<span class="remDisplayName__fullName" title="${userDisplayName}">${element}</span>`;
    document.getElementById("remDisplayName").innerHTML += fn;
}