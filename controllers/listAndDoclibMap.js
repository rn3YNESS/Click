const initSiteListsAndLibraries = async () => {
    console.log(`${new Date()} :init initSiteListsAndLibraries`);
    //Init CurrentNavigation (Lists/Libraries and Custom folders/links)
    const requestUriCurrentNavigation = `${_spPageContextInfo.webAbsoluteUrl}/_api/navigation/menustate?mapproviderName='CurrentNavigationSwitchableProvider'`
    const currentNavigationData = await getData(requestUriCurrentNavigation);
    for (const navigationNode of currentNavigationData.Nodes) {
        let node = { IsHidden: navigationNode.IsHidden, Title: navigationNode.Title, Url: navigationNode.SimpleUrl, HasChildrens: true, Nodes: [] };
        if (navigationNode.Nodes.length > 0) {
            for (const subNode of navigationNode.Nodes) {
                node.Nodes.push({Title: subNode.Title, Url: subNode.SimpleUrl, HasChildrens: true, ParentLink: "" });
            }
        }
        navObject.GlobalVariables.ListsAndDocLibs.lord.push(node);
    }
    /*const lord = await getListsAndLibraries(); //Get all list and folders using search api
    if (isNullOrEmpty(navObject.Lists.UsefulLinks.HE)) {
        navObject.Lists.UsefulLinks.HE = "קישורים שימושיים";
    }
    var f = spContextObject.User.ID + "_" + spContextObject.User.DisplayName;
    var fExist = await getFolder(navObject.Lists.UsefulLinks.HE, f);
    //first initiation
    if (fExist.length == 0) {
        if (lord > 0)
            addListNavigationTree();
    }
    //if folder exist
    else {
        const links = await getItemsInFolder(navObject.Lists.UsefulLinks.HE, navObject.Lists.UsefulLinks.EN, f);
        if (lord > links.length) {
            console.log("New items was created");
            let difference = navObject.GlobalVariables.ListsAndDocLibs.lord.filter(x => {
                return !links.some(a => {
                    return a.UsefulLink.Url === x.Url;
                });
            });
            let maxIndex = Math.max(...links.map(o => o.UsefulLinksOrder));
            addUsfulLinkInsideFolder(difference, f, ++maxIndex);
        } else {
            console.log("There is no New items");
        }
    }*/
}

const getListsAndLibraries = async () => {
    const requestUri = buildSearchQuery(`querytext='contentclass=STS_List_DocumentLibrary OR contentclass=STS_List_* (path:${spContextObject.CONSTANTS.SITECONTEXT})'`, "&rowlimit=500", "&selectproperties='Title,url,contentclass,ParentLink'", null, "&trimduplicates=false");
    const data = await getData(requestUri);
    for (r of data.PrimaryQueryResult.RelevantResults.Table.Rows) {
        var node = { IsParent: true, Title: r.Cells[2].Value, Url: r.Cells[3].Value, HasChildrens: true, SubSites: [] };
        navObject.GlobalVariables.ListsAndDocLibs.lord.push(node);
    }
    return navObject.GlobalVariables.ListsAndDocLibs.lord.length;
}

const addListNavigationTree = async () => {
    var f = spContextObject.User.ID + "_" + spContextObject.User.DisplayName;
    //Check if folder exist
    var fExist = await getFolder(navObject.Lists.UsefulLinks.HE, f,null);
    let folderName;
    //Create folder if doesn't exist
    if (fExist.length == 0) {
        folderName = await createFolder(navObject.Lists.UsefulLinks.HE, navObject.Lists.UsefulLinks.EN, f,null);
    }
    //Create node inside the folder
    let index = 0;
    addUsfulLinkInsideFolder(navObject.GlobalVariables.ListsAndDocLibs.lord, f, index);
}

const addUsfulLinkInsideFolder = async (elements, f, index) => {
    for (const element of elements) {
        const listItem = {
            Title: element.Title,
            UsefulLink: { 'Url': element.Url, 'Description': 'לחץ על הקישור', '__metadata': { 'type': 'SP.FieldUrlValue' } },
            UsefulLinksOrder: index,
            UsefulLinksHide: false
        };
        await createItemInsideFolder(navObject.Lists.UsefulLinks.HE, navObject.Lists.UsefulLinks.EN, f, listItem);
        index++;
    }
    navObject.GlobalVariables.ListsAndDocLibs.maxOrder = index;
}

const getUsefulLinks = async () => {
    const requestUri = buildRequestUrl(null, navObject.Lists.UsefulLinks.HE, "items", null, `$filter=(FSObjType eq 0)`, null, `&$orderBy=UsefulLinksOrder asc`, null);
    const usfulLinks = await getData(requestUri);
    if (usfulLinks.value.length > 0)
        return usfulLinks.value;
    else
        return null;
}

