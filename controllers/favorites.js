const favoriteObject = {

    GlobalVariables: {
        favArr: [], //Array of new favorites
        pointersArr: [],
        myFavorites: [], //Array of existing favorites
        myFavoritesRemoved: [],
        favContainer: { panel: 'favorites__personal', preview: 'formFavoritesPreview' }
    },

    Lists: {
        Favorite: {
            HE: "מועדפים",
            EN: "userFavorites"
        }
    }
}

const initFavoritesModal = async() => {
    await openModalDialog('מועדפים', `/_catalogs/masterpage/Click/views/webparts/favorites.html`);
    //Disable Save btn if there is 6 favs
    if (favoriteObject.GlobalVariables.myFavorites.length > 5) {
        document.getElementById("save__btn").disabled = true;
    }
    for (const favorite of favoriteObject.GlobalVariables.myFavorites) {
        drawFavorite('formFavoritesPreview', favorite.Title, favorite.favoriteType, favorite.URL.Url, favorite.Id);
    }
}

const loadFavorites = async() => {
    let favPanel = document.getElementById('favorites__personal');
    var userId;
    let a = await getData(`${spContextObject.CONSTANTS.WEBAPPLICATIONURL}/_api/web/SiteUsers?$filter=Email eq '${spContextObject.User.Email}'`);
    if(!isNullOrEmpty(a)){
        userId = a.value[0].Id;   
    }
    else{
        return;
    }
    favPanel.innerHTML = "";
    /*if (sessionStorage.getItem('currentUser')) {
        userId = JSON.parse((sessionStorage.getItem('currentUser'))).ID;
    } else {
        userId = spContextObject.User.ID;
    }*/
    const requestUri = buildRequestUrl(spContextObject.CONSTANTS.WEBAPPLICATIONURL, favoriteObject.Lists.Favorite.HE, "items", null, `$filter=Author eq ${userId} and FSObjType eq 0&$orderby=Created desc`, null, null, null);
    const favorites = await getData(requestUri);
    if (favorites.value.length > 0) {
        favoriteObject.GlobalVariables.myFavorites = favorites.value
        for (const favorite of favoriteObject.GlobalVariables.myFavorites) {
            drawFavorite('favorites__personal', favorite.Title, favorite.favoriteType, favorite.URL.Url, favorite.Id);
        }
    }
}


const closeFavoriteModal = (scriptRef) => {
    //removeScript(scriptRef)
    favoriteObject.GlobalVariables.favArr = [];
    loadFavorites();
    closeModal()
}

const drawFavorite = (container, favDisplayName, favType, favUrl, favId) => {
    const favIcon = getFavTypeIcon(favType);
    const favHtml = getFavHTML(container, favDisplayName, favIcon, favId, favUrl, favId);
    document.getElementById(container).innerHTML += favHtml;
}


const drawFavoriteOnPreview = (favDisplayName, favType, favUrl, favTypeIcon, favId) => {
    var p = favoriteObject.GlobalVariables.favArr.length;
    var favHtml = getFavHTML(p, favDisplayName, favTypeIcon, favId);
    document.getElementById('formFavoritesPreview').innerHTML += favHtml;
    var f = { fType: favType, fName: favDisplayName, fURL: favUrl, fspItemID: favId };
    favoriteObject.GlobalVariables.favArr.push(f);
}

const getFavHTML = (container, favDisplayName, favType, favId, favUrl, index) => {
    let favHtml;
    switch (container) {
        case favoriteObject.GlobalVariables.favContainer.panel:
            favHtml =
                `<div id='${favId}' title='${favDisplayName}'>
                    <img class="favorites__img" onclick='openWindow("${favUrl}")' alt='${favDisplayName}' src='/_catalogs/masterpage/Click/public/images/${favType}'/>                    
                    <span class='favorites__txt'>${favDisplayName}</span>                    
                </div>`;
            break;
        case favoriteObject.GlobalVariables.favContainer.preview:
            favHtml =
                `<div id='${index}' spItemID='${favId}'>
                    <img src='/_layouts/images/delitem.gif' onclick='removeFavorite(this)' class='imgDeleteFav' />
                    <img src='/_catalogs/masterpage/Click/public/images/edit.png' onclick='setFieldToUpdate(this)' class='imgUpdateFav' />
                    <img alt='${favDisplayName}' src='/_catalogs/masterpage/Click/public/images/${favType}'/>
                    <div class='favorites__txt'>
                        <span>${favDisplayName}</span>
                    </div>
                </div>`;
            break;
        default:
            break;
    }
    return favHtml;
}

