window.addEventListener("load",function () {

    var docsetTitleText=document.getElementById("idDocsetName").innerText;

    var loc = window.location.pathname
    //var divNo = loc.split("/")[3].split("_")[1]
    var taskaddress =  "/sites/BudgetsProjects/Lists/TaskList/" 
    const alltasks = document.createElement("div");
    alltasks.innerHTML = '<span title="הצג כל המשימות" style="cursor:pointer;border: none;"> <a style="font-weight:bold;font-size:1.3em;color:#0072c6;" href="'+taskaddress+'"> הצג כל המשימות</a></span><br/><br/>';

    const addNode= document.createElement("div");
    addNode.innerHTML='<span title="הוסף משימה עבור פרוייקט '+docsetTitleText+'" style="cursor:pointer;font-size:1.3em;color:#0072c6;border: none;" onClick="addTaskBtn()"> <span class="ms-qcb-glyph ms-listview-glyph-withmargin ms-core-form-heading ms-listview-new-glyph ms-listview-new-glyph-circle "></span><span style="font-weight:bold"> משימה חדשה עבור פרוייקט '+docsetTitleText+' </span></span>';
    
    //get Docset Title
    //idDocsetName
    
    //var target=document.getElementById("MSOZoneCell_WebPartWPQ4");
    var target=document.getElementById("newtask");
    //npdu_newtask

    target.appendChild(alltasks);
    target.appendChild(addNode);

});

function addTaskBtn(){
    var queryString = window.location.search;

    var loc = window.location.pathname
    //var divNo = loc.split("/")[3].split("_")[1] //Div1

    var docSetTitle=document.getElementById("idDocsetName").innerHTML;
    
    //var docSetTitle = docSetTitleSpan.con

    var params = new URLSearchParams(queryString);
        if(params.has("ID")){
        var docSetId= params.get("ID");
        var _options = SP.UI.$create_DialogOptions();
        _options.dialogReturnValueCallback = function(result){
            location.reload();
        }
        
        _options.allowMaximize = false;
        _options.showClose = true;
        _options.autoSize = true;
        _options.width = 800;
       
        if(params.has("width")) { _options.width = parseInt(params.get("width")); }
        if(params.has("height")) { _options.height = parseInt(params.get("height")); }

        
        _options.url= "/sites/BudgetsProjects/Lists/TaskList/NewForm.aspx?RootFolder=%2Fsites%2FBudgetsProjects%2FLists%2FTaskList";
        _options.url=_options.url+"&Source="+encodeURIComponent(window.location);
        _options.url=_options.url+"&FolderID="+docSetId;
        //_options.url=_options.url+"&docSetTitle="+docSetTitle;
        SP.UI.ModalDialog.showModalDialog(_options);

    }
}
