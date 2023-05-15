var xValues = [];
var yValues = [];
var barColors = ["red", "green","blue","orange","brown"];

const calc = async(items) =>{
    let sum = 0;
    for(const item of items){
        sum += item.PercentComplete;
    }

    return ((sum*100)/items.length);
}

const initChart = async () =>{
    const requestUriTasks = buildSearchQuery(`querytext='contentclass="STS_List_Tasks*" AND Title:"פרויקט"'`, "&rowlimit=500", "&selectproperties='Title,Path,SiteName'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
    const projects = await getData(requestUriTasks);
    for (p of projects.PrimaryQueryResult.RelevantResults.Table.Rows) {
        let project = {
            Title: p.Cells[2].Value.split('-')[1].trim(),
            Site: p.Cells[4].Value
        }
        xValues.push(project.Title);
        let requestUri = `${project.Site}/_api/web/lists/GetByTitle('${project.Title}')/items?`;//buildRequestUrl(project.Title, "items", null,null, null, null, null);
        let listItems = await getData(requestUri);
        let y = await calc(listItems.value);
        yValues.push(y);
    }

    yValues.push(0);
    new Chart("myChart", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
          legend: {
            display: true,
            labels: {
              color:['red','green']
                      }},
          title: {
            display: true,
            text: "רשימת פרוייקים"
          }
        }
      });
}

initChart();