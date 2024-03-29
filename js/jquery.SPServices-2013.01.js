/*
 * SPServices - Work with SharePoint's Web Services using jQuery
 * Version 2013.01
 * @requires jQuery v1.5 or greater - jQuery 1.7+ recommended
 *
 * Copyright (c) 2009-2013 Sympraxis Consulting LLC
 * Examples and docs at:
 * http://spservices.codeplex.com
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
/*
 * @description Work with SharePoint's Web Services using jQuery
 * @type jQuery
 * @name SPServices
 * @category Plugins/SPServices
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */
/* jshint undef: true */
/* global _spUserId, _spPageContextInfo, GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */
(function (ak) {
    var aa = "2013.01";
    var Q = "/";
    var ah = "Column not found on page";
    var ac = "http://schemas.microsoft.com/sharepoint";
    var B = {};
    var b = "Alerts";
    var u = "Authentication";
    var am = "Copy";
    var G = "Forms";
    var ar = "Lists";
    var l = "Meetings";
    var C = "People";
    var f = "Permissions";
    var g = "PublishedLinksService";
    var ai = "Search";
    var A = "SPSearch";
    var ag = "SharePointDiagnostics";
    var Z = "SiteData";
    var aA = "Sites";
    var J = "SocialDataService";
    var ae = "SpellCheck";
    var n = "TaxonomyClientService";
    var k = "usergroup";
    var K = "UserProfileService";
    var E = "Versions";
    var ay = "Views";
    var e = "WebPartPages";
    var av = "Webs";
    var F = "Workflow";
    var ao = new ao();
    var O = 0;
    var x = ["listName", "description"];
    var U = [];
    U.GetAlerts = [b, false];
    U.DeleteAlerts = [b, true];
    U.Mode = [u, false];
    U.Login = [u, false];
    U.CopyIntoItems = [am, true];
    U.CopyIntoItemsLocal = [am, true];
    U.GetItem = [am, false];
    U.GetForm = [G, false];
    U.GetFormCollection = [G, false];
    U.AddAttachment = [ar, true];
    U.AddDiscussionBoardItem = [ar, true];
    U.AddList = [ar, true];
    U.AddListFromFeature = [ar, true];
    U.ApplyContentTypeToList = [ar, true];
    U.CheckInFile = [ar, true];
    U.CheckOutFile = [ar, true];
    U.CreateContentType = [ar, true];
    U.DeleteAttachment = [ar, true];
    U.DeleteContentType = [ar, true];
    U.DeleteContentTypeXmlDocument = [ar, true];
    U.DeleteList = [ar, true];
    U.GetAttachmentCollection = [ar, false];
    U.GetList = [ar, false];
    U.GetListAndView = [ar, false];
    U.GetListCollection = [ar, false];
    U.GetListContentType = [ar, false];
    U.GetListContentTypes = [ar, false];
    U.GetListItemChanges = [ar, false];
    U.GetListItemChangesSinceToken = [ar, false];
    U.GetListItems = [ar, false];
    U.GetVersionCollection = [ar, false];
    U.UndoCheckOut = [ar, true];
    U.UpdateContentType = [ar, true];
    U.UpdateContentTypesXmlDocument = [ar, true];
    U.UpdateContentTypeXmlDocument = [ar, true];
    U.UpdateList = [ar, true];
    U.UpdateListItems = [ar, true];
    U.AddMeeting = [l, true];
    U.CreateWorkspace = [l, true];
    U.RemoveMeeting = [l, true];
    U.SetWorkSpaceTitle = [l, true];
    U.ResolvePrincipals = [C, false];
    U.SearchPrincipals = [C, false];
    U.AddPermission = [f, true];
    U.AddPermissionCollection = [f, true];
    U.GetPermissionCollection = [f, true];
    U.RemovePermission = [f, true];
    U.RemovePermissionCollection = [f, true];
    U.UpdatePermission = [f, true];
    U.GetLinks = [g, true];
    U.GetPortalSearchInfo = [ai, false];
    U.GetQuerySuggestions = [ai, false];
    U.GetSearchMetadata = [ai, false];
    U.Query = [ai, false];
    U.QueryEx = [ai, false];
    U.Registration = [ai, false];
    U.Status = [ai, false];
    U.SPQuery = [A, false];
    U.SPQueryEx = [A, false];
    U.SPRegistration = [A, false];
    U.SPStatus = [A, false];
    U.SendClientScriptErrorReport = [ag, true];
    U.GetAttachments = [Z, false];
    U.EnumerateFolder = [Z, false];
    U.SiteDataGetList = [Z, false];
    U.SiteDataGetListCollection = [Z, false];
    U.SiteDataGetSite = [Z, false];
    U.SiteDataGetSiteUrl = [Z, false];
    U.SiteDataGetWeb = [Z, false];
    U.CreateWeb = [aA, true];
    U.DeleteWeb = [aA, false];
    U.GetSite = [aA, false];
    U.GetSiteTemplates = [aA, false];
    U.AddComment = [J, true];
    U.AddTag = [J, true];
    U.AddTagByKeyword = [J, true];
    U.CountCommentsOfUser = [J, false];
    U.CountCommentsOfUserOnUrl = [J, false];
    U.CountCommentsOnUrl = [J, false];
    U.CountRatingsOnUrl = [J, false];
    U.CountTagsOfUser = [J, false];
    U.DeleteComment = [J, true];
    U.DeleteRating = [J, true];
    U.DeleteTag = [J, true];
    U.DeleteTagByKeyword = [J, true];
    U.DeleteTags = [J, true];
    U.GetAllTagTerms = [J, false];
    U.GetAllTagTermsForUrlFolder = [J, false];
    U.GetAllTagUrls = [J, false];
    U.GetAllTagUrlsByKeyword = [J, false];
    U.GetCommentsOfUser = [J, false];
    U.GetCommentsOfUserOnUrl = [J, false];
    U.GetCommentsOnUrl = [J, false];
    U.GetRatingAverageOnUrl = [J, false];
    U.GetRatingOfUserOnUrl = [J, false];
    U.GetRatingOnUrl = [J, false];
    U.GetRatingsOfUser = [J, false];
    U.GetRatingsOnUrl = [J, false];
    U.GetSocialDataForFullReplication = [J, false];
    U.GetTags = [J, true];
    U.GetTagsOfUser = [J, true];
    U.GetTagTerms = [J, true];
    U.GetTagTermsOfUser = [J, true];
    U.GetTagTermsOnUrl = [J, true];
    U.GetTagUrlsOfUser = [J, true];
    U.GetTagUrlsOfUserByKeyword = [J, true];
    U.GetTagUrls = [J, true];
    U.GetTagUrlsByKeyword = [J, true];
    U.SetRating = [J, true];
    U.UpdateComment = [J, true];
    U.SpellCheck = [ae, false];
    U.AddTerms = [n, true];
    U.GetChildTermsInTerm = [n, false];
    U.GetChildTermsInTermSet = [n, false];
    U.GetKeywordTermsByGuids = [n, false];
    U.GetTermsByLabel = [n, false];
    U.GetTermSets = [n, false];
    U.AddGroup = [k, true];
    U.AddGroupToRole = [k, true];
    U.AddRole = [k, true];
    U.AddRoleDef = [k, true];
    U.AddUserCollectionToGroup = [k, true];
    U.AddUserCollectionToRole = [k, true];
    U.AddUserToGroup = [k, true];
    U.AddUserToRole = [k, true];
    U.GetAllUserCollectionFromWeb = [k, false];
    U.GetGroupCollection = [k, false];
    U.GetGroupCollectionFromRole = [k, false];
    U.GetGroupCollectionFromSite = [k, false];
    U.GetGroupCollectionFromUser = [k, false];
    U.GetGroupCollectionFromWeb = [k, false];
    U.GetGroupInfo = [k, false];
    U.GetRoleCollection = [k, false];
    U.GetRoleCollectionFromGroup = [k, false];
    U.GetRoleCollectionFromUser = [k, false];
    U.GetRoleCollectionFromWeb = [k, false];
    U.GetRoleInfo = [k, false];
    U.GetRolesAndPermissionsForCurrentUser = [k, false];
    U.GetRolesAndPermissionsForSite = [k, false];
    U.GetUserCollection = [k, false];
    U.GetUserCollectionFromGroup = [k, false];
    U.GetUserCollectionFromRole = [k, false];
    U.GetUserCollectionFromSite = [k, false];
    U.GetUserCollectionFromWeb = [k, false];
    U.GetUserInfo = [k, false];
    U.GetUserLoginFromEmail = [k, false];
    U.RemoveGroup = [k, true];
    U.RemoveGroupFromRole = [k, true];
    U.RemoveRole = [k, true];
    U.RemoveUserCollectionFromGroup = [k, true];
    U.RemoveUserCollectionFromRole = [k, true];
    U.RemoveUserCollectionFromSite = [k, true];
    U.RemoveUserFromGroup = [k, true];
    U.RemoveUserFromRole = [k, true];
    U.RemoveUserFromSite = [k, true];
    U.RemoveUserFromWeb = [k, true];
    U.UpdateGroupInfo = [k, true];
    U.UpdateRoleDefInfo = [k, true];
    U.UpdateRoleInfo = [k, true];
    U.UpdateUserInfo = [k, true];
    U.AddColleague = [K, true];
    U.AddLink = [K, true];
    U.AddMembership = [K, true];
    U.AddPinnedLink = [K, true];
    U.CreateMemberGroup = [K, true];
    U.CreateUserProfileByAccountName = [K, true];
    U.GetCommonColleagues = [K, false];
    U.GetCommonManager = [K, false];
    U.GetCommonMemberships = [K, false];
    U.GetInCommon = [K, false];
    U.GetPropertyChoiceList = [K, false];
    U.GetUserColleagues = [K, false];
    U.GetUserLinks = [K, false];
    U.GetUserMemberships = [K, false];
    U.GetUserPinnedLinks = [K, false];
    U.GetUserProfileByGuid = [K, false];
    U.GetUserProfileByIndex = [K, false];
    U.GetUserProfileByName = [K, false];
    U.GetUserProfileCount = [K, false];
    U.GetUserProfileSchema = [K, false];
    U.ModifyUserPropertyByAccountName = [K, true];
    U.RemoveAllColleagues = [K, true];
    U.RemoveAllLinks = [K, true];
    U.RemoveAllMemberships = [K, true];
    U.RemoveAllPinnedLinks = [K, true];
    U.RemoveColleague = [K, true];
    U.RemoveLink = [K, true];
    U.RemoveMembership = [K, true];
    U.RemovePinnedLink = [K, true];
    U.UpdateColleaguePrivacy = [K, true];
    U.UpdateLink = [K, true];
    U.UpdateMembershipPrivacy = [K, true];
    U.UpdatePinnedLink = [K, true];
    U.DeleteAllVersions = [E, true];
    U.DeleteVersion = [E, true];
    U.GetVersions = [E, false];
    U.RestoreVersion = [E, true];
    U.AddView = [ay, true];
    U.DeleteView = [ay, true];
    U.GetView = [ay, false];
    U.GetViewHtml = [ay, false];
    U.GetViewCollection = [ay, false];
    U.UpdateView = [ay, true];
    U.UpdateViewHtml = [ay, true];
    U.AddWebPart = [e, true];
    U.AddWebPartToZone = [e, true];
    U.GetWebPart2 = [e, false];
    U.GetWebPartPage = [e, false];
    U.GetWebPartProperties = [e, false];
    U.GetWebPartProperties2 = [e, false];
    U.CreateContentType = [av, true];
    U.GetColumns = [av, false];
    U.GetContentType = [av, false];
    U.GetContentTypes = [av, false];
    U.GetCustomizedPageStatus = [av, false];
    U.GetListTemplates = [av, false];
    U.GetObjectIdFromUrl = [av, false];
    U.GetWeb = [av, false];
    U.GetWebCollection = [av, false];
    U.GetAllSubWebCollection = [av, false];
    U.UpdateColumns = [av, true];
    U.UpdateContentType = [av, true];
    U.WebUrlFromPageUrl = [av, false];
    U.AlterToDo = [F, true];
    U.GetTemplatesForItem = [F, false];
    U.GetToDosForItem = [F, false];
    U.GetWorkflowDataForItem = [F, false];
    U.GetWorkflowTaskData = [F, false];
    U.StartWorkflow = [F, true];
    var T = {};
    T.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
    T.footer = "</soap:Body></soap:Envelope>";
    T.payload = "";
    var ab;
    ak.fn.SPServices = function (aC) {
        var aE = ak.extend({}, ak.fn.SPServices.defaults, aC);
        for (var aD = 0; aD < x.length; aD++) {
            if (typeof aE[x[aD]] === "string") {
                aE[x[aD]] = h(aE[x[aD]]);
            }
        }
        T.opheader = "<" + aE.operation + " ";
        switch (U[aE.operation][0]) {
            case b:
                T.opheader += "xmlns='" + ac + "/soap/2002/1/alerts/' >";
                ab = ac + "/soap/2002/1/alerts/";
                break;
            case l:
                T.opheader += "xmlns='" + ac + "/soap/meetings/' >";
                ab = ac + "/soap/meetings/";
                break;
            case f:
                T.opheader += "xmlns='" + ac + "/soap/directory/' >";
                ab = ac + "/soap/directory/";
                break;
            case g:
                T.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
                ab = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
                break;
            case ai:
                T.opheader += "xmlns='urn:Microsoft.Search' >";
                ab = "urn:Microsoft.Search/";
                break;
            case ag:
                T.opheader += "xmlns='" + ac + "/diagnostics/' >";
                ab = "http://schemas.microsoft.com/sharepoint/diagnostics/";
                break;
            case J:
                T.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
                ab = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
                break;
            case ae:
                T.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/' >";
                ab = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
                break;
            case n:
                T.opheader += "xmlns='" + ac + "/taxonomy/soap/' >";
                ab = ac + "/taxonomy/soap/";
                break;
            case k:
                T.opheader += "xmlns='" + ac + "/soap/directory/' >";
                ab = ac + "/soap/directory/";
                break;
            case K:
                T.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
                ab = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
                break;
            case e:
                T.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
                ab = "http://microsoft.com/sharepoint/webpartpages/";
                break;
            case F:
                T.opheader += "xmlns='" + ac + "/soap/workflow/' >";
                ab = ac + "/soap/workflow/";
                break;
            default:
                T.opheader += "xmlns='" + ac + "/soap/'>";
                ab = ac + "/soap/";
                break;
        }
        ab += aE.operation;
        T.opfooter = "</" + aE.operation + ">";
        var aG = "_vti_bin/" + U[aE.operation][0] + ".asmx";
        if (aE.webURL.charAt(aE.webURL.length - 1) === Q) {
            aG = aE.webURL + aG;
        } else {
            if (aE.webURL.length > 0) {
                aG = aE.webURL + Q + aG;
            } else {
                aG = ak().SPServices.SPGetCurrentSite() + Q + aG;
            }
        }
        T.payload = "";
        switch (aE.operation) {
            case "GetAlerts":
                break;
            case "DeleteAlerts":
                T.payload += "<IDs>";
                for (aD = 0; aD < aE.IDs.length; aD++) {
                    T.payload += au("string", aE.IDs[aD]);
                }
                T.payload += "</IDs>";
                break;
            case "Mode":
                break;
            case "Login":
                ap(aE, ["username", "password"]);
                break;
            case "CopyIntoItems":
                ap(aE, ["SourceUrl"]);
                T.payload += "<DestinationUrls>";
                for (aD = 0; aD < aE.DestinationUrls.length; aD++) {
                    T.payload += au("string", aE.DestinationUrls[aD]);
                }
                T.payload += "</DestinationUrls>";
                ap(aE, ["Fields", "Stream", "Results"]);
                break;
            case "CopyIntoItemsLocal":
                ap(aE, ["SourceUrl"]);
                T.payload += "<DestinationUrls>";
                for (aD = 0; aD < aE.DestinationUrls.length; aD++) {
                    T.payload += au("string", aE.DestinationUrls[aD]);
                }
                T.payload += "</DestinationUrls>";
                break;
            case "GetItem":
                ap(aE, ["Url", "Fields", "Stream"]);
                break;
            case "GetForm":
                ap(aE, ["listName", "formUrl"]);
                break;
            case "GetFormCollection":
                ap(aE, ["listName"]);
                break;
            case "AddAttachment":
                ap(aE, ["listName", "listItemID", "fileName", "attachment"]);
                break;
            case "AddDiscussionBoardItem":
                ap(aE, ["listName", "message"]);
                break;
            case "AddList":
                ap(aE, ["listName", "description", "templateID"]);
                break;
            case "AddListFromFeature":
                ap(aE, ["listName", "description", "featureID", "templateID"]);
                break;
            case "ApplyContentTypeToList":
                ap(aE, ["webUrl", "contentTypeId", "listName"]);
                break;
            case "CheckInFile":
                ap(aE, ["pageUrl", "comment", "CheckinType"]);
                break;
            case "CheckOutFile":
                ap(aE, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                break;
            case "CreateContentType":
                ap(aE, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                break;
            case "DeleteAttachment":
                ap(aE, ["listName", "listItemID", "url"]);
                break;
            case "DeleteContentType":
                ap(aE, ["listName", "contentTypeId"]);
                break;
            case "DeleteContentTypeXmlDocument":
                ap(aE, ["listName", "contentTypeId", "documentUri"]);
                break;
            case "DeleteList":
                ap(aE, ["listName"]);
                break;
            case "GetAttachmentCollection":
                ap(aE, ["listName", ["listItemID", "ID"]]);
                break;
            case "GetList":
                ap(aE, ["listName"]);
                break;
            case "GetListAndView":
                ap(aE, ["listName", "viewName"]);
                break;
            case "GetListCollection":
                break;
            case "GetListContentType":
                ap(aE, ["listName", "contentTypeId"]);
                break;
            case "GetListContentTypes":
                ap(aE, ["listName"]);
                break;
            case "GetListItems":
                ap(aE, ["listName", "viewName", ["query", "CAMLQuery"], ["viewFields", "CAMLViewFields"], ["rowLimit", "CAMLRowLimit"], ["queryOptions", "CAMLQueryOptions"]]);
                break;
            case "GetListItemChanges":
                ap(aE, ["listName", "viewFields", "since", "contains"]);
                break;
            case "GetListItemChangesSinceToken":
                ap(aE, ["listName", "viewName", "query", "viewFields", "rowLimit", "queryOptions", "changeToken", "contains"]);
                break;
            case "GetVersionCollection":
                ap(aE, ["strlistID", "strlistItemID", "strFieldName"]);
                break;
            case "UndoCheckOut":
                ap(aE, ["pageUrl"]);
                break;
            case "UpdateContentType":
                ap(aE, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                break;
            case "UpdateContentTypesXmlDocument":
                ap(aE, ["listName", "newDocument"]);
                break;
            case "UpdateContentTypeXmlDocument":
                ap(aE, ["listName", "contentTypeId", "newDocument"]);
                break;
            case "UpdateList":
                ap(aE, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                break;
            case "UpdateListItems":
                ap(aE, ["listName"]);
                if (typeof aE.updates !== "undefined" && aE.updates.length > 0) {
                    ap(aE, ["updates"]);
                } else {
                    T.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + aE.batchCmd + "'>";
                    for (aD = 0; aD < aE.valuepairs.length; aD++) {
                        T.payload += "<Field Name='" + aE.valuepairs[aD][0] + "'>" + L(aE.valuepairs[aD][1]) + "</Field>";
                    }
                    if (aE.batchCmd !== "New") {
                        T.payload += "<Field Name='ID'>" + aE.ID + "</Field>";
                    }
                    T.payload += "</Method></Batch></updates>";
                }
                break;
            case "AddMeeting":
                ap(aE, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
                break;
            case "CreateWorkspace":
                ap(aE, ["title", "templateName", "lcid", "timeZoneInformation"]);
                break;
            case "RemoveMeeting":
                ap(aE, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
                break;
            case "SetWorkspaceTitle":
                ap(aE, ["title"]);
                break;
            case "ResolvePrincipals":
                ap(aE, ["principalKeys", "principalType", "addToUserInfoList"]);
                break;
            case "SearchPrincipals":
                ap(aE, ["searchText", "maxResults", "principalType"]);
                break;
            case "AddPermission":
                ap(aE, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                break;
            case "AddPermissionCollection":
                ap(aE, ["objectName", "objectType", "permissionsInfoXml"]);
                break;
            case "GetPermissionCollection":
                ap(aE, ["objectName", "objectType"]);
                break;
            case "RemovePermission":
                ap(aE, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
                break;
            case "RemovePermissionCollection":
                ap(aE, ["objectName", "objectType", "memberIdsXml"]);
                break;
            case "UpdatePermission":
                ap(aE, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                break;
            case "GetLinks":
                break;
            case "GetPortalSearchInfo":
                T.opheader = "<" + aE.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                ab = "http://microsoft.com/webservices/OfficeServer/QueryService/" + aE.operation;
                break;
            case "GetQuerySuggestions":
                T.opheader = "<" + aE.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                ab = "http://microsoft.com/webservices/OfficeServer/QueryService/" + aE.operation;
                T.payload += au("queryXml", h(aE.queryXml));
                break;
            case "GetSearchMetadata":
                T.opheader = "<" + aE.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                ab = "http://microsoft.com/webservices/OfficeServer/QueryService/" + aE.operation;
                break;
            case "Query":
                T.payload += au("queryXml", h(aE.queryXml));
                break;
            case "QueryEx":
                T.opheader = "<" + aE.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                ab = "http://microsoft.com/webservices/OfficeServer/QueryService/" + aE.operation;
                T.payload += au("queryXml", h(aE.queryXml));
                break;
            case "Registration":
                T.payload += au("registrationXml", h(aE.registrationXml));
                break;
            case "Status":
                break;
            case "SPQuery":
                T.payload += au("queryXml", h(aE.queryXml));
                break;
            case "SPQueryEx":
                T.opheader = "<" + aE.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                ab = "http://microsoft.com/webservices/OfficeServer/QueryService/" + aE.operation;
                T.payload += au("queryXml", h(aE.queryXml));
                break;
            case "SendClientScriptErrorReport":
                ap(aE, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
                break;
            case "EnumerateFolder":
                ap(aE, ["strFolderUrl"]);
                break;
            case "GetAttachments":
                ap(aE, ["strListName", "strItemId"]);
                break;
            case "SiteDataGetList":
                ap(aE, ["strListName"]);
                T = j(T, aE.operation);
                break;
            case "SiteDataGetListCollection":
                T = j(T, aE.operation);
                break;
            case "SiteDataGetSite":
                T = j(T, aE.operation);
                break;
            case "SiteDataGetSiteUrl":
                ap(aE, ["Url"]);
                T = j(T, aE.operation);
                break;
            case "SiteDataGetWeb":
                T = j(T, aE.operation);
                break;
            case "CreateWeb":
                ap(aE, [
                    "url",
                    "title",
                    "description",
                    "templateName",
                    "language",
                    "languageSpecified",
                    "locale",
                    "localeSpecified",
                    "collationLocale",
                    "collationLocaleSpecified",
                    "uniquePermissions",
                    "uniquePermissionsSpecified",
                    "anonymous",
                    "anonymousSpecified",
                    "presence",
                    "presenceSpecified",
                ]);
                break;
            case "DeleteWeb":
                ap(aE, ["url"]);
                break;
            case "GetSite":
                ap(aE, ["SiteUrl"]);
                break;
            case "GetSiteTemplates":
                ap(aE, ["LCID", "TemplateList"]);
                break;
            case "AddComment":
                ap(aE, ["url", "comment", "isHighPriority", "title"]);
                break;
            case "AddTag":
                ap(aE, ["url", "termID", "title", "isPrivate"]);
                break;
            case "AddTagByKeyword":
                ap(aE, ["url", "keyword", "title", "isPrivate"]);
                break;
            case "CountCommentsOfUser":
                ap(aE, ["userAccountName"]);
                break;
            case "CountCommentsOfUserOnUrl":
                ap(aE, ["userAccountName", "url"]);
                break;
            case "CountCommentsOnUrl":
                ap(aE, ["url"]);
                break;
            case "CountRatingsOnUrl":
                ap(aE, ["url"]);
                break;
            case "CountTagsOfUser":
                ap(aE, ["userAccountName"]);
                break;
            case "DeleteComment":
                ap(aE, ["url", "lastModifiedTime"]);
                break;
            case "DeleteRating":
                ap(aE, ["url"]);
                break;
            case "DeleteTag":
                ap(aE, ["url", "termID"]);
                break;
            case "DeleteTagByKeyword":
                ap(aE, ["url", "keyword"]);
                break;
            case "DeleteTags":
                ap(aE, ["url"]);
                break;
            case "GetAllTagTerms":
                ap(aE, ["maximumItemsToReturn"]);
                break;
            case "GetAllTagTermsForUrlFolder":
                ap(aE, ["urlFolder", "maximumItemsToReturn"]);
                break;
            case "GetAllTagUrls":
                ap(aE, ["termID"]);
                break;
            case "GetAllTagUrlsByKeyword":
                ap(aE, ["keyword"]);
                break;
            case "GetCommentsOfUser":
                ap(aE, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                break;
            case "GetCommentsOfUserOnUrl":
                ap(aE, ["userAccountName", "url"]);
                break;
            case "GetCommentsOnUrl":
                ap(aE, ["url", "maximumItemsToReturn", "startIndex"]);
                if (typeof aE.excludeItemsTime !== "undefined" && aE.excludeItemsTime.length > 0) {
                    T.payload += au("excludeItemsTime", aE.excludeItemsTime);
                }
                break;
            case "GetRatingAverageOnUrl":
                ap(aE, ["url"]);
                break;
            case "GetRatingOfUserOnUrl":
                ap(aE, ["userAccountName", "url"]);
                break;
            case "GetRatingOnUrl":
                ap(aE, ["url"]);
                break;
            case "GetRatingsOfUser":
                ap(aE, ["userAccountName"]);
                break;
            case "GetRatingsOnUrl":
                ap(aE, ["url"]);
                break;
            case "GetSocialDataForFullReplication":
                ap(aE, ["userAccountName"]);
                break;
            case "GetTags":
                ap(aE, ["url"]);
                break;
            case "GetTagsOfUser":
                ap(aE, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                break;
            case "GetTagTerms":
                ap(aE, ["maximumItemsToReturn"]);
                break;
            case "GetTagTermsOfUser":
                ap(aE, ["userAccountName", "maximumItemsToReturn"]);
                break;
            case "GetTagTermsOnUrl":
                ap(aE, ["url", "maximumItemsToReturn"]);
                break;
            case "GetTagUrls":
                ap(aE, ["termID"]);
                break;
            case "GetTagUrlsByKeyword":
                ap(aE, ["keyword"]);
                break;
            case "GetTagUrlsOfUser":
                ap(aE, ["termID", "userAccountName"]);
                break;
            case "GetTagUrlsOfUserByKeyword":
                ap(aE, ["keyword", "userAccountName"]);
                break;
            case "SetRating":
                ap(aE, ["url", "rating", "title", "analysisDataEntry"]);
                break;
            case "UpdateComment":
                ap(aE, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
                break;
            case "SpellCheck":
                ap(aE, ["chunksToSpell", "declaredLanguage", "useLad"]);
                break;
            case "AddTerms":
                ap(aE, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                break;
            case "GetChildTermsInTerm":
                ap(aE, ["sspId", "lcid", "termId", "termSetId"]);
                break;
            case "GetChildTermsInTermSet":
                ap(aE, ["sspId", "lcid", "termSetId"]);
                break;
            case "GetKeywordTermsByGuids":
                ap(aE, ["termIds", "lcid"]);
                break;
            case "GetTermsByLabel":
                ap(aE, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                break;
            case "GetTermSets":
                ap(aE, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                break;
            case "AddGroup":
                ap(aE, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
                break;
            case "AddGroupToRole":
                ap(aE, ["groupName", "roleName"]);
                break;
            case "AddRole":
                ap(aE, ["roleName", "description", "permissionMask"]);
                break;
            case "AddRoleDef":
                ap(aE, ["roleName", "description", "permissionMask"]);
                break;
            case "AddUserCollectionToGroup":
                ap(aE, ["groupName", "usersInfoXml"]);
                break;
            case "AddUserCollectionToRole":
                ap(aE, ["roleName", "usersInfoXml"]);
                break;
            case "AddUserToGroup":
                ap(aE, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
                break;
            case "AddUserToRole":
                ap(aE, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
                break;
            case "GetAllUserCollectionFromWeb":
                break;
            case "GetGroupCollection":
                ap(aE, ["groupNamesXml"]);
                break;
            case "GetGroupCollectionFromRole":
                ap(aE, ["roleName"]);
                break;
            case "GetGroupCollectionFromSite":
                break;
            case "GetGroupCollectionFromUser":
                ap(aE, ["userLoginName"]);
                break;
            case "GetGroupCollectionFromWeb":
                break;
            case "GetGroupInfo":
                ap(aE, ["groupName"]);
                break;
            case "GetRoleCollection":
                ap(aE, ["roleNamesXml"]);
                break;
            case "GetRoleCollectionFromGroup":
                ap(aE, ["groupName"]);
                break;
            case "GetRoleCollectionFromUser":
                ap(aE, ["userLoginName"]);
                break;
            case "GetRoleCollectionFromWeb":
                break;
            case "GetRoleInfo":
                ap(aE, ["roleName"]);
                break;
            case "GetRolesAndPermissionsForCurrentUser":
                break;
            case "GetRolesAndPermissionsForSite":
                break;
            case "GetUserCollection":
                ap(aE, ["userLoginNamesXml"]);
                break;
            case "GetUserCollectionFromGroup":
                ap(aE, ["groupName"]);
                break;
            case "GetUserCollectionFromRole":
                ap(aE, ["roleName"]);
                break;
            case "GetUserCollectionFromSite":
                break;
            case "GetUserCollectionFromWeb":
                break;
            case "GetUserInfo":
                ap(aE, ["userLoginName"]);
                break;
            case "GetUserLoginFromEmail":
                ap(aE, ["emailXml"]);
                break;
            case "RemoveGroup":
                ap(aE, ["groupName"]);
                break;
            case "RemoveGroupFromRole":
                ap(aE, ["roleName", "groupName"]);
                break;
            case "RemoveRole":
                ap(aE, ["roleName"]);
                break;
            case "RemoveUserCollectionFromGroup":
                ap(aE, ["groupName", "userLoginNamesXml"]);
                break;
            case "RemoveUserCollectionFromRole":
                ap(aE, ["roleName", "userLoginNamesXml"]);
                break;
            case "RemoveUserCollectionFromSite":
                ap(aE, ["userLoginNamesXml"]);
                break;
            case "RemoveUserFromGroup":
                ap(aE, ["groupName", "userLoginName"]);
                break;
            case "RemoveUserFromRole":
                ap(aE, ["roleName", "userLoginName"]);
                break;
            case "RemoveUserFromSite":
                ap(aE, ["userLoginName"]);
                break;
            case "RemoveUserFromWeb":
                ap(aE, ["userLoginName"]);
                break;
            case "UpdateGroupInfo":
                ap(aE, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
                break;
            case "UpdateRoleDefInfo":
                ap(aE, ["oldRoleName", "roleName", "description", "permissionMask"]);
                break;
            case "UpdateRoleInfo":
                ap(aE, ["oldRoleName", "roleName", "description", "permissionMask"]);
                break;
            case "UpdateUserInfo":
                ap(aE, ["userLoginName", "userName", "userEmail", "userNotes"]);
                break;
            case "AddColleague":
                ap(aE, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
                break;
            case "AddLink":
                ap(aE, ["accountName", "name", "url", "group", "privacy"]);
                break;
            case "AddMembership":
                ap(aE, ["accountName", "membershipInfo", "group", "privacy"]);
                break;
            case "AddPinnedLink":
                ap(aE, ["accountName", "name", "url"]);
                break;
            case "CreateMemberGroup":
                ap(aE, ["membershipInfo"]);
                break;
            case "CreateUserProfileByAccountName":
                ap(aE, ["accountName"]);
                break;
            case "GetCommonColleagues":
                ap(aE, ["accountName"]);
                break;
            case "GetCommonManager":
                ap(aE, ["accountName"]);
                break;
            case "GetCommonMemberships":
                ap(aE, ["accountName"]);
                break;
            case "GetInCommon":
                ap(aE, ["accountName"]);
                break;
            case "GetPropertyChoiceList":
                ap(aE, ["propertyName"]);
                break;
            case "GetUserColleagues":
                ap(aE, ["accountName"]);
                break;
            case "GetUserLinks":
                ap(aE, ["accountName"]);
                break;
            case "GetUserMemberships":
                ap(aE, ["accountName"]);
                break;
            case "GetUserPinnedLinks":
                ap(aE, ["accountName"]);
                break;
            case "GetUserProfileByGuid":
                ap(aE, ["guid"]);
                break;
            case "GetUserProfileByIndex":
                ap(aE, ["index"]);
                break;
            case "GetUserProfileByName":
                if (typeof aE.accountName !== "undefined" && aE.accountName.length > 0) {
                    ap(aE, [["AccountName", "accountName"]]);
                } else {
                    ap(aE, ["AccountName"]);
                }
                break;
            case "GetUserProfileCount":
                break;
            case "GetUserProfileSchema":
                break;
            case "ModifyUserPropertyByAccountName":
                ap(aE, ["accountName", "newData"]);
                break;
            case "RemoveAllColleagues":
                ap(aE, ["accountName"]);
                break;
            case "RemoveAllLinks":
                ap(aE, ["accountName"]);
                break;
            case "RemoveAllMemberships":
                ap(aE, ["accountName"]);
                break;
            case "RemoveAllPinnedLinks":
                ap(aE, ["accountName"]);
                break;
            case "RemoveColleague":
                ap(aE, ["accountName", "colleagueAccountName"]);
                break;
            case "RemoveLink":
                ap(aE, ["accountName", "id"]);
                break;
            case "RemoveMembership":
                ap(aE, ["accountName", "sourceInternal", "sourceReference"]);
                break;
            case "RemovePinnedLink":
                ap(aE, ["accountName", "id"]);
                break;
            case "UpdateColleaguePrivacy":
                ap(aE, ["accountName", "colleagueAccountName", "newPrivacy"]);
                break;
            case "UpdateLink":
                ap(aE, ["accountName", "data"]);
                break;
            case "UpdateMembershipPrivacy":
                ap(aE, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
                break;
            case "UpdatePinnedLink ":
                ap(aE, ["accountName", "data"]);
                break;
            case "DeleteAllVersions":
                ap(aE, ["fileName"]);
                break;
            case "DeleteVersion":
                ap(aE, ["fileName", "fileVersion"]);
                break;
            case "GetVersions":
                ap(aE, ["fileName"]);
                break;
            case "RestoreVersion":
                ap(aE, ["fileName", "fileVersion"]);
                break;
            case "AddView":
                ap(aE, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
                break;
            case "DeleteView":
                ap(aE, ["listName", "viewName"]);
                break;
            case "GetView":
                ap(aE, ["listName", "viewName"]);
                break;
            case "GetViewCollection":
                ap(aE, ["listName"]);
                break;
            case "GetViewHtml":
                ap(aE, ["listName", "viewName"]);
                break;
            case "UpdateView":
                ap(aE, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                break;
            case "UpdateViewHtml":
                ap(aE, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                break;
            case "AddWebPart":
                ap(aE, ["pageUrl", "webPartXml", "storage"]);
                break;
            case "AddWebPartToZone":
                ap(aE, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                break;
            case "GetWebPart2":
                ap(aE, ["pageUrl", "storageKey", "storage", "behavior"]);
                break;
            case "GetWebPartPage":
                ap(aE, ["documentName", "behavior"]);
                break;
            case "GetWebPartProperties":
                ap(aE, ["pageUrl", "storage"]);
                break;
            case "GetWebPartProperties2":
                ap(aE, ["pageUrl", "storage", "behavior"]);
                break;
            case "Webs.CreateContentType":
                ap(aE, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
                break;
            case "GetColumns":
                ap(aE, ["webUrl"]);
                break;
            case "GetContentType":
                ap(aE, ["contentTypeId"]);
                break;
            case "GetContentTypes":
                break;
            case "GetCustomizedPageStatus":
                ap(aE, ["fileUrl"]);
                break;
            case "GetListTemplates":
                break;
            case "GetObjectIdFromUrl":
                ap(aE, ["objectUrl"]);
                break;
            case "GetWeb":
                ap(aE, [["webUrl", "webURL"]]);
                break;
            case "GetWebCollection":
                break;
            case "GetAllSubWebCollection":
                break;
            case "UpdateColumns":
                ap(aE, ["newFields", "updateFields", "deleteFields"]);
                break;
            case "Webs.UpdateContentType":
                ap(aE, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
                break;
            case "WebUrlFromPageUrl":
                ap(aE, [["pageUrl", "pageURL"]]);
                break;
            case "AlterToDo":
                ap(aE, ["item", "todoId", "todoListId", "taskData"]);
                break;
            case "GetTemplatesForItem":
                ap(aE, ["item"]);
                break;
            case "GetToDosForItem":
                ap(aE, ["item"]);
                break;
            case "GetWorkflowDataForItem":
                ap(aE, ["item"]);
                break;
            case "GetWorkflowTaskData":
                ap(aE, ["item", "listId", "taskId"]);
                break;
            case "StartWorkflow":
                ap(aE, ["item", "templateId", "workflowParameters"]);
                break;
            default:
                break;
        }
        var aH = T.header + T.opheader + T.payload + T.opfooter + T.footer;
        var aF;
        if (aE.cacheXML) {
            aF = B[aH];
        }
        var aB = ak.isFunction(aE.completefunc);
        if (typeof aF === "undefined") {
            B[aH] = ak.ajax({
                url: aG,
                async: aB ? false : aE.async,
                beforeSend: function (i) {
                    if (U[aE.operation][1]) {
                        i.setRequestHeader("SOAPAction", ab);
                    }
                },
                type: "POST",
                data: aH,
                dataType: "xml",
                contentType: "text/xml;charset='utf-8'",
                complete: function (aI, i) {
                    if (aB) {
                        aE.completefunc(aI, i);
                    }
                },
            });
            return B[aH];
        } else {
            if (aB) {
                aE.completefunc(aF, null);
            }
            return aF;
        }
    };
    ak.fn.SPServices.defaults = {
        cacheXML: false,
        operation: "",
        webURL: "",
        makeViewDefault: false,
        CAMLViewName: "",
        CAMLQuery: "",
        CAMLViewFields: "",
        CAMLRowLimit: 0,
        CAMLQueryOptions: "<QueryOptions></QueryOptions>",
        batchCmd: "Update",
        valuepairs: [],
        DestinationUrls: [],
        behavior: "Version3",
        storage: "Shared",
        objectType: "List",
        cancelMeeting: true,
        nonGregorian: false,
        fClaim: false,
        recurrenceId: 0,
        sequence: 0,
        maximumItemsToReturn: 0,
        startIndex: 0,
        isHighPriority: false,
        isPrivate: false,
        rating: 1,
        maxResults: 10,
        principalType: "User",
        async: true,
        completefunc: null,
    };
    ak.fn.SPServices.SPGetCurrentSite = function () {
        if (ao.thisSite.length > 0) {
            return ao.thisSite;
        }
        var i = T.header + "<WebUrlFromPageUrl xmlns='" + ac + "/soap/' ><pageUrl>" + location.protocol + "//" + location.host + location.pathname + "</pageUrl></WebUrlFromPageUrl>" + T.footer;
        ak.ajax({
            async: false,
            url: "/_vti_bin/Webs.asmx",
            type: "POST",
            data: i,
            dataType: "xml",
            contentType: 'text/xml;charset="utf-8"',
            complete: function (aB) {
                ao.thisSite = ak(aB.responseXML).find("WebUrlFromPageUrlResult").text();
            },
        });
        return ao.thisSite;
    };
    ak.fn.SPServices.SPCascadeDropdowns = function (aJ) {
        var aB = ak.extend(
            {},
            {
                relationshipWebURL: "",
                relationshipList: "",
                relationshipListParentColumn: "",
                relationshipListChildColumn: "",
                relationshipListSortColumn: "",
                parentColumn: "",
                childColumn: "",
                listName: ak().SPServices.SPListNameFromUrl(),
                CAMLQuery: "",
                CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>",
                promptText: "",
                noneText: "(None)",
                simpleChild: false,
                selectSingleOption: false,
                matchOnId: false,
                completefunc: null,
                debug: false,
            },
            aJ
        );
        var aD = false;
        var aH = "SPServices.SPCascadeDropdowns";
        var aE = new aq(aB.parentColumn);
        if (aE.Obj.html() === null && aB.debug) {
            X(aH, "parentColumn: " + aB.parentColumn, ah);
            return;
        }
        var i = new aq(aB.childColumn);
        if (i.Obj.html() === null && aB.debug) {
            X(aH, "childColumn: " + aB.childColumn, ah);
            return;
        }
        if (aB.simpleChild === true && i.Type === "C") {
            ak().SPServices.SPComplexToSimpleDropdown({ columnName: aB.childColumn });
            i = new aq(aB.childColumn);
        }
        var aI, aG;
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: aB.listName,
            completefunc: function (aK) {
                ak(aK.responseXML)
                    .find("Fields")
                    .each(function () {
                        ak(this)
                            .find("Field[DisplayName='" + aB.childColumn + "']")
                            .each(function () {
                                aI = ak(this).attr("Required") === "TRUE" ? true : false;
                                aG = ak(this).attr("StaticName");
                                return false;
                            });
                    });
            },
        });
        var aF = { opt: aB, childSelect: i, childColumnStatic: aG, childColumnRequired: aI };
        var aC = aE.Obj.data("SPCascadeDropdownsChildColumns");
        if (typeof aC === "undefined") {
            aE.Obj.data("SPCascadeDropdownsChildColumns", [aF]);
        } else {
            aC.push(aF);
            aE.Obj.data("SPCascadeDropdownsChildColumns", aC);
            aD = true;
        }
        if (!aD) {
            switch (aE.Type) {
                case "S":
                    aE.Obj.bind("change", function () {
                        ax(aB.parentColumn, aE);
                    });
                    break;
                case "C":
                    ak("input[id='" + aE.Obj.attr("optHid") + "']").bind("propertychange", function () {
                        ax(aB.parentColumn, aE);
                    });
                    break;
                case "M":
                    aE.Obj.bind("dblclick", function () {
                        ax(aB.parentColumn, aE);
                    });
                    aE.Obj.closest("span")
                        .find("select[id$='SelectResult']")
                        .bind("dblclick", function () {
                            ax(aB.parentColumn, aE);
                        });
                    aE.Obj.closest("span")
                        .find("button")
                        .each(function () {
                            ak(this).bind("click", function () {
                                ax(aB.parentColumn, aE);
                            });
                        });
                    break;
                default:
                    break;
            }
        }
        ax(aB.parentColumn, aE);
    };
    function ax(aL, aF) {
        var aM = "";
        var aE;
        var aH = null;
        var aC;
        var aI;
        var i;
        var aK;
        var aG;
        var aJ;
        var aD;
        var aB = aF.Obj.data("SPCascadeDropdownsChildColumns");
        ak(aB).each(function () {
            var aP = this.opt;
            var aO = this.childSelect;
            var aT = this.childColumnStatic;
            var aU = this.childColumnRequired;
            var aR;
            aE = c(aF, aP.matchOnId);
            var aS = aE.join(";#");
            if (aF.Obj.data("SPCascadeDropdown_Selected_" + aT) === aS) {
                return;
            }
            aF.Obj.data("SPCascadeDropdown_Selected_" + aT, aS);
            aH = c(aO, true);
            if (aO.Type === "M") {
                aC = new az(aO.Obj);
                aI = aC.MultiLookupPickerdata;
                i = aC.master;
                aR = aO.Obj.closest("span").find("select[ID$='SelectResult']");
            }
            var aQ = aP.relationshipListSortColumn.length > 0 ? aP.relationshipListSortColumn : aP.relationshipListChildColumn;
            var aN = "<Query><OrderBy><FieldRef Name='" + aQ + "'/></OrderBy><Where><And>";
            if (aP.CAMLQuery.length > 0) {
                aN += "<And>";
            }
            if (aE.length === 0) {
                aN += "<Eq><FieldRef Name='" + aP.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
            } else {
                if (aE.length === 1) {
                    aN += "<Eq><FieldRef Name='" + aP.relationshipListParentColumn + (aP.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") + L(aE[0]) + "</Value></Eq>";
                } else {
                    var aV = aE.length > 2 ? true : false;
                    for (O = 0; O < aE.length - 1; O++) {
                        aN += "<Or>";
                    }
                    for (O = 0; O < aE.length; O++) {
                        aN += "<Eq><FieldRef Name='" + aP.relationshipListParentColumn + (aP.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") + L(aE[O]) + "</Value></Eq>";
                        if (O > 0 && O < aE.length - 1 && aV) {
                            aN += "</Or>";
                        }
                    }
                    aN += "</Or>";
                }
            }
            if (aP.CAMLQuery.length > 0) {
                aN += aP.CAMLQuery + "</And>";
            }
            aN += "<IsNotNull><FieldRef Name='" + aP.relationshipListChildColumn + "' /></IsNotNull>";
            aN += "</And></Where></Query>";
            ak().SPServices({
                operation: "GetListItems",
                async: false,
                webURL: aP.relationshipWebURL,
                listName: aP.relationshipList,
                CAMLQuery: aN,
                CAMLViewFields: "<ViewFields><FieldRef Name='" + aP.relationshipListParentColumn + "' /><FieldRef Name='" + aP.relationshipListChildColumn + "' /></ViewFields>",
                CAMLRowLimit: 0,
                CAMLQueryOptions: aP.CAMLQueryOptions,
                completefunc: function (aW) {
                    ak(aW.responseXML)
                        .find("errorstring")
                        .each(function () {
                            var aY = "SPServices.SPCascadeDropdowns";
                            var aX = ak(this).text();
                            if (aP.debug && aX === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                                X(aY, "relationshipListParentColumn: " + aP.relationshipListParentColumn + " or relationshipListChildColumn: " + aP.relationshipListChildColumn, "Not found in relationshipList " + aP.relationshipList);
                            } else {
                                if (aP.debug && aX === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                                    X(aY, "relationshipList: " + aP.relationshipList, "List not found");
                                }
                            }
                            return;
                        });
                    switch (aO.Type) {
                        case "S":
                            ak(aO.Obj).find("option").remove();
                            if (!aU && aP.promptText.length > 0) {
                                aO.Obj.append("<option value='0'>" + aP.promptText.replace(/\{0\}/g, aP.childColumn) + "</option>");
                            } else {
                                if (!aU) {
                                    aO.Obj.append("<option value='0'>" + aP.noneText + "</option>");
                                }
                            }
                            break;
                        case "C":
                            aM = aU ? "" : aP.noneText + "|0";
                            aO.Obj.attr("value", "");
                            break;
                        case "M":
                            ak(aO.Obj).find("option").remove();
                            aK = "";
                            break;
                        default:
                            break;
                    }
                    aG = parseFloat(ak(aW.responseXML).SPFilterNode("rs:data").attr("ItemCount"));
                    ak(aW.responseXML)
                        .SPFilterNode("z:row")
                        .each(function () {
                            var aY = {};
                            var aX = ak(this).attr("ows_" + aP.relationshipListChildColumn);
                            if (typeof aX !== "undefined" && aX.indexOf(";#") > 0) {
                                aY = new m(aX);
                            } else {
                                aY.id = ak(this).attr("ows_ID");
                                aY.value = aX;
                            }
                            if (isNaN(aY.id)) {
                                aY.id = ak(this).attr("ows_ID");
                            }
                            aJ = aY.id;
                            aD = aY.value;
                            switch (aO.Type) {
                                case "S":
                                    var aZ = ak(this).attr("ows_ID") === aH[0] ? " selected='selected'" : "";
                                    aO.Obj.append("<option" + aZ + " value='" + aY.id + "'>" + aY.value + "</option>");
                                    break;
                                case "C":
                                    if (aY.id === aH[0]) {
                                        aO.Obj.attr("value", aY.value);
                                    }
                                    aM = aM + (aM.length > 0 ? "|" : "") + aY.value + "|" + aY.id;
                                    break;
                                case "M":
                                    aO.Obj.append("<option value='" + aY.id + "'>" + aY.value + "</option>");
                                    aK += aY.id + "|t" + aY.value + "|t |t |t";
                                    break;
                                default:
                                    break;
                            }
                        });
                    switch (aO.Type) {
                        case "S":
                            aO.Obj.trigger("change");
                            if (aG === 1 && aP.selectSingleOption === true) {
                                ak(aO.Obj).find("option[value!='0']:first").attr("selected", "selected");
                            }
                            break;
                        case "C":
                            aO.Obj.attr("choices", aM);
                            if (aG === 1 && aP.selectSingleOption === true) {
                                ak(aO.Obj).attr("value", aD);
                                ak("input[id='" + aO.Obj.attr("optHid") + "']").val(aJ);
                            }
                            if (aO.Obj.val() === "") {
                                ak("input[id='" + aO.Obj.attr("optHid") + "']").val("");
                            }
                            break;
                        case "M":
                            i.data = "";
                            aI.attr("value", aK);
                            ak(aR)
                                .find("option")
                                .each(function () {
                                    var aY = ak(this);
                                    var aX = ak(this).html();
                                    ak(this).attr("selected", "selected");
                                    ak(aO.Obj)
                                        .find("option")
                                        .filter(function () {
                                            return ak(this).text() === aX.replace(/&amp;/, "&");
                                        })
                                        .each(function () {
                                            if (ak(this).html() === aX) {
                                                aY.removeAttr("selected");
                                            }
                                        });
                                });
                            GipRemoveSelectedItems(i);
                            ak(aO.Obj)
                                .find("option")
                                .each(function () {
                                    var aX = ak(this);
                                    ak(aR)
                                        .find("option")
                                        .each(function () {
                                            if (ak(this).html() === aX.html()) {
                                                aX.remove();
                                            }
                                        });
                                });
                            GipAddSelectedItems(i);
                            i.data = GipGetGroupData(aK);
                            aO.Obj.trigger("dblclick");
                            break;
                        default:
                            break;
                    }
                },
            });
            if (aP.completefunc !== null) {
                aP.completefunc();
            }
        });
    }
    ak.fn.SPServices.SPComplexToSimpleDropdown = function (aJ) {
        var i = ak.extend({}, { columnName: "", completefunc: null, debug: false }, aJ);
        var aC = new aq(i.columnName);
        if (aC.Obj.html() === null && i.debug) {
            X("SPServices.SPComplexToSimpleDropdown", "columnName: " + i.columnName, ah);
            return;
        }
        if (aC.Type !== "C") {
            return;
        }
        var aH = ak(aC.Obj).attr("choices").split("|");
        var aD = ak(aC.Obj).attr("optHid");
        var aI = ak("input[id='" + aD + "']");
        var aB = ak("input[id='" + aD + "']").val();
        var aE = ad("SPComplexToSimpleDropdown", i.columnName);
        var aG = "<select id='" + aE + "' title='" + i.columnName + "'>";
        for (O = 0; O < aH.length; O = O + 2) {
            var aF = aH[O + 1] === aB ? " selected='selected' " : " ";
            aG += "<option" + aF + "value='" + aH[O + 1] + "'>" + aH[O] + "</option>";
        }
        aG += "</select>";
        ak(aC.Obj).closest("td").prepend(aG);
        ak(aC.Obj).closest("span").find("img").remove();
        ak(aC.Obj).closest("span").find("input").hide();
        ak("#" + aE).change(function () {
            var aK = ak(this).val();
            aI.val(aK);
            ak(aC.Obj).val(
                ak(this)
                    .find("option[value='" + (aK !== "0" ? aK : "") + "']")
                    .html()
            );
        });
        ak("#" + aE).trigger("change");
        if (i.completefunc !== null) {
            i.completefunc();
        }
    };
    ak.fn.SPServices.SPDisplayRelatedInfo = function (aB) {
        var aD = ak.extend(
            {},
            {
                columnName: "",
                relatedWebURL: "",
                relatedList: "",
                relatedListColumn: "",
                relatedColumns: [],
                displayFormat: "table",
                headerCSSClass: "ms-vh2",
                rowCSSClass: "ms-vb",
                CAMLQuery: "",
                numChars: 0,
                matchType: "Eq",
                matchOnId: false,
                completefunc: null,
                debug: false,
            },
            aB
        );
        var i;
        var aC = [];
        var aG;
        var aF = "SPServices.SPDisplayRelatedInfo";
        var aE = new aq(aD.columnName);
        if (aE.Obj.html() === null && aD.debug) {
            X(aF, "columnName: " + aD.columnName, ah);
            return;
        }
        i = ad("SPDisplayRelatedInfo", aD.columnName);
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: aD.relatedWebURL,
            listName: aD.relatedList,
            completefunc: function (aH) {
                ak(aH.responseXML)
                    .find("faultcode")
                    .each(function () {
                        if (aD.debug) {
                            X(aF, "relatedList: " + aD.relatedList, "List not found");
                            return;
                        }
                    });
                aG = ak(aH.responseXML).find("List");
                aC[aD.relatedListColumn] = ak(aH.responseXML).find("Fields > Field[Name='" + aD.relatedColumn + "']");
                for (O = 0; O < aD.relatedColumns.length; O++) {
                    aC[aD.relatedColumns[O]] = ak(aH.responseXML).find("Fields > Field[Name='" + aD.relatedColumns[O] + "']");
                }
            },
        });
        switch (aE.Type) {
            case "S":
                aE.Obj.bind("change", function () {
                    af(aD, i, aG, aC);
                });
                break;
            case "C":
                ak("input[id='" + aE.Obj.attr("optHid") + "']").bind("propertychange", function () {
                    af(aD, i, aG, aC);
                });
                break;
            case "M":
                if (aD.debug) {
                    X(aF, "columnName: " + aD.columnName, "Multi-select columns not supported by this function");
                }
                break;
            default:
                break;
        }
        af(aD, i, aG, aC);
    };
    function af(aC, aG, aI, aD) {
        var aJ = null;
        var aF = "SPServices.SPDisplayRelatedInfo";
        var aE = new aq(aC.columnName);
        aJ = c(aE, aC.matchOnId);
        if (aE.Type === "C" && aC.numChars > 0 && aJ[0].length < aC.numChars) {
            return;
        }
        if (aE.Obj.attr("showRelatedSelected") === aJ[0]) {
            return;
        }
        aE.Obj.attr("showRelatedSelected", aJ[0]);
        ak("#" + aG).remove();
        aE.Obj.parent().append("<div id=" + aG + "></div>");
        var i = "<Query><Where>";
        if (aC.CAMLQuery.length > 0) {
            i += "<And>";
        }
        var aB = aD[aC.relatedListColumn].attr("Type");
        if (aB === "Lookup") {
            i += "<Eq><FieldRef Name='" + aC.relatedListColumn + (aC.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") + L(aJ[0]) + "</Value></Eq>";
        } else {
            i += "<Eq><FieldRef Name='" + (aC.matchOnId ? "ID' /><Value Type='Counter'>" : aC.relatedListColumn + "'/><Value Type='Text'>") + L(aJ[0]) + "</Value></Eq>";
        }
        if (aC.CAMLQuery.length > 0) {
            i += aC.CAMLQuery + "</And>";
        }
        i += "</Where></Query>";
        var aH = " ";
        for (O = 0; O < aC.relatedColumns.length; O++) {
            aH += "<FieldRef Name='" + aC.relatedColumns[O] + "' />";
        }
        ak().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: aC.relatedWebURL,
            listName: aC.relatedList,
            CAMLQuery: i,
            CAMLViewFields: "<ViewFields>" + aH + "</ViewFields>",
            CAMLRowLimit: 0,
            completefunc: function (aL) {
                ak(aL.responseXML)
                    .find("errorstring")
                    .each(function () {
                        var aM = ak(this).text();
                        if (aC.debug && aM === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                            X(aF, "relatedListColumn: " + aC.relatedListColumn, "Column not found in relatedList " + aC.relatedList);
                        } else {
                            if (aC.debug && aM === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                                X(aF, "relatedList: " + aC.relatedList, "List not found");
                            }
                        }
                        return;
                    });
                var aK;
                switch (aC.displayFormat) {
                    case "table":
                        aK = "<table>";
                        aK += "<tr>";
                        for (O = 0; O < aC.relatedColumns.length; O++) {
                            if (typeof aD[aC.relatedColumns[O]] === "undefined" && aC.debug) {
                                X(aF, "columnName: " + aC.relatedColumns[O], "Column not found in relatedList");
                                return;
                            }
                            aK += "<th class='" + aC.headerCSSClass + "'>" + aD[aC.relatedColumns[O]].attr("DisplayName") + "</th>";
                        }
                        aK += "</tr>";
                        ak(aL.responseXML)
                            .SPFilterNode("z:row")
                            .each(function () {
                                aK += "<tr>";
                                for (O = 0; O < aC.relatedColumns.length; O++) {
                                    aK += "<td class='" + aC.rowCSSClass + "'>" + W(aI, aD[aC.relatedColumns[O]], ak(this).attr("ows_" + aC.relatedColumns[O]), aC) + "</td>";
                                }
                                aK += "</tr>";
                            });
                        aK += "</table>";
                        break;
                    case "list":
                        aK = "<table>";
                        ak(aL.responseXML)
                            .SPFilterNode("z:row")
                            .each(function () {
                                for (O = 0; O < aC.relatedColumns.length; O++) {
                                    if (typeof aD[aC.relatedColumns[O]] === "undefined" && aC.debug) {
                                        X(aF, "columnName: " + aC.relatedColumns[O], "Column not found in relatedList");
                                        return;
                                    }
                                    aK += "<tr>";
                                    aK += "<th class='" + aC.headerCSSClass + "'>" + aD[aC.relatedColumns[O]].attr("DisplayName") + "</th>";
                                    aK += "<td class='" + aC.rowCSSClass + "'>" + W(aI, aD[aC.relatedColumns[O]], ak(this).attr("ows_" + aC.relatedColumns[O]), aC) + "</td>";
                                    aK += "</tr>";
                                }
                            });
                        aK += "</table>";
                        break;
                    default:
                        break;
                }
                ak("#" + aG).html(aK);
            },
        });
        if (aC.completefunc !== null) {
            aC.completefunc();
        }
    }
    ak.fn.SPServices.SPFilterDropdown = function (aN) {
        var aC = ak.extend(
            {},
            {
                relationshipWebURL: "",
                relationshipList: "",
                relationshipListColumn: "",
                relationshipListSortColumn: "",
                relationshipListSortAscending: true,
                columnName: "",
                listName: ak().SPServices.SPListNameFromUrl(),
                promptText: "",
                noneText: "(None)",
                CAMLQuery: "",
                CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><ViewAttributes Scope='RecursiveAll'/></QueryOptions>",
                completefunc: null,
                debug: false,
            },
            aN
        );
        var aM = "";
        var aL = null;
        var aF;
        var aG;
        var aB;
        var aK;
        var aJ;
        var aI = "SPServices.SPFilterDropdown";
        var aH = new aq(aC.columnName);
        if (aH.Obj.html() === null && aC.debug) {
            X(aI, "columnName: " + aC.columnName, ah);
            return;
        }
        aL = c(aH, true);
        var aE = aC.relationshipListSortColumn.length > 0 ? aC.relationshipListSortColumn : aC.relationshipListColumn;
        var aD = aC.relationshipListSortAscending === true ? "" : "Ascending='FALSE'";
        var i = "<Query><OrderBy><FieldRef Name='" + aE + "' " + aD + "/></OrderBy><Where>";
        if (aC.CAMLQuery.length > 0) {
            i += aC.CAMLQuery;
        }
        i += "</Where></Query>";
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: aC.listName,
            completefunc: function (aO) {
                ak(aO.responseXML)
                    .find("Fields")
                    .each(function () {
                        ak(this)
                            .find("Field[DisplayName='" + aC.columnName + "']")
                            .each(function () {
                                aJ = ak(this).attr("Required") === "TRUE" ? true : false;
                                return false;
                            });
                    });
            },
        });
        ak().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: aC.relationshipWebURL,
            listName: aC.relationshipList,
            CAMLQuery: i,
            CAMLViewFields: "<ViewFields><FieldRef Name='" + aC.relationshipListColumn + "' /></ViewFields>",
            CAMLRowLimit: 0,
            CAMLQueryOptions: aC.CAMLQueryOptions,
            completefunc: function (aP) {
                ak(aP.responseXML)
                    .find("errorstring")
                    .each(function () {
                        var aQ = ak(this).text();
                        if (aC.debug && aQ === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                            X(aI, "relationshipListColumn: " + aC.relationshipListColumn, "Not found in relationshipList " + aC.relationshipList);
                        } else {
                            if (aC.debug && aQ === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                                X(aI, "relationshipList: " + aC.relationshipList, "List not found");
                            }
                        }
                        return;
                    });
                switch (aH.Type) {
                    case "S":
                        ak(aH.Obj).find("option").remove();
                        if (!aJ && aC.promptText.length > 0) {
                            aH.Obj.append("<option value='0'>" + aC.promptText.replace(/\{0\}/g, aC.columnName) + "</option>");
                        } else {
                            if (!aJ) {
                                aH.Obj.append("<option value='0'>" + aC.noneText + "</option>");
                            }
                        }
                        break;
                    case "C":
                        aM = aJ ? "" : aC.noneText + "|0";
                        aH.Obj.attr("value", "");
                        break;
                    case "M":
                        ak(aH.Obj).find("option").remove();
                        aK = "";
                        break;
                    default:
                        break;
                }
                ak(aP.responseXML)
                    .SPFilterNode("z:row")
                    .each(function () {
                        var aR = {};
                        var aQ = ak(this).attr("ows_" + aC.relationshipListColumn);
                        if (typeof aQ !== "undefined" && aQ.indexOf(";#") > 0) {
                            aR = new m(aQ);
                        } else {
                            aR.id = ak(this).attr("ows_ID");
                            aR.value = aQ;
                        }
                        if (isNaN(aR.id)) {
                            aR.id = ak(this).attr("ows_ID");
                        }
                        switch (aH.Type) {
                            case "S":
                                var aS = ak(this).attr("ows_ID") === aL[0] ? " selected='selected'" : "";
                                aH.Obj.append("<option" + aS + " value='" + aR.id + "'>" + aR.value + "</option>");
                                break;
                            case "C":
                                if (aR.id === aL[0]) {
                                    aH.Obj.attr("value", aR.value);
                                }
                                aM = aM + (aM.length > 0 ? "|" : "") + aR.value + "|" + aR.id;
                                break;
                            case "M":
                                aH.Obj.append("<option value='" + aR.id + "'>" + aR.value + "</option>");
                                aK += aR.id + "|t" + aR.value + "|t |t |t";
                                break;
                            default:
                                break;
                        }
                    });
                switch (aH.Type) {
                    case "S":
                        aH.Obj.trigger("change");
                        break;
                    case "C":
                        aH.Obj.attr("choices", aM);
                        aH.Obj.trigger("propertychange");
                        break;
                    case "M":
                        aF = new az(aH.Obj);
                        aG = aF.MultiLookupPickerdata;
                        aB = aF.master;
                        var aO = aH.Obj.closest("span").find("select[ID$='SelectResult']");
                        aB.data = "";
                        aG.attr("value", aK);
                        ak(aO)
                            .find("option")
                            .each(function () {
                                var aQ = ak(this);
                                ak(this).attr("selected", "selected");
                                ak(aH.Obj)
                                    .find("option")
                                    .each(function () {
                                        if (ak(this).html() === aQ.html()) {
                                            aQ.removeAttr("selected");
                                        }
                                    });
                            });
                        GipRemoveSelectedItems(aB);
                        ak(aH.Obj)
                            .find("option")
                            .each(function () {
                                var aQ = ak(this);
                                ak(aO)
                                    .find("option")
                                    .each(function () {
                                        if (ak(this).html() === aQ.html()) {
                                            aQ.remove();
                                        }
                                    });
                            });
                        GipAddSelectedItems(aB);
                        aB.data = GipGetGroupData(aK);
                        aH.Obj.trigger("dblclick");
                        break;
                    default:
                        break;
                }
            },
        });
        if (aC.completefunc !== null) {
            aC.completefunc();
        }
    };
    ak.fn.SPServices.SPDebugXMLHttpResult = function (aC) {
        var aE = ak.extend({}, { node: null, indent: 0 }, aC);
        var aD;
        var aG = 3;
        var aF = 4;
        var aB = "";
        aB += "<table class='ms-vb' style='margin-left:" + aE.indent * 3 + "px;' width='100%'>";
        if (aE.node.nodeName === "DisplayPattern") {
            aB += "<tr><td width='100px' style='font-weight:bold;'>" + aE.node.nodeName + "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + aE.node.xml + "</textarea></td></tr>";
        } else {
            if (!aE.node.hasChildNodes()) {
                aB += "<tr><td width='100px' style='font-weight:bold;'>" + aE.node.nodeName + "</td><td>" + (aE.node.nodeValue !== null ? N(aE.node.nodeValue) : "&nbsp;") + "</td></tr>";
                if (aE.node.attributes) {
                    aB += "<tr><td colspan='99'>" + s(aE.node) + "</td></tr>";
                }
            } else {
                if (aE.node.hasChildNodes() && aE.node.firstChild.nodeType === aF) {
                    aB += "<tr><td width='100px' style='font-weight:bold;'>" + aE.node.nodeName + "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + aE.node.parentNode.text + "</textarea></td></tr>";
                } else {
                    if (aE.node.hasChildNodes() && aE.node.firstChild.nodeType === aG) {
                        aB += "<tr><td width='100px' style='font-weight:bold;'>" + aE.node.nodeName + "</td><td>" + N(aE.node.firstChild.nodeValue) + "</td></tr>";
                    } else {
                        aB += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + aE.node.nodeName + "</td></tr>";
                        if (aE.node.attributes) {
                            aB += "<tr><td colspan='99'>" + s(aE.node) + "</td></tr>";
                        }
                        aB += "<tr><td>";
                        for (aD = 0; aD < aE.node.childNodes.length; aD++) {
                            aB += ak().SPServices.SPDebugXMLHttpResult({ node: aE.node.childNodes.item(aD), indent: aE.indent + 1 });
                        }
                        aB += "</td></tr>";
                    }
                }
            }
        }
        aB += "</table>";
        return aB;
    };
    ak.fn.SPServices.SPGetCurrentUser = function (aE) {
        var aG = ak.extend({}, { webURL: "", fieldName: "Name", fieldNames: {}, debug: false }, aE);
        if (aG.fieldName === "ID" && typeof ao.thisUserId !== "undefined") {
            return ao.thisUserId;
        }
        var aC = "";
        var aF = {};
        var aH = aG.fieldNames.length > 0 ? aG.fieldNames.length : 1;
        var aD;
        var aB = aG.webURL.length > 0 ? aG.webURL : ak().SPServices.SPGetCurrentSite();
        ak.ajax({
            async: false,
            url: aB + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
            complete: function (aI) {
                aD = aI;
            },
        });
        for (O = 0; O < aH; O++) {
            if (aG.fieldNames[O] === "ID") {
                aC = ao.thisUserId;
            } else {
                var i;
                if (aH > 1) {
                    i = RegExp('FieldInternalName="' + aG.fieldNames[O] + '"', "gi");
                } else {
                    i = RegExp('FieldInternalName="' + aG.fieldName + '"', "gi");
                }
                ak(aD.responseText)
                    .find("table.ms-formtable td[id^='SPField']")
                    .each(function () {
                        if (i.test(ak(this).html())) {
                            switch (ak(this).attr("id")) {
                                case "SPFieldText":
                                    aC = ak(this).text();
                                    break;
                                case "SPFieldNote":
                                    aC = ak(this).find("div").html();
                                    break;
                                case "SPFieldURL":
                                    aC = ak(this).find("img").attr("src");
                                    break;
                                default:
                                    aC = ak(this).text();
                                    break;
                            }
                            return false;
                        }
                    });
            }
            if (aG.fieldNames[O] !== "ID") {
                aC = typeof aC !== "undefined" ? aC.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, "") : null;
            }
            if (aH > 1) {
                aF[aG.fieldNames[O]] = aC;
            }
        }
        return aH > 1 ? aF : aC;
    };
    ak.fn.SPServices.SPLookupAddNew = function (aI) {
        var aD = ak.extend({}, { lookupColumn: "", promptText: "Add new {0}", newWindow: false, ContentTypeID: "", completefunc: null, debug: false }, aI);
        var aF = "SPServices.SPLookupAddNew";
        var aC = new aq(aD.lookupColumn);
        if (aC.Obj.html() === null && aD.debug) {
            X(aF, "lookupColumn: " + aD.lookupColumn, ah);
            return;
        }
        var i = "";
        var aH = "";
        var aB = "";
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: ak().SPServices.SPListNameFromUrl(),
            completefunc: function (aJ) {
                ak(aJ.responseXML)
                    .find("Field[DisplayName='" + aD.lookupColumn + "']")
                    .each(function () {
                        aB = ak(this).attr("StaticName");
                        ak().SPServices({
                            operation: "GetList",
                            async: false,
                            cacheXML: true,
                            listName: ak(this).attr("List"),
                            completefunc: function (aK) {
                                ak(aK.responseXML)
                                    .find("List")
                                    .each(function () {
                                        aH = ak(this).attr("WebFullUrl");
                                        aH = aH !== Q ? aH + Q : aH;
                                    });
                            },
                        });
                        i = D(ak(this).attr("List"), "NewForm");
                        return false;
                    });
            },
        });
        if (aH.length === 0 && aD.debug) {
            X(aF, "lookupColumn: " + aD.lookupColumn, "This column does not appear to be a lookup column");
            return;
        }
        if (i.length > 0) {
            var aG = aH + i;
            aG += aD.newWindow
                ? (aD.ContentTypeID.length > 0 ? "?ContentTypeID=" + aD.ContentTypeID : "") + "' target='_blank'"
                : "?" + (aD.ContentTypeID.length > 0 ? "ContentTypeID=" + aD.ContentTypeID + "&" : "") + "Source=" + z(location.href) + "'";
            var aE = "<div id='SPLookupAddNew_" + aB + "'><a href='" + aG + ">" + aD.promptText.replace(/\{0\}/g, aD.lookupColumn) + "</a></div>";
            ak(aC.Obj).parents("td.ms-formbody").append(aE);
        } else {
            if (aD.debug) {
                X(aF, "lookupColumn: " + aD.lookupColumn, "NewForm cannot be found");
                return;
            }
        }
        if (aD.completefunc !== null) {
            aD.completefunc();
        }
    };
    ak.fn.SPServices.SPGetLastItemId = function (aB) {
        var aD = ak.extend({}, { webURL: "", listName: "", userAccount: "", CAMLQuery: "" }, aB);
        var aC;
        var aE = 0;
        ak().SPServices({
            operation: "GetUserInfo",
            webURL: aD.webURL,
            async: false,
            userLoginName: aD.userAccount !== "" ? aD.userAccount : ak().SPServices.SPGetCurrentUser(),
            completefunc: function (aF) {
                ak(aF.responseXML)
                    .find("User")
                    .each(function () {
                        aC = ak(this).attr("ID");
                    });
            },
        });
        var i = "<Query><Where>";
        if (aD.CAMLQuery.length > 0) {
            i += "<And>";
        }
        i += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + aC + "</Value></Eq>";
        if (aD.CAMLQuery.length > 0) {
            i += aD.CAMLQuery + "</And>";
        }
        i += "</Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>";
        ak().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: aD.webURL,
            listName: aD.listName,
            CAMLQuery: i,
            CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
            CAMLRowLimit: 1,
            CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
            completefunc: function (aF) {
                ak(aF.responseXML)
                    .SPFilterNode("z:row")
                    .each(function () {
                        aE = ak(this).attr("ows_ID");
                    });
            },
        });
        return aE;
    };
    ak.fn.SPServices.SPRequireUnique = function (aB) {
        var aC = ak.extend(
            {},
            {
                columnStaticName: "Title",
                duplicateAction: 0,
                ignoreCase: false,
                initMsg: "This value must be unique.",
                initMsgCSSClass: "ms-vb",
                errMsg: "This value is not unique.",
                errMsgCSSClass: "ms-formvalidation",
                showDupes: false,
                completefunc: null,
            },
            aB
        );
        var aG = ak().SPServices.SPGetQueryString();
        var aH = aG.ID;
        ao.thisList = ak().SPServices.SPListNameFromUrl();
        var aF = "<span id='SPRequireUnique" + aC.columnStaticName + "' class='{0}'>{1}</span><br/>";
        var aE = aF.replace(/\{0\}/g, aC.initMsgCSSClass).replace(/\{1\}/g, aC.initMsg);
        var aD = ak().SPServices.SPGetDisplayFromStatic({ listName: ao.thisList, columnStaticName: aC.columnStaticName });
        var i = ak("input[Title='" + aD + "']");
        ak(i).parent().append(aE);
        ak(i).blur(function () {
            var aK = [];
            var aL = ak(this).attr("value");
            if (aL.length === 0) {
                return false;
            }
            ak().SPServices({
                operation: "GetListItems",
                async: false,
                listName: ao.thisList,
                CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + aC.columnStaticName + "'/></IsNotNull></Where></Query>",
                CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='" + aC.columnStaticName + "' /></ViewFields>",
                CAMLRowLimit: 0,
                completefunc: function (aN) {
                    var aM = aC.ignoreCase ? aL.toUpperCase() : aL;
                    ak(aN.responseXML)
                        .SPFilterNode("z:row")
                        .each(function () {
                            var aO = aC.ignoreCase
                                ? ak(this)
                                      .attr("ows_" + aC.columnStaticName)
                                      .toUpperCase()
                                : ak(this).attr("ows_" + aC.columnStaticName);
                            if (aM === aO && ak(this).attr("ows_ID") !== aH) {
                                aK.push([ak(this).attr("ows_ID"), ak(this).attr("ows_" + aC.columnStaticName)]);
                            }
                        });
                },
            });
            var aJ = aC.initMsg;
            ak("span#SPRequireUnique" + aC.columnStaticName)
                .html(aJ)
                .attr("class", aC.initMsgCSSClass);
            ak("input[value='OK']:disabled, input[value='Save']:disabled").removeAttr("disabled");
            if (aK.length > 0) {
                aJ = aC.errMsg;
                ak("span#SPRequireUnique" + aC.columnStaticName)
                    .html(aJ)
                    .attr("class", aC.errMsgCSSClass);
                if (aC.duplicateAction === 1) {
                    ak("input[Title='" + aC.columnDisplayName + "']").focus();
                    ak("input[value='OK'], input[value='Save']").attr("disabled", "disabled");
                }
                if (aC.showDupes) {
                    var aI = " " + aK.length + " duplicate item" + (aK.length > 1 ? "s" : "") + ": ";
                    for (O = 0; O < aK.length; O++) {
                        aI += "<a href='DispForm.aspx?ID=" + aK[O][0] + "&Source=" + location.href + "'>" + aK[O][1] + "</a> ";
                    }
                    ak("span#SPRequireUnique" + aC.columnStaticName).append(aI);
                }
            }
        });
        if (aC.completefunc !== null) {
            aC.completefunc();
        }
    };
    ak.fn.SPServices.SPGetDisplayFromStatic = function (aB) {
        var aC = ak.extend({}, { webURL: "", listName: "", columnStaticName: "", columnStaticNames: {} }, aB);
        var i = "";
        var aD = {};
        var aE = aC.columnStaticNames.length > 0 ? aC.columnStaticNames.length : 1;
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: aC.webURL,
            listName: aC.listName,
            completefunc: function (aF) {
                if (aE > 1) {
                    for (O = 0; O < aE; O++) {
                        aD[aC.columnStaticNames[O]] = ak(aF.responseXML)
                            .find("Field[StaticName='" + aC.columnStaticNames[O] + "']")
                            .attr("DisplayName");
                    }
                } else {
                    i = ak(aF.responseXML)
                        .find("Field[StaticName='" + aC.columnStaticName + "']")
                        .attr("DisplayName");
                }
            },
        });
        return aE > 1 ? aD : i;
    };
    ak.fn.SPServices.SPGetStaticFromDisplay = function (i) {
        var aC = ak.extend({}, { webURL: "", listName: "", columnDisplayName: "", columnDisplayNames: {} }, i);
        var aB = "";
        var aD = {};
        var aE = aC.columnDisplayNames.length > 0 ? aC.columnDisplayNames.length : 1;
        ak().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: aC.webURL,
            listName: aC.listName,
            completefunc: function (aF) {
                if (aE > 1) {
                    for (O = 0; O < aE; O++) {
                        aD[aC.columnDisplayNames[O]] = ak(aF.responseXML)
                            .find("Field[DisplayName='" + aC.columnDisplayNames[O] + "']")
                            .attr("StaticName");
                    }
                } else {
                    aB = ak(aF.responseXML)
                        .find("Field[DisplayName='" + aC.columnDisplayName + "']")
                        .attr("StaticName");
                }
            },
        });
        return aE > 1 ? aD : aB;
    };
    ak.fn.SPServices.SPRedirectWithID = function (aC) {
        var aD = ak.extend({}, { redirectUrl: "", qsParamName: "ID" }, aC);
        ao.thisList = ak().SPServices.SPListNameFromUrl();
        var aH = ak().SPServices.SPGetQueryString();
        var aG = aH.ID;
        var aF = aH.List;
        var aB = aH.RootFolder;
        var aE = aH.ContentTypeId;
        if (typeof aH.ID === "undefined") {
            aG = ak().SPServices.SPGetLastItemId({ listName: ao.thisList });
            ak("form[name='aspnetForm']").each(function () {
                var aJ = location.href.indexOf("?") > 0 ? location.href.substring(0, location.href.indexOf("?")) : location.href;
                var aK = typeof aH.Source === "string" ? "Source=" + aH.Source.replace(/\//g, "%2f").replace(/:/g, "%3a") : "";
                var aI = [];
                if (typeof aF !== "undefined") {
                    aI.push("List=" + aF);
                }
                if (typeof aB !== "undefined") {
                    aI.push("RootFolder=" + aB);
                }
                if (typeof aE !== "undefined") {
                    aI.push("ContentTypeId=" + aE);
                }
                var aL =
                    aJ + (aI.length > 0 ? "?" + aI.join("&") + "&" : "?") + "Source=" + aJ + "?ID=" + aG + (aK.length > 0 ? "%26RealSource=" + aH.Source : "") + (typeof aH.RedirectURL === "string" ? "%26RedirectURL=" + aH.RedirectURL : "");
                ak(this).attr("action", aL);
            });
        } else {
            while (aH.ID === aG) {
                aG = ak().SPServices.SPGetLastItemId({ listName: ao.thisList });
            }
            var i = typeof aH.RedirectURL === "string" ? aH.RedirectURL : aD.redirectUrl;
            location.href = i + (i.indexOf("?") > 0) ? "&" : "?" + aD.qsParamName + "=" + aG + (typeof aH.RealSource === "string" ? "&Source=" + aH.RealSource : "");
        }
    };
    ak.fn.SPServices.SPSetMultiSelectSizes = function (aL) {
        var i = ak.extend({}, { multiSelectColumn: "", minWidth: 0, maxWidth: 0, debug: false }, aL);
        var aG = "SPServices.SPSetMultiSelectSizes";
        var aE = new aq(i.multiSelectColumn);
        if (aE.Obj.html() === null && i.debug) {
            X(aG, "multiSelectColumn: " + i.multiSelectColumn, ah);
            return;
        }
        if (aE.Type !== "M" && i.debug) {
            X(aG, "multiSelectColumn: " + i.multiSelectColumn, "Column is not multi-select.");
            return;
        }
        var aF = aE.Obj;
        var aJ = aF.closest("span").find("select[ID$='SelectResult']");
        var aH = ad("SPSetMultiSelectSizes", i.multiSelectColumn);
        var aI = aF.closest("span");
        aI.append("<select id='" + aH + "' ></select>");
        var aD = aI.find("> select");
        aD.css({ width: "auto", height: 0, visibility: "hidden" });
        aD.append(aF.find("option").clone());
        aD.append(aJ.find("option").clone());
        var aB = aD.width() + 5;
        var aK = aB;
        if (i.minWidth > 0 || i.maxWidth > 0) {
            if (aB < i.minWidth) {
                aB = i.minWidth;
            }
            if (aK < i.minWidth) {
                aK = i.minWidth;
            }
            if (aK > i.maxWidth) {
                aK = i.maxWidth;
            }
        }
        var aC = aB;
        aF.css("width", aC + "px")
            .parent()
            .css("width", aK + "px");
        aJ.css("width", aC + "px")
            .parent()
            .css("width", aK + "px");
        if (i.maxWidth === 0 || i.maxWidth > aK) {
            aF.parent().css("overflow-x", "hidden");
            aJ.parent().css("overflow-x", "hidden");
        }
        aD.remove();
    };
    ak.fn.SPServices.SPScriptAudit = function (aC) {
        var aD = ak.extend({}, { webURL: "", listName: "", outputId: "", auditForms: true, auditViews: true, auditPages: true, auditPagesListName: "Pages", showHiddenLists: false, showNoScript: false, showSrc: true }, aC);
        var aB = [
            ["New", "NewForm.aspx", false],
            ["Display", "DispForm.aspx", false],
            ["Edit", "EditForm.aspx", false],
        ];
        var aE;
        ak("#" + aD.outputId).append(
            "<table id='SPScriptAudit' width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1><tr><th></th><th>List</th><th>Page Class</th><th>Page Type</th><th>Page</th>" +
                (aD.showSrc ? "<th>Script References</th>" : "") +
                "</tr></table>"
        );
        ak("#SPScriptAudit th").attr("class", "ms-vh2-nofilter");
        if (aD.auditForms || aD.auditViews) {
            ak().SPServices({
                operation: "GetListCollection",
                webURL: aD.webURL,
                async: false,
                completefunc: function (aG) {
                    ak(aG.responseXML)
                        .find("List")
                        .each(function () {
                            aE = ak(this);
                            if (aD.listName.length === 0 || aE.attr("Title") === aD.listName) {
                                if ((aD.showHiddenLists && aE.attr("Hidden") === "False") || !aD.showHiddenLists) {
                                    if (aD.auditForms) {
                                        ak().SPServices({
                                            operation: "GetListContentTypes",
                                            webURL: aD.webURL,
                                            listName: aE.attr("ID"),
                                            async: false,
                                            completefunc: function (aH) {
                                                ak(aH.responseXML)
                                                    .find("ContentType")
                                                    .each(function () {
                                                        if (ak(this).attr("ID").substring(0, 6) !== "0x0120") {
                                                            var aJ = ak(this).find("FormUrls");
                                                            for (O = 0; O < aB.length; O++) {
                                                                ak(aJ)
                                                                    .find(aB[O][0])
                                                                    .each(function () {
                                                                        aw(aD, aE, "Form", this.nodeName, (aD.webURL.length > 0 ? aD.webURL : ak().SPServices.SPGetCurrentSite()) + Q + ak(this).text());
                                                                        aB[O][2] = true;
                                                                    });
                                                                if (!aB[O][2]) {
                                                                    var aI = aE.attr("DefaultViewUrl");
                                                                    aw(aD, aE, "Form", aB[O][0], aI.substring(0, aI.lastIndexOf(Q) + 1) + aB[O][1]);
                                                                }
                                                            }
                                                            for (O = 0; O < aB.length; O++) {
                                                                aB[O][2] = false;
                                                            }
                                                        }
                                                    });
                                            },
                                        });
                                    }
                                    if (aD.auditViews) {
                                        ak().SPServices({
                                            operation: "GetViewCollection",
                                            webURL: aD.webURL,
                                            listName: aE.attr("ID"),
                                            async: false,
                                            completefunc: function (aH) {
                                                ak(aH.responseXML)
                                                    .find("View")
                                                    .each(function () {
                                                        aw(aD, aE, "View", ak(this).attr("DisplayName"), ak(this).attr("Url"));
                                                    });
                                            },
                                        });
                                    }
                                }
                            }
                        });
                },
            });
        }
        var i = 0;
        var aF = [];
        if (typeof aD.auditPagesListName === "string") {
            i = 1;
            aF.push(aD.auditPagesListName);
        } else {
            i = aD.auditPagesListName.length;
            aF = aD.auditPagesListName;
        }
        if (aD.auditPages) {
            for (O = 0; O < i; O++) {
                ak().SPServices({
                    operation: "GetList",
                    async: false,
                    cacheXML: true,
                    webURL: aD.webURL,
                    listName: aF[O],
                    completefunc: function (aG) {
                        ak(aG.responseXML)
                            .find("List")
                            .each(function () {
                                aE = ak(this);
                            });
                    },
                });
                ak().SPServices({
                    operation: "GetListItems",
                    async: false,
                    webURL: aD.webURL,
                    listName: aF[O],
                    CAMLQuery: "<Query><Where><Neq><FieldRef Name='ContentType'/><Value Type='Text'>Folder</Value></Neq></Where></Query>",
                    CAMLViewFields: "<ViewFields><FieldRef Name='Title'/><FieldRef Name='FileRef'/></ViewFields>",
                    CAMLRowLimit: 0,
                    completefunc: function (aG) {
                        ak(aG.responseXML)
                            .SPFilterNode("z:row")
                            .each(function () {
                                var aJ = ak(this).attr("ows_FileRef").split(";#")[1];
                                var aH = ak(this).attr("ows_Title");
                                var aI = typeof aH !== "undefined" ? aH : "";
                                if (aJ.indexOf(".aspx") > 0) {
                                    aw(aD, aE, "Page", aI, Q + aJ);
                                }
                            });
                    },
                });
            }
        }
        ak("#SPScriptAudit tr[class='ms-alternating']:even").removeAttr("class");
    };
    function aw(aB, aC, aJ, aF, aD) {
        var aG = 0;
        var aI = 0;
        var aE = {};
        aE.type = [];
        aE.src = [];
        aE.script = [];
        var aH = RegExp("<script[\\s\\S]*?/script>", "gi");
        ak.ajax({
            type: "GET",
            url: aD,
            dataType: "text",
            async: false,
            success: function (aP) {
                var aO;
                while ((aO = aH.exec(aP))) {
                    var aK = aj(aO, "language");
                    var aQ = aj(aO, "type");
                    var aM = aj(aO, "src");
                    if (aM !== null && aM.length > 0 && !al(aM)) {
                        aE.type.push(aK !== null && aK.length > 0 ? aK : aQ);
                        aE.src.push(aM);
                        aI++;
                    }
                }
                if ((!aB.showNoScript && aE.type.length > 0) || aB.showNoScript) {
                    var aN = aD.substring(0, aD.lastIndexOf(Q) + 1);
                    var aL =
                        "<tr class=ms-alternating><td class=ms-vb-icon><a href='" +
                        aC.attr("DefaultViewUrl") +
                        "'><IMG border=0 src='" +
                        aC.attr("ImageUrl") +
                        "'width=16 height=16></A></TD><td class=ms-vb2><a href='" +
                        aC.attr("DefaultViewUrl") +
                        "'>" +
                        aC.attr("Title") +
                        (aC.attr("Hidden") === "True" ? "(Hidden)" : "") +
                        "</td><td class=ms-vb2>" +
                        aJ +
                        "</td><td class=ms-vb2>" +
                        aF +
                        "</td><td class=ms-vb2><a href='" +
                        aD +
                        "'>" +
                        R(aD) +
                        "</td>";
                    if (aB.showSrc) {
                        var i;
                        aL += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
                        for (aG = 0; aG < aE.type.length; aG++) {
                            i = aE.src[aG].substr(0, 1) !== Q ? aN + aE.src[aG] : aE.src[aG];
                            aL += "<tr><td class=ms-vb2 width='30%'>" + aE.type[aG] + "</td>";
                            aL += "<td class=ms-vb2 width='70%'><a href='" + i + "'>" + R(aE.src[aG]) + "</td></tr>";
                        }
                        aL += "</table></td>";
                    }
                    ak("#SPScriptAudit").append(aL);
                }
            },
        });
    }
    function aj(aD, aB) {
        var aC;
        var i = RegExp(aB + "=(\"([^\"]*)\")|('([^']*)')", "gi");
        if ((aC = i.exec(aD))) {
            return aC[2];
        }
        return null;
    }
    function al(aD) {
        var aC;
        var aB = ["WebResource.axd", "_layouts"];
        for (aC = 0; aC < aB.length; aC++) {
            if (aD.indexOf(aB[aC]) > -1) {
                return true;
            }
        }
        return false;
    }
    ak.fn.SPServices.SPArrangeChoices = function (aC) {
        var aD = ak.extend({}, { listName: ak().SPServices.SPListNameFromUrl(), columnName: "", perRow: 99, randomize: false }, aC);
        var aF = false;
        var aE = [];
        var aB;
        var i = ak().SPServices({ operation: "GetList", async: false, cacheXML: true, listName: aD.listName });
        i.done(function () {
            aF =
                ak(i.responseXML)
                    .find("Field[DisplayName='" + aD.columnName + "']")
                    .attr("FillInChoice") === "TRUE"
                    ? true
                    : false;
            var aK = y(aD.columnName);
            var aI = ak(aK).find("tr").length;
            var aH = 0;
            var aJ;
            var aG;
            ak(aK)
                .find("tr")
                .each(function (aL) {
                    aH++;
                    if (aF && aH === aI - 1) {
                        aJ = ak(this).find("td").html();
                    } else {
                        if (aF && aH === aI) {
                            aG = ak(this).find("td").html();
                        } else {
                            aE.push(ak(this).html());
                        }
                    }
                });
            if (aD.randomize) {
                aE.sort(p);
            }
            aB = "<tr>";
            for (O = 0; O < aE.length; O++) {
                aB += aE[O];
                if ((O + 1) % aD.perRow === 0) {
                    aB += "</TR><TR>";
                }
            }
            aB += "</tr>";
            if (aF) {
                aB += "<tr><td colspan='99'>" + aJ + aG + "</td></tr>";
            }
            ak(aK).find("tr").remove();
            ak(aK).find("table").append(aB);
        });
    };
    ak.fn.SPServices.SPAutocomplete = function (aC) {
        var aD = ak.extend(
            {},
            {
                WebURL: "",
                sourceList: "",
                sourceColumn: "",
                columnName: "",
                CAMLQuery: "",
                CAMLQueryOptions: "<QueryOptions></QueryOptions>",
                CAMLRowLimit: 0,
                filterType: "BeginsWith",
                numChars: 0,
                ignoreCase: false,
                highlightClass: "",
                uniqueVals: false,
                maxHeight: 99999,
                slideDownSpeed: "fast",
                processingIndicator: "_layouts/images/REFRESH.GIF",
                debug: false,
            },
            aC
        );
        var aF;
        var aB = ak("input[Title='" + aD.columnName + "']");
        ak("input[Title='" + aD.columnName + "']").css("position", "");
        var aG = aB.attr("ID");
        var aE = aB.css("color");
        var aH = aB.css("width");
        if (aB.html() === null && aD.debug) {
            X("SPServices.SPAutocomplete", "columnName: " + aD.columnName, "Column is not an input control or is not found on page");
            return;
        }
        aB.closest("span").find("br").remove();
        aB.wrap("<div>");
        var i = ad("SPAutocomplete", aD.columnName);
        aB.after("<div><ul id='" + i + "' style='width:" + aH + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
        ak("#" + i).css("width", aH);
        ak(aB).keyup(function () {
            var aQ = ak(this).val();
            ak("#" + i).hide();
            if (aQ.length < aD.numChars) {
                return false;
            }
            aB.css({ "background-image": "url(" + aD.processingIndicator + ")", "background-position": "right", "background-repeat": "no-repeat" });
            var aP = [];
            var aI = "<Query><OrderBy><FieldRef Name='" + aD.sourceColumn + "'/></OrderBy><Where>";
            if (aD.CAMLQuery.length > 0) {
                aI += "<And>";
            }
            aI += "<" + aD.filterType + "><FieldRef Name='" + aD.sourceColumn + "'/><Value Type='Text'>" + aQ + "</Value></" + aD.filterType + ">";
            if (aD.CAMLQuery.length > 0) {
                aI += aD.CAMLQuery + "</And>";
            }
            aI += "</Where></Query>";
            ak().SPServices({
                operation: "GetListItems",
                async: false,
                webURL: aD.WebURL,
                listName: aD.sourceList,
                CAMLQuery: aI,
                CAMLQueryOptions: aD.CAMLQueryOptions,
                CAMLViewFields: "<ViewFields><FieldRef Name='" + aD.sourceColumn + "' /></ViewFields>",
                CAMLRowLimit: aD.CAMLRowLimit,
                completefunc: function (aT) {
                    var aS = aD.ignoreCase ? aQ.toUpperCase() : aQ;
                    ak(aT.responseXML)
                        .SPFilterNode("z:row")
                        .each(function () {
                            var aV = ak(this).attr("ows_" + aD.sourceColumn);
                            var aW = aD.ignoreCase
                                ? ak(this)
                                      .attr("ows_" + aD.sourceColumn)
                                      .toUpperCase()
                                : ak(this).attr("ows_" + aD.sourceColumn);
                            if (aD.filterType === "Contains") {
                                var aU = aW.indexOf(aS);
                                if (aU >= 0 && (!aD.uniqueVals || ak.inArray(aV, aP) === -1)) {
                                    aP.push(ak(this).attr("ows_" + aD.sourceColumn));
                                }
                            } else {
                                if (aS === aW.substr(0, aS.length) && (!aD.uniqueVals || ak.inArray(aV, aP) === -1)) {
                                    aP.push(ak(this).attr("ows_" + aD.sourceColumn));
                                }
                            }
                        });
                },
            });
            var aL = "";
            for (O = 0; O < aP.length; O++) {
                if (aD.highlightClass.length > 0) {
                    var aK = RegExp(aQ, aD.ignoreCase ? "gi" : "g");
                    var aN = aP[O].match(aK);
                    var aM = 0;
                    for (aF = 0; aF < aN.length; aF++) {
                        var aO = aP[O].indexOf(aN[aF], aM);
                        var aJ = aO + aN[aF].length;
                        var aR = "<span class='" + aD.highlightClass + "'>" + aN[aF] + "</span>";
                        aP[O] = aP[O].substr(0, aO) + aR + aP[O].substr(aJ);
                        aM = aO + aR.length;
                    }
                }
                aL += "<li style='display: block;position: relative;cursor: pointer;'>" + aP[O] + "</li>";
            }
            ak("#" + i).html(aL);
            ak("#" + i + " li")
                .click(function () {
                    ak("#" + i).fadeOut(aD.slideUpSpeed);
                    ak("#" + aG).val(ak(this).text());
                })
                .mouseover(function () {
                    var aS = { cursor: "hand", color: "#ffffff", background: "#3399ff" };
                    ak(this).css(aS);
                })
                .mouseout(function () {
                    var aS = { cursor: "inherit", color: aE, background: "transparent" };
                    ak(this).css(aS);
                });
            if (aP.length > 0) {
                ak("#" + i).slideDown(aD.slideDownSpeed);
            }
            aB.css("background-image", "");
        });
    };
    ak.fn.SPServices.SPGetQueryString = function () {
        var aG = {};
        var aF;
        var aB = location.search.substring(1, location.search.length);
        var aC = aB.split("&");
        var aE = /^([^=]+)=(.*)/i;
        for (var aD = 0; aD < aC.length; aD++) {
            aF = aE.exec(aC[aD]);
            if (aE.test(location.href)) {
                if (aF !== null && aF.length > 2) {
                    aG[aF[1]] = unescape(aF[2]).replace(/\+/g, " ");
                }
            }
        }
        return aG;
    };
    ak.fn.SPServices.SPListNameFromUrl = function (i) {
        var aB = ak.extend({}, { listName: "" }, i);
        if (aB.listName.length > 0) {
            ao.thisList = aB.listName;
            return ao.thisList;
        } else {
            if (ao.thisList.length > 0) {
                return ao.thisList;
            }
        }
        var aD = location.href;
        var aC = aD.substring(0, aD.indexOf(".aspx"));
        var aE = decodeURIComponent(aC.substring(0, aC.lastIndexOf(Q) + 1)).toUpperCase();
        ak().SPServices({
            operation: "GetListCollection",
            async: false,
            completefunc: function (aF) {
                ak(aF.responseXML)
                    .find("List")
                    .each(function () {
                        var aG = ak(this).attr("DefaultViewUrl");
                        var aH = aG.substring(0, aG.lastIndexOf(Q) + 1).toUpperCase();
                        if (aE.indexOf(aH) > 0) {
                            ao.thisList = ak(this).attr("ID");
                            return false;
                        }
                    });
            },
        });
        return ao.thisList;
    };
    ak.fn.SPServices.SPUpdateMultipleListItems = function (aD) {
        var aF = ak.extend({}, { webURL: "", listName: "", CAMLQuery: "", batchCmd: "Update", valuepairs: [], completefunc: null, folder: "", debug: false }, aD);
        var aE;
        var aH = [];
        var aG = [];
        ak().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: aF.webURL,
            listName: aF.listName,
            CAMLQuery: aF.CAMLQuery,
            CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' />" + (aF.folder.length > 0 ? "<Folder>" + aF.folder + "</Folder>" : "") + "</QueryOptions>",
            completefunc: function (i) {
                ak(i.responseXML)
                    .SPFilterNode("z:row")
                    .each(function () {
                        aH.push(ak(this).attr("ows_ID"));
                        var aI = ak(this).attr("ows_FileRef");
                        aI = "/" + aI.substring(aI.indexOf(";#") + 2);
                        aG.push(aI);
                    });
            },
        });
        var aB;
        var aC = "<Batch OnError='Continue'>";
        for (aE = 0; aE < aH.length; aE++) {
            aC += "<Method ID='" + aE + "' Cmd='" + aF.batchCmd + "'>";
            for (aB = 0; aB < aF.valuepairs.length; aB++) {
                aC += "<Field Name='" + aF.valuepairs[aB][0] + "'>" + L(aF.valuepairs[aB][1]) + "</Field>";
            }
            aC += "<Field Name='ID'>" + aH[aE] + "</Field>";
            if (aG[aE].length > 0) {
                aC += "<Field Name='FileRef'>" + aG[aE] + "</Field>";
            }
            aC += "</Method>";
        }
        aC += "</Batch>";
        ak().SPServices({
            operation: "UpdateListItems",
            async: false,
            webURL: aF.webURL,
            listName: aF.listName,
            updates: aC,
            completefunc: function (i) {
                if (aF.completefunc !== null) {
                    aF.completefunc(i);
                }
            },
        });
    };
    ak.fn.SPServices.SPConvertDateToISO = function (i) {
        var aB = ak.extend({}, { dateToConvert: new Date(), dateOffset: "-05:00" }, i);
        var aC = "";
        var aD = aB.dateToConvert;
        aC += aD.getFullYear() + "-";
        aC += t(aD.getMonth() + 1) + "-";
        aC += t(aD.getDate());
        aC += "T" + t(aD.getHours()) + ":";
        aC += t(aD.getMinutes()) + ":";
        aC += t(aD.getSeconds()) + "Z" + aB.dateOffset;
        return aC;
    };
    ak.fn.SPFilterNode = function (i) {
        return this.find("*").filter(function () {
            return this.nodeName === i;
        });
    };
    ak.fn.SPXmlToJson = function (i) {
        var aC = ak.extend({}, { mapping: {}, includeAllAttrs: false, removeOws: true }, i);
        var aD;
        var aB = [];
        this.each(function () {
            var aH = {};
            var aJ = this.attributes;
            ak.each(aC.mapping, function () {
                aH[this.mappedName] = "";
            });
            for (aD = 0; aD < aJ.length; aD++) {
                var aI = aJ[aD].name;
                var aG = aC.mapping[aI];
                var aE = typeof aG !== "undefined" ? aG.mappedName : aC.removeOws ? aI.split("ows_")[1] : aI;
                var aF = typeof aG !== "undefined" ? aG.objectType : undefined;
                if (aC.includeAllAttrs || aG !== undefined) {
                    aH[aE] = M(aJ[aD].value, aF);
                }
            }
            aB.push(aH);
        });
        return aB;
    };
    function M(aB, i) {
        var aC;
        switch (i) {
            case "DateTime":
            case "datetime":
                aC = d(aB);
                break;
            case "User":
                aC = S(aB);
                break;
            case "UserMulti":
                aC = w(aB);
                break;
            case "Lookup":
                aC = at(aB);
                break;
            case "LookupMulti":
                aC = o(aB);
                break;
            case "Boolean":
                aC = q(aB);
                break;
            case "Integer":
                aC = a(aB);
                break;
            case "Counter":
                aC = a(aB);
                break;
            case "MultiChoice":
                aC = v(aB);
                break;
            case "Currency":
            case "float":
                aC = P(aB);
                break;
            case "Calc":
                aC = an(aB);
                break;
            default:
                aC = r(aB);
                break;
        }
        return aC;
    }
    function r(i) {
        return i;
    }
    function a(i) {
        return parseInt(i, 10);
    }
    function P(i) {
        return parseFloat(i);
    }
    function q(aB) {
        var i = aB === "0" ? false : true;
        return i;
    }
    function d(i) {
        return new Date(i.replace(/-/g, "/"));
    }
    function S(aC) {
        if (aC.length === 0) {
            return null;
        } else {
            var i = new m(aC);
            var aB = i.value.split(",#");
            if (aB.length === 1) {
                return { userId: i.Id, userName: i.value };
            } else {
                return { userId: i.Id, userName: aB[0].replace(/(,,)/g, ","), loginName: aB[1].replace(/(,,)/g, ","), email: aB[2].replace(/(,,)/g, ","), sipAddress: aB[3].replace(/(,,)/g, ","), title: aB[4].replace(/(,,)/g, ",") };
            }
        }
    }
    function w(aC) {
        if (aC.length === 0) {
            return null;
        } else {
            var aD = [];
            var aB = aC.split(";#");
            for (O = 0; O < aB.length; O = O + 2) {
                var i = S(aB[O] + ";#" + aB[O + 1]);
                aD.push(i);
            }
            return aD;
        }
    }
    function at(i) {
        if (i.length === 0) {
            return null;
        } else {
            var aB = new m(i);
            return { lookupId: aB.id, lookupValue: aB.value };
        }
    }
    function o(aB) {
        if (aB.length === 0) {
            return null;
        } else {
            var aD = [];
            var i = aB.split(";#");
            for (O = 0; O < i.length; O = O + 2) {
                var aC = at(i[O] + ";#" + i[O + 1]);
                aD.push(aC);
            }
            return aD;
        }
    }
    function v(aC) {
        if (aC.length === 0) {
            return null;
        } else {
            var i = [];
            var aB = aC.split(";#");
            for (O = 0; O < aB.length; O++) {
                if (aB[O].length !== 0) {
                    i.push(aB[O]);
                }
            }
            return i;
        }
    }
    function an(aB) {
        if (aB.length === 0) {
            return null;
        } else {
            var i = aB.split(";#");
            return M(i[1], i[0]);
        }
    }
    ak.fn.SPServices.SPFindPeoplePicker = function (aC) {
        var aD = ak.extend({}, { peoplePickerDisplayName: "", valueToSet: "", checkNames: true }, aC);
        var aG = ak("nobr")
            .filter(function () {
                return ak(this).contents().eq(0).text() === aD.peoplePickerDisplayName;
            })
            .closest("tr");
        var aB = aG.find("div[name='upLevelDiv']");
        var i = aG.find("img[Title='Check Names']:first");
        if (aD.valueToSet.length > 0) {
            aB.html(aD.valueToSet);
        }
        if (aD.checkNames) {
            i.click();
        }
        var aF = ak.trim(aB.text());
        var aE = [];
        aB.children("span").each(function () {
            var aJ = ak(this).find("div[data]").attr("data");
            var aH = {};
            if (typeof aJ !== "undefined") {
                var aK = ak.parseXML(aJ);
                var aI = ak(aK);
                aI.find("DictionaryEntry").each(function () {
                    var aL = ak(this).find("Key").text();
                    var aM = ak(this).find("Value").text();
                    aH[aL] = aM;
                });
                aE.push(aH);
            } else {
                ak().SPServices({
                    operation: "GetUserInfo",
                    async: false,
                    cacheXML: true,
                    userLoginName: ak(this).attr("title"),
                    completefunc: function (aL) {
                        ak(aL.responseXML)
                            .find("User")
                            .each(function () {
                                ak.each(this.attributes, function (aN, aP) {
                                    var aM = aP.name;
                                    var aO = aP.value;
                                    aH[aM] = aO;
                                });
                                aE.push(aH);
                            });
                    },
                });
            }
        });
        return { row: aG, contents: aB, currentValue: aF, checkNames: i, dictionaryEntries: aE };
    };
    ak.fn.SPFindPeoplePicker = function (i) {
        return ak().SPServices.SPFindPeoplePicker(i);
    };
    ak.fn.SPServices.SPFindMMSPicker = function (aD) {
        var aF = ak.extend({}, { MMSDisplayName: "" }, aD);
        var aC = [];
        var aB = ak("div[title='" + aF.MMSDisplayName + "']");
        var aI = aB.closest("td").find("input[type='hidden']");
        var aH = aI.val().split(";");
        for (var aE = 0; aE < aH.length; aE++) {
            var aG = aH[aE].split("|");
            aC.push({ value: aG[0], guid: aG[1] });
        }
        return { terms: aC };
    };
    ak.fn.SPServices.Version = function () {
        return aa;
    };
    function ao() {
        if (typeof _spPageContextInfo !== "undefined") {
            this.thisSite = _spPageContextInfo.webServerRelativeUrl;
            this.thisList = _spPageContextInfo.pageListId;
            this.thisUserId = _spPageContextInfo.userId;
        } else {
            this.thisSite = typeof L_Menu_BaseUrl !== "undefined" ? L_Menu_BaseUrl : "";
            this.thisList = "";
            this.thisUserId = typeof _spUserId !== "undefined" ? _spUserId : undefined;
        }
    }
    function W(aM, aI, aN, aD) {
        if (typeof aN === "undefined") {
            return "";
        }
        var aJ;
        var aK = "";
        var aH;
        var aF;
        var aL = [];
        var aE = aD.relatedWebURL.length > 0 ? aD.relatedWebURL : ak().SPServices.SPGetCurrentSite();
        switch (aI.attr("Type")) {
            case "Text":
                aK = aN;
                break;
            case "URL":
                switch (aI.attr("Format")) {
                    case "Hyperlink":
                        aK = "<a href='" + aN.substring(0, aN.search(",")) + "'>" + aN.substring(aN.search(",") + 1) + "</a>";
                        break;
                    case "Image":
                        aK = "<img alt='" + aN.substring(aN.search(",") + 1) + "' src='" + aN.substring(0, aN.search(",")) + "'/>";
                        break;
                    default:
                        aK = aN;
                        break;
                }
                break;
            case "User":
            case "UserMulti":
                var aB = aN.split(";#");
                for (aJ = 0; aJ < aB.length; aJ = aJ + 2) {
                    aL.push("<a href='/_layouts/userdisp.aspx?ID=" + aB[aJ] + "&Source=" + z(location.href) + "'>" + aB[aJ + 1] + "</a>");
                }
                aK = aL.join(", ");
                break;
            case "Calculated":
                var aG = aN.split(";#");
                aK = aG[1];
                break;
            case "Number":
                aF = aI.attr("Decimals");
                aK = typeof aF === "undefined" ? parseFloat(aN).toString() : parseFloat(aN).toFixed(aF).toString();
                break;
            case "Currency":
                aF = aI.attr("Decimals");
                aK = typeof aF === "undefined" ? parseFloat(aN).toFixed(2).toString() : parseFloat(aN).toFixed(aF).toString();
                break;
            case "Lookup":
                switch (aI.attr("Name")) {
                    case "FileRef":
                        aH = aM.attr("BaseType") === "1" ? aM.attr("RootFolder") + Q + "Forms/DispForm.aspx" : aM.attr("RootFolder") + Q + "DispForm.aspx";
                        aK = "<a href='" + aH + "?ID=" + aN.substring(0, aN.search(";#")) + "&RootFolder=*&Source=" + z(location.href) + "'>" + aN.substring(aN.search(";#") + 2) + "</a>";
                        break;
                    case "FileDirRef":
                        aH = Q + aN.substring(aN.search(";#") + 2);
                        aK = "<a href='" + aH + "'>" + aN.substring(aN.search(";#") + 2) + "</a>";
                        break;
                    default:
                        aH = D(aI.attr("List"), "DisplayForm");
                        aK = "<a href='" + aD.relatedWebURL + Q + aH + "?ID=" + aN.substring(0, aN.search(";#")) + "&RootFolder=*&Source=" + z(location.href) + "'>" + aN.substring(aN.search(";#") + 2) + "</a>";
                        break;
                }
                break;
            case "LookupMulti":
                aH = D(aI.attr("List"), "DisplayForm");
                aK = "";
                if (aN.length > 0) {
                    var aC = aN.split(";#");
                    for (aJ = 0; aJ < aC.length / 2; aJ++) {
                        aL.push("<a href='" + aE + Q + aH + "?ID=" + aC[aJ * 2] + "&RootFolder=*&Source=" + z(location.href) + "'>" + aC[aJ * 2 + 1] + "</a>");
                    }
                }
                aK = aL.join(", ");
                break;
            case "File":
                R = aN.substring(aN.search(";#") + 2);
                aK = "<a href='" + aM.attr("RootFolder") + Q + R + "'>" + R + "</a>";
                break;
            case "Counter":
                aK = aN;
                break;
            case "DateTime":
                aK = aN;
                break;
            default:
                aK = aN;
                break;
        }
        return aK;
    }
    function s(aD) {
        var aC;
        var aB = "<table class='ms-vb' width='100%'>";
        for (aC = 0; aC < aD.attributes.length; aC++) {
            aB += "<tr><td width='10px' style='font-weight:bold;'>" + aC + "</td><td width='100px'>" + aD.attributes.item(aC).nodeName + "</td><td>" + N(aD.attributes.item(aC).nodeValue) + "</td></tr>";
        }
        aB += "</table>";
        return aB;
    }
    function aq(i) {
        if ((this.Obj = ak("select[Title='" + i + "']")).length === 1) {
            this.Type = "S";
        } else {
            if ((this.Obj = ak("input[Title='" + i + "']")).length === 1) {
                this.Type = "C";
            } else {
                if ((this.Obj = ak("select[ID$='SelectCandidate'][Title^='" + i + " ']")).length === 1) {
                    this.Type = "M";
                } else {
                    if ((this.Obj = ak("select[ID$='SelectCandidate'][Title$=': " + i + "']")).length === 1) {
                        this.Type = "M";
                    } else {
                        if ((this.Obj = ak("select[ID$='SelectCandidate'][Title$='\"" + i + "\".']")).length === 1) {
                            this.Type = "M";
                        } else {
                            if ((this.Obj = ak("select[ID$='SelectCandidate'][Title$=' " + i + "']")).length === 1) {
                                this.Type = "M";
                            } else {
                                this.Type = null;
                            }
                        }
                    }
                }
            }
        }
    }
    function az(aD) {
        this.MultiLookupPickerdata = aD.closest("span").find("input[id*='MultiLookup'][id$='data']");
        var aB = this.MultiLookupPickerdata.attr("id");
        var aC = aB.indexOf("Multi");
        var i = aB.substr(aC);
        var aE = aB.substr(0, aC) + i.substr(0, i.indexOf("_") + 1) + "m";
        this.master = window[aE];
    }
    function c(aD, aB) {
        var i = [];
        switch (aD.Type) {
            case "S":
                if (aB) {
                    i.push(aD.Obj.find("option:selected").val() || []);
                } else {
                    i.push(aD.Obj.find("option:selected").text() || []);
                }
                break;
            case "C":
                if (aB) {
                    i.push(ak("input[id='" + aD.Obj.attr("optHid") + "']").val() || []);
                } else {
                    i.push(aD.Obj.attr("value") || []);
                }
                break;
            case "M":
                var aC = aD.Obj.closest("span").find("select[ID$='SelectResult']");
                ak(aC)
                    .find("option")
                    .each(function () {
                        i.push(ak(this).html());
                    });
                break;
            default:
                break;
        }
        return i;
    }
    function X(aB, aD, aC) {
        var i =
            "<b>Error in function</b><br/>" +
            aB +
            "<br/><b>Parameter</b><br/>" +
            aD +
            "<br/><b>Message</b><br/>" +
            aC +
            "<br/><br/><span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
        V(i);
    }
    function V(aF) {
        var aC = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
        ak("#aspnetForm")
            .parent()
            .append("<div id='SPServices_msgBox' style=" + aC + ">" + aF);
        var i = ak("#SPServices_msgBox").height();
        var aE = ak("#SPServices_msgBox").width();
        var aD = ak(window).width() / 2 - aE / 2 + "px";
        var aB = ak(window).height() / 2 - i / 2 - 100 + "px";
        ak("#SPServices_msgBox")
            .css({ border: "5px #C02000 solid", left: aD, top: aB })
            .show()
            .fadeTo("slow", 0.75)
            .click(function () {
                ak(this).fadeOut("3000", function () {
                    ak(this).remove();
                });
            });
    }
    function ad(i, aB) {
        return i + "_" + ak().SPServices.SPGetStaticFromDisplay({ listName: ak().SPServices.SPListNameFromUrl(), columnDisplayName: aB });
    }
    function D(i, aC) {
        var aB;
        ak().SPServices({
            operation: "GetFormCollection",
            async: false,
            listName: i,
            completefunc: function (aD) {
                aB = ak(aD.responseXML)
                    .find("Form[Type='" + aC + "']")
                    .attr("Url");
            },
        });
        return aB;
    }
    function ap(aD, aB) {
        var aC;
        for (aC = 0; aC < aB.length; aC++) {
            if (typeof aB[aC] === "string") {
                T.payload += au(aB[aC], aD[aB[aC]]);
            } else {
                if (aB[aC].length === 2) {
                    T.payload += au(aB[aC][0], aD[aB[aC][1]]);
                } else {
                    X(aD.operation, "paramArray[" + aC + "]: " + aB[aC], "Invalid paramArray element passed to addToPayload()");
                }
            }
        }
    }
    function y(i) {
        var aC;
        var aB = RegExp('FieldName="' + i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + '"', "gi");
        ak("td.ms-formbody, td.ms-formbodysurvey").each(function () {
            if (aB.test(ak(this).html())) {
                aC = ak(this);
                return false;
            }
        });
        return aC;
    }
    function j(i, aC) {
        var aB = aC.substring(8);
        i.opheader = i.opheader.replace(aC, aB);
        i.opfooter = i.opfooter.replace(aC, aB);
        return i;
    }
    function au(aC, aB) {
        var i = typeof aB !== "undefined" ? aB : "";
        return "<" + aC + ">" + i + "</" + aC + ">";
    }
    function p() {
        return Math.round(Math.random()) - 0.5;
    }
    function N(i) {
        return i.indexOf("http") === 0 || i.indexOf(Q) === 0 ? "<a href='" + i + "'>" + i + "</a>" : i;
    }
    function R(i) {
        return i.substring(i.lastIndexOf(Q) + 1, i.length);
    }
    var Y = { "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" };
    var H = { "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">" };
    function h(i) {
        return i.replace(/([\&"<>])/g, function (aC, aB) {
            return Y[aB];
        });
    }
    function I(i) {
        return i.replace(/(&quot;|&lt;|&gt;|&amp;)/g, function (aC, aB) {
            return H[aB];
        });
    }
    function L(i) {
        if (typeof i === "string") {
            return i.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
        } else {
            return i;
        }
    }
    function z(i) {
        return i.replace(/&/g, "%26");
    }
    function m(i) {
        var aB = i.split(";#");
        this.id = aB[0];
        this.value = aB[1];
    }
    function t(i) {
        return i < 10 ? "0" + i : i;
    }
})(jQuery);
