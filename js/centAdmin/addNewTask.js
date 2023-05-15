//make func run after page loaded
window.addEventListener("load",function () {
    const addNode= document.createElement("div");
    addNode.innerHTML='<span title="הוסף משימה" style="cursor:pointer;margin-right:10px; margin-top: 5px" onClick="addTaskBtn()"> <img  src="/_catalogs/masterpage/click/images/addIconSP16.png" alt="הוסף משימה" /> חדש </span>';
    var target=document.getElementById("MSOZoneCell_WebPartWPQ2");
    target.appendChild(addNode);
});

function addTaskBtn(){
    var queryString = window.location.search;
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

        _options.url= "https://pmoclick/sites/centadmin/proUnit/Lists/taskList/NewForm.aspx?ContentTypeId=0x0108009F4CE7F365CB2D428F38EBC01AA2229B01005DA747E9482FBC4CB4698150CDBD32BB&RootFolder=%2Fsites%2Fcentadmin%2FproUnit%2FLists%2FtaskList";
        _options.url=_options.url+"&docSetId="+docSetId;
        SP.UI.ModalDialog.showModalDialog(_options);

    }
}