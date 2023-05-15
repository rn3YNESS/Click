const drawSiteMap = () => {
    let navBox = document.getElementById('navBox');
    var siteMapHtmlElement =
        `<ul id='siteMapUL'>
          <li id='siteMap'>
              <div class='caret1'>
                  <span class='rightBorder1 textSiteMap'>&nbsp;&nbsp;&nbsp;<b>אתרים וסביבות עבודה</b></span>
              </div>
              <br>
              <ul id='siteMapTree' ondrop='drop(event)' ondragover='allowDrop(event)'>
              </ul>
          </li>
      </ul>`;
    navBox.innerHTML = siteMapHtmlElement;
    let siteMapTree = document.getElementById('siteMapTree');
    let i = 0;
    for (const site of navObject.GlobalVariables.siteMap.sites) {
        if ((site.ListTemplateType != 0 || site.Children.length > 0) && (site.IsHidden !== true)) {
            siteMapTree.innerHTML +=
                `<li id='site_${i}' url='${site.Url}' title='${site.Title}' draggable='true' ondragstart='drag(event)'>                        
                  <a href='${site.Url}'><span class='rightBorder textSiteMap'>&nbsp;${site.Title}</span></a>
                  <ul id='ul_${i}' class='nested'></ul>
              </li>`;
            var parentNode = document.getElementById(`site_${i}`);
            if (site.SubSites.length > 0) {
                parentNode.classList.toggle("caret");
                let subSitesList = document.getElementById(`ul_${i}`);
                for (const subSite of site.SubSites) {
                    subSitesList.innerHTML += `<li draggable='true'><a class='aTextSiteMap NotHaveChild' href='${subSite.Url}'>${subSite.Title}</a></li>`;
                }
            }
        }
        i++;
    }
    //Init tree nodes toggling
    toggler("caret");
}

const initSiteMap = async() => {
    console.log(`${new Date()} :init initSiteMap`);
    //const requestUri = buildSearchQuery(`querytext='contentclass=STS_Site OR contentclass=STS_Web'`, "&rowlimit=500", "&selectproperties='Title,url,contentclass,ParentLink'", null, "&trimduplicates=false");
    //Init GlobalNavigation (Sites and Custom folders/links)
    const requestUriGlobalNavigation = `${_spPageContextInfo.webAbsoluteUrl}/_api/navigation/menustate?mapproviderName='GlobalNavigationSwitchableProvider'`
    const globalNavigationData = await getData(requestUriGlobalNavigation);
    for (const navigationNode of globalNavigationData.Nodes) {
        let node = { IsHidden: navigationNode.IsHidden ,IsParent: true, Title: navigationNode.Title, Url: navigationNode.SimpleUrl, HasChildrens: true, SubSites: [] };        
        if(navigationNode.Nodes.length > 0){
            for (const subNode of navigationNode.Nodes) {                
                node.SubSites.push({ IsParent: true, Title: subNode.Title, Url: subNode.SimpleUrl, HasChildrens: true, ParentLink: "" });
            }
        }
        navObject.GlobalVariables.siteMap.sites.push(node);
    }
    /*for (r of data.PrimaryQueryResult.RelevantResults.Table.Rows) {
        if (r.Cells[4].Value == "STS_Site") {
            var node = { IsParent: true, Title: r.Cells[2].Value, Url: r.Cells[3].Value, HasChildrens: true, SubSites: [] };
            navObject.GlobalVariables.siteMap.sites.push(node);

        } else {
            let parentSite = navObject.GlobalVariables.siteMap.sites.filter(x => { return x.Url == r.Cells[5].Value });
            if (parentSite.length > 0) {
                parentSite[0].SubSites.push({ IsParent: false, Title: r.Cells[2].Value, Url: r.Cells[3].Value, HasChildrens: false, ParentLink: r.Cells[5].Value });
            }
        }
    }*/
}

initSiteMap();