window.PMOclick = window.PMOclick || {};

PMOClickAddToFavorite = {

    GlobalVariables: {
        FavArr: [],
        PointersArr : [],
        MyFavorites: [],
        MyFavoritesRemoved: []
    },

    Lists: {
        Favorite: {
            HE: "מועדפים",
            EN: "userFavorites"
        }
    },

    Init: function () {
        //ChangeModal Title
        $('.ms-dlgTitleText').text("הוספה למועדפים");
        $('.ms-dlgTitleText').val("הוספה למועדפים");
        PMOClickAddToFavorite.GlobalVariables.MyFavorites = PMOClick.Methods.GetListItemsREST(null,PMOClickAddToFavorite.Lists.Favorite.HE, null, "$filter=Author eq " + PMOClick.User.ID +" and FSObjType eq 0&$orderby=Created desc",null,null,null);
        PMOClickAddToFavorite.Load();
    },

    Load: function () {
        if(PMOClickAddToFavorite.GlobalVariables.MyFavorites.value.length > 0){
            $.each(PMOClickAddToFavorite.GlobalVariables.MyFavorites.value,function(i,v){
                favType = PMOClickAddToFavorite.Methods.GetFavTypeIcon(v.Title, v.URL.Url, v.favoriteType);
                PMOClickAddToFavorite.Methods.DrawFavoriteOnPreview(v.Title, favType, v.URL.Url, v.favoriteType,v.Id);
            });            
        }
        if (PMOClickAddToFavorite.GlobalVariables.FavArr.length == 6) {
            $('.disAddFav').prop('disabled', true);
        }
        if (PMOClickAddToFavorite.GlobalVariables.FavArr.length >= 5) {
            $('#notification').show();
        }      
    },

    Methods: {

        GetFavTypeIcon : function(favDisplayName, favUrl, favTypeText){
            var favType = null;
            switch (favTypeText) {
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
        },

        ShowPreview: function () {
            var favDisplayName = $("#favName").val();
            var favUrl = $("#favUrl").val();
            var favTypeText = $("input[name='fType']:checked").val();
            if (favDisplayName != "" && favUrl != "" && favTypeText != "") {
                if (PMOClickAddToFavorite.GlobalVariables.FavArr.length < 6  || $("#favIndexUpdate").val() != '') {
                    if (PMOClickAddToFavorite.GlobalVariables.FavArr.length == 5) {
                        $('.disAddFav').prop('disabled', true);
                    }
                    if (PMOClickAddToFavorite.GlobalVariables.FavArr.length >= 4) {
                        $('#notification').show();
                    }
                    var favType = null;
                    favType = PMOClickAddToFavorite.Methods.GetFavTypeIcon(favDisplayName, favUrl, favTypeText);
                    if($("#favIndexUpdate").val()=='')
                        PMOClickAddToFavorite.Methods.DrawFavoriteOnPreview(favDisplayName, favType, favUrl, favTypeText,0);
                    else
                    {
                        var index = $("#favIndexUpdate").val();
                        var favId = PMOClickAddToFavorite.GlobalVariables.FavArr[index].fspItemID;
                        PMOClickAddToFavorite.Methods.UpdatePreview(favDisplayName, favType, favUrl, favTypeText, favId, index);
                    }
                }
                //Clear all fields
                $('.favField').val('');
                $('input[name="fType"]').prop('checked', false); 
            }                                   
        },

        GetFavHTML : function(index, favDisplayName, favType, favId){
            return "<div class='col-lg-1 col-md-1 col-sm-1' id='" + index + "' spItemID='"+favId+"'>" +
            "<img src='/_layouts/images/delitem.gif' style='float:right;' onclick='PMOClickAddToFavorite.Methods.RemoveFromPreview(this)' class='imgDeleteFav' />" +
            "<img src='/_catalogs/masterpage/click/images/edit.png' style='float:left;' onclick='PMOClickAddToFavorite.Methods.SetFieldToUpdate(this)' class='imgUpdateFav' />" +
            "<div style='width:100%; display:inline-block;'>" +
            "<div class='h-50' style='text-align: center;'>" +
            "<img alt='AddToFavorite' src='/_catalogs/masterpage/click/images/" + favType + "'/>" +
            "</div>" +
            "</div>" +
            "<div class='col-lg-1 col-md-1 col-sm-1 pmoFavoriteText'>" +
            "<span>" + favDisplayName + "</span>" +
            "</div>" +
            "</div>";
        },

        DrawFavoriteOnPreview: function (favDisplayName, favType, favUrl, favTypeText, favId) {
            var p = PMOClickAddToFavorite.GlobalVariables.FavArr.length;            
            var preview = PMOClickAddToFavorite.Methods.GetFavHTML(p, favDisplayName, favType, favId);
            $(".FormPreview").append(preview);
            var f = { fType: favTypeText, fName: favDisplayName, fURL: favUrl, fspItemID: favId};
            PMOClickAddToFavorite.GlobalVariables.FavArr.push(f);
        },

        AddToFavorite: function (elm) {
            // var form = document.getElementById("formBody");
            document.getElementById("loader").style.display = "block";
            $('.addButton').prop('disabled', true);
            $('.cancelButton').prop('disabled', true);
            $('.disAddFav').prop('disabled', true);
            var f = PMOClick.User.ID+"_"+PMOClick.User.DisplayName;
            //Check if folder exist
            var fExist = PMOClick.Methods.GetFolderREST(PMOClickAddToFavorite.Lists.Favorite.HE,f);
            if(fExist.value.length == 0){
                var folderName = PMOClick.Methods.CreateFolderREST(PMOClickAddToFavorite.Lists.Favorite.HE,PMOClickAddToFavorite.Lists.Favorite.EN,f);                            
                $.each(PMOClickAddToFavorite.GlobalVariables.FavArr, function (indrx, value) {
                    var listItem = {Title:value.fName, URL:{'Url':value.fURL,'Description':'לחץ על הקישור','__metadata': { 'type': 'SP.FieldUrlValue' }}, favoriteType:value.fType};    
                    PMOClick.Methods.CreateItemInsideFolder(PMOClickAddToFavorite.Lists.Favorite.HE,PMOClickAddToFavorite.Lists.Favorite.EN,folderName.Title,listItem);
                });                
            }
            else{
                $.each(PMOClickAddToFavorite.GlobalVariables.FavArr, function (indrx, value) {
                    var listItem = {Title:value.fName, URL:{'Url':value.fURL,'Description':'לחץ על הקישור','__metadata': { 'type': 'SP.FieldUrlValue' }}, favoriteType:value.fType};    
                    if(value.fspItemID == 0)
                        PMOClick.Methods.CreateItemInsideFolder(PMOClickAddToFavorite.Lists.Favorite.HE,PMOClickAddToFavorite.Lists.Favorite.EN,f,listItem);
                    else
                        PMOClick.Methods.UpdateListItemREST(PMOClickAddToFavorite.Lists.Favorite.HE,PMOClickAddToFavorite.Lists.Favorite.EN, value.fspItemID, listItem);
                });
            }
            $.each(PMOClickAddToFavorite.GlobalVariables.MyFavoritesRemoved, function (indrx, value) {
                    PMOClick.Methods.DeleteListItemREST(PMOClickAddToFavorite.Lists.Favorite.HE, value.fspItemID);
            });
            PMOClickAddToFavorite.GlobalVariables.MyFavoritesRemoved = [];
            window.parent.location.href = window.parent.location.href;
        },

        RemoveFromPreview: function (element) {
            var index = $(element).parent()[0].id;
            PMOClickAddToFavorite.GlobalVariables.MyFavoritesRemoved.push(PMOClickAddToFavorite.GlobalVariables.FavArr[index]);
            PMOClickAddToFavorite.GlobalVariables.FavArr.splice(index, 1);       
            $(element).parent().remove();

            //reindex
            var xArr = $(".FormPreview").children();
            for (let i = 0; i < xArr.length; i++) {
                xArr[i].id = i;
            }
            //return ShowPreview button to enable mode
            $('.disAddFav').prop('disabled', false);
            if (PMOClickAddToFavorite.GlobalVariables.FavArr.length >= 5)
                $('#notification').show();
            else
                $('#notification').hide();
        },

        SetFieldToUpdate : function(element){
            var index = $(element).parent()[0].id;
            $("#favName").val(PMOClickAddToFavorite.GlobalVariables.FavArr[index].fName);
            $("#favUrl").val(PMOClickAddToFavorite.GlobalVariables.FavArr[index].fURL);
            $('#' + PMOClickAddToFavorite.GlobalVariables.FavArr[index].fType).prop('checked',true);
            $("#favIndexUpdate").val(index);
            $('.disAddFav').prop('disabled', false);
        },

        UpdatePreview : function(favDisplayName, favType, favUrl, favTypeText, favId, index){
            var preview = PMOClickAddToFavorite.Methods.GetFavHTML(index, favDisplayName, favType, favId);
            $(".FormPreview").children()[index].innerHTML = preview;
            var f = { fType: favTypeText, fName: favDisplayName, fURL: favUrl, fspItemID: favId};
            PMOClickAddToFavorite.GlobalVariables.FavArr[index] = f;
            if (PMOClickAddToFavorite.GlobalVariables.FavArr.length >= 5)
                $('#notification').show();
            else
                $('#notification').hide();
        }
    }
};