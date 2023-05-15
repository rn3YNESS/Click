window.addEventListener("load",function () {

    var docsetTitleText=document.getElementById("idDocsetName").innerText;

    var loc = window.location.pathname
    var divNo = loc.split("/")[3].split("_")[1]
    var taskaddress =  "/sites/Npdu/Lists/Tasks_" + divNo; // /sites/Npdu/Lists/Tasks_Div4
    const alltasks = document.createElement("div");
    alltasks.innerHTML = '<span title="הצג כל המשימות עבור הזירה" style="cursor:pointer;border: none;"> <a style="font-weight:bold;font-size:1.3em;color:#0072c6;" href="'+taskaddress+'"> הצג כל המשימות עבור הזירה </a></span><br/><br/>';

    const addNode= document.createElement("div");
    addNode.innerHTML='<span title="הוסף משימה עבור אירוע '+docsetTitleText+'" style="cursor:pointer;font-size:1.3em;color:#0072c6;border: none;" onClick="addTaskBtn()"> <span class="ms-qcb-glyph ms-listview-glyph-withmargin ms-core-form-heading ms-listview-new-glyph ms-listview-new-glyph-circle "></span><span style="font-weight:bold"> משימה חדשה עבור אירוע '+docsetTitleText+' </span></span>';
    
    //get Docset Title
    //idDocsetName
    
    //var target=document.getElementById("MSOZoneCell_WebPartWPQ4");
    var target=document.getElementById("npdu_newtask");
    //npdu_newtask

    target.appendChild(alltasks);
    target.appendChild(addNode);

});

function addTaskBtn(){
    var queryString = window.location.search;

    var loc = window.location.pathname
    var divNo = loc.split("/")[3].split("_")[1] //Div1

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

        //_options.url= "/sites/Npdu/proUnit/Lists/Tasks_"+divNo+"/NewForm.aspx?ContentTypeId=0x010800B294524436BD8C4B8F34DFD20F05C453003C81C24DE6A8264E823884E0F33C88D2&RootFolder=%2Fsites%2FNPDU%2FLists%2FtaskList";
        _options.url= "/sites/Npdu/Lists/Tasks_"+divNo+"/NewForm.aspx?RootFolder=%2Fsites%2FNpdu%2FLists%2FTasks_"+divNo;
        //_options.url= "/sites/Npdu/Lists/EventTasks/NewForm.aspx?RootFolder=%2Fsites%2FNpdu%2FLists%2FEventTasks";
        _options.url=_options.url+"&Source="+encodeURIComponent(window.location);
        _options.url=_options.url+"&FolderID="+docSetId;
        _options.url=_options.url+"&docSetTitle="+docSetTitle;
        //_options.url=_options.url+"&deptID="+encodeURIComponent(deptId);
        SP.UI.ModalDialog.showModalDialog(_options);

    }
}
