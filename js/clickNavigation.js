const navigationCategories_object = {
    GlobalVariables: {
        categoryCollection: [],     //navigationCategories_object.GlobalVariables.categoryCollection
        location: "intpmoclick",       //navigationCategories_object.GlobalVariables.location
        scheme: "http"             //navigationCategories_object.GlobalVariables.scheme
    },
    Lists: {
        EN: "navigationCategories", //navigationCategories_object.Lists.EN
        HE: "navigationCategories"  //navigationCategories_object.Lists.HE
    }
}

const navigationItems_object = {
    GlobalVariables: {
        itemCollection: [],    //navigationItems_object.GlobalVariables.itemCollection
        location: "intpmoclick",  //navigationItems_object.GlobalVariables.location
        scheme: "http"        //navigationItems_object.GlobalVariables.scheme
    },
    Lists: {
        EN: "navigationItems", //navigationItems_object.Lists.EN
        HE: "navigationItems"  //navigationItems_object.Lists.HE
    }
}

const defaultColor = "255,255,255"; //white

const defaultIconSrc = `${navigationCategories_object.GlobalVariables.scheme}://${navigationCategories_object.GlobalVariables.location}/images/defaultNavIcon.png`;

const buildmyQueryUrl = (queryURL, list, beforeQueryString, selectedFields, filterByCommand, expand, orderBy, topItems) => {
    let requestUri = queryURL;
    //Select
    if (selectedFields !== null && selectedFields !== undefined)
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?${selectedFields}`;
    else
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?`;
    //FilterBy
    if (filterByCommand !== null && filterByCommand !== undefined)
        requestUri += filterByCommand;
    //Expand
    if (expand != null || expand != undefined)
        requestUri += expand;
    //OrderBy
    if (orderBy != null || orderBy != undefined)
        requestUri += orderBy;
    //Top
    if (topItems != null || topItems != undefined){
        requestUri += topItems;
    } else {
        requestUri += `&$top=300`;
    }
    return requestUri;
}

const getNavData = async (url) => {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json', 'accept': 'application/json' } }).then(response => { return response.json() })
        .then(responseData => {
            return responseData
        }).catch(error => {
            console.log(error);
        });
    return response;
}

const queryCategories = async () => {
    const categoriesQuery = buildmyQueryUrl(`${navigationCategories_object.GlobalVariables.scheme}://${navigationCategories_object.GlobalVariables.location}`, navigationCategories_object.Lists.HE, "", null, null, `&$expand=AttachmentFiles`, `&$orderBy=displayOrder asc`, null);
    const categoriesItems = await getNavData(categoriesQuery);
    if (categoriesItems.value.length > 0) { navigationCategories_object.GlobalVariables.categoryCollection = categoriesItems.value }
}

const queryItems = async () => {
    const navItemsQuery = buildmyQueryUrl(`${navigationItems_object.GlobalVariables.scheme}://${navigationItems_object.GlobalVariables.location}`, navigationItems_object.Lists.HE, "", null, `&$filterBy=active eq 1`, null, `&$orderBy=displayOrder asc`, null);
    const navItems = await getNavData(navItemsQuery);
    if (navItems.value.length > 0) {
        for (const itm of navItems.value) {
            var obj = new Object(itm);
            obj.indented = (itm.indent == 1);
            obj.lastDate = new Date();
            obj.newUntilDate = new Date((obj.lastDate).getFullYear(), (obj.lastDate).getMonth(), (obj.lastDate).getDate() - 1);
            if (!(isNullOrEmpty(itm.displayUntil))) { obj.lastDate = new Date(itm.displayUntil) }
            if (!(isNullOrEmpty(itm.newUntil))) { obj.newUntilDate = new Date(itm.newUntil) }
            //obj.lastDate = new Date(itm.displayUntil);
            obj.category = navigationCategories_object.GlobalVariables.categoryCollection.find(c => c.Id == itm.navigationCategoryId);
            navigationItems_object.GlobalVariables.itemCollection.push(obj);
        }
    }
}

const verifiedColor = (rgbStr) => {

    //let result = "255,255,255";

    let test = true;
    const col = rgbStr.split(",");
    for (const c of col) {
        let intC = parseInt(c);
        if (intC.toString() != c) { test = false };
        if ((intC >= 0) && (intC <= 255)) { test = false };
    }

    if (test) { return rgbStr } else { return defaultColor };

}

