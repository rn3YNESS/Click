/* This script should run as part of the master page */
/*
/* This script is a part of a template site and therefor 
/* when put in the masterpage it is uncomformtable to 
/* change its location.
/* 
/* This script, loads other script to the masterpage
/* as well as to specific pages.
/*****************************************************/
window.PMOClick = window.PMOClick || {};
PMOClick.Load = {
   // Glocal scripts to add to all pages
   ScriptLocations: [
      //SharePoint Required JS
      '_layouts/15/MicrosoftAjax.js',
      //'_layouts/15/init.js',
      '_layouts/15/SP.init.js',
      '_layouts/15/sp.runtime.js',
      '_layouts/15/sp.js',
      '_layouts/15/core.js',
      //'_layouts/15/1033/strings.js', //EN
      '_layouts/15/1037/strings.js', //HE
      //'_layouts/15/clienttemplates.js',
      '_layouts/15/clientforms.js',
      '_layouts/15/clientpeoplepicker.js',
      '_layouts/15/autofill.js',
     // '_layouts/15/ScriptResx.ashx?name=sp.res&culture=en-us',
     '_layouts/15/ScriptResx.ashx?name=sp.res&culture=he-il',
      '_layouts/15/SP.UserProfiles.js',
       '_layouts/15/SP.UI.Dialog.js',
       '_layouts/15/sp.core.js',
      //Custom Scripts ,
      '_catalogs/masterpage/click/js/browserCheck.js',                                                              
      '_catalogs/masterpage/click/js/Utility.js',
      '_catalogs/masterpage/click/js/search.js'      
   ],

   // Glocal css to add to all pages
   StyleLocations: [
      //Custom CSS
      //'_catalogs/masterpage/click/css/style.css',
      //'_catalogs/masterpage/click/css/bootstrap.css'                
      /*//Jquery Library Scripts
      '_catalogs/masterpage/MSP/css/Jquery-UI/jquery-ui.min.css'*/
   ],


   // Script to add to specific pages
   PageScripts: [
      { page: '/Pages/default.aspx', scripts: ['_catalogs/masterpage/click/js/clickHome.js'] },
     // { page: '/Pages/sergeyi.aspx', scripts: ['_catalogs/masterpage/click/js/greeting.js'] },
      { page: '/Pages/aviya.aspx', scripts: ['_catalogs/masterpage/click/js/myTasksDocsEvents.js'] },
      { page: '/Pages/ShowReminder.aspx', scripts: ['_catalogs/masterpage/click/js/showReminderItem.js'] },
      { page: '/Pages/ClickManagment.aspx', scripts: ['_catalogs/masterpage/click/js/ClickManagmentAdmin.js'] },
      { page: '/Pages/ClickManagment.aspx', scripts: ['_catalogs/masterpage/click/js/json2xml.js'] },
      { page: '/Pages/AddToFavorite.aspx', scripts: ['_catalogs/masterpage/click/js/AddToFavorite.js'] },
    //  { page: '/Pages/AddToFavorite.aspx', scripts: ['_layouts/15/SP.UI.Dialog.js'] },
      //{ page: '/Pages/ConnectedItems.aspx', scripts: ['_catalogs/masterpage/click/js/jquery.SPServices-2013.01.min.js'] },      
      //{ page: '/Pages/ConnectedItems.aspx', scripts: ['_catalogs/masterpage/click/js/jquery.SPServices-Menifa.js'] },
      //{ page: '/Pages/ConnectedItems.aspx', scripts: ['_catalogs/masterpage/click/js/jquery.SPServices-Menifa2.js'] },
      { page: '/visitorsIT/Pages/orderVisitors.aspx', scripts: ['_catalogs/masterpage/click/js/‏‏‏‏OrdersIT.js'] },
      { page: '/visitors/Pages/orderVisitors.aspx', scripts: ['_catalogs/masterpage/click/js/Visitors.js'] },
      { page: '/visitors/Pages/orderVisitors-copy.aspx', scripts: ['_catalogs/masterpage/click/js/‏‏VisitorsCopy.js'] },
      { page: '/Pages/DocsLink.aspx', scripts: ['_catalogs/masterpage/click/js/DocsLink.js'] },
    //  { page: '/Pages/Tester.aspx', scripts: ['_catalogs/masterpage/click/js/Tester.js']},
    //  { page: '/HRSM/Lists/FAST_AbsenceRequest/FAST_AbsenceRequest/newifs.aspx', scripts: ['_catalogs/masterpage/clickJS/NewItemPopUp.js'] },
    //  { page: '/HRSM/Lists/AbsenceForm/AbsenceForm/newifs.aspx', scripts: ['_catalogs/masterpage/clickJS/NewItemPopUp.js'] },
    //  { page: '/Design/Lists/DesingForm/%D7%98%D7%95%D7%A4%D7%A1%20%D7%91%D7%A7%D7%A9%D7%94/newifs.aspx', scripts: ['_catalogs/masterpage/clickJS/NewItemPopUp.js'] },
    //  { page: '/SitePages/NewItemPopUp.aspx', scripts: ['_catalogs/masterpage/clickJS/NewItemPopUp.js'] },   
      { page: '/visitorsIT/Lists/visitors/%D7%9E%D7%95%D7%96%D7%9E%D7%9F/newifs.aspx', scripts: ['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/js/AutoComplete.js']},
      { page: '/SitePages/ItemPopUp.aspx', scripts: ['_catalogs/masterpage/click/js/itempopup.js'] },
      { page: '/SitePages/newItempopup.aspx', scripts: ['_catalogs/masterpage/click/js/NewItemPopUp.js'] },
      { page: '/sites/Finance/travel/Pages/default.aspx', scripts: ['_catalogs/masterpage/click/js/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/js/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/financeAC.js']},
     // { page: '/sites/securityfiltering/Lists', scripts: ['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/JS/secFilteringAC.js']},
      { page: '/sites/securityfiltering/Lists', scripts: ['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/secFilteringAC.js']},
    // { page: '/sites/legaldepartment/HR/Pages/NameSearch.aspx', scripts: ['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/legalAC.js']}
      //{ page: '/sites/legaldepartment/HR/Pages/NameSearch.aspx', scripts: ['_catalogs/masterpage/click/js/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/js/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/legaldep/HRALLlegalAC.js']},
      {page:'/sites/legaldepartment/Forms/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/tenderFormAC.js'] },
      //{page:'/sites/legaldepartment/Forms/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/js/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/legaldep/tenderFormAC.js'] }
      {page:'/sites/legaldepartment/ProtocolLib/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/protocolsAC.js'] },
      {page:'/sites/legaldepartment/CommerceLib/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/protocolsAC.js'] },
      {page:'/sites/legaldepartment/AgreementLib/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/protocolsAC.js'] },
      {page:'/sites/legaldepartment/HR/Lists/ApplicantsList/', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRunitAC.js'] },
      //{page:'/sites/legaldepartment/HR/WorkPrivate/Forms/EditForm', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRworkerAC.js'] },
      //{page:'/sites/legaldepartment/HR/Relatives/Forms/EditFormNew', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRworkerAC.js'] },
      //{page:'/sites/legaldepartment/HR/ConflictInterest/Forms/EditFormNew', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRworkerAC.js'] },
      //{page:'/sites/legaldepartment/HR/relativesSec/Forms/EditFormNew', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRworkerAC.js'] },
      //{page:'/sites/legaldepartment/HR/Compromise/Forms/EditFormNew', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRworkerAC.js'] },
      {page:'/sites/legaldepartment/HR/Pages/DepartmentSearch.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/HRpageUnitAC.js'] },
      {page:'/sites/legaldepartment/Correspondence/Pages/HighCourts.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/legaldep/HightCourtsAC.js'] },
      {page:'sites/legaldepartment/Correspondence/Pages/claims.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/legaldep/claimsAC.js'] },
      //{page:'sites/legaldepartment/Correspondence/Pages/claims.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/legaldep/claimsAC.js'] }
      {page:'/sites/LegalDepartment/Correspondence/Pages/Suggestions.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/legaldep/suggestionsAC.js'] },
      {page:'/sites/Committees/ana/Lists/AnaForum/NewForm.aspx', scripts:['/sites/Committees/Menifa/createNewForumMessage.js'] },
      {page:'/sites/Committees/WearCommittee/Pages/default.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/committees/wearMainPageAC.js'] },
      {page:'/sites/Committees/WearCommittee/protocolsLibrary/forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/committees/wearProtocolsAC.js'] },
      {page:'/sites/Committees/parking/Pages/employeeParkingVouchers.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/committees/parkAllWorkerInfoAC.js'] },
      {page:'/sites/Committees/parking/Lists/ParkingTickets/NewForm.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/js/acjs/committees/parkSetFromURL.js'] },
      {page:'/sites/Committees/parking/Lists/ParkingApprovalList/NewFormNew.aspx', scripts:['_catalogs/masterpage/click/js/acjs/committees/parkingInsertValsToFields.js'] },
      {page:'/sites/Training/Pages/SearchEmployee.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/training/workerInfoAC.js'] },
      {page:'sites/Training/Pages/SearchByCourse.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/training/courseNameSearchAC.js'] },
      {page:'/sites/Training/Certificate/Forms/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/training/certAC.js'] },
      //{page:'/sites/mankalorbit/Office/Lists/PhoneCON/newform.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/mankal/messagesAC.js'] },
      //{page:'/sites/mankalorbit/Office/Lists/PhoneCON/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/mankal/messagesAC.js'] },
      //{page:'/sites/mankalorbit/Office/Lists/TaskList/NewForm.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices.2014.02.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-Menifa2.js','_catalogs/masterpage/click/js/acjs/mankal/tasksAC.js'] },
      //{page:'/sites/mankalorbit/Office/Lists/TaskList/EditForm.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices.2014.02.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-Menifa2.js','_catalogs/masterpage/click/js/acjs/mankal/tasksAC.js'] },
      {page:'/sites/mankalorbit/Office/Lists/TaskList/NewForm.aspx', scripts:['/_catalogs/masterpage/click/JS/AutoComplete.js','/_catalogs/masterpage/click/js/acjs/mankal/tasksAC.js'] },
      {page:'/sites/mankalorbit/Office/Lists/TaskList/EditForm.aspx', scripts:['/_catalogs/masterpage/click/JS/AutoComplete.js','/_catalogs/masterpage/click/js/acjs/mankal/tasksAC.js'] },
      
      {page:'/sites/sec/Lists/TelMessages/NewForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/sec/messagesAC.js'] },
      {page:'/sites/sec/Lists/TelMessages/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/sec/messagesAC.js'] },
      {page:'/sec/Lists/TelMessagesRamat/NewForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/sec/messagesAC.js'] },
      {page:'/sec/Lists/TelMessagesRamat/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/sec/messagesAC.js'] },
      {page:'/sites/it/Pages/Activities.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices.2014.02.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-Menifa2.js','/_catalogs/masterpage/click/js/acjs/it/activitiesPageAC.js'] },
      {page:'/sites/it/Pages/URLFilteredActivity.aspx', scripts:['_catalogs/masterpage/click/js/acjs/it/activityInfoPage.js'] },
      {page:'/sites/it/Lists/List2/NewForm2.aspx', scripts:['_catalogs/masterpage/click/js/acjs/it/createNewMilestone.js'] },
      {page:'/sites/it/Lists/TaskList/newformtest.aspx', scripts:['_catalogs/masterpage/click/js/acjs/it/newActivityTask.js'] },
      {page:'/sites/it/Pages/IT_Links.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices.2014.02.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-Menifa2.js','_catalogs/masterpage/click/js/acjs/it/systemsPageAC.js'] },
      {page:'/it/Office/Lists/MessagesList/newform.aspx', scripts:['_catalogs/masterpage/click/JS/jquery.SPServices-2013.01.js','_catalogs/masterpage/click/JS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/acjs/it/ramiMessagesAC.js'] },
      {page:'/sites/it/Prof_Work/Lists/NetworkPrintersList/NewForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/it/printersAndFaxesAC.js'] },
      {page:'/sites/it/Prof_Work/Lists/NetworkPrintersList/EditForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/it/printersAndFaxesAC.js'] },
      {page:'/sites/it/Prof_Work/Lists/SystemChanges/NewForm.aspx', scripts:['_catalogs/masterpage/click/js/AutoComplete.js','_catalogs/masterpage/click/js/acjs/it/changesAC.js'] },
      {page:'/visitorsIT/Lists/visitorsOrder/%D7%94%D7%96%D7%9E%D7%A0%D7%AA%20%D7%9E%D7%91%D7%A7%D7%A8%D7%99%D7%9D/newifs.aspx', scripts:['_catalogs/masterpage/click/js/visitorsit/addVisitorBtn.js'] },
      {page:'/visitorsIT/Lists/visitorsOrder/%D7%94%D7%96%D7%9E%D7%A0%D7%AA%20%D7%9E%D7%91%D7%A7%D7%A8%D7%99%D7%9D/editifs.aspx', scripts:['_catalogs/masterpage/click/js/visitorsit/addVisitorBtn.js'] },
      {page:'/visitorsIT/Lists/visitors/%D7%9E%D7%95%D7%96%D7%9E%D7%9F/newifs.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices-2013.01.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/visitorsit/setOrder.js'] },
      {page:'/visitors/Lists/visitorsOrder/%D7%94%D7%96%D7%9E%D7%A0%D7%AA%20%D7%9E%D7%91%D7%A7%D7%A8%D7%99%D7%9D/newifs.aspx', scripts:['_catalogs/masterpage/click/js/visitors/addVisitorBtn.js'] },
      {page:'/visitors/Lists/visitorsOrder/%D7%94%D7%96%D7%9E%D7%A0%D7%AA%20%D7%9E%D7%91%D7%A7%D7%A8%D7%99%D7%9D/editifs.aspx', scripts:['_catalogs/masterpage/click/js/visitors/addVisitorBtn.js'] },
      {page:'/visitors/Lists/visitors/%D7%9E%D7%95%D7%96%D7%9E%D7%9F/newifs.aspx', scripts:['/_catalogs/masterpage/clickJS/jquery.SPServices-2013.01.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-menifa2.js','_catalogs/masterpage/click/js/visitors/setOrder.js'] },
      { page: '/ITSM/Lists/incident/Item/newifs.aspx', scripts: ['/_catalogs/masterpage/clickJS/jquery-ui.min.js','_catalogs/masterpage/click/js/ITSM/formAutocomplete.js'] },
      { page: '/ITSM/Lists/itsmSurvey/Item/newifs.aspx', scripts: ['_catalogs/masterpage/click/js/ITSM/createNewSurvey.js'] },
      { page: '/SSM/Lists/incident/Item/newifs.aspx', scripts: ['/_catalogs/masterpage/clickJS/jquery-ui.min.js','_catalogs/masterpage/click/js/ssm/formAC.js'] },
      { page: '/SSM/Lists/SSMFeedback/Item/newifs.aspx', scripts: ['_catalogs/masterpage/click/js/SSM/createNewSurvey.js'] },
      { page: '/sites/it/InfoSecTeam/Lists/ConsultingHours/NewFormNew.aspx', scripts: ['/_catalogs/masterpage/clickJS/jquery.SPServices.2014.02.min.js','/_catalogs/masterpage/clickJS/jquery.SPServices-Menifa2.js','/_catalogs/masterpage/click/js/acjs/it/cyber/consultinghoursAC.js'] },
      { page: '/sites/it/InfoSecTeam/Lists/ProjectTaskList/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/acjs/it/cyber/projectTaskLIst.js'] },
      { page: '/sites/it/InfoSecTeam/Lists/ProjectTaskList/EditForm.aspx', scripts: ['_catalogs/masterpage/click/js/acjs/it/cyber/projectTaskLIst.js'] },
      { page: '/sites/it/InfoSecTeam/Systems/Forms/EditForm.aspx', scripts: ['_catalogs/masterpage/click/js/acjs/it/cyber/addnewSystem.js'] },
      { page: '/sites/it/InfoSecTeam/KnowledgeBase/Forms/EditForm.aspx', scripts: ['_catalogs/masterpage/click/js/acjs/it/cyber/addnewSystem.js'] },
      { page: '/sites/centadmin/proUnit/Shared%20Documents/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/centAdmin/addNewTask.js'] },
      { page: '/sites/centadmin/proUnit/Lists/taskList/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/centAdmin/setDocIdToTask.js'] },
      { page: '/sites/Npdu/Docs_Div1/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D%20%D7%94%D7%A1%D7%91%D7%A8%D7%94/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/addnewtask.js'] },
      { page: '/sites/Npdu/Docs_Div2/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D%20%D7%94%D7%A1%D7%91%D7%A8%D7%94/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/addnewtask.js'] },
      { page: '/sites/Npdu/Docs_Div3/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D%20%D7%94%D7%A1%D7%91%D7%A8%D7%94/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/addnewtask.js'] },
      { page: '/sites/Npdu/Docs_Div4/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D%20%D7%94%D7%A1%D7%91%D7%A8%D7%94/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/addnewtask.js'] },
      { page: '/sites/Npdu/Lists/Tasks_Div1/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/setFolderIDtoTask.js'] },
      { page: '/sites/Npdu/Lists/Tasks_Div2/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/setFolderIDtoTask.js'] },
      { page: '/sites/Npdu/Lists/Tasks_Div3/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/setFolderIDtoTask.js'] },
      { page: '/sites/Npdu/Lists/Tasks_Div4/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/setFolderIDtoTask.js'] },
      { page: '/sites/Npdu/SitePages/cal.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/milestonejs.js','_catalogs/masterpage/click/js/npdu/myjobs.js'] },
      { page: '/sites/Npdu/SitePages/tasks.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/milestonejs.js','_catalogs/masterpage/click/js/npdu/deptJobs.js'] },
      { page: '/sites/Npdu/SitePages/gant.aspx', scripts: ['_catalogs/masterpage/click/js/npdu/milestonejs.js','_catalogs/masterpage/click/js/npdu/hideganttimelines.js'] },
      { page: '/sites/tpo/proUnit/Shared%20Documents/Forms/%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/docsethomepage.aspx', scripts: ['_catalogs/masterpage/click/js/tpo/addNewTask.js'] },
      { page: '/sites/tpo/proUnit/Lists/taskList/NewForm.aspx', scripts: ['_catalogs/masterpage/click/js/tpo/setDocIdToTask.js'] }
   ],

   // Adding all the custom script references to the page
   // Could use <_spPageContextInfo.webServerRelativeUrl> but should not wait to 
   // page load
   AddCustomScript: function () {

      var pageScripts = document.getElementsByTagName('SCRIPT');
      var scriptLocation = pageScripts[pageScripts.length - 1].src;
      var webLocation = scriptLocation.substring(0, scriptLocation.indexOf('/_catalogs/masterpage/click/js/'));

      // Loading scripts as part of the master page (global scripts)
      var locations = PMOClick.Load.ScriptLocations;
      for (var i = 0; i < locations.length; i++) {
         if (!PMOClick.Load.ExistInScriptLocation(pageScripts, locations[i])) {
            var location = webLocation + '/' + locations[i];
            document.write('<script type="text/javascript" src="' + location + '"></script>');
         }
      }

      // Loading css files as part of the master page (global style)
      var cssLocations = PMOClick.Load.StyleLocations;
      for (var i = 0; i < cssLocations.length; i++) {
         //<link rel="stylesheet" type="text/css" href="../_catalogs/masterpage/DiscountReqs/css/admin.css" />
         var location = webLocation + '/' + cssLocations[i];
         document.write('<link rel="stylesheet" type="text/css" href="' + location + '" />');
      }


      locations = PMOClick.Load.PageScripts;

      // Get current absolute page path
      var indexOfWebLocation = window.location.href.indexOf(webLocation);
      var currentLocation =
         window.location.href.substring(indexOfWebLocation,
            window.location.href.length -
            window.location.search.length).toLowerCase();

      // Search for current page in pages list
      for (var p in locations) {
         var location = locations[p];         
         var pageLocation = webLocation + location.page;

         // If current page was found, add its scripts
         if (currentLocation.toLowerCase().indexOf(location.page.toLowerCase()) >= 0) {
            var scripts = location.scripts;
            for (var s = 0; s < scripts.length; s++) {
               var pageScriptLocation = webLocation + '/' + scripts[s];
               document.write('<script type="text/javascript" src="' + pageScriptLocation + '"></script>');
            }
         }
      }
   },

   ExistInScriptLocation: function (scriptLocationArr, val) {
      for (var i = 0; i < scriptLocationArr.length; i++) {
         if (scriptLocationArr[i].src.indexOf(val) > -1) {
            return true;
         }
      }
      return false;
   }

};
PMOClick.Load.AddCustomScript();
