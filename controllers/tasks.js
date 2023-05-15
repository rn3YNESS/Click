const initTasks = async() => {
    console.log(`${new Date()} : call initTasks at tasks.js`);
    //Get all current user tasks 
    const requestUriTasks = buildSearchQuery(`querytext='contentclass="STS_ListItem_Tasks*" AND (AssignedTo:"${encodeURIComponent(spContextObject.User.DisplayName)}" OR AssignedTo:"${encodeURIComponent((spContextObject.User.LogInName).split("i:0#.w|")[1])}") AND Path:"${spContextObject.CONSTANTS.WEBAPPLICATIONURL}"'`, "&rowlimit=500", "&selectproperties='Title,Path,StatusOWSCHCS,Priority,DueDateOWSDATE,StartDateOWSDATE,ListItemId,PercentCompleteOWSNMBR,AssignedTo'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
    const tasksData = await getData(requestUriTasks);
    for (t of tasksData.PrimaryQueryResult.RelevantResults.Table.Rows) {
        let task = {
            Title: t.Cells[2].Value,
            Path: t.Cells[3].Value,
            Priority: t.Cells[5].Value,
            ListItemId: t.Cells[8].Value,
            AssignedTo: t.Cells[9].Value,
            Status: t.Cells[4].Value,
            DueDate: t.Cells[6].Value,
            StartDate: t.Cells[7].Value,
            PercentComplete: t.Cells[11].Value
        }
        personalDataObject.GlobalVariables.AllUserTasks.push(task);
    }

    for (const task of personalDataObject.GlobalVariables.AllUserTasks) {
        if (task.Status != personalDataObject.TasksStatus.REJECTED.Text) {
            if (getCountTaskStatus(task.Status) < 5) {
                var bgColor = getColorByStatus(task.Status);
                var textDate = getRemainingDays(new Date(), new Date(task.DueDate));
                var htmlDivTask =
                    `<div class="${bgColor} taskContentText">
                <div class="spaceRow">
                    <div> ${task.Title} </div>
                </div>
                <div class="spaceRow">
                    <div>
                        <span class="boldDaysText"> ${textDate}</span>&nbsp;|&nbsp;<span> ${getPriority(task.Priority)}</span>
                    </div>
                    <div class="textLeft">
                        <a onclick="initTaskModal('${task.Title}',${task.ListItemId})" target="_blank" style='text-decoration: none; color:#ffffff; cursor: pointer;'>פרטים נוספים</a>                        
                    </div>
                </div>
            </div>`;
                drawTask(htmlDivTask, task.Status);
            }
        }
    }
    titleGroupTask();
}

const editTask = () => {
    const lockIcons = document.querySelectorAll(".lockIcon");
    const taskFields = document.querySelectorAll(".taskField, .click__btn");
    for (const lockIcon of lockIcons) {
        lockIcon.src = "/_catalogs/masterpage/click/public/images/lock-5-16.png";
        lockIcon.title = "פתוח לעריכה";
    }
    for (const taskField of taskFields) {
        taskField.disabled = false;
    }

    document.getElementById("taskTitle").focus();
    document.getElementById('taskPercentComplete').innerHTML += `< a href = "#" > Hello < /a>`;
}

const updateTask = async() => {
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    //const assignedTo = document.getElementById('taskAssignedTo').value;
    var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["taskAssignedTo_TopSpan"];
    const assignedTo = isNullOrEmpty(_PeoplePickerOject) ? null : await getUserInfo(_PeoplePickerOject); 
    const taskComplete = document.getElementById('taskComplete').value;
    const taskStartDate = new Date(parseInt(document.getElementById('taskStartDate').name));
    const dueDate = new Date(parseInt(document.getElementById('taskDueDate').name));
    const priority = document.getElementById('taskPriority').value;
    const description = document.getElementById('taskDescription').value;
    //Title,Description,EventDateOWSDATE,EndDateOWSDATE,Location,CategoryOWSCHCS,assignedToOWSUSER,Category

    const listItem = {
        __metadata: { "type": getListItemType(TaskObject.Lists.Tasks.EN) },
        Title: title,
        Complete: taskComplete,
        Description: description,
        StartDate: taskStartDate,
        DueDate: dueDate,
        Priority: priority,
        Description : description
    };
    await updateListItem(TaskObject.Lists.Tasks.HE, id, listItem);
    const index = personalDataObject.GlobalVariables.AllUserTasks.findIndex(object => {
        return (object.ListItemId === id && object.Title === document.getElementById('taskId').title);
    });
    updateTaskInGlobalScope(index, listItem)
    closeModal();
}

const updateTaskInGlobalScope = async(index, listItem) => {
    personalDataObject.GlobalVariables.AllUserTasks[index] = {...personalDataObject.GlobalVariables.AllUserTasks[index], ...listItem };
    var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["remAttendee_TopSpan"];
    const ParticipantsPicker = isNullOrEmpty(_PeoplePickerOject) ? null : await getUserInfo(_PeoplePickerOject);
}

const getColorByStatus = (status) => {
    switch (status) {
        case personalDataObject.TasksStatus.WAITING.Text:
            return personalDataObject.TasksStatus.WAITING.Color;
            break;
        case personalDataObject.TasksStatus.DOING.Text:
            return personalDataObject.TasksStatus.DOING.Color;
            break;
        case personalDataObject.TasksStatus.OPEN.Text:
            return personalDataObject.TasksStatus.OPEN.Color;
            break;
        default:
            return 'blue';
            break;
    }
}

const drawTask = (htmlDivTask, status) => {
    switch (status) {
        case personalDataObject.TasksStatus.WAITING.Text:
            document.getElementById('waitingTasks').innerHTML += htmlDivTask;
            personalDataObject.GlobalVariables.numTasks.Waiting.First++;
            break;
        case personalDataObject.TasksStatus.DOING.Text:
            document.getElementById('doingTasks').innerHTML += htmlDivTask;
            personalDataObject.GlobalVariables.numTasks.Doing.First++;
            break;
        case personalDataObject.TasksStatus.OPEN.Text:
            document.getElementById('openTasks').innerHTML += htmlDivTask;
            personalDataObject.GlobalVariables.numTasks.Opening.First++;
            break;
        case personalDataObject.TasksStatus.COMPLETED.Text:
            document.getElementById('completedTasks').innerHTML += htmlDivTask;
            personalDataObject.GlobalVariables.numTasks.COMPLETED.First++;
            break;
    }
}

const getCountTaskStatus = (status) => {
    switch (status) {
        case personalDataObject.TasksStatus.WAITING.Text:
            personalDataObject.GlobalVariables.numTasks.Waiting.All++;
            return personalDataObject.GlobalVariables.numTasks.Waiting.First;
        case personalDataObject.TasksStatus.DOING.Text:
            personalDataObject.GlobalVariables.numTasks.Doing.All++;
            return personalDataObject.GlobalVariables.numTasks.Doing.First;
        case personalDataObject.TasksStatus.OPEN.Text:
            personalDataObject.GlobalVariables.numTasks.Opening.All++;
            return personalDataObject.GlobalVariables.numTasks.Opening.First;
        case personalDataObject.TasksStatus.COMPLETED.Text:
            personalDataObject.GlobalVariables.numTasks.Opening.All++;
            return personalDataObject.GlobalVariables.numTasks.Opening.First;
    }
}

const getRemainingDays = (fromDay, toDay) => {
    dateDiff = datediff(fromDay, toDay)
    if (dateDiff >= 0)
        return dateDiff + " ימים";
    else
        return "מתעכב ב " + dateDiff * -1 + " ימים";
}

const datediff = (first, second) => {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

const parseDate = (str) => {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1] - 1, mdy[0]);
}

