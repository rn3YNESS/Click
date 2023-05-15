const drawReminders = () => {
    document.getElementById('personalR').innerHTML = "";
    document.getElementById('unitR').innerHTML = "";
    const todayReminders = personalDataObject.GlobalVariables.AllUserReminders.filter(x => {
        const a = (new Date(x.EventDate)).setHours(0, 0, 0, 0);
        const b = (new Date()).setHours(0, 0, 0, 0);
        return a === b; //return ((a === b) && (spContextObject.User.DisplayName === x.Author));
    });
 
    if (todayReminders.length > 0) {
        //Get personal reminders
        const personalReminders = todayReminders.filter(x => {
            const a = x.Author.includes(spContextObject.User.DisplayName);
            const b = isNullOrEmpty(x.ParticipantsPicker);
            return (a && b);
        });
        //Get unit reminders
        const unitReminders = todayReminders.filter(x => {             
            let a = false;
            let b = false;
            const currentUser = (spContextObject.User.LogInName.includes(x.Author))? x.Author : spContextObject.User.DisplayName;
            //Reminder is item that created by the current user with differance participates
            if(x.Author === currentUser){
                a = !((x.ParticipantsPicker !== null) ? x.ParticipantsPicker.includes(spContextObject.User.DisplayName) : true);
            }

            //someone create item and current user is one of the participent
            if(!(x.Author === currentUser)){
                b = ((x.ParticipantsPicker !== null) ? x.ParticipantsPicker.includes(spContextObject.User.DisplayName) : false);
            }                                    
            return (a || b);
        });
 
        if (personalReminders.length > 0) {
            drawReminder(personalReminders, 'personalR', 'personal');
        } else {
            drawNonReminder(null, 'personalR', 'personal');
        }
        if (unitReminders.length > 0) {
            drawReminder(unitReminders, 'unitR', 'unit');
       } else {
            drawNonReminder(null, 'unitR', 'unit');
        }
 
    } else {
        drawNonReminder(null, 'personalR', 'personal');
        drawNonReminder(null, 'unitR', 'unit');
    }
}
 
const drawReminder = (reminders, drawInsideContainer, type) => {
    let maxIterations = (type === 'personal') ? 3 : 6;
    let counter = 0;
    for (const reminder of reminders) {
        if (counter === maxIterations) {
            return;
        }
        const fotmatDate = formatDateString(reminder.EventDate);
        const day = fotmatDate.split(" ")[0];
        const month = fotmatDate.split(" ")[1];
        const cube =
            `<div class='interactiveCube interactiveCubeMax interactiveCube${type}'>
            <div class='interactiveCubeInnerRight interactiveCubeInner${type}'>                  
                <div class="interactiveCubeInnerRight__month">${month}</div>
                <div class="interactiveCubeInnerRight__day">${day}</div>
                <div class="interactiveCubeInnerRight__icon">
                    <img alt="calendarIcon" src="/_catalogs/masterpage/click/public/images/WhiteCalanderTransparentBG2.png" height="24" width="24" />
                </div>
            </div>
            <div class='interactiveCubeInnerLeft'>
                <div style='height:80%; width:100%; color:#ffffff;'>
                    <p style='font-size:20px;'>${reminder.Title}</p>
                </div>
                <div style='height:20%; width:100%;text-align:left;'>
                    <button type="button" class="reminder__moreInformationbtn ${type}" onclick="initReminderModal('${reminder.Title}',${reminder.ListItemId})" style="color:#8b6bfd;">מידע נוסף</button>
                </div>
            </div>
        </div>`;
        document.getElementById(drawInsideContainer).innerHTML += cube;
        counter++
    }
}
 
