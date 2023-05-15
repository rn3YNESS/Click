/**
* For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
*/
var pieProjectsConfig = {
    type: 'pie',
    data: {
        datasets: [{
            data: [],
            backgroundColor: [],
            label: 'Projects',
        },],
        labels: [],
    },
    options: {
        responsive: true,
        cutoutPercentage: 80,
        legend: {
            display: false,
        },
    },
}

var pieMokdanConfig = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: [],
            label: 'Mokdans',
        },],
        labels: []
    },
    options: {
        responsive: true,
        cutoutPercentage: 80,
        legend: {
            display: false,
        },
    },
}

var pieRequestsColors = ['#7e3af2', '#e02424', '#31c48d', '#ff5a1f'];
var pieMokdanColors = ['#31c48d', '#e02424', '#3f83f8', '#ff5a1f', '#0694a2', '#7e3af2'];

InitPieConfig = (picConfigObj, entries, legend, colorPalte) => {
    //Init Chart
    picConfigObj.data.labels = [];
    picConfigObj.data.datasets[0].data = [];
    document.getElementById(legend).innerHTML = "";
    let legendColorPalte = [...colorPalte];
    //Fill Data
    for (const e of entries) {
        picConfigObj.data.labels.push(e.Title);
        picConfigObj.data.datasets[0].data.push((isNaN(e.Complete) ? 0.5 : e.Complete));
        let color = legendColorPalte.pop();
        let legendItem = `<div class="flex items-center legendItem" onclick="initPieModal('${e.Title}','${e.Site}')">
                                <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color:${color}; "></span>
                                <span>${e.Title}</span>
                              </div>`;
        document.getElementById(legend).innerHTML += legendItem;
        picConfigObj.data.datasets[0].backgroundColor.push(color);

    };
}

const calc = async (items) => {
    let sum = 0;
    for (const item of items) {
        sum += item.PercentComplete;
    }

    return ((sum * 100) / items.length);
}

const initPieModal = async (title, site) => {
    let requestUri = `${site}/_api/web/lists/GetByTitle('${title}')/items?`;
    let listItems = await getData(requestUri);
    if (listItems.value.length > 0) {
        await openModalDialog(title, '/_catalogs/masterpage/Click/views/webparts/peiChartDetails.html');
        
        var i;
        var results = listItems.value.reduce((x, y) => {
            (x[y.Status] = x[y.Status] || []).push(y);
            return x;
        }, {});
        for (const item of Object.entries(results)) {
            let section = `<div class="accordion__chart">${item[0]}</div><div class="panel__chart" id="panel__${item[0]}" isActive="false"></div>`;
            document.getElementById("accordion__container").innerHTML += section;

            for (t of item[1]) {
                let precentComplete = `${(t.PercentComplete * 100)}%`;
                let d = (new Date(t.DueDate) - (new Date));
                //const diffTime = Math.abs(d);
                const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24));
                let a = (diffDays > 0) ? `נותרו עוד ${diffDays} ימים לסיום המשימה` : `המשימה באיחור של ${Math.abs(diffDays)} ימים`;
                let task = '';
                (t.PercentComplete < 1) ? task = `<div><div><img alt="משימה" src="/_layouts/15/images/TasksAttractMode.png" height="24"/>${t.Title}</div><div>${a}</div><div> אחוז ביצוע : ${precentComplete}</div></div>` : task = `<div><div><img alt="משימה" src="/_layouts/15/images/TasksAttractMode.png" height="24"/>${t.Title}</div><div> אחוז ביצוע : ${precentComplete}</div></div>`;
                document.getElementById(`panel__${item[0]}`).innerHTML += task;
            }
        }

        initAccordion();
    }
}

const initAccordion = () => {
    var acc = document.getElementsByClassName("accordion__chart");
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            let isActive = this.classList.contains("active");
            for (a of acc) {  
                a.classList.remove("active");
            }            
            //Close all panels
            let panels = document.getElementsByClassName("panel__chart");
            for (panel of panels) {                
                panel.style.maxHeight = null;
            }
            if(!isActive){
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }                
            }


        });
    }
}

InitPie = async () => {
    var projectsContainer = [];
    const requestUriTasks = buildSearchQuery(`querytext='contentclass="STS_List_Tasks*" AND Title:"פרויקט"'`, "&rowlimit=500", "&selectproperties='Title,Path,SiteName'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
    const projects = await getData(requestUriTasks);
    if (projects.PrimaryQueryResult.RelevantResults.RowCount > 0) {
        for (p of projects.PrimaryQueryResult.RelevantResults.Table.Rows) {
            let project = {
                Title: p.Cells[2].Value.split('-')[1].trim(),
                Site: p.Cells[4].Value
            }
            let requestUri = `${project.Site}/_api/web/lists/GetByTitle('${project.Title}')/items?`;//buildRequestUrl(project.Title, "items", null,null, null, null, null);
            let listItems = await getData(requestUri);
            let y = await calc(listItems.value);
            project.Complete = y;
            projectsContainer.push(project);
        }
        //Init Configuration
        InitPieConfig(pieProjectsConfig, projectsContainer, `legendPieProjects`, pieRequestsColors);
    }


    // change this to the id of your chart element in HMTL
    var pieCtxProjects = document.getElementById('pieProjects');
    // const context = pieCtxProjects.getContext('2d');
    // context.clearRect(0, 0, pieCtxProjects.width, pieCtxProjects.height);
    window.myPie = new Chart(pieCtxProjects, pieProjectsConfig);
}

//InitPie();