const getFavTypeIcon = (favTypeP) => {
    var favType = null;
    switch (favTypeP) {
        case "doc":
            favType = "fileIcon.png";
            break;
        case "page":
            favType = "pageIcon.png";
            break;
        case "form":
            favType = "formsIcon.png";
            break;
    }
    return favType;
}

const drawFavoritePreview = () => {
    //Remove hightlights
    const removeHiglights = document.querySelectorAll('.errorHighlights');
    for (element of removeHiglights) {
        element.classList.remove('errorHighlights');
    }
    const favDisplayName = document.getElementById('favName').value;
    const favUrl = document.getElementById('favUrl').value
    const favType = (!isEmpty(document.querySelector('input[name="fType"]:checked'))) ? document.querySelector('input[name="fType"]:checked').value : null;
    if (isValidFavoritesDetails(favDisplayName, favUrl, favType)) {
        var f = { fType: favType, fName: favDisplayName, fURL: favUrl };
        favoriteObject.GlobalVariables.favArr.push(f);
        if ((favoriteObject.GlobalVariables.myFavorites.length + favoriteObject.GlobalVariables.favArr.length) < 7) {
            drawFavorite('formFavoritesPreview', favDisplayName, favType, favUrl, (`${favType}_${favDisplayName.replace(/\s/g,'')}`));
        } else {
            showNotification("warning", "מועדפים: ", "לא ניתן להכיל יותר מ -6 מועדפים");
        }
        //Clear all fields        
        clearFavoriteFormFields()
    } else {
        const hasFavDisplayName = (!isEmpty(favDisplayName)) ? true : document.getElementById('favName').classList.add('errorHighlights');
        const hasFavUrl = (!isEmpty(favUrl) && isValidUrl(favUrl)) ? true : document.getElementById('favUrl').classList.add('errorHighlights');
        const hasFavType = (!isEmpty(favType)) ? true : document.querySelector('.favorites__form_typeContainer').classList.add('errorHighlights');
    }
}

const isValidFavoritesDetails = (favDisplayName, favUrl, favType) => {
    const hasFavDisplayName = (!isEmpty(favDisplayName)) ? true : false;
    const hasFavUrl = (!isEmpty(favUrl) && isValidUrl(favUrl)) ? true : false;
    const hasFavType = (!isEmpty(favType)) ? true : false;

    if (hasFavDisplayName && hasFavUrl && hasFavType) {
        if ((favoriteObject.GlobalVariables.myFavorites.length < 6 && favoriteObject.GlobalVariables.favArr.length < 6) || document.getElementById("favIndexUpdate").value != '') {
            document.getElementById("save__btn").disabled = false;
            if (favoriteObject.GlobalVariables.favArr.length == 5) {
                $('.disAddFav').prop('disabled', true);
            }
            if (favoriteObject.GlobalVariables.favArr.length >= 4) {
                $('#notification').show();
            }
            return true;
        }
    } else {
        showNotification("warning", "מועדפים: ", "לא ניתן להכיל יותר מ -6 מועדפים");
        return false;
    }

    return false;
}

const isValidUrl = (url) => {
    let pattern = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    const isValid = pattern.test(url);
    return isValid;
}

const clearFavoriteFormFields = () => {
    for (let item of document.getElementsByClassName('favField')) {
        switch (item.type) {
            case 'radio':
                item.checked = false
                break;

            default: //Text
                item.value = ''
                break;
        }
    }
}

