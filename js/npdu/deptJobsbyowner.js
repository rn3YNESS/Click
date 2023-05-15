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

    var deptTasksElement = document.getElementById("deptTasksDiv");
    //const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, `$filter=Author eq ${userId} and FSObjType eq 0&$orderby=Created desc`, null, null, null);
    const requestUri = buildRequestUrl(z_object.Lists.zirot.HE, "", null, null, null, null, null);
    const zirots = await getData(requestUri);

    //var tasksSet = new Set();

    if (zirots.value.length > 0) {

        z_object.GlobalVariables.myzirots = zirots.value
        var deptTasksText = `<div class="filter"><input type="checkbox" onclick="toggleVisibility(this);" id="alltasks" name="alltasks" checked><label for="alltasks">הצג כל המשימות</label></div>`;
        for (const zirot of z_object.GlobalVariables.myzirots) {

            deptTasksText += `<div class="deptdiv" style="background-color:#${zirot.EventColor}">`;
            deptTasksText += `<div class="deptTitle" style="background-image: url('../images/div0${zirot.divNo}.png')">${zirot.Title}</div>`;
            var today = new Date();

            const requestUri = buildRequestUrl(`משימות ${zirot.Title}`, "", null, null, `$filter=Status ne 'הושלם' &$orderby=DueDate asc`, null, null);
            const tasks = await getData(requestUri);
            if (tasks.value.length > 0) {

                deptTasksText += `<div class="tasksdiv" style="background-color:#${zirot.TaskColor}"><table class="tasktable">`;


                for (const task of tasks.value) {

                    var duedate = "";
                    var duedatelabel = "";
                    var duedateelement = "";

                    var datecolor = "#000000";
                    var dateborder = "none";

                    if (null != task.DueDate) {
                        ddate = new Date(task.DueDate);
                        duedate = new Date(task.DueDate).toLocaleDateString("en-GB");
                        if (ddate <= today) { datecolor = "#FF0000"; dateborder = "solid 1px #FF0000;font-weight:bold" };
                        duedatelabel = `&#013;תאריך יעד: ${duedate}`;
                        duedateelement = `<span class="datespan" style="color:${datecolor};border:${dateborder}">${duedate}</span>`;

                    } else {

                        duedateelement = `<span class="datespan" style="color:${datecolor};border:${dateborder}">לא צוין</span>`;
                    };


                    var modifieddate = new Date(task.Modified).toLocaleDateString("en-GB");//};
                    var modifieddatelabel = `&#013;שונה לאחרונה: ${modifieddate}`;


                    var startdate = "";
                    var startdatelabel = "";
                    if (null != task.StartDate) {
                        startdate = new Date(task.StartDate).toLocaleDateString("en-GB");
                        startdatelabel = `&#013;תאריך התחלה: ${startdate}`;;
                    };

                    var rowclass = "taskrow";
                    if (_spPageContextInfo.userId == task.AssignedToId) { rowclass = "mytaskrow" }
                    deptTasksText += `<tr class="${rowclass}">`;

                    //deptTasksText += `<div class="itemdiv">${ddate} - ${task.Title}</div>`;
                    deptTasksText += `<td style="text-align:center">${duedateelement}</td>`;

                    //var user = task.AssignedToId;
                    deptTasksText += `<td title="${task.Title}${startdatelabel}${duedatelabel}${modifieddatelabel}"><a style="color:black;" href="/sites/Npdu/Lists/Tasks_Div${zirot.divNo}/DispForm.aspx?ID=${task.Id}">${task.Title}</a></td>`;

                    deptTasksText += "</tr>"

                }
                deptTasksText += `</table></div>`;
                
            }



            deptTasksText += `</div>`;


        }

    }




    deptTasksElement.innerHTML = deptTasksText;


}

window.addEventListener("load", function () {

    activatecall();


})

function toggleVisibility(eventsender) {

    var deptTasksRows = document.getElementsByClassName("taskrow");

    var rowvisibility = true;
    for (const row of deptTasksRows) {
        if (eventsender.checked === true) {
            
            rowvisibility = false;
        }
        
        row.hidden = rowvisibility;
    }
   
}   
