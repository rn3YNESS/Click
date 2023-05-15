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

    return txt;
}

const countMilestones = (taskArray, userID) => {
    var cnt = 0;
    for (const tsk of taskArray){
        if ((tsk.Type == "milestone") && (userID == usr.Id)) {cnt += 1;}
    }
    return cnt;
}

const filterSetByUser = (itemSet, userID) => {
    var resultSet = new Set();
    for (const itm of itemSet){
        if (itm.AssignedTo == userID) {
            resultSet.add(itm);
        }
    }
    return resultSet;
}

const filterSetByBranch = (itemSet, branchID) => {
    var resultSet = new Set();
    for (const itm of itemSet){
        if (itm.divNo == branchID) {
            resultSet.add(itm);
        }
    }
    return resultSet;
}

const containsCurrentUserItems = (itemSet) => {
    var result = false;
    for (const itm of itemSet){
        if ((itm.Type == "deptTask") || (itm.Type == 'branchTask')) {
            if (itm.AssignedTo == _spPageContextInfo.userId) {
                result = true;
            }
            for (const sec of itm.SecondaryId){ 
                if (sec.value == _spPageContextInfo.userId) {
                     result = true;
                }
            }
        }
        if (itm.Type == "milestone") {
            if (itm.AssignedTo == _spPageContextInfo.userId) {
                result = true; 
            }
        }
    }
    return result;
}