const titleGroupTask = () => {
    document.getElementById('openTasksGroupText').innerHTML += `( ${personalDataObject.GlobalVariables.numTasks.Opening.First})`;
    document.getElementById('doingTasksGroupText').innerHTML += `( ${personalDataObject.GlobalVariables.numTasks.Doing.First})`;
    document.getElementById('waitingTasksGroupText').innerHTML += `( ${personalDataObject.GlobalVariables.numTasks.Waiting.First})`;
    document.getElementById('completedTasksGroupText').innerHTML += `( ${personalDataObject.GlobalVariables.numTasks.COMPLETED.First})`;
}

const getPriority = (priority) => {
    return priority.substring(priority.indexOf(' ') + 1);
}

const initTaskModal = async(title, id) => {
    await openModalDialog(title, '/_catalogs/masterpage/Click/views/webparts/task.html');
    const t = personalDataObject.GlobalVariables.AllUserTasks.filter(x => {
        return ((x.Title === title) && (x.ListItemId === id.toString()));
    });

    if (t.length > 0) {
        loadTaskDetails(t[0]);
    }
}

const loadTaskDetails = (task) => {
    const id = (isNullOrEmpty(task.ListItemId)) ? "אין" : task.ListItemId;
    document.getElementById('taskId').value = id;
    document.getElementById('taskId').title = task.Title;

    const title = (isNullOrEmpty(task.Title)) ? "אין" : task.Title;
    document.getElementById('taskTitle').value = title;
    const status = (isNullOrEmpty(task.Status)) ? "אין" : task.Status;
    document.getElementById('taskComplete').value = status;
    const eventDate = (isNullOrEmpty(task.StartDate)) ? "אין" : formatDateHE(task.StartDate);
    document.getElementById('taskStartDate').value = getDate_d(task.StartDate);
    document.getElementById('taskStartDate').name = Date.parse(task.StartDate);
    const dueDate = (isNullOrEmpty(task.DueDate)) ? "אין" : formatDateHE(task.DueDate);
    document.getElementById('taskDueDate').value = getDate_d(task.DueDate);
    document.getElementById('taskDueDate').name = Date.parse(task.DueDate);
    const priority = (isNullOrEmpty(task.Priority)) ? "אין" : task.Priority;
    document.getElementById('taskPriority').value = priority;
    const percentComplete = (isNullOrEmpty(task.PercentComplete)) ? "0%" : addTaskPercent((task.PercentComplete) * 100);
    document.getElementById('taskPercentComplete').value = percentComplete;
    const description = (isNullOrEmpty(task.Description)) ? "אין" : task.Description;
    document.getElementById('taskDescription').value = description;

    /*Init peoplePicker*/
    initTaskPeoplePicker(task);
}

