window.addEventListener("load",function () {
    var queryString = window.location.search;
    var params = new URLSearchParams(queryString);

    

    if(params.has("FolderID")){
        var FolderID= params.get("FolderID");
        
        var target=document.getElementById("FolderID_71e8307e-2a6c-417e-9b79-837cc3cb59aa_$NumberField");
        var targetLabel=document.getElementById("FolderID");
        target.focus();
        target.value=FolderID;
        target.style.display = "none";
        targetLabel.style.display = "none";
        target.parentElement.parentElement.style.display = "none";
    }

    if(params.has("docSetTitle")){
        var docSetTitle= params.get("docSetTitle");
        
        var docSetTitletarget=document.getElementById("EventTitle_3436b9d7-11b8-4dda-a1b0-2808dfb92a7a_$TextField");
        var docSetTitletargetLabel=document.getElementById("EventTitle");
        docSetTitletarget.focus();
        docSetTitletarget.value=docSetTitle;
        docSetTitletarget.style.display = "none";
        docSetTitletargetLabel.style.display = "none";
        docSetTitletarget.parentElement.parentElement.style.display = "none";
    }

    //if(params.has("deptID")){
    //    var deptID= params.get("deptID");
    //
    //    var dept=document.getElementById("_x05d6__x05d9__x05e8__x05d4__61436a64-afa6-4e66-97b0-b30e6771e0a0_$LookupField");
    //    var deptLabel=document.getElementById("_x05d6__x05d9__x05e8__x05d4_");
    //    dept.focus();
    //    dept.value=deptID;
    //    dept.style.display = "none";
    //    deptLabel.style.display = "none";
    //    dept.parentElement.parentElement.style.display = "none";
    //}
        
});
    

// DIV1: FolderID_71e8307e-2a6c-417e-9b79-837cc3cb59aa_$NumberField
// DIV2: FolderID_71e8307e-2a6c-417e-9b79-837cc3cb59aa_$NumberField