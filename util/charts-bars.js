/**
* For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
*/
var tasksData = null;

var barConfig = {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'משימות',
            backgroundColor: [],
            // borderColor: window.chartColors.red,
            borderWidth: 1,
            data: []
        }],
    },
    options: {
        responsive: true,
        legend: {
            display: false,
        },
    },
}

var barsColors = ['#31c48d', '#e02424', '#3f83f8', '#ff5a1f', '#0694a2', '#7e3af2'];

InitBarsConfig = (barConfigObj, entries, legend, colorPalte) => {
    //Init chart
    barConfigObj.data.labels = [];
    barConfigObj.data.datasets[0].data = [];
    document.getElementById(legend).innerHTML = "";
    let legendColorPalte = [...colorPalte];
    //Fill Data
    for (const e of entries) {
        barConfigObj.data.labels.push(e[0]);
        barConfigObj.data.datasets[0].data.push(e[1].length);
        let color = legendColorPalte.pop();
        let legendItem = `<div class="flex items-center legendItem" onclick="initBarsModal('משימות בסטאטוס : ${e[0]}')">
          <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color:${color}; cursor:pointer;">
          </span>
          <span id="${e[0]}" style="cursor:pointer;">${e[0]}</span>
        </div>`;
        //SPUtilities.Methods.OpenInDialog('${e[0]}', '400', '800', false, true, true, '/sites/CustomerService/Pages/Mokdan.aspx?m=${e[0]}');
        document.getElementById(legend).innerHTML += legendItem;
        barConfigObj.data.datasets[0].backgroundColor.push(color);
    };
    barConfigObj.data.datasets[0].data.push(0);
}

const initBarsModal = async (title) => {
    var results = tasksData.PrimaryQueryResult.RelevantResults.Table.Rows.reduce((x, y) => {
        (x[y.Cells[2].Value] = x[y.Cells[2].Value] || []).push(y);
        return x;
    }, {});

    await openModalDialog(title, '/_catalogs/masterpage/Click/views/webparts/barsChartDetails.html');

    for (const item of Object.entries(results)) {        
        let requestUri = `${item[1][0].Cells[9].Value}/_api/web/lists('${item[0]}')`;
        let list = await getData(requestUri);
        let section = `<div class="accordion__chart">${list.Title}</div><div class="panel__chart" id="panel__${item[0]}"></div>`;
        document.getElementById("accordion__container").innerHTML += section;
        for (t of item[1]) {
            let precentComplete = `${(t.Cells[14].Value * 100)}%`;
            let d = (new Date(t.Cells[12].Value) - (new Date));
            //const diffTime = Math.abs(d);
            const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24));
            let a = (diffDays > 0) ? `נותרו עוד ${diffDays} ימים לסיום המשימה` : `המשימה באיחור של ${Math.abs(diffDays)} ימים`;
            let task = '';
            (t.PercentComplete < 1) ? task = `<div><div><img alt="משימה" src="/_layouts/15/images/TasksAttractMode.png" height="24"/>${t.Cells[3].Value}</div><div>${a}</div><div> אחוז ביצוע : ${precentComplete}</div></div>` : task = `<div><div><img alt="משימה" src="/_layouts/15/images/TasksAttractMode.png" height="24"/>${t.Cells[3].Value}</div><div> אחוז ביצוע : ${precentComplete}</div></div>`;
            document.getElementById(`panel__${item[0]}`).innerHTML += task;
        }        
    }

    initAccordion();
    // }
}

InitBars = async () => {
    var tasksContainer = [];
    const requestUriTasks = buildSearchQuery(`querytext='contentclass="STS_ListItem_Tasks*" AND Path:"${spContextObject.CONSTANTS.WEBAPPLICATIONURL}"'`, "&rowlimit=500", "&selectproperties='ListId,Title,Path,StatusOWSCHCS,Priority,DueDateOWSDATE,StartDateOWSDATE,ListItemId,PercentCompleteOWSNMBR,AssignedTo,ParentLink,SiteName'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
    tasksData = await getData(requestUriTasks);
    if (tasksData.PrimaryQueryResult.RelevantResults.RowCount > 0) {
        for (t of tasksData.PrimaryQueryResult.RelevantResults.Table.Rows) {
            let task = {
                ListId: t.Cells[2].Value,
                Title: t.Cells[3].Value,
                ParentLink: t.Cells[8].Value,
                Site: t.Cells[9].Value,
                Status: t.Cells[11].Value,
                Duedate: t.Cells[12].Value,
                PercentComplete: t.Cells[14].Value
            }
            tasksContainer.push(task);
        }
        //Group by Status
        var result = tasksContainer.reduce((x, y) => {
            (x[y.Status] = x[y.Status] || []).push(y);
            return x;
        }, {});
        //Init Configuration
        InitBarsConfig(barConfig, Object.entries(result), `legendBarsTasks`, barsColors);
    }


    // change this to the id of your chart element in HMTL
    var pieCtxtasks = document.getElementById('barsTasks');
    // const context = pieCtxtasks.getContext('2d');
    // context.clearRect(0, 0, pieCtxtasks.width, pieCtxtasks.height);
    window.myPie = new Chart(pieCtxtasks, barConfig);
}

//InitBars();