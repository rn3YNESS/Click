var today = new Date(),
    year = today.getFullYear(),
    month = today.getMonth(), //PMOClick.Methods.GetMonthLiteral(today.getMonth()),
    monthTag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    day = today.getDate(),
    days = document.getElementsByTagName('td'),
    selectedDay,
    setDate,
    daysLen = days.length;

function Calendar(selector, options) {
    this.options = options;
    this.draw();
}

Calendar.prototype.draw = function() {
    this.getOptions();
    this.drawDays();
    var that = this,
        // reset = document.getElementById('reset'),
        pre = document.getElementsByClassName('pre-button'),
        next = document.getElementsByClassName('next-button');

    pre[0].addEventListener('click', function() { that.preMonth(); });
    next[0].addEventListener('click', function() { that.nextMonth(); });
    // reset.addEventListener('click', function(){that.reset(); });
    while (daysLen--) {
        days[daysLen].addEventListener('click', function() { that.clickDay(this); });
    }
};

Calendar.prototype.drawHeader = function(e) {
    // var headDay = document.getElementsByClassName('head-day'),
    var headMonth = document.getElementsByClassName('head-month');

    // e?headDay[0].innerHTML = e : headDay[0].innerHTML = day;
    headMonth[0].innerHTML = getMonthLiteral(month) + " - " + year;
};

Calendar.prototype.drawDays = function() {
    var numDisable = 0;
    var startDay = new Date(year, month, 1).getDay(),
        nDays = new Date(year, month + 1, 0).getDate(),
        n = startDay;
    for (var k = 0; k < 42; k++) {
        days[k].innerHTML = '';
        days[k].id = '';
        days[k].className = '';
    }

    for (var i = 1; i <= nDays; i++) {
        days[n].innerHTML = i;
        n++;
    }

    for (var j = 0; j < 42; j++) {
        if (days[j].innerHTML === "") {

            days[j].id = "disabled";
            if (j < 7)
                numDisable++;
        } else if (j === day + startDay - 1) {
            if ((this.options && (month === setDate.getMonth()) && (year === setDate.getFullYear())) || (!this.options && (month === today.getMonth()) && (year === today.getFullYear()))) {
                this.drawHeader(day);
                days[j].id = "today";
                days[j].className = "selected ";
            }
        }
    }

    highlightEvents(numDisable);
};

Calendar.prototype.clickDay = function(o) {
    var selected = document.getElementsByClassName("selected"),
        len = selected.length;
    if (len !== 0) {
        selected[0].classList.remove("selected");
    }
    o.className += " selected";
    selectedDay = new Date(year, month, o.innerHTML);

    if (personalDataObject.GlobalVariables.AllUserReminders.length > 0) {
        const reminders = personalDataObject.GlobalVariables.AllUserReminders.filter(x => {
            const a = (new Date(x.EventDate)).setHours(0, 0, 0, 0);
            const b = (new Date(selectedDay)).setHours(0, 0, 0, 0);
            return a === b;
        });

        //Clear reminders area
        document.getElementById('personalR').innerHTML = "";
        document.getElementById('unitR').innerHTML = "";


        const personalReminders = reminders.filter(x => isNullOrEmpty(x.ParticipantsPicker));
        if (personalReminders.length > 0) {
            drawReminder(personalReminders, 'personalR', 'personal');
        } else {
            drawNonReminder(selectedDay, 'personalR', 'personal');
        }
        const unitReminders = reminders.filter(x => !isNullOrEmpty(x.ParticipantsPicker));
        if (unitReminders.length > 0) {
            drawReminder(unitReminders, 'unitR', 'unit');
        } else {
            drawNonReminder(selectedDay, 'unitR', 'unit');
        }

    }
};

Calendar.prototype.preMonth = function() {
    if (month < 1) {
        month = 11;
        year = year - 1;
    } else {
        month = month - 1;
    }
    this.drawHeader(1);
    this.drawDays();
};

Calendar.prototype.nextMonth = function() {
    if (month >= 11) {
        month = 0;
        year = year + 1;
    } else {
        month = month + 1;
    }
    this.drawHeader(1);
    this.drawDays();
};

Calendar.prototype.getOptions = function() {
    if (this.options) {
        var sets = this.options.split('-');
        setDate = new Date(sets[0], sets[1] - 1, sets[2]);
        day = setDate.getDate();
        year = setDate.getFullYear();
        month = setDate.getMonth();
    }
};