const drawLinks = () => {
    let tree = document.getElementById('tree');
    let i = 0;
    /*if (showAll) {
        for (const link of usfulLinks) {

            tree.innerHTML +=
                `<li id='list_${link.Id}' hide="${link.UsefulLinksHide}" class='listMap__item' value='${link.UsefulLinksOrder}' title='${link.Title}' draggable='true' ondragstart='drag(event)'>                        
                        <a href='${link.UsefulLink.Url}'><span class='rightBorder textSiteMap'>&nbsp;${link.Title}</span></a>
                    </li>`;
            i++;

        }
    } else {
        for (const link of usfulLinks) {
            if (!link.UsefulLinksHide) {
                tree.innerHTML +=
                    `<li id='list_${link.Id}' hide="${link.UsefulLinksHide}" class='listMap__item' value='${link.UsefulLinksOrder}' title='${link.Title}' draggable='true' ondragstart='drag(event)'>                        
                        <a href='${link.UsefulLink.Url}'><span class='rightBorder textSiteMap'>&nbsp;${link.Title}</span></a>
                    </li>`;
                i++;
            }
        }
    }*/

    for (const list of navObject.GlobalVariables.ListsAndDocLibs.lord) {
        if (list.IsHidden !== true) {
            tree.innerHTML +=
                `<li id='list_${list.Title}' hide="${list.IsHidden}" class='listMap__item' value='${list.Title}' title='${list.Title}' draggable='true' ondragstart='drag(event)'>                        
            <a href='${list.Url}'><span class='rightBorder textSiteMap'>&nbsp;${list.Title}</span></a>
            <ul id='ul_${i}' class='nested'></ul>
        </li>`;
        var parentNode = document.getElementById(`list_${list.Title}`);        
        if (list.Nodes.length > 0) {
            parentNode.classList.toggle("caret");
            let subNodeList = document.getElementById(`ul_${i}`);
            for (const subNode of list.Nodes) {
                subNodeList.innerHTML += `<li draggable='true'><a class='aTextSiteMap NotHaveChild' href='${subNode.Url}'>${subNode.Title}</a></li>`;
            }
        }        
            i++;
        }
        /*if ((list.ListTemplateType != 0 || list.Children.length > 0) && (list.IsHidden !== true)) {
            siteMapTree.innerHTML +=
                `<li id='site_${i}' url='${list.Url}' title='${list.Title}' draggable='true' ondragstart='drag(event)'>                        
                  <a href='${list.Url}'><span class='rightBorder textSiteMap'>&nbsp;${list.Title}</span></a>
                  <ul id='ul_${i}' class='nested'></ul>
              </li>`;
            var parentNode = document.getElementById(`site_${i}`);
            if (list.SubSites.length > 0) {
                parentNode.classList.toggle("caret");
                let subSitesList = document.getElementById(`ul_${i}`);
                for (const subSite of list.SubSites) {
                    subSitesList.innerHTML += `<li draggable='true'><a class='aTextSiteMap NotHaveChild' href='${subSite.Url}'>${subSite.Title}</a></li>`;
                }
            }
        }
        i++;
    }  */

    }
}

const initAddLinkModal = async (title, id) => {
    await openModalDialog(title, '/_catalogs/masterpage/Click/views/webparts/addLink.html');
}

const addLink = () => {
    initAddLinkModal("הוספת קישור")
}

const addNewLink = async () => {
    var f = spContextObject.User.ID + "_" + spContextObject.User.DisplayName;
    const listItem = {
        Title: document.getElementById("linkTitle").value,
        UsefulLink: { 'Url': document.getElementById("linkUrl").value, 'Description': 'לחץ על הקישור', '__metadata': { 'type': 'SP.FieldUrlValue' } },
        UsefulLinksOrder: navObject.GlobalVariables.ListsAndDocLibs.maxOrder,
        UsefulLinksHide: false
    };
    navObject.GlobalVariables.ListsAndDocLibs.maxOrder++;
    await createItemInsideFolder(navObject.Lists.UsefulLinks.HE, navObject.Lists.UsefulLinks.EN, f, listItem);
    editLinks();
    closeModal();
}

const drawListsAndLibreries = async (showAll) => {
    let navBox = document.getElementById('navBox');
    navBox.innerHTML = "";
    var listsAndDoclibsHtmlElement =
        `<ul id='listMapULUL'>
            <li id='listMap'>
                <div class='caret1'>
                    <span class='rightBorder1 textSiteMap'>&nbsp;&nbsp;&nbsp;<b>רשימות וספריות מסמכים</b></span>
                </div>
                <br>
                <div id='addLink' class=''>
                    <a href="javascript:void(0)" class="editLinks addLinks mySidebarActions__item" onclick="addLink()">
                        <img src="${spContextObject.CONSTANTS.WEBAPPLICATIONURL}/_catalogs/masterpage/click/public/images/add-link-16.png" alt="ערוך" width="16" height="16" />הוספת קישור
                    </a>
                </div>
                <ul id='tree' ondrop='drop(event)' ondragover='allowDrop(event)'>
                </ul>
            </li>
        </ul>`;
    navBox.innerHTML = listsAndDoclibsHtmlElement;
    /*const usfulLinks = await getUsefulLinks(); //'and UsefulLinksHide eq false'
    navObject.GlobalVariables.ListsAndDocLibs.maxOrder = usfulLinks.length;
    drawLinks(usfulLinks, showAll);*/
    drawLinks();
    //Init tree nodes toggling
    toggler("caret");
}

