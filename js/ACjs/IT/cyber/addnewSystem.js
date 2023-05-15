$('document').ready(function(){

  addNewSystem();/*
  $('#ctl00_m_g_9659a39a_7793_40ee_9774_fb0890e7a343_ctl00_ctl05_ctl06_ctl00_ctl00_ctl04_ctl00_ctl00_TextField').change(function() {checkReminderDays();});*/
  
});


function addNewSystem() {
//for projecttasklist  
 //for Systems editForm

var div = document.createElement("DIV");
div.innerHTML=  "<a href='#' onClick=javascript:OpenPopUpPage('/sites/it/InfoSecTeam/Lists/systemsList/NewForm.aspx?IsDlg=1',RefreshPage)>הוסף מערכת</a>";
var element = $("[id$='system_b718f45c-987b-4d22-a32b-3fbf59c04640_$LookupField']")[0];
element.parentNode.insertBefore(div, element.nextSibling);


}
/*
function checkReminderDays() {

var startArr = ($('#ctl00_m_g_9659a39a_7793_40ee_9774_fb0890e7a343_ctl00_ctl05_ctl04_ctl00_ctl00_ctl04_ctl00_ctl00_DateTimeField_DateTimeFieldDate').val()).split("/");

var start =  new Date(startArr[2]+'-'+startArr[1]+'-'+startArr[0]);


var end = new Date($('#ctl00_m_g_9659a39a_7793_40ee_9774_fb0890e7a343_ctl00_ctl05_ctl05_ctl00_ctl00_ctl04_ctl00_ctl00_DateTimeField_DateTimeFieldDate').val());

// end - start returns difference in milliseconds 
var diff = new Date(end - start);

// get days
var days = diff/1000/60/60/24;

alert(days);
}

*/






