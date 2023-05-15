var siteUrl = '/sites/Npdu';
var branches = "זירות";

var tasksArray = [];
var tasksSet = new Set();
//var ctx = new SP.ClientContext(siteUrl);

function retrieveBranchItems() {

    //var clientContextBranches = new SP.ClientContext(siteUrl);
    //var oListBranches = clientContextBranches.get_web().get_lists().getByTitle(branches);
    this.ctx = new SP.ClientContext(siteUrl);
    var oListBranches = this.ctx.get_web().get_lists().getByTitle(branches);
    var camlQueryBranches = new SP.CamlQuery();

    camlQueryBranches.set_viewXml('<View><Query><Where>' +
        '<Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>0</Value></Geq>' +
        '</Where></Query></View>');

    this.collBranchesItem = oListBranches.getItems(camlQueryBranches);

    //clientContextBranches.load(collBranchesItem);

    //clientContextBranches.executeQueryAsync(Function.createDelegate(this, this.onBranchQuerySucceeded), Function.createDelegate(this, this.onBranchQueryFailed));
    this.ctx.load(collBranchesItem);

    this.ctx.executeQueryAsync(Function.createDelegate(this, this.onBranchQuerySucceeded), Function.createDelegate(this, this.onBranchQueryFailed));

}

function retrieveTasks(listname) {
    //var tasksContext = new SP.ClientContext(siteUrl);
    //var oListTasks = tasksContext.get_web().get_lists().getByTitle(listname);
    var oListTasks = this.ctx.get_web().get_lists().getByTitle(listname);
    var camlQueryTasks = new SP.CamlQuery();

    camlQueryTasks.set_viewXml('<View><Query><Where>' +
        '<Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>0</Value></Geq>' +
        '</Where></Query></View>');

    //'<Eq><FieldRef Name="AssignedTo" LookupId="TRUE" /><Value Type="Integer"><UserID /></Value></Eq>' +


    this.collTasksItem = oListTasks.getItems(camlQueryTasks);

    //tasksContext.load(collTasksItem);

    //tasksContext.executeQueryAsync(Function.createDelegate(this, this.addTasks));
    this.ctx.load(collTasksItem);

    //this.ctx.executeQueryAsync(Function.createDelegate(this, this.addTasks));
    ctx.executeQueryAsync(function () {
        //if (collTasksItem != undefined) {
        //if (collTasksItem.get_count() > 0) {
        var tasksEnumerator = collTasksItem.getEnumerator();


        while (tasksEnumerator.moveNext()) {
            var taskItem = tasksEnumerator.get_current();
            //add task to collection
            //this.tasksArray.push(taskItem);
            tasksSet.add(taskItem);

        }

        //}
    });


}

function addTasks() {

    console.log(this.collTasksItem.getEnumerator().length);
    //if (this.collTasksItem.get_ > 0) {
    var tasksEnumerator = this.collTasksItem.getEnumerator();


    while (tasksEnumerator.moveNext()) {
        var taskItem = tasksEnumerator.get_current();
        //add task to collection
        this.tasksArray.push(taskItem);

    }

    //}


}

function onBranchQuerySucceeded(sender, args) {

    var branchEnumerator = collBranchesItem.getEnumerator();

    while (branchEnumerator.moveNext()) {
        var branchItem = branchEnumerator.get_current();
        retrieveTasks('משימות ' + branchItem.get_item('Title'));
        //retrieveTasks('Tasks_Div' + branchItem.get_item('divNo'));


    }

    //tasksArray.sort();

    var myTasksElement = document.getElementById("myTasksDiv");
    //var myTasksDiv = document.createElement("div");
    var myTasksText = '<table>';
    for (tsk in this.tasksSet) {
        myTasksText += '<tr><td>task</td><tr>';
    }
    //loop through tasks collection here
    //<link>due date/Title/eventTitle</link>

    myTasksText += '</table>';

    myTasksElement.innerHTML = myTasksText;

}


function onBranchQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

window.addEventListener("load", function () {

    retrieveBranchItems();


})