const addToFavorite = async(elm) => {
    document.getElementById("loader").style.display = "block";
    document.getElementById('save__btn').disabled = true;
    document.getElementById('cancel__btn').disabled = true;
    let userId = null;
    //document.getElementsByClassName('disAddFav').prop('disabled', true);
    let a = await getData(`${spContextObject.CONSTANTS.WEBAPPLICATIONURL}/_api/web/SiteUsers?$filter=Email eq '${spContextObject.User.Email}'`);
    if(!isNullOrEmpty(a)){
        userId = a.value[0].Id;   
    }
    else{
        return;
    }
    var f = userId + "_" + spContextObject.User.DisplayName;
    //Check if folder exist
    var fExist = await getFolder(favoriteObject.Lists.Favorite.HE, f,spContextObject.CONSTANTS.WEBAPPLICATIONURL);
    let folderName;
    //Create folder if doesn't exist
    if (fExist.length == 0) {
        folderName = await createFolder(favoriteObject.Lists.Favorite.HE, favoriteObject.Lists.Favorite.EN, f,spContextObject.CONSTANTS.WEBAPPLICATIONURL);
    }
    //Create favorites inside the folder
    for (const element of favoriteObject.GlobalVariables.favArr) {
        const listItem = { Title: element.fName, URL: { 'Url': element.fURL, 'Description': 'לחץ על הקישור', '__metadata': { 'type': 'SP.FieldUrlValue' } }, favoriteType: element.fType };
        await createItemInsideFolder(favoriteObject.Lists.Favorite.HE, favoriteObject.Lists.Favorite.EN, f, listItem,spContextObject.CONSTANTS.WEBAPPLICATIONURL);
    }
    favoriteObject.GlobalVariables.favArr = [];
    closeModal();
    //Render favorites to the panel 
    loadFavorites();
}

const removeFavorite = (element) => {
    if (confirm("האם ברצונך למחוק את הפריט מרשימת המועדפים שלך? \n בחר/י אישור או ביטול.")) {
        const itemId = parseInt(element.parentElement.id);
        if (!isNaN(itemId)) {
            favoriteObject.GlobalVariables.myFavorites = favoriteObject.GlobalVariables.myFavorites.filter(x => x.Id !== itemId);
            deleteListItem(favoriteObject.Lists.Favorite.HE, itemId);
        } else {
            favoriteObject.GlobalVariables.favArr = favoriteObject.GlobalVariables.favArr.filter(x => x.Id !== itemId);
        }
        element.parentElement.remove();
        //Enable Save btn if there is less then 6 favs
        if (favoriteObject.GlobalVariables.myFavorites.length <= 6) {
            document.getElementById("save__btn").disabled = false;
        }
    }
}

const setFieldToUpdate = (element) => {
    const itemId = parseInt(element.parentElement.id);
    if (!isNaN(itemId)) {
        let btn = document.getElementsByClassName('btnShowPreview')[0];
        let editableFavorite = favoriteObject.GlobalVariables.myFavorites.filter(x => x.Id === itemId);
        document.getElementById('favName').value = editableFavorite[0].Title;
        document.getElementById('favUrl').value = editableFavorite[0].URL.Url;
        document.querySelector(`input[id='${editableFavorite[0].favoriteType}']`).checked = true;
        btn.textContent = "עדכון מועדף";
        btn.value = "update";
        btn.setAttribute('onclick', `updatePreview(${itemId})`);
        if (favoriteObject.GlobalVariables.myFavorites.length <= 6) {
            document.getElementById("save__btn").disabled = false;
        }
    } else {
        let editableFavorite = favoriteObject.GlobalVariables.favArr.filter(x => x.Id === itemId);
    }
}

const updatePreview = async(favId) => {
    let editableFavorite = favoriteObject.GlobalVariables.myFavorites.filter(x => x.Id === favId);
    let btn = document.getElementsByClassName('btnShowPreview')[0];
    document.getElementById(favId).remove();
    const favDisplayName = editableFavorite[0].Title = document.getElementById('favName').value;
    const favUrl = editableFavorite[0].URL.Url = document.getElementById('favUrl').value
    const favType = editableFavorite[0].favoriteType = document.querySelector('input[name="fType"]:checked').value;
    drawFavorite('formFavoritesPreview', favDisplayName, favType, favUrl, favId);
    const listItem = { Title: favDisplayName, URL: { 'Url': favUrl, 'Description': 'לחץ על הקישור' }, favoriteType: favType };
    await updateListItem(favoriteObject.Lists.Favorite.HE, favId, listItem);
    btn.textContent = "הוספת מועדף +";
    btn.value = "insert";
    btn.setAttribute('onclick', `drawFavoritePreview()`);
}

const initFavorites = () => {
    console.log(`${new Date()} :init favorites`);
    loadFavorites();
}

initFavorites();