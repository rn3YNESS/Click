document.getElementById('aspnetForm').style.display="none";

window.addEventListener("load",function () {
var url=window.location.href;
var param=url.split("&");
var targetUrl=param[1];
if(targetUrl.startsWith("http:"))
{

	targetUrl=targetUrl.replace("http:","https:");
}
//alert(targetUrl);
if(window.location.href.split("&")[1].indexOf('pmoclick')>-1){
if( window.location.href.split("&")[2]!=null && window.location.href.split("&")[2].indexOf('Cyber')>-1){
var popupURL=targetUrl+ "?isCyber=1";
//alert(popupURL);
javascript:OpenPopUpPage(popupURL,function() {window.location.href = "http://pmoportal/"});
}else{
javascript:OpenPopUpPage(targetUrl,function() {window.location.href = "http://pmoportal/"});}
}else{
    alert('!!!פנייה לא מורשית');
}

});
