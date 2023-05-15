function hideganttimelines () {
    var timeline_div1 = document.getElementById("ctl00_ctl37_g_0af9a806_8d70_43ec_953d_ba8dba2bbb71_ctl04");
    var timeline_div2 = document.getElementById("ctl00_ctl37_g_6f154fe2_d719_46f7_ba94_77da244258ba_ctl04");
    var timeline_div3 = document.getElementById("ctl00_ctl37_g_be45a0ed_b4ac_4bfd_823c_29b011403310_ctl04");
    var timeline_div4 = document.getElementById("ctl00_ctl37_g_1dce0d4e_f1bd_485b_8855_474963bf083f_ctl04");

    timeline_div1.style['display'] = "none";
    timeline_div2.style['display'] = "none";
    timeline_div3.style['display'] = "none";
    timeline_div4.style['display'] = "none";


}


window.addEventListener("load", function () {

    hideganttimelines();




})