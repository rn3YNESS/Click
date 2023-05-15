var PMOClick = window.PMOClick || {};
window.addEventListener("load",function () {
    const defaultPicURL = "/_layouts/15/images/person.gif?rev=43";
    const today = new Date();
    const month =today.getMonth()+1;
    //var addr= PMOClick.CONSTANTS.WEBABSOLUTEURL.replace('/Pages/null','');
    const birthdays= PMOClick.Methods.GetListItemsREST(_spPageContextInfo.siteAbsoluteUrl, "עובדי האגף", "&$Select=Title,birthDate,avatar","&$filter=month eq "+month ,null,'&$orderby=birthDay',null) ;
    //console.log(birthdays.value);
    birthdays.value.forEach(element => {
        var node = document.createElement('div');
        node.className='birthdayBox';
        //node.style.border="1px solid red";
        node.style.marginBottom ='10px';
        node.title=element.Title;
        //node.innerText= element.Title;
        var img= document.createElement('img');
        img.className='WorkPic';
        if(element.avatar!=null){
            img.src=element.avatar.Url;
        }
        else{
            img.src=defaultPicURL;
        }
        img.height=70;
        img.alt="worker photo missing"
        node.appendChild(img);
        var span=document.createElement('div');
        span.className='birthdayText';
        span.innerText=element.Title;
        span.style.borderBottom = '3px solid #8B6BFD';
        node.appendChild(span);
        var tmpDate =new Date (element.birthDate);
        var birthTXT=document.createTextNode( '   ' + tmpDate.getDate() + '.' + (tmpDate.getMonth()+1));
        span.appendChild(birthTXT)
            //balloons pic fluent UI fabric iconography
        var balloon = document.createElement('i');
        balloon.className='ms-Icon ms-Icon--Balloons';
        balloon.areaHidden='true';
        span.appendChild(balloon);
        this.document.getElementById("BDWP").appendChild(node);
     });

}); 