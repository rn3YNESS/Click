document.getElementById('aspnetForm').style.display="none";

window.addEventListener("load",function () {
var url=window.location.href;
var param=url.split("&");
var targetUrl=param[1];
if(window.location.href.split("&")[1].indexOf('pmoclick')>-1){
if( window.location.href.split("&")[2]!=null && window.location.href.split("&")[2].indexOf('Cyber')>-1){
var popupURL=window.location.href.split("&")[1]+ "?isCyber=1";
//alert(popupURL);
javascript:OpenPopUpPage(popupURL,function() {window.location.href = "http://pmoportal/"});
}else{
//original
//javascript:OpenPopUpPage(window.location.href.split("&")[1],function() {window.location.href = "http://pmoportal/"});}

//working
javascript:OpenPopUpPage(window.location.href.split("&")[1],function() {window.location.href = "https://pmoportal/"},740);}

//testing
//javascript:OpenPopUpPage(window.location.href.split("&")[1],function() {window.location.href = "https://pmoportal/"},724);}

//javascript:commonModalDialogOpen(window.location.href.split("&")[1],{width = 900},{window.location.href = "https://pmoportal/"});

}else{
    alert('!!!פנייה לא מורשית');
}

});