const addActionsEditLinks = (el) => {
    el.innerHTML += `<div class="listItem__actions">
    <select class="select__list" id='select__${el.id}' title="מיין"></select>
    <img id='img__${el.id}' onclick="toggleLinkImage(this)" title="הסתר" src="${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/click/public/images/eye-3-16.png" alt="הסתר" width="16" height="16" />
    </div>`;
    let select = document.getElementById(`select__${el.id}`);
    let img = document.getElementById(`img__${el.id}`);
    for (let index = 0; index < navObject.GlobalVariables.ListsAndDocLibs.maxOrder; index++) {
        addOptionHtmlElement(`select__${el.id}`, 'option', index);
    }
    select.value = el.value;
    select.addEventListener("change", function (e) {
        changeOrder(this);
    });

    //icon hide or display
    if (el.attributes.hide.value === 'true') {
        img.src = img.src.replace('eye-3-16.png', 'icons8-hide-32-removebg.png');
        img.title = "הצג";
        let currentImg = img.id.split("img__")[1];
        let li = document.getElementById(`${currentImg}`);
        li['hide'] = true;
        li.classList.add("link__cahnge");
    }
}

const changeOrder = (selectedElement) => {
    let currentLi = selectedElement.id.split("select__")[1]; //Get the list_{id}
    //prev value of the li
    let li = document.getElementById(`${currentLi}`);
    let prevValue = li.value;
    //All select element
    let s = document.querySelectorAll('.select__list');
    let switchSelect = [...s].filter(x => x.value == selectedElement.value);
    switchElementValue(switchSelect, currentLi, prevValue, selectedElement.value);
}

const switchElementValue = (elementsToSwitch, elementId, prevValue, newValue) => {
    let switchSelect = elementsToSwitch.filter(x => x.id !== `select__${elementId}`);
    let changedSelect = elementsToSwitch.filter(x => x.id === `select__${elementId}`);
    let switchLiId = switchSelect[0].id.split("select__")[1];
    let changedLiId = changedSelect[0].id.split("select__")[1];
    let switchLi = document.getElementById(`${switchLiId}`);
    let changedLi = document.getElementById(`${changedLiId}`);
    //change
    switchSelect[0].value = prevValue;
    switchLi.value = prevValue;
    switchLi.classList.add("link__cahnge");

    changedSelect[0].value = newValue;
    changedLi.value = newValue;
    changedLi.classList.add("link__cahnge");
}

const removeActionsEditLinks = () => {
    if (!isNullOrEmpty(document.querySelector('.editLinks'))) {
        document.querySelector('.editLinks').remove();
    }
}

const editLinks = async () => {
    await drawListsAndLibreries(true);
    let items = document.querySelectorAll('.listMap__item');
    for (const item of items) {
        addActionsEditLinks(item);
    }
    let actions = document.getElementById('mySidebarActions');
    actions.innerHTML += `<button class="mySidebarActions__btn" type="button" onclick="updateLinksDetails()">אישור</button><button class="mySidebarActions__btn" type="button" onclick="cancelEditLinks()">ביטול</button>`;
    let addLinkBtn = document.getElementById('addLink');
    addLinkBtn.style.display = 'block';
}

const cancelEditLinks = () => {
    let collection = document.querySelectorAll('.listItem__actions');
    for (let item of collection) {
        item.remove();
    }

    let btns = document.querySelectorAll('.mySidebarActions__btn');
    for (let btn of btns) {
        btn.remove();
    }

    drawListsAndLibreries(false);
}

const toggleLinkImage = (img) => {
    if (img.src.indexOf('eye-3-16.png') > 0) {
        img.src = img.src.replace('eye-3-16.png', 'icons8-hide-32-removebg.png');
        img.title = "הצג";
        let currentImg = img.id.split("img__")[1];
        let li = document.getElementById(`${currentImg}`);
        li['hide'] = true;
        li.classList.add("link__cahnge");
    } else {
        img.src = img.src.replace('icons8-hide-32-removebg.png', 'eye-3-16.png');
        img.title = "הסתר";
        let currentImg = img.id.split("img__")[1];
        let li = document.getElementById(`${currentImg}`);
        li['hide'] = false;
        li.classList.add("link__cahnge");
    }

}

const updateLinksDetails = async () => {
    let items = document.querySelectorAll('.link__cahnge');
    for (const item of items) {
        const listItem = {
            __metadata: { "type": getListItemType(navObject.Lists.UsefulLinks.EN) },
            //Title: item.Title,
            //UsefulLink: { 'Url': item.Url, 'Description': 'לחץ על הקישור', '__metadata': { 'type': 'SP.FieldUrlValue' } },
            UsefulLinksOrder: item.value,
            UsefulLinksHide: item.hide
        };
        const itemId = item.id.split('list_')[1];
        await updateListItem(navObject.Lists.UsefulLinks.HE, itemId, listItem);
    }
    //Refresh the list
    cancelEditLinks();

}

initSiteListsAndLibraries()