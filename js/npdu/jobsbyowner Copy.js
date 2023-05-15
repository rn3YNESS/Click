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

const headerdiv = async () => {
    var txt = `<div class="titleDiv">משימות ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​מטה ההסברה הלאו​מי</div>`;
    txt += `<div style="text-align:center"><span style="height: 35px; padding: 5px 30px; text-align: center; font-family: assistant; font-weight: bold; color: #0072c6; font-size: 1.3em; border-radius: 7px; border: 2px solid #0072c6;"><a href="/sites/Npdu" style="color: #0072c6; font-size: 14pt;">מעבר ללוח אירועים ומשימות​​</a></span><div>`;
    txt += `<div class="choiceDiv">` +
        `<input type="radio" name="viewChoice" id="byUser"   value="byUser"   onclick="toggleView();" checked>` +
        `<label for="byUser">לפי מבצע</label>` +
        `<input type="radio" name="viewChoice" id="byBranch" value="byBranch" onclick="toggleView();">` +
        `<label for="byBranch">לפי זירה</label>` +
        `</div>`;
    txt += `<div class="filter"><input class="mytaskcheckbox" type="checkbox" onclick="toggleVisibility(this);" id="alltasks" name="alltasks" ><label class="mytasklabel" for="alltasks">הצג משימות שלי</label></div>`;
    //txt += `<div id="divMilestones"></div>`;//const response = txt;
    //txt += `<script type="text/javascript" src="/_catalogs/masterpage/Click/js/npdu/milestonejs.js"></script>`
    return txt;
}

//function includeJs(jsFilePath) {
//    var js = document.createElement("script");
//
//    js.type = "text/javascript";
//    js.src = jsFilePath;
//
//    document.body.appendChild(js);
//}

