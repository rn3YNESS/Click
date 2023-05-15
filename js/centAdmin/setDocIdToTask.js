//make func run after page loaded
window.addEventListener("load",function () {
    var queryString = window.location.search;
    var params = new URLSearchParams(queryString);
        if(params.has("docSetId")){
        var docSetId= params.get("docSetId");
        //this.alert(docSetId);
        var target=document.getElementById("projectLookup_7d060a4f-96d5-47f1-ba18-f0bdfcce0e20_$LookupField");
        target.focus();
        target.value=docSetId;
        target.setAttribute("disabled", "disabled");
        target.blur();
        }
        
});