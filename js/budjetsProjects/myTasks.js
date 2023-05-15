const z_object = {

    GlobalVariables: {
        favArr: [], //Array of new zirots
        pointersArr: [],
        myzirots: [], //Array of existing zirot
        myzirotsRemoved: [],
        favContainer: { panel: 'zirots__personal', preview: 'formzirotsPreview' }
    },


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
    var txt = `<div class="titleDiv">משימות ​אגף תקציבים ופרויקטים</div>`;
    txt+=`<div id="OwnersHeader" style="text-align:center;"><span style="border: 2px solid #896fae;padding: 5px 30px; margin:10px;border-radius:25px;">מבצעים</span></div>`;
    txt+=`<div id="ProjectsHeader" style="text-align:center"><span style="border: 2px solid #368fb2;padding: 5px 30px;margin:10px;border-radius:25px;">פרוייקטים</span></div>`;
    txt+=`<div id="CalHeader" style="text-align:center"><span style="border: 2px solid #1072c2;padding: 5px 30px;margin:10px;border-radius:25px;">לוח שנה - משימות פעילות</span></div>`;
    txt += `<div class="choiceDiv">` +
        `<label for="byUser" class="container"><input type="radio" name="viewChoice" id="byUser"   value="byUser"   onclick="toggleView();" checked>` +
        `<span class="checkmark mark1" style="border:2px solid #896fae;"></span>`+
        `לפי מבצע</label>` +
        `<label for="byBranch" class="container"><input type="radio" name="viewChoice" id="byBranch" value="byBranch" onclick="toggleView();">` +
        `<span class="checkmark mark2" style="border:2px solid #368fb2;"></span>`+
        `לפי פרויקט</label>` +
        `<label for="calRadio" class="container"><input type="radio" name="viewChoice" id="calRadio" value="calRadio" onclick="toggleView();">` +
        `<span class="checkmark mark2" style="border:2px solid #1072c2;"></span>`+
        `לוח שנה - משימות פעילות</label>`+
       // `<!--span style="padding-right:10%;"><a href="/sites/BudgetsProjects/Lists/TaskList/taskcalendar.aspx">לוח שנה - משימות פעילות</a></span!-->`+
        //`<span style="position:absolute;left:30px;height: 35px; padding: 5px 30px; text-align: center; font-family: assistant; font-weight: bold; color: #0072c6; border-radius: 7px; border: 2px solid #0072c6;"><a href="/sites/BudgetsProjects/Lists/TaskList/taskcalendar.aspx" target="_blanc" style="color: #0072c6; font-size: 14pt;"> מעבר ללוח שנה של משימות פעילות​​</a></span>`+
        `</div>`;
    txt += `<div class="filter"><input class="mytaskcheckbox" type="checkbox" onclick="toggleVisibility(this);" id="alltasks" name="alltasks" ><label class="mytasklabel" for="alltasks">הצג משימות שלי בלבד</label></div>`;
    

    return txt;
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
        if (itm.FolderID == branchID) {
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
            /*for (const sec of itm.SecondaryId){ 
                if (sec.value == _spPageContextInfo.userId) {
                     result = true;
                }
            }*/
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
//**get projects**//
    //query projects
   var projectsSet = new Set();
   //  const requestUri = buildRequestUrl(`מעקב משימות`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,projectLookup/Id,projectLookup/Title,Id,DueDate,Status`, `&$filter=((Status ne 'הושלם') and (Status ne 'נדחה')) `, `&$expand=AssignedTo,projectLookup`, null, null);
   const projectsRequest = buildRequestUrl(`פרוייקטים`, "", `$select=Title,Id`,`&$filter=((ContentTypeId eq '0x0120D52000B16F7EA44B54CB46A1BD6D49F984D26F') and (isActive eq 1))`, null, null, null);
   const projects = await getData(projectsRequest);
   if (projects.value.length > 0){
       for (const prj of projects.value){
           const proj = new Object();
           proj.name = prj.Title;
           proj.Id = prj.Id;
           projectsSet.add(proj);
       }
   }

    
   /**קבלת זירות**/ 
   /*const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);*/

    /////////////////////////////////////////////////////////////////////////////////////////
    // Collect Tasks from branches
    /////////////////////////////////////////////////////////////////////////////////////////

    var tasksSet = new Set();
    //var milestoneSet = new Set();
    var userSet = new Set();

            const requestUri = buildRequestUrl(`מעקב משימות`, "", `$select=Title,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,projectLookup/Id,projectLookup/Title,Id,DueDate,Status`, `&$filter=((Status ne 'הושלם') and (Status ne 'נדחה')) `, `&$expand=AssignedTo,projectLookup`, null, null);
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
                    if(task.projectLookup == undefined){
                        taskItem.EventTitle=`לא משויך לפרויקט`
                        taskItem.FolderID=null;

                    }
                    else{
                        taskItem.EventTitle=task.projectLookup.Title;
                        taskItem.FolderID=task.projectLookup.Id;
                    }

                    /*taskItem.SecondaryId = new Set();
                    if (task.AssignedTo2 != null) {

                        taskItem.Secondary = ``;

                        for (const secondaryOwner of task.AssignedTo2){
                            if (taskItem.Secondary != ``){taskItem.Secondary += `</br>`;}
                            taskItem.Secondary += `${secondaryOwner.FirstName} ${secondaryOwner.LastName}`;
                            taskItem.SecondaryId.add(secondaryOwner.Id);
                        }

                    }*/

                    taskItem.Type = 'branchTask';
                    //taskItem.EventTitle = task.EventTitle;
                    taskItem.Status = task.Status;
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

        //var myTasksText = '<div class="wptitle">משימות לפי מבצע</div>';
        var myTasksText = "";



//////////////////////////////DISPLAY////////////////////////////////////
        // START NEW GRID BASED CODE

        //myTasksText += `START NEW CODE`;

        myTasksText += `<div class="byownercontainer">`;
        for (const usr of userSet) {


            myTasksText += `<br/><div class="byowner_header" id="user_${usr.Id}" onclick="toggleGridItems(this);">${usr.Name}</div>`;

            var containsusertasks = ` nousertasks`;
            if (containsCurrentUserItems(filterSetByUser(tasksSet,usr.Id))){containsusertasks = ` withusertasks`;}

            myTasksText += ``+//`<div class="columnheader ${containsusertasks}"></div>` +
              //  `<div class="columnheader ${containsusertasks}">מבצע משני</div>` +
                `<div class="columnheader ${containsusertasks}">שם משימה</div>` +
                `<div class="columnheader ${containsusertasks}"></div>` +
                `<div class="columnheader ${containsusertasks}">פרויקט</div>` +
                `<div class="columnheader ${containsusertasks}">תאריך יעד</div>`+
                `<div class="columnheader ${containsusertasks}">סטטוס</div>`;
            for (const tsk of tasksSet) {
                if (tsk.AssignedTo == usr.Id) {

                    var containsusertasks = ` nousertasks`;
                    if ((_spPageContextInfo.userId == usr.Id)) {
                        containsusertasks = ` withusertasks`;
                    }
                 //   var second = "";
                 //   if (tsk.Secondary != undefined) { second += `${tsk.Secondary}` }

                    var eventcell = "";
                    var pluslink = "";

                    if (`לא משויך לפרויקט` != tsk.EventTitle) {
                        pluslink = `<a title="הוסף משימה חדשה עבור פרויקט '${tsk.EventTitle}'" href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`;
                        eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/DocLib1/Forms/dispform.aspx?id=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
                    }
                    else{
                        pluslink = `<a title="הוסף משימה חדשה עבור פרויקט '${tsk.EventTitle}'" href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/NewForm.aspx?FolderID=${tsk.FolderID}&Source=${window.location}">⊕</a>`;
                        //eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/DocLib1/Forms/dispform.aspx?id=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
                        eventcell = `${tsk.EventTitle}`;
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

                    myTasksText += `` + //`<div class="byowner_branch${containsusertasks}" style="background-color:#${tsk.bg};background-image:url('../images/div0${tsk.divNo}_bg.png')">${tsk.branch}</div>` +
                        //`<div class="defaultgriditem byowner_owner2${containsusertasks}">${second}</div>` +
                        `<div class="defaultgriditem byowner_task${containsusertasks} right_radius"><a href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList//DispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                        `<div class="defaultgriditem byowner_newevent${containsusertasks}">${pluslink}</div>` +
                        `<div class="defaultgriditem byowner_event${containsusertasks}">${eventcell}</div>` +
                        `<div class="defaultgriditem byowner_duedate${containsusertasks}" style="color:${byowner_datecolor}">${byowner_duedate}</div>`+
                        `<div class="defaultgriditem byowner_duedate${containsusertasks} left_radius">${tsk.Status}</div>`;
                }


            }
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
        myTasksByBranchText += `<div class="bybranch_header" id="user_0" onclick="toggleGridItems(this);">&nbsp;&nbsp;משימות ללא שיוך לפרויקט<div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/NewForm.aspx&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;
        
        // check if user tasks in following table
//filterSetByBranch(tasksSet, `0`)
        var containsusertasks = ` nousertasks`;
        if (containsCurrentUserItems(filterSetByBranch(tasksSet, `null`))){containsusertasks = ` withusertasks`;}
        
        //title column headers
        myTasksByBranchText += `<div class="columnheader${containsusertasks}">שם מבצע</div>` +
         //   `<div class="columnheader${containsusertasks}">מבצע משני</div>` +
            `<div class="columnheader${containsusertasks}">שם משימה</div>` +  
            `<div class="columnheader${containsusertasks}"></div>` +
            //`<div class="columnheader${containsusertasks}">אירוע</div>` +
            `<div class="columnheader${containsusertasks}">תאריך יעד</div>`;

        for (const tsk of tasksSet) {
            //departmental tasks
            

                containsusertasks = ` nousertasks`;
                  if (_spPageContextInfo.userId == tsk.AssignedTo) {
               // if ((_spPageContextInfo.userId == tsk.AssignedTo) /*|| (tsk.SecondaryId.has(_spPageContextInfo.userId))) {
                    containsusertasks = ` withusertasks`;
                }

                //var seconduser = "";
                //if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }

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
                if(tsk.FolderID==null){
                myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks} right_radius">${tsk.AssignedToName}</div>` +
                    //`<div class="defaultgriditem bybranch_owner2${containsusertasks}">${seconduser}</div>` +
                    `<div class="defaultgriditem bybranch_task${containsusertasks} "><a href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/dispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                    `<div class="defaultgriditem bybranch_newevent${containsusertasks}"></div>` +
                    //`<div class="defaultgriditem bybranch_event${containsusertasks}"></div>` +
                    `<div class="defaultgriditem bybranch_duedate${containsusertasks} left_radius" style="color:${datecolor}">${displaydate}</div>`;
                }
            
        }

      
        /////////////////////////////////////////////////////////////
        //branch tasks
        /////////////////////////////////////////////////////////////
        if (projectsSet.size > 0) {
            for (const branch of projectsSet) {

                myTasksByBranchText += `<div class="bybranch_header" onclick="toggleGridItems(this);">&nbsp;&nbsp;משימות פרוייקט: ${branch.name} <div style="float:left;margin-left:50px;border-radius:7px;padding:2px 8px"><a style="color:#ffffff" href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/NewForm.aspx?FolderID=${branch.Id}&callback=${window.location}">⊕ הוסף משימה</a></div></div>`;

                var containsusertasks = ` nousertasks`;
                if (containsCurrentUserItems(filterSetByBranch(tasksSet, branch.Id))){containsusertasks = ` withusertasks`;}


               //title column headers
               myTasksByBranchText += `<div class="columnheader${containsusertasks}">שם מבצע</div>` +
                  // `<div class="columnheader${containsusertasks}">מבצע משני</div>` +
                   `<div class="columnheader${containsusertasks}">שם משימה</div>` +
                   `<div class="columnheader${containsusertasks}"></div>` +
                  // `<div class="columnheader${containsusertasks}">אירוע</div>` +
                   `<div class="columnheader${containsusertasks}">תאריך יעד</div>`;

               for (const tsk of tasksSet) {
                   if (tsk.EventTitle == branch.name) {
                       //task line with ${containsusertasks} applied
                       var containsusertasks = ` nousertasks`;

                        if ((_spPageContextInfo.userId == tsk.AssignedTo) /*|| (tsk.SecondaryId.has(_spPageContextInfo.userId))*/) {
                            containsusertasks = ` withusertasks`;
                        }
                        //var seconduser = "";
                        //if (tsk.Secondary != undefined) { seconduser = tsk.Secondary }

                        var eventcell = "";
                        var pluslink = "";
                        //if (null != tsk.EventTitle) { eventcell = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>&nbsp;<a href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Docs_Div${tsk.divNo}/Forms/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`}
                        if (null != tsk.EventTitle) {
                            //pluslink = `<a title="הוסף משימה חדשה עבור אירוע '${tsk.EventTitle}'" href="/sites/Npdu/Lists/Tasks_Div${branch.Id}/NewForm.aspx?FolderID=${tsk.FolderID}&docSetTitle=${tsk.EventTitle}&Source=${window.location}">⊕</a>`;
                            eventcell = `<a href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/DispForm.aspx&itemid=${tsk.FolderID}&callback=${window.location}">${tsk.EventTitle}</a>`;
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

                        myTasksByBranchText += `<div class="defaultgriditem bybranch_owner${containsusertasks} right_radius">${tsk.AssignedToName}</div>` +
                          //  `<div class="defaultgriditem bybranch_owner2${containsusertasks}">${seconduser}</div>` +
                            `<div class="defaultgriditem bybranch_task${containsusertasks}"><a style="color:black;" href="/SitePages/itemPopUp.aspx?form=/sites/BudgetsProjects/Lists/TaskList/dispForm.aspx&itemid=${tsk.Id}&callback=${window.location}">${tsk.Title}</a></div>` +
                            `<div class="defaultgriditem bybranch_newevent${containsusertasks}">${pluslink}</div>` +
                           // `<div class="defaultgriditem bybranch_event${containsusertasks}">${eventcell}</div>` +
                            `<div class="defaultgriditem bybranch_duedate${containsusertasks} left_radius" style="color:${datecolor}">${datetext}</div>`;

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
    document.getElementById('OwnersHeader').innerHTML=`<span style="border: 2px solid #896fae;padding: 5px 30px; margin:10px;border-radius:25px;">משימות שלי</span>`;
    document.getElementById('ProjectsHeader').innerHTML=`<span style="border: 2px solid #368fb2;padding: 5px 30px;margin:10px;border-radius:25px;">משימות שלי</span>`;
    for (const tbl of tasktables) {
        if (eventsender.checked === false) {
            tablevisibility = false;
            document.getElementById('OwnersHeader').innerHTML=`<span style="border: 2px solid #896fae;padding: 5px 30px; margin:10px;border-radius:25px;">מבצעים</span>`;
            document.getElementById('ProjectsHeader').innerHTML=`<span style="border: 2px solid #368fb2;padding: 5px 30px;margin:10px;border-radius:25px;">פרוייקטים</span>`;
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
    var calRadio = document.getElementById("calRadio");

    if (byuserradio.checked == true) {
        //myTasksElement.style.display = "block"; myTasksByBranchElement.style.display = "none";
        myTasksElement.hidden = false;
        myTasksByBranchElement.hidden = true;
        document.getElementById('OwnersHeader').hidden=false;
        document.getElementById('ProjectsHeader').hidden=true;
        document.getElementById('CalHeader').hidden=true;
        document.getElementById('MSOZoneCell_WebPartWPQ2').hidden=true;
        document.getElementById('alltasks').disabled=false;
        
    }
    if (bybranchradio.checked == true) {
        //myTasksElement.style.display = "none"; myTasksByBranchElement.style.display = "block";
        myTasksElement.hidden = true;
        myTasksByBranchElement.hidden = false;
        document.getElementById('OwnersHeader').hidden=true;
        document.getElementById('ProjectsHeader').hidden=false;
        document.getElementById('CalHeader').hidden=true;
        document.getElementById('MSOZoneCell_WebPartWPQ2').hidden=true;
        document.getElementById('alltasks').disabled=false;
        
    }
    if(calRadio.checked == true){
        myTasksElement.hidden = true;
        myTasksByBranchElement.hidden = true;
        document.getElementById('OwnersHeader').hidden=true;
        document.getElementById('ProjectsHeader').hidden=true;
        document.getElementById('CalHeader').hidden=false;
        document.getElementById('MSOZoneCell_WebPartWPQ2').hidden=false;
        if(document.getElementById('alltasks').checked=true){document.getElementById('alltasks').click();}
        document.getElementById('alltasks').disabled=true;
    }

    //var myTasksElement = document.getElementById("TasksDiv");
    //var myTasksByBranchElement = document.getElementById("TasksByBranchDiv");
    //if (sender.id = "byUser") { myTasksElement.style.display = "block"; myTasksByBranchElement.style.display = "none"; }
    //if (sender.id = "byBranch") { myTasksElement.style.display = "none"; myTasksByBranchElement.style.display = "block"; }
}

window.addEventListener("load", function () {

    activatecall();


})