const activatecall = async () => {
    var myTasksElement = document.getElementById("HeaderDiv");

    myTasksElement.innerHTML = await headerdiv();


    var myTasksElement = document.getElementById("TasksDiv");
    var myTasksByBranchElement = document.getElementById("TasksByBranchDiv");
    toggleView();
    
    const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);

    /////////////////////////////////////////////////////////////////////////////////////////
    // Collect Tasks from branches
    /////////////////////////////////////////////////////////////////////////////////////////

    var tasksSet = new Set();
    var milestoneSet = new Set();
    var userSet = new Set();

    if (zirots.value.length > 0) {

        z_object.GlobalVariables.myzirots = zirots.value
        for (const zirot of z_object.GlobalVariables.myzirots) {

            const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo2/Id,AssignedTo2/FirstName,AssignedTo2/LastName,EventTitle,FolderID,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo,AssignedTo2`, null, null);
            //const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo2/Id,AssignedTo2/LastName,EventTitle,FolderID,Id,DueDate`, `&$filter=Status ne 'הושלם'`, `&$expand=AssignedTo,AssignedTo2`, null, null);
            



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

                        taskItem.AssignedTo = usrItem.Id;
                        taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                        
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

                        for (const secondaryOwner of task.AssignedTo2){
                            if (taskItem.Secondary != ``){taskItem.Secondary += `</br>`;}
                            taskItem.Secondary += `${secondaryOwner.FirstName} ${secondaryOwner.LastName}`;
                            taskItem.SecondaryId.add(secondaryOwner.Id);
                        }

                    }

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

                taskItem.AssignedTo = usrItem.Id;
                taskItem.AssignedToName = `${task.AssignedTo.FirstName} ${task.AssignedTo.LastName}`;
                
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

            }

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


            milestoneSet.add(milestoneItem);
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
        // Display tasks & milestones by OWNER
        /////////////////////////////////////////////////////////////////////////////////////////


        // START NEW GRID BASED CODE

        //myTasksText += `START NEW CODE`;

        myTasksText += `<div class="byownercontainer">`;
        for (const usr of userSet) {


            myTasksText += `<br/><div class="byowner_header" id="user_${usr.Id}" onclick="toggleGridItems(this);">${usr.Name}</div>`;

            var containsusertasks = ` nousertasks`;
            if (containsCurrentUserItems(filterSetByUser(tasksSet,usr.Id))){containsusertasks = ` withusertasks`;}

            myTasksText += `<div class="columnheader ${containsusertasks}"></div>` +
                `<div class="columnheader ${containsusertasks}">מבצע משני</div>` +
                `<div class="columnheader ${containsusertasks}">שם משימה</div>` +
                `<div class="columnheader ${containsusertasks}"></div>` +
                `<div class="columnheader ${containsusertasks}">אירוע</div>` +
                `<div class="columnheader ${containsusertasks}">תאריך יעד</div>`;
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


                    //var isMilestone = ``; var milestoneClass = ``;
                    //if (tsk.Type == "milestone") {isMilestone = `<span class="milestonemarker">אבן דרך ל${tsk.branch}: </span>`; milestoneClass = ` milestoneCell`;listURL = "Milestones"}

                    
                    //if (tsk.Type == "milestone") {eventlink = `<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">`}

                    myTasksText += `<div class="byowner_branch${containsusertasks}" style="background-color:#${tsk.bg};background-image:url('../images/div0${tsk.divNo}_bg.png')">${tsk.branch}</div>` +
                        `<div class="defaultgriditem byowner_owner2${containsusertasks}">${second}</div>` +
                        `<div class="defaultgriditem byowner_task${containsusertasks}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                        `<div class="defaultgriditem byowner_newevent${containsusertasks}">${pluslink}</div>` +
                        `<div class="defaultgriditem byowner_event${containsusertasks}">${eventcell}</div>` +
                        `<div class="defaultgriditem byowner_duedate${containsusertasks}" style="color:${byowner_datecolor}">${byowner_duedate}</div>`;
                }


            }


            var userMilestones = new Set(filterSetByUser(milestoneSet, usr.Id));
            
            if (userMilestones.size != 0) {
                var containsusertasks = ` nousertasks`;
                if ((_spPageContextInfo.userId == usr.Id)) {
                    containsusertasks = ` withusertasks`;
                }
                
                myTasksText += `<div class="milestone_byowner_header ${containsusertasks}">אבני דרך</div>`
                //milestone header
                for (const milestone of userMilestones) {
                    //milestone item
                    containsusertasks = ` nousertasks`;
                    if ((_spPageContextInfo.userId == usr.Id)) {
                        containsusertasks = ` withusertasks`;
                    }
                    var dueDate = new Date(milestone.DueDate);
                    var dueDateFormatted = dueDate.toLocaleDateString("en-GB");
                    myTasksText += `<div class="byowner_branch${containsusertasks}" style="background-color:#${milestone.bg};background-image:url('../images/div0${milestone.divNo}_bg.png')">${milestone.branch}</div>` +
                        `<div class="defaultgriditem byowner_milestone_title${containsusertasks}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=${milestone.Id}&callback=${window.location}">${milestone.Title}</a></div>` +
                        `<div class="defaultgriditem byowner_duedate ${containsusertasks}">${dueDateFormatted}</div>`;


                }
            }
            //if (countMilestones(milestoneSet, usr.Id) != 0){
            //    // add milestones
            //}

        }
        myTasksText += `</div>`; //end of class byownercontainer

        //myTasksText += `END OF NEW CODE`;

        // END GRID BASED CODE


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
        /////////////////////////////////////////////////////////////
        //departmental tasks
        /////////////////////////////////////////////////////////////
        //branch title header with colapse link
        myTasksByBranchText += `<div class="bybranch_header" style="background-color:#b2b2b2" id="user_0" onclick="toggleGridItems(this);">&nbsp;<img src="../images/div00_bg.png" style="height:30px" title="משימות מטה">&nbsp;&nbsp;משימות מטה<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;
        
        // check if user tasks in following table
//filterSetByBranch(tasksSet, `0`)
        var containsusertasks = ` nousertasks`;
        if (containsCurrentUserItems(filterSetByBranch(tasksSet, `0`))){containsusertasks = ` withusertasks`;}
        
        //title column headers
        myTasksByBranchText += `<div class="columnheader${containsusertasks}">שם מבצע</div>` +
            `<div class="columnheader${containsusertasks}">מבצע משני</div>` +
            `<div class="columnheader${containsusertasks}">שם משימה</div>` +
            `<div class="columnheader${containsusertasks}"></div>` +
            `<div class="columnheader${containsusertasks}">אירוע</div>` +
            `<div class="columnheader${containsusertasks}">תאריך יעד</div>`;

        for (const tsk of tasksSet) {
            //departmental tasks
            if (tsk.branch == `מטה`) {

                containsusertasks = ` nousertasks`;

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
                //var isMilestone = ``; var milestoneClass = ``;
                //if (tsk.Type == "milestone"){isMilestone = `<span class="milestonemarker">אבן דרך ל${tsk.branch}: </span>`; milestoneClass = ` milestoneCell`;listURL = `Milestones`;}

                myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks}">${tsk.AssignedToName}</div>` +
                    `<div class="defaultgriditem bybranch_owner2${containsusertasks}">${seconduser}</div>` +
                    `<div class="defaultgriditem bybranch_task${containsusertasks}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                    `<div class="defaultgriditem bybranch_newevent${containsusertasks}"></div>` +
                    `<div class="defaultgriditem bybranch_event${containsusertasks}"></div>` +
                    `<div class="defaultgriditem bybranch_duedate${containsusertasks}" style="color:${datecolor}">${displaydate}</div>`;
            }
        }

        var deptMilestones = new Set(filterSetByBranch(milestoneSet, 0));
        if (deptMilestones.size != 0) {
            var containsusertasks = ` nousertasks`;
           if (containsCurrentUserItems(deptMilestones)){containsusertasks = ` withusertasks`}
            myTasksByBranchText += `<div class="milestone_bybranch_header ${containsusertasks}">אבני דרך</div>`;
            //dept milestone header
            for (const milestone of deptMilestones){
                //milestone item
                containsusertasks = ` nousertasks`;
                if ((_spPageContextInfo.userId == milestone.AssignedTo)) {
                    containsusertasks = ` withusertasks`;
                }
                var dueDate = new Date(milestone.DueDate);
                var dueDateFormatted = dueDate.toLocaleDateString("en-GB");
                myTasksByBranchText += `<div class="defaultgriditem ${containsusertasks}" >${milestone.AssignedToName}</div><div class="defaultgriditem ${containsusertasks}"></div>` +
                                       `<div class="defaultgriditem bybranch_milestone_title${containsusertasks}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=${milestone.Id}&callback=${window.location}">${milestone.Title}</a></div>` +
                                       `<div class="defaultgriditem bybranch_duedate ${containsusertasks}">${dueDateFormatted}</div>`;
                
            }
        }


        /////////////////////////////////////////////////////////////
        //branch tasks
        /////////////////////////////////////////////////////////////
        if (zirots.value.length > 0) {
            for (const branch of zirots.value) {

                myTasksByBranchText += `<div class="bybranch_header" style="background-color:#${branch.TaskColor}" onclick="toggleGridItems(this);">&nbsp;<img src="../images/div0${branch.divNo}_bg.png" style="height:30px" title="משימות ${branch.Title}">&nbsp;&nbsp;משימות ${branch.Title}<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Tasks/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;

                var containsusertasks = ` nousertasks`;
                if (containsCurrentUserItems(filterSetByBranch(tasksSet, branch.Id))){containsusertasks = ` withusertasks`;}


                //title column headers
                myTasksByBranchText += `<div class="columnheader${containsusertasks}">שם מבצע</div>` +
                    `<div class="columnheader${containsusertasks}">מבצע משני</div>` +
                    `<div class="columnheader${containsusertasks}">שם משימה</div>` +
                    `<div class="columnheader${containsusertasks}"></div>` +
                    `<div class="columnheader${containsusertasks}">אירוע</div>` +
                    `<div class="columnheader${containsusertasks}">תאריך יעד</div>`;

                for (const tsk of tasksSet) {
                    if (tsk.branch == branch.Title) {
                        //task line with ${containsusertasks} applied
                        var containsusertasks = ` nousertasks`;

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

                        //var isMilestone = ``; var milestoneClass = ``;
                        //if (tsk.Type == "milestone"){isMilestone = `<span class="milestonemarker">אבן דרך: </span>`; milestoneClass = ` milestoneCell`;listURL = "Milestones"}

                        myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks}">${tsk.AssignedToName}</div>` +
                            `<div class="defaultgriditem bybranch_owner2${containsusertasks}">${seconduser}</div>` +
                            `<div class="defaultgriditem bybranch_task${containsusertasks}"><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/${listURL}/DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                            `<div class="defaultgriditem bybranch_newevent${containsusertasks}">${pluslink}</div>` +
                            `<div class="defaultgriditem bybranch_event${containsusertasks}">${eventcell}</div>` +
                            `<div class="defaultgriditem bybranch_duedate${containsusertasks}" style="color:${datecolor}">${datetext}</div>`;

                    }
                }
                var branchMilestones = new Set(filterSetByBranch(milestoneSet, branch.divNo));
                if (branchMilestones.size != 0) {

                    var containsusertasks = ` nousertasks`;
                    if (containsCurrentUserItems(branchMilestones)){containsusertasks = ` withusertasks`}

                    myTasksByBranchText += `<div class="milestone_bybranch_header ${containsusertasks}">אבני דרך</div>`;
                    //branch milestone header
                    for (const milestone of branchMilestones) {
                        //milestone item
                        containsusertasks = ` nousertasks`;
                        if ((_spPageContextInfo.userId == milestone.AssignedTo)) {
                            containsusertasks = ` withusertasks`;
                        }
                        var dueDate = new Date(milestone.DueDate);
                        var dueDateFormatted = dueDate.toLocaleDateString("en-GB");
                        myTasksByBranchText += `<div class="defaultgriditem ${containsusertasks}" >${milestone.AssignedToName}</div><div class="defaultgriditem ${containsusertasks}"></div>` +
                            `<div class="defaultgriditem bybranch_milestone_title${containsusertasks}"><a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=${milestone.Id}&callback=${window.location}">${milestone.Title}</a></div>` +
                            `<div class="defaultgriditem bybranch_duedate ${containsusertasks}">${dueDateFormatted}</div>`;

                    }
                }
            }


            

        }


        myTasksByBranchText += `</div>` //end of bybranchcontainer

        //myTasksByBranchText += `END OF NEW CODE`;
        // END GRID BASED CODE





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


