const linkItemsObject = {

    GlobalVariables: {
        favArr: [], //Array of new LinkItems
        pointersArr: [],
        myLinkItems: [], //Array of existing LinkItems
        myLinkItemsRemoved: [],
        favContainer: { panel: 'LinkItems__personal', preview: 'formLinkItemsPreview' }
    },

    Lists: {
        Favorite: {
            HE: "מועדפים",
            EN: "userLinkItems"
        }
    }
}

const initLinkItemsModal = async() => {
    await openModalDialog('קישור פריטים', `/_catalogs/masterpage/Click/views/webparts/linkItems.html`);
}

const loadLinkItems = async() => {
    initLinkItemsModal();
}

const initLinkItems = () => {
    console.log(`${new Date()} :init LinkItems`);
    //loadLinkItems();
}

initLinkItems();