const activatecall = async () => {
    var myTasksElement = document.getElementById("HeaderDiv");

    myTasksElement.innerHTML = await headerdiv();
    //includeJs("/_catalogs/masterpage/Click/js/npdu/milestonejs.js");

    var myTasksElement = document.getElementById("TasksDiv");
    var myTasksByBranchElement = document.getElementById("TasksByBranchDiv");
    toggleView();
    //myTasksElement.setAttribute("expandarrow",'▼');
    //var myTasksText = '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<table style="">';
    //myTasksText += '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >תאריך יעד</th></tr>';
    //const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, `$filter=Author eq ${userId} and FSObjType eq 0&$orderby=Created desc`, null, null, null);
    const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);

    /////////////////////////////////////////////////////////////////////////////////////////
    // Collect Tasks from branches
    /////////////////////////////////////////////////////////////////////////////////////////

    var tasksSet = new Set();
    var userSet = new Set();

    if (zirots.value.length > 0) {

        z_object.GlobalVariables.myzirots = zirots.value
        for (const zirot of z_object.GlobalVariables.myzirots) {
            //const requestUri = buildRequestUrl("משימות " + zirot.Title, "", null, null, null, null, null);
            const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo2/Id,AssignedTo2/FirstName,AssignedTo2/LastName,EventTitle,FolderID,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo,AssignedTo2`, null, null);
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
                        taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                        //if (task.AssignedTo2 != null) { taskItem.AssignedToName += `<br/>(${task.AssignedTo2.FirstName} ${task.AssignedTo2.LastName})` };
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
                    taskItem.SecondaryId = new Set();
                    if (task.AssignedTo2 != null) {

                        taskItem.Secondary = ``;
                        //var SecondaryOwners = new Set();
                        //taskItem.SecondaryId = new Set();
                        for (const secondaryOwner of task.AssignedTo2){
                            if (taskItem.Secondary != ``){taskItem.Secondary += `</br>`;}
                            taskItem.Secondary += `${secondaryOwner.FirstName} ${secondaryOwner.LastName}`;
                            taskItem.SecondaryId.add(secondaryOwner.Id);
                        }
                        //taskItem.Secondary = `${task.AssignedTo2.FirstName} ${task.AssignedTo2.LastName}`;
                        //taskItem.SecondaryId = task.AssignedTo2.Id
                    }
                    //if (!userSet.has(task.AssignedTo.Id)) {
                    //    userSet.add(task.AssignedTo.Id);
                    //}


                    //taskItem.AssignedTo = task.AssignedTo.Id;
                    //taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`
                    taskItem.Type = 'branchTask';
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
    /////////////////////////////////////////////////////////////////////////////////////////
    // Collect departmental tasks
    /////////////////////////////////////////////////////////////////////////////////////////

    //load tasks from departmental task list too....
    const centralrequestUri = buildRequestUrl(`משימות מטה רוחביות`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo2/Id,AssignedTo2/FirstName,AssignedTo2/LastName,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo,AssignedTo2`, null, null);
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
                taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                //if (task.AssignedTo2 != null) { taskItem.AssignedToName += `<br/>(${task.AssignedTo2.FirstName} ${task.AssignedTo2.LastName})` };
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
            taskItem.SecondaryId = new Set();
            if (task.AssignedTo2 != null) {
                taskItem.Secondary = ``;
                //taskItem.SecondaryId = new Set();
                for (const secondaryOwner of task.AssignedTo2){
                    if (taskItem.Secondary != ``){taskItem.Secondary += `</br>`;}
                    taskItem.Secondary += `${secondaryOwner.FirstName} ${secondaryOwner.LastName}`;
                    taskItem.SecondaryId.add(secondaryOwner.Id);
                }
                //taskItem.Secondary = `${task.AssignedTo2.FirstName} ${task.AssignedTo2.LastName}`; 
                //taskItem.SecondaryId = task.AssignedTo2.Id 
            }
            //if (!userSet.has(task.AssignedTo)) {
            //    userSet.add(task.AssignedTo.Id);
            //}


            //taskItem.AssignedTo = task.AssignedTo.Id;
            //taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`
            //taskItem.EventTitle = task.EventTitle;
            //taskItem.FolderID = task.FolderID;
            taskItem.Type = 'deptTask';
            taskItem.branch = `מטה`;
            taskItem.bg = 'b2b2b2';
            //taskItem.bg = zirot.EventColor;
            taskItem.divNo = '0';
            taskItem.Title = task.Title;
            taskItem.Id = task.Id;
            taskItem.DueDate = task.DueDate;

            tasksSet.add(taskItem);

        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Collect milestones
    /////////////////////////////////////////////////////////////////////////////////////////
    const todaysDate = new Date();
    const todaysDateIso = todaysDate.toISOString();

    const milestonesQuery = buildRequestUrl(`אבני דרך`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,Id,Expires,OData__x05d6__x05d9__x05e8__x05d4_/divNo,OData__x05d6__x05d9__x05e8__x05d4_/TaskColor,OData__x05d6__x05d9__x05e8__x05d4_/Title`, `&$filter=Expires ge datetime'${todaysDateIso}'`, `&$expand=AssignedTo,OData__x05d6__x05d9__x05e8__x05d4_`, null, null);
    //const milestonesQuery = buildRequestUrl(`אבני דרך`, "", `$select=*`, null, null, null, null);
    const milestonetasks = await getData(milestonesQuery);
    if (milestonetasks.value.length > 0) {
        for (const milestone of milestonetasks.value) {
            
            const milestoneItem = new Object();
            
            if (milestone.hasOwnProperty('OData__x05d6__x05d9__x05e8__x05d4_')){

                const branchObj = milestone.OData__x05d6__x05d9__x05e8__x05d4_;
                
                milestoneItem.branch = branchObj.Title;
                milestoneItem.bg = branchObj.TaskColor;
                milestoneItem.divNo = branchObj.divNo //'זירה/divNo';
            } else {
                milestoneItem.branch = `מטה`;
                milestoneItem.bg = `b2b2b2`;
                milestoneItem.divNo = `0`; //'זירה/divNo';

            }
            milestoneItem.AssignedToName = `${milestone.AssignedTo.FirstName} ${milestone.AssignedTo.LastName}`;
            milestoneItem.Type = 'milestone';
            milestoneItem.Title = milestone.Title;
            milestoneItem.Id = milestone.Id;
            milestoneItem.DueDate = milestone.Expires;
            milestoneItem.AssignedTo = milestone.AssignedTo.Id;
            milestoneItem.SecondaryId = new Set();
            //.SecondaryId


            tasksSet.add(milestoneItem);
        }

    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Display milestones
    /////////////////////////////////////////////////////////////////////////////////////////

    //if (tasksSet.size > 0) {
    //    
    //}


    

    if (tasksSet.size > 0) {


        const sortedTasksSet = Array.from(tasksSet).sort((a, b) => {
            let da = new Date(a.DueDate),
                db = new Date(b.DueDate);
            return da - db;

        });//a.DueDate - b.DueDate);
        tasksSet = new Set(sortedTasksSet);

        //var myTasksText = '<div class="wptitle">משימות לפי מבצע</div>';
        var myTasksText = "";

        /////////////////////////////////////////////////////////////////////////////////////////
        // Display tasks by OWNER
        /////////////////////////////////////////////////////////////////////////////////////////


        // START NEW GRID BASED CODE

        //myTasksText += `START NEW CODE`;

        myTasksText += `<div class="byownercontainer">`;
        for (const usr of userSet) {


            myTasksText += `<br/><div class="byowner_header" id="user_${usr.Id}" onclick="toggleGridItems(this);">${usr.Name}</div>`;
            myTasksText += `<div class="columnheader"></div>` +
                `<div class="columnheader">מבצע משני</div>` +
                `<div class="columnheader">שם משימה</div>` +
                `<div class="columnheader"></div>` +
                `<div class="columnheader">אירוע</div>` +
                `<div class="columnheader">תאריך יעד</div>`;
            for (const tsk of tasksSet) {
                if (tsk.AssignedTo == usr.Id) {

                    var containsusertasks = ` nousertasks`;
                    if ((_spPageContextInfo.userId == usr.Id)) {
                        containsusertasks = ` withusertasks`;
                    }
                    var second = "";
                    if (tsk.Secondary != undefined) { second += `${tsk.Secondary}` }

                    var eventcell = "";
                    var pluslink = "";

                    if (null != tsk.EventTitle) {
                        pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${tsk.divNo}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`;
                        eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
                    }

                    var compdate = new Date(tsk.DueDate);
                    var byowner_duedate = "לא צוין";
                    var byowner_datecolor = `black`;
                    var tdy = new Date();
                    if (compdate < tdy) { byowner_datecolor = `red`; };
                    if (tsk.DueDate != null) { byowner_duedate = compdate.toLocaleDateString("en-GB"); }

                    var taskDir = "";
                    if (tsk.divNo != "0") { taskDir = `_Div${tsk.divNo}` }
                    var listURL = `Tasks${taskDir}`;


                    var isMilestone = ``; var milestoneClass = ``;
                    if (tsk.Type == "milestone"){isMilestone = `<span class="milestonemarker">אבן דרך ל${tsk.branch}: </span>`; milestoneClass = ` milestoneCell`;listURL = "Milestones"}

                    
                    if (tsk.Type == "milestone") {eventlink = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">`}

                    myTasksText += `<div class="byowner_branch${containsusertasks}${milestoneClass}" style="background-color:#${tsk.bg};background-image:url('../images/div0${tsk.divNo}_bg.png')">${tsk.branch}</div>` +
                        `<div class="defaultgriditem byowner_owner2${containsusertasks}${milestoneClass}">${second}</div>` +
                        `<div class="defaultgriditem byowner_task${containsusertasks}${milestoneClass}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${isMilestone}${tsk.Title}</a></div>` +
                        `<div class="defaultgriditem byowner_newevent${containsusertasks}${milestoneClass}">${pluslink}</div>` +
                        `<div class="defaultgriditem byowner_event${containsusertasks}${milestoneClass}">${eventcell}</div>` +
                        `<div class="defaultgriditem byowner_duedate${containsusertasks}${milestoneClass}" style="color:${byowner_datecolor}">${byowner_duedate}</div>`;
                }
            }
        }
        myTasksText += `</div>`; //end of class byownercontainer

        //myTasksText += `END OF NEW CODE`;

        // END GRID BASED CODE

        //#region oldcode
        ////OLD CODE BY OWNER
        //        for (const usr of userSet) {
        //
        //            var containsusertasks = ` class="nousertasks"`;
        //
        //            if ((_spPageContextInfo.userId == usr.Id)) {
        //                containsusertasks = ` class="withusertasks"`;
        //            }
        //
        //            myTasksText += `<div class="userheader" id="user_${usr.Id}" onclick="toggleItems(this);">${usr.Name}</div>`;
        //            myTasksText += `<div id="tasks_${usr.Id}"${containsusertasks}><table>`;
        //
        //            myTasksText += '<tr><th></th><th class="jobheadercell">מבצע משני</th><th class="jobheadercell" >שם משימה</th><th class="jobheadercell" ></th><th class="jobheadercell" >אירוע</th><th class="jobheadercell" >תאריך יעד</th></tr>';
        //            for (const tsk of tasksSet) {
        //                var eventcell = "";
        //                var pluslink = "";
        //
        //                if (null != tsk.EventTitle) {
        //                    eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
        //                    pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${tsk.divNo}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`
        //                }
        //                var second = "";
        //                if (tsk.Secondary != undefined) { second += `${tsk.Secondary}` }
        //                if (tsk.AssignedTo == usr.Id) {
        //
        //                    var compdate = new Date(tsk.DueDate);
        //                    var datestyle = "";
        //                    var tdy = new Date();
        //                    if (compdate < tdy) { datestyle = ` style="color:red"` };
        //
        //                    myTasksText += `<tr>`;
        //                    myTasksText += `<td class="jobcell" id="firstcell" style="border-radius:7px; white-space:nowrap; background-color:#${tsk.bg};background-image: url('../images/div0${tsk.divNo}_bg.png')">${tsk.branch}</td>`
        //                    myTasksText += `<td class="jobcell">${second}</td>`;
        //                    myTasksText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks_Div${tsk.divNo}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></td>`;
        //                    //new
        //                    myTasksText += `<td class="jobcell">${pluslink}</td>`;
        //
        //                    myTasksText += `<td class="jobcell">${eventcell}</td>`;
        //                    myTasksText += `<td class="jobcell"${datestyle}>`;
        //
        //                    //var compdate = new Date(tsk.DueDate);
        //                    //var datestyle = "";
        //
        //
        //                    var ddate = compdate.toLocaleDateString("en-GB");
        //                    if (tsk.DueDate != null) {
        //                        myTasksText += `${ddate}`;
        //                    } else {
        //                        myTasksText += "לא צוין";
        //                    }
        //                    myTasksText += `</td>`;
        //
        //                    myTasksText += `</tr>`;
        //                }
        //
        //            }//href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=' + oListItem.get_item('ID') + '&callback=' + window.location + '"
        //            myTasksText += '</table></div>';
        //
        //        }
        //
        //#endregion
        myTasksElement.innerHTML = myTasksText;
        //        //var myTasksByBranchText = '<div class="wptitle">משימות לפי זירה</div>';
        //


        /////////////////////////////////////////////////////////////////////////////////////////
        // Display tasks by BRANCH
        /////////////////////////////////////////////////////////////////////////////////////////

        var myTasksByBranchText = "";

        // START NEW GRID BASED CODE

        //myTasksByBranchText += `START NEW CODE`;

        myTasksByBranchText += `<div class="bybranchcontainer">`;

        //departmental tasks
        //branch title header with colapse link
        myTasksByBranchText += `<div class="bybranch_header" style="background-color:#b2b2b2" id="user_0" onclick="toggleGridItems(this);">&nbsp;<img src="../images/div00_bg.png" style="height:30px" title="משימות מטה">&nbsp;&nbsp;משימות מטה<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;
        //title column headers
        myTasksByBranchText += `<div class="columnheader">שם מבצע</div>` +
            `<div class="columnheader">מבצע משני</div>` +
            `<div class="columnheader">שם משימה</div>` +
            `<div class="columnheader"></div>` +
            `<div class="columnheader">אירוע</div>` +
            `<div class="columnheader">תאריך יעד</div>`;
        for (const tsk of tasksSet) {
            //departmental tasks
            if (tsk.branch == `מטה`) {

                var containsusertasks = ` nousertasks`;
                //if ((_spPageContextInfo.userId == tsk.AssignedTo) || (_spPageContextInfo.userId == tsk.SecondaryId)) {
                if ((_spPageContextInfo.userId == tsk.AssignedTo) || (tsk.SecondaryId.has(_spPageContextInfo.userId))) {
                    containsusertasks = ` withusertasks`;
                }

                var seconduser = "";
                if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }

                var datecolor = `black`;
                var compdate = new Date(tsk.DueDate);
                var tdy = new Date();
                if (compdate < tdy) { datecolor = `red` };
                var ddate = compdate.toLocaleDateString("en-GB");
                var displaydate = "לא צוין";
                if (tsk.DueDate != null) { displaydate = ddate }
                var listURL = `Tasks`;
                var isMilestone = ``; var milestoneClass = ``;
                if (tsk.Type == "milestone"){isMilestone = `<span class="milestonemarker">אבן דרך ל${tsk.branch}: </span>`; milestoneClass = ` milestoneCell`;listURL = `Milestones`;}

                myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks}${milestoneClass}">${tsk.AssignedToName}</div>` +
                    `<div class="defaultgriditem bybranch_owner2${containsusertasks}${milestoneClass}">${seconduser}</div>` +
                    `<div class="defaultgriditem bybranch_task${containsusertasks}${milestoneClass}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${isMilestone}${tsk.Title}</a></div>` +
                    `<div class="defaultgriditem bybranch_newevent${containsusertasks}${milestoneClass}"></div>` +
                    `<div class="defaultgriditem bybranch_event${containsusertasks}${milestoneClass}"></div>` +
                    `<div class="defaultgriditem bybranch_duedate${containsusertasks}${milestoneClass}" style="color:${datecolor}">${displaydate}</div>`;
            }
        }
        //branch tasks
        if (zirots.value.length > 0) {
            for (const branch of zirots.value) {
                //branch title header with colapse link
                //myTasksByBranchText += `<div class="bybranch_header" onclick="toggleItems(this);"></div>`;
                myTasksByBranchText += `<div class="bybranch_header" style="background-color:#${branch.TaskColor}" onclick="toggleGridItems(this);">&nbsp;<img src="../images/div0${branch.divNo}_bg.png" style="height:30px" title="משימות ${branch.Title}">&nbsp;&nbsp;משימות ${branch.Title}<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;

                //title column headers
                myTasksByBranchText += `<div class="columnheader">שם מבצע</div>` +
                    `<div class="columnheader">מבצע משני</div>` +
                    `<div class="columnheader">שם משימה</div>` +
                    `<div class="columnheader"></div>` +
                    `<div class="columnheader">אירוע</div>` +
                    `<div class="columnheader">תאריך יעד</div>`;

                for (const tsk of tasksSet) {
                    if (tsk.branch == branch.Title) {
                        //task line with ${containsusertasks} applied
                        var containsusertasks = ` nousertasks`;
                        //if ((_spPageContextInfo.userId == tsk.AssignedTo) || (_spPageContextInfo.userId == tsk.SecondaryId)) {
                        if ((_spPageContextInfo.userId == tsk.AssignedTo) || (tsk.SecondaryId.has(_spPageContextInfo.userId))) {
                            containsusertasks = ` withusertasks`;
                        }
                        var seconduser = "";
                        if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }

                        var eventcell = "";
                        var pluslink = "";
                        //if (null != tsk.EventTitle) { eventcell = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>&nbsp;<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`}
                        if (null != tsk.EventTitle) {
                            pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`;
                            eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
                        }

                        var compdate = new Date(tsk.DueDate);
                        var datecolor = `black`;
                        var datetext = "לא צוין";
                        var tdy = new Date();
                        if (compdate < tdy) { datecolor = `red` };
                        
                        if (tsk.DueDate != null) {
                            datetext = compdate.toLocaleDateString("en-GB");;
                        }

                        var taskDir = "";
                        if (tsk.divNo != "0") { taskDir = `_Div${tsk.divNo}` }
                        var listURL = `Tasks${taskDir}`;

                        var isMilestone = ``; var milestoneClass = ``;
                        if (tsk.Type == "milestone"){isMilestone = `<span class="milestonemarker">אבן דרך: </span>`; milestoneClass = ` milestoneCell`;listURL = "Milestones"}

                        myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks}${milestoneClass}">${tsk.AssignedToName}</div>` +
                            `<div class="defaultgriditem bybranch_owner2${containsusertasks}${milestoneClass}">${seconduser}</div>` +
                            `<div class="defaultgriditem bybranch_task${containsusertasks}${milestoneClass}"><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${isMilestone}${tsk.Title}</a></div>` +
                            `<div class="defaultgriditem bybranch_newevent${containsusertasks}${milestoneClass}">${pluslink}</div>` +
                            `<div class="defaultgriditem bybranch_event${containsusertasks}${milestoneClass}">${eventcell}</div>` +
                            `<div class="defaultgriditem bybranch_duedate${containsusertasks}${milestoneClass}" style="color:${datecolor}">${datetext}</div>`;

                    }
                }

            }
        }


        myTasksByBranchText += `</div>` //end of bybranchcontainer

        //myTasksByBranchText += `END OF NEW CODE`;
        // END GRID BASED CODE



