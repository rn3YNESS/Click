const z_object = {

    GlobalVariables: {
        favArr: [], //Array of new zirots
        pointersArr: [],
        myzirots: [], //Array of existing zirots
        myzirotsRemoved: [],
        favContainer: { panel: 'zirots__personal', preview: 'formzirotsPreview' }
    },

    Lists: {
        zirot: {
            HE: "זירות",
            EN: "Depts"
        }
    }
}


const buildRequestUrl = (list, beforeQueryString, selectedFields, filterByCommand, expand, orderBy, topItems) => {

    let requestUri = _spPageContextInfo.webAbsoluteUrl;
    //Select
    if (selectedFields !== null && selectedFields !== undefined)
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?${selectedFields}`;
    else
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?`;
    //FilterBy
    if (filterByCommand !== null && filterByCommand !== undefined)
        requestUri += filterByCommand;
    //Expand
    if (expand != null || expand != undefined)
        requestUri += expand;
    //OrderBy
    if (orderBy != null || orderBy != undefined)
        requestUri += orderBy;
    //Top
    if (topItems != null || topItems != undefined)
        requestUri += topItems;

    return requestUri;
}


const getData = async (url) => {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json', 'accept': 'application/json' } }).then(response => { return response.json() })
        // parses JSON response into native JavaScript objects
        .then(responseData => {
            return responseData
        }).catch(error => {
            console.log(error);
        });
    return response;
}