const isNullOrEmpty = (value) => {
    return (!value || value == undefined || value == "" || value.length == 0);
}

const renderNavigation = async () => {
    await queryCategories();
    await queryItems();

    const todayNow = new Date();
    const today = new Date(todayNow.getFullYear(), todayNow.getMonth(), todayNow.getDate());

    const navGrid = document.createElement("div");
    navGrid.classList.add("navGrid");

    for (const cat of navigationCategories_object.GlobalVariables.categoryCollection) {

        const catItems = navigationItems_object.GlobalVariables.itemCollection.filter(i => ((i.navigationCategoryId == cat.Id) && (i.lastDate > today)));
        if (catItems.length > 0) {
            const catDiv = document.createElement("div");
            catDiv.classList.add("catDiv");

            //ADD GRAPHIC
            const icon = document.createElement("img");
            icon.title = cat.Title;
            icon.src = defaultIconSrc;
            if (cat.AttachmentFiles.length > 0) {
                icon.src = `${navigationCategories_object.GlobalVariables.scheme}://${navigationCategories_object.GlobalVariables.location}${cat.AttachmentFiles[0].ServerRelativeUrl}`;
            }
            const iconDiv = document.createElement("div");
            iconDiv.classList.add("iconDiv");
            iconDiv.appendChild(icon);
            catDiv.appendChild(iconDiv);

            //ADD TITLE
            const catTitle = document.createElement("div");
            catTitle.classList.add("catTitle");
            catTitle.style.color = `rgb(${verifiedColor(cat.displayColor)})`;
            catTitle.innerHTML = cat.Title;
            catDiv.appendChild(catTitle);

            //ADD ITEMS
            //const catItems = navigationItems_object.GlobalVariables.itemCollection.filter(i => i.navigationCategoryId == cat.Id);
            for (const itm of catItems) {
                const itmDiv = document.createElement("div");
                itmDiv.classList.add("itmDiv");

                const bullet = document.createElement("div");
                bullet.classList.add("bullet");
                bullet.innerHTML = "&#9702;"
                bullet.style.color = `rgb(${verifiedColor(itm.bulletColor)})`;
                if (itm.indented) {
                    bullet.classList.add("indented");
                    bullet.innerHTML = "*";
                }
                itmDiv.appendChild(bullet);

                itmText = document.createElement("div")
                if (itm.link != null) {
                    const itmA = document.createElement("a");
                    itmA.classList.add("itmA");
                    itmA.href = itm.link;
                    itmA.innerHTML = itm.Title;
                    if (itm.newUntilDate >= today) { itmA.innerHTML += `&nbsp;&nbsp;<span class="newItem">חדש!</span>` }
                    itmA.style.color = `rgb(${verifiedColor(itm.displayColor)})`;
                    itmDiv.appendChild(itmA);
                } else {
                    const itmB = document.createElement("div");
                    itmB.classList.add("itmB");
                    itmB.innerHTML = itm.Title;
                    itmB.style.color = `rgba(${verifiedColor(itm.displayColor)},0.5)`;
                    itmDiv.appendChild(itmB);
                }
                catDiv.appendChild(itmDiv);
            }
            navGrid.appendChild(catDiv)
        }
    }
    return navGrid;
}
const renderCloseButton = () => {
    const closeButtonDiv = document.createElement("div");
    closeButtonDiv.classList.add("closeButtonDiv");

    const closeButton = document.createElement("a");
    closeButton.classList.add("closebtn");
    closeButton.href = "javascript:void(0)";
    closeButton.setAttribute(`onclick`, `PMOClick.Methods.CloseNav()`);
    closeButton.innerHTML = "×";
    closeButtonDiv.appendChild(closeButton);

    return closeButtonDiv;
}
const renderPage = async () => {
    //housekeeping
    const clickNavigation = document.getElementById("clickNavigation");

    //closeButton
    clickNavigation.appendChild(renderCloseButton());

    //nav
    clickNavigation.appendChild(await renderNavigation());
}

window.addEventListener("load", function () {
    renderPage();
})