//#region oldcode
//        myTasksByBranchText += `<div class="userheader" id="user_0" style="background-color:#b2b2b2" onclick="toggleItems(this);">&nbsp;<img src="../images/div00_bg.png" style="height:30px" title="משימות מטה">&nbsp;&nbsp;משימות מטה<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;
//
//        var containsusertasks = ` class="nousertasks"`;
//        for (const tsk of tasksSet) {
//            if (((_spPageContextInfo.userId == tsk.AssignedTo) || (_spPageContextInfo.userId == tsk.SecondaryId)) && (tsk.branch == `​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​מטה`)) {
//                containsusertasks = ` class="withusertasks"`;
//            }
//        }
//
//
//        myTasksByBranchText += `<div id="tasks_0"><table${containsusertasks}>`;
//        myTasksByBranchText += '<tr><th style="white-space:nowrap;padding:0px 10px">שם מבצע</th><th style="white-space:nowrap;padding:0px 10px">מבצע משני</th><th class="jobheadercell" width="99%">שם משימה</th><th class="jobheadercell" ></th><th class="jobheadercell" >תאריך יעד</th></tr>';
//        for (const tsk of tasksSet) {
//            //departmental tasks
//
//            if (tsk.branch == `​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​מטה`) {
//                var compdate = new Date(tsk.DueDate);
//                var datestyle = "";
//                var tdy = new Date();
//                if (compdate < tdy) { datestyle = ` style="color:red"` };
//                var rowclass = "taskrow";
//                if (_spPageContextInfo.userId == tsk.AssignedTo) {
//                    rowclass = `usertaskrow`;
//                }
//                var seconduser = "";
//                if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }
//                myTasksByBranchText += `<tr class="${rowclass}">`;
//                myTasksByBranchText += `<td class="jobcell" style="white-space:nowrap;">${tsk.AssignedToName}</td>`
//                myTasksByBranchText += `<td class="jobcell">${seconduser}</td>`;
//                myTasksByBranchText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></td>`;
//                myTasksByBranchText += `<td class="jobcell"></td>`;
//                myTasksByBranchText += `<td class="jobcell"${datestyle}>`;
//
//                //var compdate = new Date(tsk.DueDate);
//                //var datestyle = "";
//
//
//                var ddate = compdate.toLocaleDateString("en-GB");
//                if (tsk.DueDate != null) {
//                    myTasksByBranchText += `${ddate}`;
//                } else {
//                    myTasksByBranchText += "לא צוין";
//                }
//                myTasksByBranchText += `</td>`;
//
//                myTasksByBranchText += `</tr>`;
//
//            }
//
//
//        }
//        myTasksByBranchText += '</table></div>';
//        if (zirots.value.length > 0) {
//            for (const branch of zirots.value) {
//                myTasksByBranchText += `<div class="userheader" id="user_${branch.Id}" style="background-color:#${branch.TaskColor}" onclick="toggleItems(this);">&nbsp;<img src="../images/div0${branch.Id}_bg.png" style="height:30px" title="${branch.Title}">&nbsp;&nbsp;${branch.Title}<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;
//
//
//                var containsusertasks = ` class="nousertasks"`;
//                for (const tsk of tasksSet) {
//                    if (((_spPageContextInfo.userId == tsk.AssignedTo) || (_spPageContextInfo.userId == tsk.SecondaryId)) && (tsk.branch == branch.Title)) {
//                        containsusertasks = ` class="withusertasks"`;
//                    }
//                }
//
//                myTasksByBranchText += `<div id="tasks_${branch.Id}"><table${containsusertasks}>`;
//                myTasksByBranchText += '<tr><th style="white-space:nowrap;padding:0px 10px">שם מבצע</th><th style="white-space:nowrap;padding:0px 10px">מבצע משני</th><th class="jobheadercell" width="99%">שם משימה</th><th class="jobheadercell" ></th><th class="jobheadercell" >אירוע</th><th class="jobheadercell" >תאריך יעד</th></tr>';
//                for (const tsk of tasksSet) {
//                    var eventcell = "";
//                    var pluslink = "";
//                    //if (null != tsk.EventTitle) { eventcell = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>&nbsp;<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`}
//                    if (null != tsk.EventTitle) { 
//                        eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
//                        pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>` }
//
//                    if (tsk.branch == branch.Title) {
//                        var compdate = new Date(tsk.DueDate);
//                        var datestyle = "";
//                        var tdy = new Date();
//                        if (compdate < tdy) { datestyle = ` style="color:red"` };
//
//                        var rowclass = "taskrow";
//                        if ((_spPageContextInfo.userId == tsk.AssignedTo) || (_spPageContextInfo.userId == tsk.SecondaryId)) {
//                            rowclass = `usertaskrow`;
//                        }
//                        var seconduser = "";
//                        if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }
//                        myTasksByBranchText += `<tr class="${rowclass}">`;
//                        myTasksByBranchText += `<td class="jobcell" style="white-space:nowrap;">${tsk.AssignedToName}</td>`
//                        myTasksByBranchText += `<td class="jobcell">${seconduser}</td>`;
//                        myTasksByBranchText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks_Div${tsk.divNo}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></td>`;
//                        myTasksByBranchText += `<td class="jobcell">${pluslink}</td>`;
//                        myTasksByBranchText += `<td class="jobcell">${eventcell}</td>`;
//                        myTasksByBranchText += `<td class="jobcell"${datestyle}>`;
//
//                        //var compdate = new Date(tsk.DueDate);
//                        //var datestyle = "";
//
//
//                        var ddate = compdate.toLocaleDateString("en-GB");
//                        if (tsk.DueDate != null) {
//                            myTasksByBranchText += `${ddate}`;
//                        } else {
//                            myTasksByBranchText += "לא צוין";
//                        }
//                        myTasksByBranchText += `</td>`;
//
//                        myTasksByBranchText += `</tr>`;
//                    }
//
//
//
//                }
//                myTasksByBranchText += '</table></div>';
//                // department tasks
//
//            }
//        }

