var PMOClick = window.PMOClick || {};
//make func run after page loaded
window.addEventListener("load",function () {
   //var addr= PMOClick.CONSTANTS.WEBABSOLUTEURL.replace('/Pages/null','');
   const FUnits= PMOClick.Methods.GetListItemsREST(_spPageContextInfo.siteAbsoluteUrl, "subUnits", "&$Select=Title,url,order0,logo,showOnMainPage","&$filter=showOnMainPage eq 1",null,"&$orderby=order0",null) ;
  //console.log(FUnits);
     FUnits.value.forEach(element => {
        var node = document.createElement('div');
        node.className='proNavBox';
        //node.innerText= element.Title;
        node.setAttribute("onclick","window.open('"+element.url+"')");
        var navTitle =  document.createElement('p');
        navTitle.className='navTitleText';
        navTitle.innerText =element.Title;
        var logo =document.createElement('img');
        logo.className='navBoxLogo';
        logo.alt=element.Title;
        logo.src=element.logo.Url;
        logo.width =50;
        logo.height =50;
        node.appendChild(logo);
        var br =document.createElement('br');
        node.appendChild(br);
        node.appendChild(navTitle);
        this.document.getElementById("proceduresBox").appendChild(node);
     });
     this.document.getElementById("proceduresBox").style.display = "flex";
     this.document.getElementById("proceduresBox").style.alignItems = "center";
     const titlesList= document.getElementsByClassName('navTitleText');
     titlesList[0].style.borderRadius='0px 5px 5px 0px';
     titlesList[titlesList.length-1].style.borderRadius='5px 0px 0px 5px';

});