const activatecall = async () => {

    var myTasksElement = document.getElementById("TasksByBranchDiv");
    //myTasksElement.setAttribute("expandarrow",'▼');
    //var myTasksText = '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<table style="">';
    //myTasksText += '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >תאריך יעד</th></tr>';
    //const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, `$filter=Author eq ${userId} and FSObjType eq 0&$orderby=Created desc`, null, null, null);
    const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);

    var tasksSet = new Set();
    var userSet = new Set();

    if (zirots.value.length > 0) {

        z_object.GlobalVariables.myzirots = zirots.value
        for (const zirot of z_object.GlobalVariables.myzirots) {
            //const requestUri = buildRequestUrl("משימות " + zirot.Title, "", null, null, null, null, null);
            const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,EventTitle,FolderID,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo`, null, null);
            //value: "הביטוי \"Title,AssignedTo,AssignedToId,EventTitle,FolderID,Id,DueDate?$filter=Status ne 'הושלם'\" אינו חוקי."
            //value: "הביטוי \"Title,AssignedTo,AssignedToId,EventTitle,FolderID,Id,DueDate?\" אינו חוקי."


            const tasks = await getData(requestUri);
            if (tasks.value.length > 0) {

                //do interesting things here
                for (const task of tasks.value) {

                    const taskItem = new Object();
                    if (task.AssignedTo != undefined) {
                        const usrItem = new Object();
                        usrItem.Id = task.AssignedTo.Id;
                        usrItem.Name = `הוקצה ל: ${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                        var isinset = false;
                        for (const usr of userSet) { if (usr.Id == usrItem.Id) { isinset = true } };
                        if (isinset == false) { userSet.add(usrItem) };
                        // if (!userSet.has(usrItem)) {
                        //     userSet.add(usrItem);

                        // }
                        taskItem.AssignedTo = usrItem.Id;
                        taskItem.AssignedToName = usrItem.Name;
                    } else {
                        const usrItem = new Object();
                        usrItem.Id = 0;
                        usrItem.Name = "משימות שלא הוקצו";
                        var isinset = false;
                        for (const usr of userSet) { if (usr.Id == usrItem.Id) { isinset = true } };
                        if (isinset == false) { userSet.add(usrItem) };
                        taskItem.AssignedTo = 0;
                        taskItem.AssignedToName = "לא הוקצה";
                    }

                    //if (!userSet.has(task.AssignedTo.Id)) {
                    //    userSet.add(task.AssignedTo.Id);
                    //}


                    //taskItem.AssignedTo = task.AssignedTo.Id;
                    //taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`
                    taskItem.EventTitle = task.EventTitle;
                    taskItem.FolderID = task.FolderID;
                    taskItem.branch = zirot.Title;
                    taskItem.bg = zirot.TaskColor;
                    //taskItem.bg = zirot.EventColor;
                    taskItem.divNo = zirot.divNo;
                    taskItem.Title = task.Title;
                    taskItem.Id = task.Id;
                    taskItem.DueDate = task.DueDate;

                    tasksSet.add(taskItem);

                }
            }

        }




    }

    //load tasks from departmental task list too....
    const centralrequestUri = buildRequestUrl(`משימות מטה רוחביות`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo`, null, null);
    const centraltasks = await getData(centralrequestUri);
    if (centraltasks.value.length > 0) {

        //do interesting things here
        for (const task of centraltasks.value) {

            const taskItem = new Object();

            if (task.AssignedTo != undefined) {
                const usrItem = new Object();
                usrItem.Id = task.AssignedTo.Id;
                usrItem.Name = `הוקצה ל: ${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                var isinset = false;
                for (const usr of userSet) { if (usr.Id == usrItem.Id) { isinset = true } };
                if (isinset == false) { userSet.add(usrItem) };
                //if (!userSet.has(usrItem)) {
                //    userSet.add(usrItem);
                //
                //}
                taskItem.AssignedTo = usrItem.Id;
                taskItem.AssignedToName = usrItem.Name;
            } else {
                const usrItem = new Object();
                usrItem.Id = 0;
                usrItem.Name = "משימות שלא הוקצו";
                var isinset = false;
                for (const usr of userSet) { if (usr.Id == usrItem.Id) { isinset = true } };
                if (isinset == false) { userSet.add(usrItem) };
                taskItem.AssignedTo = 0;
                taskItem.AssignedToName = "לא הוקצה";
            }
            //if (!userSet.has(task.AssignedTo)) {
            //    userSet.add(task.AssignedTo.Id);
            //}


            //taskItem.AssignedTo = task.AssignedTo.Id;
            //taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`
            //taskItem.EventTitle = task.EventTitle;
            //taskItem.FolderID = task.FolderID;
            taskItem.branch = '​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​מטה';
            taskItem.bg = 'b2b2b2';
            //taskItem.bg = zirot.EventColor;
            taskItem.divNo = '0';
            taskItem.Title = task.Title;
            taskItem.Id = task.Id;
            taskItem.DueDate = task.DueDate;

            tasksSet.add(taskItem);

        }
    }


    if (tasksSet.size > 0) {






        const sortedTasksSet = Array.from(tasksSet).sort((a, b) => {
            let da = new Date(a.DueDate),
                db = new Date(b.DueDate);
            return da - db;

        });//a.DueDate - b.DueDate);
        tasksSet = new Set(sortedTasksSet);

        var myTasksText = '<div class="wptitle">משימות לפי זירה</div>';
        if (zirots.value.length > 0) {
            for (const branch of zirots) {
                myTasksText += `<div class="branchheader" id="user_${branch.Id}" onclick="toggleItems(this);">${Branch.Title}</div>`;
                myTasksText += `<div id="tasks_${branch.Id}"><table>`;
                myTasksText += '<tr><th>שם מבצע</th><th class="jobcell" >שם משימה</th><th class="jobcell" >אירוע</th><th class="jobcell" >תאריך יעד</th></tr>';
                for (const tsk of tasksSet) {
                    var eventcell = "";
                    if (null != tsk.EventTitle) { eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>` }

                    if (tsk.branch == branch.Id) {
                        //display task
                    }



                }
                // department tasks

            }
        }
        //old code - to comment
        //for (const usr of userSet) {
        //    myTasksText += `<div class="userheader" id="user_${usr.Id}" onclick="toggleItems(this);">${usr.Name}</div>`;
        //    myTasksText += `<div id="tasks_${usr.Id}"><table>`;
        //    myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >אירוע</th><th class="jobcell" >תאריך יעד</th></tr>';
//
        //    for (const tsk of tasksSet) {
        //        var eventcell = "";
        //        if (null != tsk.EventTitle) { eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>` }
//
        //        if (tsk.AssignedTo == usr.Id) {
//
        //            var compdate = new Date(tsk.DueDate);
        //            var datestyle = "";
        //            var tdy = new Date();
        //            if (compdate < tdy) { datestyle = ` style="color:red"` };
//
        //            myTasksText += `<tr>`;
        //            myTasksText += `<td class="jobcell" id="firstcell" style="border-radius:7px; white-space:nowrap; background-color:#${tsk.bg};background-image: url('../images/div0${tsk.divNo}_bg.png')">${tsk.branch}</td>`
        //            myTasksText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks_Div${tsk.divNo}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></td>`;
        //            myTasksText += `<td class="jobcell">${eventcell}</td>`;
        //            myTasksText += `<td class="jobcell"${datestyle}>`;
//
        //            var compdate = new Date(tsk.DueDate);
        //            var datestyle = "";
//
//
        //            var ddate = compdate.toLocaleDateString("en-GB");
        //            if (tsk.DueDate != null) {
        //                myTasksText += `${ddate}`;
        //            } else {
        //                myTasksText += "לא צוין";
        //            }
        //            myTasksText += `</td>`;
//
        //            myTasksText += `</tr>`;
        //        }
//
        //    }//href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=' + oListItem.get_item('ID') + '&callback=' + window.location + '"
        //    myTasksText += '</table></div>';
//
        //}


        //sort array based on DueDate ascending


        //myTasksText += '<table style="">';
        //myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >תאריך יעד</th></tr>';
        //
        //for (const task of tasksSet) {
        //    // format item in row
        //    myTasksText += `<tr>`;
        //    myTasksText += `<td class="jobcell" id="firstcell" style="border-radius:7px; white-space:nowrap; background-color:#${task.bg};background-image: url('../images/div0${task.divNo}_bg.png')">${task.branch}</td>`
        //    myTasksText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/sites/Npdu/Lists/Tasks_Div${task.divNo}/DispForm.aspx?ID=${task.Id}">${task.Title}</a></td>`;
        //    myTasksText += `<td class="jobcell" >`;
        //    var ddate = new Date(task.DueDate).toLocaleDateString("en-GB");
        //    if (task.DueDate != null) {
        //        myTasksText += `${ddate}`;
        //    } else {
        //        myTasksText += "לא צוין";
        //    }
        //    myTasksText += `</td>`;
        //
        //    myTasksText += `</tr>`;
        //}
        //
        //myTasksText += '</table>';

        myTasksElement.innerHTML = myTasksText;

        //myTasksElement.hidden = true;
    }



    //myTasksText += '</table>';

    //myTasksElement.innerHTML = myTasksText;

}

function toggleItems(sender) {
    var usr = sender.id.split("_")[1];
    //Attr("expandarrow",'\140A'); ///* "'\140A';  /*left arrow. down is \1401*/")

    const targettable = document.getElementById(`tasks_${usr}`);
    if (targettable.hidden == true) {
        targettable.hidden = false;
        sender.setAttribute("tgarrow", '▼');
        //sender.style.setProperty('--tgarrow', "▼")
        //targettable.style.maxHeight = targettable.clientHeight + "px";
    } else {
        targettable.hidden = true;
        sender.setAttribute("tgarrow", '◀');
        //sender.style.setProperty('--tgarrow', "◀")
        //targettable.style.maxHeight = 0;
    }

}

window.addEventListener("load", function () {

    activatecall();


})


