window.addEventListener("load",function () {
    var queryString = window.location.search;
    var params = new URLSearchParams(queryString);

    //alert(params);

    if(params.has("FolderID")){
        var FolderID= params.get("FolderID");
        
        var target=document.getElementById("projectLookup_a56b4952-b579-45c2-bf48-ee7e77997344_$LookupField");
        var targetLabel=document.getElementById("projectLookup");
        target.focus();
        target.value=FolderID;
        target.style.display = "none";
        targetLabel.style.display = "none";
        target.parentElement.parentElement.style.display = "none";
    }
/*
    if(params.has("docSetTitle")){
        var docSetTitle= params.get("docSetTitle");
        
        var docSetTitletarget=document.getElementById("EventTitle_3436b9d7-11b8-4dda-a1b0-2808dfb92a7a_$TextField");
        var docSetTitletargetLabel=document.getElementById("EventTitle");
        docSetTitletarget.focus();
        docSetTitletarget.value=docSetTitle;
        docSetTitletarget.style.display = "none";
        docSetTitletargetLabel.style.display = "none";
        docSetTitletarget.parentElement.parentElement.style.display = "none";
    }*/
});