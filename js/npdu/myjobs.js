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

    var myTasksElement = document.getElementById("myTasksDiv");
    //var myTasksText = '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<table style="">';
    //myTasksText += '<div class="wptitle">משימות שלי</div>';
    //myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >תאריך יעד</th></tr>';
    //const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, `$filter=Author eq ${userId} and FSObjType eq 0&$orderby=Created desc`, null, null, null);
    const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);

    var tasksSet = new Set();

    if (zirots.value.length > 0) {




        z_object.GlobalVariables.myzirots = zirots.value
        for (const zirot of z_object.GlobalVariables.myzirots) {
            //const requestUri = buildRequestUrl("משימות " + zirot.Title, "", null, null, null, null, null);
            const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", null, `$filter=AssignedTo eq ${_spPageContextInfo.userId} and Status ne 'הושלם'`, null, null, null);
            const tasks = await getData(requestUri);
            if (tasks.value.length > 0) {

                //do interesting things here
                for (const task of tasks.value) {

                    const taskItem = new Object();
                    taskItem.branch = zirot.Title;
                    taskItem.bg = zirot.TaskColor;
                    //taskItem.bg = zirot.EventColor;
                    taskItem.divNo = zirot.divNo;
                    taskItem.Title = task.Title;
                    taskItem.Id = task.Id;
                    taskItem.DueDate = task.DueDate;

                    tasksSet.add(taskItem);


                    //myTasksText += `<tr>`;
                    /////sites/Npdu/Lists/Tasks_Div4/DispForm.aspx?ID=2
                    //myTasksText += `<td class="jobcell" style="background-color:#${zirot.TaskColor}">${zirot.Title}</td>`
                    //myTasksText += `<td class="jobcell" ><a href="/sites/Npdu/Lists/Tasks_Div${zirot.divNo}/DispForm.aspx?ID=${task.Id}">${task.Title}</a></td>`;
                    //myTasksText += `<td class="jobcell" >`;
                    //var ddate = new Date(task.DueDate).toLocaleDateString("en-GB");
                    //if (task.DueDate != null) {
                    //    myTasksText += `${ddate}`;
                    //}
                    //myTasksText += `</td>`;
//
                    //myTasksText += `</tr>`;
                }
            }

        }




    }

    if (tasksSet.size > 0) {

        const sortedTasksSet = Array.from(tasksSet).sort((a,b) => {
            let da = new Date(a.DueDate),
                db = new Date(b.DueDate);
                return da - db;

        });//a.DueDate - b.DueDate);
        tasksSet = new Set(sortedTasksSet);

        //sort array based on DueDate ascending
        var myTasksText = '<div class="wptitle">משימות שלי</div>';

        myTasksText += '<table style="">';
        myTasksText += '<tr><th></th><th class="jobcell" >שם משימה</th><th class="jobcell" >תאריך יעד</th></tr>';

        for (const task of tasksSet) {
            // format item in row
            myTasksText += `<tr>`;
            myTasksText += `<td class="jobcell" id="firstcell" style="border-radius:7px; white-space:nowrap; background-color:#${task.bg};background-image: url('../images/div0${task.divNo}.png')">${task.branch}</td>`
            myTasksText += `<td class="jobcell" width="99%" ><a style="color:black;" href="/sites/Npdu/Lists/Tasks_Div${task.divNo}/DispForm.aspx?ID=${task.Id}">${task.Title}</a></td>`;
            myTasksText += `<td class="jobcell" >`;
            var ddate = new Date(task.DueDate).toLocaleDateString("en-GB");
            if (task.DueDate != null) {
                myTasksText += `${ddate}`;
            } else {
                myTasksText += "לא צוין";
            }
            myTasksText += `</td>`;

            myTasksText += `</tr>`;
        }

        myTasksText += '</table>';
        myTasksElement.innerHTML = myTasksText;
        myTasksElement.hidden = true; 
    }



    //myTasksText += '</table>';

    //myTasksElement.innerHTML = myTasksText;

}

window.addEventListener("load", function () {

    activatecall();


})