const addTaskPercent = (percent) => {
    document.getElementById('taskPercentComplete').innerHTML = `${percent}%`;
    switch (true) {
        case percent <= 20:
            document.getElementById('taskPercentComplete').classList.add('notStart');
            break;
        case (percent > 20 && percent < 50):
            document.getElementById('taskPercentComplete').classList.add('inProgress');
            break;
        case (percent >= 50 && percent < 85):
            document.getElementById('taskPercentComplete').classList.add('beforeFinish');
            break;
        case (percent >= 85):
            document.getElementById('taskPercentComplete').classList.add('done');
            break;
        default:
            break;
    }
    document.getElementById('taskPercentComplete').style.width = `${percent}%`;
}

const initTaskPeoplePicker = (task) => {
    initializePeoplePicker('taskAssignedTo');
    if (!isNullOrEmpty(task.AssignedTo)) {
        //Get only users with email address <Change  the Email>
        const users = task.AssignedTo.split(';'); //.filter(x => x.includes("@PFE.CORP.NET")); // [6].includes("\\")
        if (users.length > 0) {
            for (const user of users) {
                const assignedTo = (isNullOrEmpty(user)) ? "אין" : user; //(isNullOrEmpty(task.AssignedTo)) ? "אין" : task.AssignedTo.split('|')[0]; //task.AssignedTo.results; //
                document.getElementById('taskAssignedTo_TopSpan_EditorInput').value += assignedTo;
                var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict["taskAssignedTo_TopSpan"];
                _PeoplePickerOject.AddUnresolvedUserFromEditor(true);
            }
        }
    }

    const peoplePickerInputFiled = document.getElementById('taskAssignedTo_TopSpan_EditorInput');
    //Disable peoplePicker
    peoplePickerInputFiled.setAttribute('disabled', 'disabled');
    peoplePickerInputFiled.classList.add('taskField');
    peoplePickerInputFiled.addEventListener('blur', (event) => {
        document.getElementById("taskDisplayName").innerHTML = "";
        const users = document.querySelectorAll(".ms-entity-resolved");
        for (const user of users) {
            renderTaskDisplyName(user.textContent);
        }
    });

    if (!isNullOrEmpty(task.AssignedTo)) {
        renderTaskDisplyName(task.AssignedTo);
    }
}

const renderTaskDisplyName = (userDisplayName) => {
    const fullName = userDisplayName.split(" ");
    let element = "";
    for (let index = 0; index < fullName.length; index++) {
        element += fullName[index].substring(0, 1);
    }
    const fn = `<span class="taskDisplayName__fullName" title="${userDisplayName}">${element}</span>`;
    document.getElementById("taskDisplayName").innerHTML += fn;
}

initTasks();