const drawNonReminder = (selectedDate, drawInsideContainer, type) => {
    const fotmatDate = (isNullOrEmpty(selectedDate)) ? formatDateString(new Date()) : formatDateString(new Date(selectedDate));
    const day = fotmatDate.split(" ")[0];
    const month = fotmatDate.split(" ")[1];
    const cube =
        `<div class='interactiveCube interactiveCube${type}'>
                <div class='interactiveCubeInnerRight interactiveCubeInner${type}'>                  
                    <div class="interactiveCubeInnerRight__month">${month}</div>
                    <div class="interactiveCubeInnerRight__day">${day}</div>
                    <div class="interactiveCubeInnerRight__icon">
                        <img alt="calendarIcon" src="/_catalogs/masterpage/click/public/images/WhiteCalanderTransparentBG2.png" height="24" width="24" />
                    </div>
                </div>
                <div class='interactiveCubeInnerLeft'>
                    <div style='display: flex; width: 100%; height:178px; align-items:center;justify-content:center;color:#ffffff;'>
                        <img alt="reminderIcon" src="/_catalogs/masterpage/click/public/images/reminder.png" height="24" width="24" />
                        <p style='font-size:2rem;'>אין תזכורות</p>
                    </div>
                </div>
            </div>`;
    document.getElementById(drawInsideContainer).innerHTML += cube;
 
}
 
const initReminderModal = async(title, id) => {
    await openModalDialog(title, '/_catalogs/masterpage/Click/views/webparts/reminder.html');
    const r = personalDataObject.GlobalVariables.AllUserReminders.filter(x => {
        return ((x.Title === title) && (x.ListItemId === id.toString()));
    });
 
    if (r.length > 0) {
        loadReminderDetails(r[0]);
    }
}
 
const loadReminderDetails = (reminder) => {
    const id = (isNullOrEmpty(reminder.ListItemId)) ? "אין" : reminder.ListItemId;
    document.getElementById('remId').value = id;
    document.getElementById('remId').title = reminder.Title;
 
    const title = (isNullOrEmpty(reminder.Title)) ? "אין" : reminder.Title;
    document.getElementById('remTitle').value = title;
    const location = (isNullOrEmpty(reminder.Location)) ? "אין" : reminder.Location;
    document.getElementById('remPlace').value = location;
 
    const eventDate = (isNullOrEmpty(reminder.EventDate)) ? "אין" : formatDateHE(reminder.EventDate);
    document.getElementById('remEventDate').value = getDate_d(reminder.EventDate);
    document.getElementById('remEventDate').name = Date.parse(reminder.EventDate);
 
    const dueDate = (isNullOrEmpty(reminder.EndDate)) ? "אין" : formatDateHE(reminder.EndDate);
    document.getElementById('remEndDate').value = getDate_d(reminder.EndDate);
    document.getElementById('remEndDate').name = Date.parse(reminder.EndDate);
 
    const category = (isNullOrEmpty(reminder.Category)) ? "אין" : reminder.Category;
    document.getElementById('remCategory').value = category;
 
    const description = (isNullOrEmpty(reminder.Description)) ? "אין" : reminder.Description;
    document.getElementById('remDiscription').value = description;
 
    /*Init peoplePicker*/
    initReminderPeoplePicker(reminder);
}
 
const initReminderPeoplePicker = (reminder) => {
    initializePeoplePicker('remAttendee');
    if (!isNullOrEmpty(reminder.ParticipantsPicker)) {
        //Get only users with email address <Change  the Email>
        const users = reminder.ParticipantsPicker.split('|').filter(x => x.includes("@PFE.CORP.NET")); // [6].includes("\\")
        if (users.length > 0) {
            for (const user of users) {
                const ParticipantsPicker = (isNullOrEmpty(user)) ? "אין" : user; //(isNullOrEmpty(reminder.ParticipantsPicker)) ? "אין" : reminder.ParticipantsPicker.split('|')[0]; //reminder.ParticipantsPicker.results; //
                document.getElementById('remAttendee_TopSpan_EditorInput').value += ParticipantsPicker;
                var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["remAttendee_TopSpan"];
                _PeoplePickerOject.AddUnresolvedUserFromEditor(true);
            }
        }
    }
 
    const peoplePickerInputFiled = document.getElementById('remAttendee_TopSpan_EditorInput');
    //Disable peoplePicker
    peoplePickerInputFiled.setAttribute('disabled', 'disabled');
    peoplePickerInputFiled.classList.add('remField');
    peoplePickerInputFiled.addEventListener('blur', (event) => {
        document.getElementById("remDisplayName").innerHTML = "";
        const users = document.querySelectorAll(".ms-entity-resolved");
        for (const user of users) {
            renderDisplyName(user.textContent);
        }
    });
 
    if (!isNullOrEmpty(reminder.ParticipantsPicker)) {
        renderDisplyName(reminder.ParticipantsPicker.split('|')[1]);
    }
}