//#endregion

        myTasksByBranchElement.innerHTML = myTasksByBranchText;
        //myTasksByBranchElement.nextSibling();
        //myTasksElement.hidden = true;
    }



    //myTasksText += '</table>';

    //myTasksElement.innerHTML = myTasksText;

}

function toggleItems(sender) {
    var usr = sender.id.split("_")[1];
    //Attr("expandarrow",'\140A'); ///* "'\140A';  /*left arrow. down is \1401*/")

    //const targettable = document.getElementById(`tasks_${usr}`);
    const targettable = sender.nextSibling;
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

function toggleGridItems(sender) {

    var targetitem = sender.nextSibling;
    var targetclass = targetitem.attributes.class.nodeValue;
    var shown = !(targetitem.hidden);
    var mytasksonly = document.getElementById("alltasks").checked;

    while ((targetitem.className != "byowner_header") && (targetitem.className != "bybranch_header")) {

        if (shown){
            targetitem.hidden = true;
            
        } else {
            var targetclass = targetitem.attributes.class.nodeValue;
            if (targetclass.search("columnheader") != -1){ targetitem.hidden = false; }
            if (mytasksonly && (targetclass.search("withusertasks") != -1)) {targetitem.hidden = false;}
            if (!mytasksonly) {targetitem.hidden = false;}
        }
        targetitem = targetitem.nextSibling;
//---------------------
        //if (mytasksonly) {
        //    if ( targetclass.search("withusertasks") != -1 ) {
        //        targetitem.hidden = !(targetitem.hidden);
        //    }
        //} else{
//
        //targetitem.hidden = !(targetitem.hidden);
        //
        //}
        //targetitem = targetitem.nextSibling;
        //targetclass = targetitem.attributes.class.nodeValue;
    }

}


function toggleVisibility(eventsender) {

    var tasktables = document.getElementsByClassName("nousertasks");
    var tablevisibility = true;
    for (const tbl of tasktables) {
        if (eventsender.checked === false) {
            tablevisibility = false;
        }
        tbl.hidden = tablevisibility;
    }

    var deptTasksRows = document.getElementsByClassName("taskrow");

    var rowvisibility = true;
    for (const row of deptTasksRows) {
        if (eventsender.checked === false) {

            rowvisibility = false;
        }

        row.hidden = rowvisibility;
    }

}

function toggleView() {
    //alert("Toggle");
    var myTasksElement = document.getElementById("TasksDiv");
    var myTasksByBranchElement = document.getElementById("TasksByBranchDiv");
    var byuserradio = document.getElementById("byUser");
    var bybranchradio = document.getElementById("byBranch");

    if (byuserradio.checked == true) {
        //myTasksElement.style.display = "block"; myTasksByBranchElement.style.display = "none";
        myTasksElement.hidden = false;
        myTasksByBranchElement.hidden = true;
    }
    if (bybranchradio.checked == true) {
        //myTasksElement.style.display = "none"; myTasksByBranchElement.style.display = "block";
        myTasksElement.hidden = true;
        myTasksByBranchElement.hidden = false;
    }

    //var myTasksElement = document.getElementById("TasksDiv");
    //var myTasksByBranchElement = document.getElementById("TasksByBranchDiv");
    //if (sender.id = "byUser") { myTasksElement.style.display = "block"; myTasksByBranchElement.style.display = "none"; }
    //if (sender.id = "byBranch") { myTasksElement.style.display = "none"; myTasksByBranchElement.style.display = "block"; }
}

window.addEventListener("load", function () {

    activatecall();


})


