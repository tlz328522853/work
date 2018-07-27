(function ($, undefined) {
    "use strict";
    var UTC_DAY_IN_MS = 24 * 60 * 60 * 1000;
    function findDay(elt, text) {
        var cd = new Date(parseInt(text, 10));
        cd.setHours(0, 0, 0, 0);
        var id = $(elt).attr("id") || "";
        var si = id.indexOf("-") + 1;
        var ed = new Date(parseInt(id.substring(si, id.length), 10));
        ed.setHours(0, 0, 0, 0);
        return cd.getTime() === ed.getTime();
    }
    $.expr[':'].findday = $.expr.createPseudo ?
        $.expr.createPseudo(function(text) {
            return function(elt) {
                return findDay(elt, text);
            };
        }) :
        function(elt, i, match) {
            return findDay(elt, match[3]);
        };
    function findWeek(elt, text) {
        var cd = new Date(parseInt(text, 10));
        var y = cd.getFullYear();
        var w = cd.getWeekOfYear();
        var m = cd.getMonth();
        if (m === 11 && w === 1) {
            y++;
        } else if (!m && w > 51) {
            y--;
        }
        cd = y + "-" + w;
        var id = $(elt).attr("id") || "";
        var si = id.indexOf("-") + 1;
        var ed = id.substring(si, id.length);
        return cd === ed;
    }
    $.expr[':'].findweek = $.expr.createPseudo ?
        $.expr.createPseudo(function(text) {
            return function(elt) {
                return findWeek(elt, text);
            };
        }) :
        function(elt, i, match) {
            return findWeek(elt, match[3]);
        };
    function findMonth(elt, text) {
        var cd = new Date(parseInt(text, 10));
        cd = cd.getFullYear() + "-" + cd.getMonth();
        var id = $(elt).attr("id") || "";
        var si = id.indexOf("-") + 1;
        var ed = id.substring(si, id.length);
        return cd === ed;
    }
    $.expr[':'].findmonth = $.expr.createPseudo ?
        $.expr.createPseudo(function(text) {
            return function(elt) {
                return findMonth(elt, text);
            };
        }) :
        function(elt, i, match) {
            return findMonth(elt, match[3]);
        };
    Date.prototype.getWeekId = function () {
        var y = this.getFullYear();
        var w = this.getWeekOfYear();
        var m = this.getMonth();
        if (m === 11 && w === 1) {
            y++;
        } else if (!m && w > 51) {
            y--;
        }
        return 'dh-' + y + "-" + w;
    };
    Date.prototype.getRepDate = function (scale) {
        switch (scale) {
        case "hours":
            return this.getTime();
        case "weeks":
            return this.getDayForWeek().getTime();
        case "months":
            return new Date(this.getFullYear(), this.getMonth(), 1).getTime();
        case "days":
        default:
            return this.getTime();
        }
    };
    Date.prototype.getDayOfYear = function () {
        var year = this.getFullYear();
        return (Date.UTC(year, this.getMonth(), this.getDate()) -
                Date.UTC(year, 0, 0)) / UTC_DAY_IN_MS;
    };
    var firstDay = 1;
    var weekOneDate = 4;
    Date.prototype.getWeekOfYear = function () {
        var year = this.getFullYear(),
            month = this.getMonth(),
            date = this.getDate(),
            day = this.getDay();
        var diff = weekOneDate - day;
        if (day < firstDay) {
            diff -= 7;
        }
        if (diff + 7 < weekOneDate - firstDay) {
            diff += 7;
        }
        return Math.ceil(new Date(year, month, date + diff).getDayOfYear() / 7);
    };
    Date.prototype.getDayForWeek = function () {
        var day = this.getDay();
        var diff = (day < firstDay ? -7 : 0) + firstDay - day;
        return new Date( this.getFullYear(), this.getMonth(), this.getDate() + diff );
    };
    function ktkGetNextDate(currentDate, scaleStep) {
        for(var minIncrements = 1;; minIncrements++) {
            var nextDate = new Date(currentDate);
            nextDate.setHours(currentDate.getHours() + scaleStep * minIncrements);

            if (nextDate.getTime() !== currentDate.getTime()) {
                return nextDate;
            }
		}
    }
    $.fn.gantt = function (options) {
        var scales = ["hours", "days", "weeks", "months"];
        var settings = {
            source: [],
            holidays: [],
            itemsPerPage: 7,
            dow: ["S", "M", "T", "W", "T", "F", "S"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            waitText: "Please wait...",
            navigate: "buttons",
            scrollToToday: true,
            useCookie: false,
            cookieKey: "jquery.fn.gantt",
            scale: "days",
            maxScale: "months",
            minScale: "hours",
            onItemClick: function (data) { return; },
            onAddClick: function (dt, rowId) { return; },
            onRender: $.noop
        };
        $.extend(settings, options);
        settings.useCookie = settings.useCookie && $.isFunction($.cookie);
        var core = {
            elementFromPoint: (function(){ 
                if (document.compatMode === "CSS1Compat") {
                    return function (x, y) {
                        x -= window.pageXOffset;
                        y -= window.pageYOffset;
                        return document.elementFromPoint(x, y);
                    };
                }
                return function (x, y) {
                    x -= $(document).scrollLeft();
                    y -= $(document).scrollTop();
                    return document.elementFromPoint(x, y);
                };
            })(),
            create: function (element) {
                if (typeof settings.source !== "string") {
                    element.data = settings.source;
                    core.init(element);
                } else {
                    $.getJSON(settings.source, function (jsData) {
                        element.data = jsData;
                        core.init(element);
                    });
                }
            },
            init: function (element) {
                element.rowsNum = element.data.length;
                element.pageCount = Math.ceil(element.rowsNum / settings.itemsPerPage);
                element.rowsOnLastPage = element.rowsNum - (Math.floor(element.rowsNum / settings.itemsPerPage) * settings.itemsPerPage);
                element.dateStart = tools.getMinDate(element);
                element.dateEnd = tools.getMaxDate(element);
                core.waitToggle(element, function () { core.render(element); });
            },
            render: function (element) {
                var content = $('<div class="fn-content"/>');
                var $leftPanel = core.leftPanel(element);
                content.append($leftPanel);
                var $rightPanel = core.rightPanel(element, $leftPanel);
                var mLeft, hPos;
                content.append($rightPanel);
                content.append(core.navigation(element));
                var $dataPanel = $rightPanel.find(".dataPanel");
                element.gantt = $('<div class="fn-gantt" />').append(content);
                $(element).empty().append(element.gantt);
                element.scrollNavigation.panelMargin = parseInt($dataPanel.css("margin-left").replace("px", ""), 10);
                element.scrollNavigation.panelMaxPos = ($dataPanel.width() - $rightPanel.width());
                element.scrollNavigation.canScroll = ($dataPanel.width() > $rightPanel.width());
                core.markNow(element);
                core.fillData(element, $dataPanel, $leftPanel);
                if (settings.useCookie) {
                    var sc = $.cookie(settings.cookieKey + "ScrollPos");
                    if (sc) {
                        element.hPosition = sc;
                    }
                }
                if (settings.scrollToToday) {
                    core.navigateTo(element, 'now');
                    core.scrollPanel(element, 0);
                } else {
                    if (element.hPosition !== 0) {
                        if (element.scaleOldWidth) {
                            mLeft = ($dataPanel.width() - $rightPanel.width());
                            hPos = mLeft * element.hPosition / element.scaleOldWidth;
                            element.hPosition = hPos > 0 ? 0 : hPos;
                            element.scaleOldWidth = null;
                        }
                        $dataPanel.css({ "margin-left": element.hPosition });
                        element.scrollNavigation.panelMargin = element.hPosition;
                    }
                    core.repositionLabel(element);
                }
                $dataPanel.css({ height: $leftPanel.height() });
                core.waitToggle(element);
                settings.onRender();
            },
            leftPanel: function (element) {
                var ganttLeftPanel = $('<div class="leftPanel"/>')
                    .append($('<div class="row spacer"/>')
                    .css("height", tools.getCellSize() * element.headerRows)
                    .css("width", "100%"));
                var entries = [];
                $.each(element.data, function (i, entry) {
                    if (i >= element.pageNum * settings.itemsPerPage &&
                        i < (element.pageNum * settings.itemsPerPage + settings.itemsPerPage)) {
                        var dataId = ('id' in entry) ? '" data-id="' + entry.id : '';
                        entries.push(
                            '<div class="row name row' + i +
                            (entry.desc ? '' : (' fn-wide '+dataId)) +
                            '" id="rowheader' + i +
                            '" data-offset="' + i % settings.itemsPerPage * tools.getCellSize() + '">' +
                            '<span class="fn-label' +
                            (entry.cssClass ? ' ' + entry.cssClass : '') + '">' +
                            (entry.name || '') +
                            '</span>' +
                            '</div>');
                        if (entry.desc) {
                            entries.push(
                                '<div class="row desc row' + i +
                                ' " id="RowdId_' + i + dataId + '">' +
                                '<span class="fn-label' +
                                (entry.cssClass ? ' ' + entry.cssClass : '') + '">' +
                                entry.desc +
                                '</span>' +
                                '</div>');
                        }
                    }
                });
                return ganttLeftPanel.append(entries.join(""));
            },
            dataPanel: function (element, width) {
                var dataPanel = $('<div class="dataPanel" style="width: ' + width + 'px;"/>');
                var wheel = 'onwheel' in element ?
                    'wheel' : document.onmousewheel !== undefined ?
                    'mousewheel' : 'DOMMouseScroll';
                $(element).on(wheel, function (e) { core.wheelScroll(element, e); });
                dataPanel.click(function (e) {
                    e.stopPropagation();
                    var corrX, corrY;
                    var leftpanel = $(element).find(".fn-gantt .leftPanel");
                    var datapanel = $(element).find(".fn-gantt .dataPanel");
                    switch (settings.scale) {
                    case "months":
                        corrY = tools.getCellSize();
                        break;
                    case "hours":
                        corrY = tools.getCellSize() * 4;
                        break;
                    case "days":
                        corrY = tools.getCellSize() * 3;
                        break;
                    case "weeks":
                    default:
                        corrY = tools.getCellSize() * 2;
                    }
                    var col = core.elementFromPoint(e.pageX, datapanel.offset().top + corrY);
                    if (col.className === "fn-label") {
                        col = $(col.parentNode);
                    } else {
                        col = $(col);
                    }
                    var dt = col.data("repdate");
                    var row = core.elementFromPoint(leftpanel.offset().left + leftpanel.width() - 10, e.pageY);
                    if (row.className.indexOf("fn-label") === 0) {
                        row = $(row.parentNode);
                    } else {
                        row = $(row);
                    }
                    var rowId = row.data('id');
                    settings.onAddClick(dt, rowId);
                });
                return dataPanel;
            },
            rightPanel: function (element, leftPanel) {
                var range = null;
                var dowClass = ["sn", "wd", "wd", "wd", "wd", "wd", "sa"];
                var yearArr = [];
                var scaleUnitsThisYear = 0;
                var monthArr = [];
                var scaleUnitsThisMonth = 0;
                var dayArr = [];
                var hoursInDay = 0;
                var dowArr = [];
                var horArr = [];
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var $row = $('<div class="row header"></div>');
                var i, len;
                var year, month, week, day;
                var rday, dayClass;
                var dataPanel;
                switch (settings.scale) {
                case "hours":
                    range = tools.parseTimeRange(element.dateStart, element.dateEnd, element.scaleStep);
                    year = range[0].getFullYear();
                    month = range[0].getMonth();
                    day = range[0];
                    for (i = 0, len = range.length; i < len; i++) {
                        rday = range[i];
                        var rfy = rday.getFullYear();
                        if (rfy !== year) {
                            yearArr.push(
                                '<div class="row header year" style="width: ' +
                                tools.getCellSize() * scaleUnitsThisYear +
                                'px;"><div class="fn-label">' +
                                year +
                                '</div></div>');
                            year = rfy;
                            scaleUnitsThisYear = 0;
                        }
                        scaleUnitsThisYear++;
                        var rm = rday.getMonth();
                        if (rm !== month) {
                            monthArr.push(
                                '<div class="row header month" style="width: ' +
                                tools.getCellSize() * scaleUnitsThisMonth + 'px"><div class="fn-label">' +
                                settings.months[month] +
                                '</div></div>');
                            month = rm;
                            scaleUnitsThisMonth = 0;
                        }
                        scaleUnitsThisMonth++;
                        var rgetDay = rday.getDay();
                        var getDay = day.getDay();
                        if (rgetDay !== getDay) {
                            dayClass = (today - day === 0) ?
                                "today" : tools.isHoliday( day.getTime() ) ?
                                "holiday" : dowClass[getDay];
                            dayArr.push(
                                '<div class="row date ' + dayClass + '" ' +
                                'style="width: ' + tools.getCellSize() * hoursInDay + 'px;">' +
                                '<div class="fn-label">' + day.getDate() + '</div></div>');
                            dowArr.push(
                                '<div class="row day ' + dayClass + '" ' +
                                'style="width: ' + tools.getCellSize() * hoursInDay + 'px;">' +
                                '<div class="fn-label">' + settings.dow[getDay] + '</div></div>');
                            day = rday;
                            hoursInDay = 0;
                        }
                        hoursInDay++;
                        dayClass = dowClass[rgetDay];
                        if (tools.isHoliday(rday)) {
                            dayClass = "holiday";
                        }
                        horArr.push(
                            '<div class="row day ' +
                            dayClass +
                            '" id="dh-' +
                            rday.getTime() +
                            '" data-offset="' + i * tools.getCellSize() +
                            '" data-repdate="' + rday.getRepDate(settings.scale) +
                            '"><div class="fn-label">' +
                            rday.getHours() +
                            '</div></div>');
                    }
                    yearArr.push(
                        '<div class="row header year" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisYear + 'px;"><div class="fn-label">' +
                        year +
                        '</div></div>');
                    monthArr.push(
                        '<div class="row header month" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisMonth + 'px"><div class="fn-label">' +
                        settings.months[month] +
                        '</div></div>');
                    dayClass = dowClass[day.getDay()];
                    if ( tools.isHoliday(day) ) {
                        dayClass = "holiday";
                    }
                    dayArr.push(
                        '<div class="row date ' + dayClass + '" ' +
                        'style="width: ' + tools.getCellSize() * hoursInDay + 'px;">' +
                        '<div class="fn-label">' + day.getDate() + '</div></div>');
                    dowArr.push(
                        '<div class="row day ' + dayClass + '" ' +
                        'style="width: ' + tools.getCellSize() * hoursInDay + 'px;">' +
                        '<div class="fn-label">' + settings.dow[day.getDay()] + '</div></div>');
                    dataPanel = core.dataPanel(element, range.length * tools.getCellSize());
                    dataPanel.append(
                        $row.clone().html(yearArr.join("")),
                        $row.clone().html(monthArr.join("")),
                        $row.clone().html(dayArr.join("")),
                        $row.clone().html(dowArr.join("")),
                        $row.clone().html(horArr.join(""))
                    );
                    break;
                case "weeks":
                    range = tools.parseWeeksRange(element.dateStart, element.dateEnd);
                    year = range[0].getFullYear();
                    month = range[0].getMonth();
                    week = range[0].getWeekOfYear();
                    var diff;
                    for (i = 0, len = range.length; i < len; i++) {
                        rday = range[i];
                        if (week > (week = rday.getWeekOfYear())) {
                            diff = rday.getDate() - 1;
                            diff -= !rday.getMonth() ? 0 : 31;
                            diff /= 7;
                            yearArr.push(
                                '<div class="row header year" style="width: ' +
                                tools.getCellSize() * (scaleUnitsThisYear - diff) +
                                'px;"><div class="fn-label">' +
                                year +
                                '</div></div>');
                            year++;
                            scaleUnitsThisYear = diff;
                        }
                        scaleUnitsThisYear++;
                        if (rday.getMonth() !== month) {
                            diff = rday.getDate() - 1;
                            diff /= 7;
                            monthArr.push(
                                '<div class="row header month" style="width:' +
                                tools.getCellSize() * (scaleUnitsThisMonth - diff) +
                                'px;"><div class="fn-label">' +
                                settings.months[month] +
                                '</div></div>');
                            month = rday.getMonth();
                            scaleUnitsThisMonth = diff;
                        }
                        scaleUnitsThisMonth++;
                        dayArr.push(
                            '<div class="row day wd"' +
                            ' id="' + rday.getWeekId() +
                            '" data-offset="' + i * tools.getCellSize() +
                            '" data-repdate="' + rday.getRepDate(settings.scale) + '">' +
                            '<div class="fn-label">' + week + '</div></div>');
                    }
                    yearArr.push(
                        '<div class="row header year" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisYear + 'px;"><div class="fn-label">' +
                        year +
                        '</div></div>');
                    monthArr.push(
                        '<div class="row header month" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisMonth + 'px"><div class="fn-label">' +
                        settings.months[month] +
                        '</div></div>');
                    dataPanel = core.dataPanel(element, range.length * tools.getCellSize());
                    dataPanel.append(
                        $row.clone().html(yearArr.join("")),
                        $row.clone().html(monthArr.join("")),
                        $row.clone().html(dayArr.join(""))
                    );
                    break;
                case 'months':
                    range = tools.parseMonthsRange(element.dateStart, element.dateEnd);
                    year = range[0].getFullYear();
                    month = range[0].getMonth();
                    for (i = 0, len = range.length; i < len; i++) {
                        rday = range[i];
                        if (rday.getFullYear() !== year) {
                            yearArr.push(
                                '<div class="row header year" style="width: ' +
                                tools.getCellSize() * scaleUnitsThisYear +
                                'px;"><div class="fn-label">' +
                                year +
                                '</div></div>');
                            year = rday.getFullYear();
                            scaleUnitsThisYear = 0;
                        }
                        scaleUnitsThisYear++;
                        monthArr.push(
                            '<div class="row day wd" id="dh-' + tools.genId(rday) +
                            '" data-offset="' + i * tools.getCellSize() +
                            '" data-repdate="' + rday.getRepDate(settings.scale) + '">' +
                            (1 + rday.getMonth()) + '</div>');
                    }
                    yearArr.push(
                        '<div class="row header year" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisYear + 'px;"><div class="fn-label">' +
                        year +
                        '</div></div>');
                    monthArr.push(
                        '<div class="row header month" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisMonth + 'px"><div class="fn-label">' +
                        settings.months[month] +
                        '</div></div>');
                    dataPanel = core.dataPanel(element, range.length * tools.getCellSize());
                    dataPanel.append(
                        $row.clone().html(yearArr.join("")),
                        $row.clone().html(monthArr.join("")),
                        $row.clone().html(dayArr.join("")),
                        $row.clone().html(dowArr.join(""))
                    );
                    break;
                default:
                    range = tools.parseDateRange(element.dateStart, element.dateEnd);
                    var dateBefore = ktkGetNextDate(range[0], -1);
                    year = dateBefore.getFullYear();
                    month = dateBefore.getMonth();
                    for (i = 0, len = range.length; i < len; i++) {
                        rday = range[i];
                        if (rday.getFullYear() !== year) {
                            yearArr.push(
                                '<div class="row header year" style="width:' +
                                tools.getCellSize() * scaleUnitsThisYear +
                                'px;"><div class="fn-label">' +
                                year +
                                '</div></div>');
                            year = rday.getFullYear();
                            scaleUnitsThisYear = 0;
                        }
                        scaleUnitsThisYear++;
                        if (rday.getMonth() !== month) {
                            monthArr.push(
                                '<div class="row header month" style="width:' +
                                tools.getCellSize() * scaleUnitsThisMonth +
                                'px;"><div class="fn-label">' +
                                settings.months[month] +
                                '</div></div>');
                            month = rday.getMonth();
                            scaleUnitsThisMonth = 0;
                        }
                        scaleUnitsThisMonth++;
                        day = rday.getDay();
                        dayClass = dowClass[day];
                        if ( tools.isHoliday(rday) ) {
                            dayClass = "holiday";
                        }
                        dayArr.push(
                            '<div class="row date ' + dayClass + '"' +
                            ' id="dh-' + tools.genId(rday) +
                            '" data-offset="' + i * tools.getCellSize() +
                            '" data-repdate="' + rday.getRepDate(settings.scale) + '">' +
                            '<div class="fn-label">' + rday.getDate() + '</div></div>');
                        dowArr.push(
                            '<div class="row day ' + dayClass + '"' +
                            ' id="dw-' + tools.genId(rday) +
                            '" data-repdate="' + rday.getRepDate(settings.scale) + '">' +
                            '<div class="fn-label">' + settings.dow[day] + '</div></div>');
                    }
                    yearArr.push(
                        '<div class="row header year" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisYear + 'px;"><div class="fn-label">' +
                        year +
                        '</div></div>');
                    monthArr.push(
                        '<div class="row header month" style="width: ' +
                        tools.getCellSize() * scaleUnitsThisMonth + 'px"><div class="fn-label">' +
                        settings.months[month] +
                        '</div></div>');
                    dataPanel = core.dataPanel(element, range.length * tools.getCellSize());
                    dataPanel.append(
                        $row.clone().html(yearArr.join("")),
                        $row.clone().html(monthArr.join("")),
                        $row.clone().html(dayArr.join("")),
                        $row.clone().html(dowArr.join(""))
                    );
                }
                return $('<div class="rightPanel"></div>').append(dataPanel);
            },
            navigation: function (element) {
                var ganttNavigate = null;
                if (settings.navigate === "scroll") {
                    ganttNavigate = $('<div class="navigate" />')
                        .append($('<div class="nav-slider" />')
                            .append($('<div class="nav-slider-left" />')
                                .append($('<button type="button" class="nav-link nav-page-back"/>')
                                    .html('&lt;')
                                    .click(function () {
                                        core.navigatePage(element, -1);
                                    }))
                                .append($('<div class="page-number"/>')
                                        .append($('<span/>')
                                            .html(element.pageNum + 1 + ' / ' + element.pageCount)))
                                .append($('<button type="button" class="nav-link nav-page-next"/>')
                                    .html('&gt;')
                                    .click(function () {
                                        core.navigatePage(element, 1);
                                    }))
                                .append($('<button type="button" class="nav-link nav-now"/>')
                                    .html('&#9679;')
                                    .click(function () {
                                        core.navigateTo(element, 'now');
                                    }))
                                .append($('<button type="button" class="nav-link nav-prev-week"/>')
                                    .html('&lt;&lt;')
                                    .click(function () {
                                        if (settings.scale === 'hours') {
                                            core.navigateTo(element, tools.getCellSize() * 8);
                                        } else if (settings.scale === 'days') {
                                            core.navigateTo(element, tools.getCellSize() * 30);
                                        } else if (settings.scale === 'weeks') {
                                            core.navigateTo(element, tools.getCellSize() * 12);
                                        } else if (settings.scale === 'months') {
                                            core.navigateTo(element, tools.getCellSize() * 6);
                                        }
                                    }))
                                .append($('<button type="button" class="nav-link nav-prev-day"/>')
                                    .html('&lt;')
                                    .click(function () {
                                        if (settings.scale === 'hours') {
                                            core.navigateTo(element, tools.getCellSize() * 4);
                                        } else if (settings.scale === 'days') {
                                            core.navigateTo(element, tools.getCellSize() * 7);
                                        } else if (settings.scale === 'weeks') {
                                            core.navigateTo(element, tools.getCellSize() * 4);
                                        } else if (settings.scale === 'months') {
                                            core.navigateTo(element, tools.getCellSize() * 3);
                                        }
                                    })))
                            .append($('<div class="nav-slider-content" />')
                                    .append($('<div class="nav-slider-bar" />')
                                            .append($('<a class="nav-slider-button" />')
                                                )
                                                .mousedown(function (e) {
                                                    e.preventDefault();
                                                    element.scrollNavigation.scrollerMouseDown = true;
                                                    core.sliderScroll(element, e);
                                                })
                                                .mousemove(function (e) {
                                                    if (element.scrollNavigation.scrollerMouseDown) {
                                                        core.sliderScroll(element, e);
                                                    }
                                                })
                                            )
                                        )
                            .append($('<div class="nav-slider-right" />')
                                .append($('<button type="button" class="nav-link nav-next-day"/>')
                                    .html('&gt;')
                                    .click(function () {
                                        if (settings.scale === 'hours') {
                                            core.navigateTo(element, tools.getCellSize() * -4);
                                        } else if (settings.scale === 'days') {
                                            core.navigateTo(element, tools.getCellSize() * -7);
                                        } else if (settings.scale === 'weeks') {
                                            core.navigateTo(element, tools.getCellSize() * -4);
                                        } else if (settings.scale === 'months') {
                                            core.navigateTo(element, tools.getCellSize() * -3);
                                        }
                                    }))
                            .append($('<button type="button" class="nav-link nav-next-week"/>')
                                    .html('&gt;&gt;')
                                    .click(function () {
                                        if (settings.scale === 'hours') {
                                            core.navigateTo(element, tools.getCellSize() * -8);
                                        } else if (settings.scale === 'days') {
                                            core.navigateTo(element, tools.getCellSize() * -30);
                                        } else if (settings.scale === 'weeks') {
                                            core.navigateTo(element, tools.getCellSize() * -12);
                                        } else if (settings.scale === 'months') {
                                            core.navigateTo(element, tools.getCellSize() * -6);
                                        }
                                    }))
                                .append($('<button type="button" class="nav-link nav-zoomIn"/>')
                                    .html('&#43;')
                                    .click(function () {
                                        core.zoomInOut(element, -1);
                                    }))
                                .append($('<button type="button" class="nav-link nav-zoomOut"/>')
                                    .html('&#45;')
                                    .click(function () {
                                        core.zoomInOut(element, 1);
                                    }))
                                    )
                                );
                    $(document).mouseup(function () {
                        element.scrollNavigation.scrollerMouseDown = false;
                    });
                } else {
                    ganttNavigate = $('<div class="navigate" />')
                        .append($('<button type="button" class="nav-link nav-page-back"/>')
                            .html('&lt;')
                            .click(function () {
                                core.navigatePage(element, -1);
                            }))
                        .append($('<div class="page-number"/>')
                                .append($('<span/>')
                                    .html(element.pageNum + 1 + ' / ' + element.pageCount)))
                        .append($('<button type="button" class="nav-link nav-page-next"/>')
                            .html('&gt;')
                            .click(function () {
                                core.navigatePage(element, 1);
                            }))
                        .append($('<button type="button" class="nav-link nav-begin"/>')
                            .html('&#124;&lt;')
                            .click(function () {
                                core.navigateTo(element, 'begin');
                            }))
                        .append($('<button type="button" class="nav-link nav-prev-week"/>')
                            .html('&lt;&lt;')
                            .click(function () {
                                core.navigateTo(element, tools.getCellSize() * 7);
                            }))
                        .append($('<button type="button" class="nav-link nav-prev-day"/>')
                            .html('&lt;')
                            .click(function () {
                                core.navigateTo(element, tools.getCellSize());
                            }))
                        .append($('<button type="button" class="nav-link nav-now"/>')
                            .html('&#9679;')
                            .click(function () {
                                core.navigateTo(element, 'now');
                            }))
                        .append($('<button type="button" class="nav-link nav-next-day"/>')
                            .html('&gt;')
                            .click(function () {
                                core.navigateTo(element, tools.getCellSize() * -1);
                            }))
                        .append($('<button type="button" class="nav-link nav-next-week"/>')
                            .html('&gt;&gt;')
                            .click(function () {
                                core.navigateTo(element, tools.getCellSize() * -7);
                            }))
                        .append($('<button type="button" class="nav-link nav-end"/>')
                            .html('&gt;&#124;')
                            .click(function () {
                                core.navigateTo(element, 'end');
                            }))
                        .append($('<button type="button" class="nav-link nav-zoomIn"/>')
                            .html('&#43;')
                            .click(function () {
                                core.zoomInOut(element, -1);
                            }))
                        .append($('<button type="button" class="nav-link nav-zoomOut"/>')
                            .html('&#45;')
                            .click(function () {
                                core.zoomInOut(element, 1);
                            }));
                }
                return $('<div class="bottom"></div>').append(ganttNavigate);
            },
            createProgressBar: function (days, label, desc, classNames, dataObj) {
                label = label || "";
                var cellWidth = tools.getCellSize();
                var barMarg = tools.getProgressBarMargin() || 0;
                var bar = $('<div class="bar"><div class="fn-label">' + label + '</div></div>')
                        .css({
                            width: ((cellWidth * days) - barMarg) + 2
                        })
                        .data("dataObj", dataObj);
                if (desc) {
                    bar
                      .mouseenter(function (e) {
                          var hint = $('<div class="fn-gantt-hint" />').html(desc);
                          $("body").append(hint);
                          hint.css("left", e.pageX);
                          hint.css("top", e.pageY);
                          hint.show();
                      })
                      .mouseleave(function () {
                          $(".fn-gantt-hint").remove();
                      })
                      .mousemove(function (e) {
                          $(".fn-gantt-hint").css("left", e.pageX);
                          $(".fn-gantt-hint").css("top", e.pageY + 15);
                      });
                }
                if (classNames) {
                    bar.addClass(classNames);
                }
                bar.click(function (e) {
                    e.stopPropagation();
                    settings.onItemClick($(this).data("dataObj"));
                });
                return bar;
            },
            markNow: function (element) {
                var cd = new Date().setHours(0, 0, 0, 0);
                switch (settings.scale) {
                case "weeks":
                    $(element).find(':findweek("' + cd + '")').removeClass('wd').addClass('today');
                    break;
                case "months":
                    $(element).find(':findmonth("' + cd + '")').removeClass('wd').addClass('today');
                    break;
                case "days":
                case "hours":
                default:
                    $(element).find(':findday("' + cd + '")').removeClass('wd').addClass('today');
                }
            },
            fillData: function (element, datapanel, leftpanel) {
                var invertColor = function (colStr) {
                    try {
                        colStr = colStr.replace("rgb(", "").replace(")", "");
                        var rgbArr = colStr.split(",");
                        var R = parseInt(rgbArr[0], 10);
                        var G = parseInt(rgbArr[1], 10);
                        var B = parseInt(rgbArr[2], 10);
                        var gray = Math.round((255 - (0.299 * R + 0.587 * G + 0.114 * B)) * 0.9);
                        return "rgb(" + gray + ", " + gray + ", " + gray + ")";
                    } catch (err) {
                        return "";
                    }
                };
                $.each(element.data, function (i, entry) {
                    if (i >= element.pageNum * settings.itemsPerPage &&
                        i < (element.pageNum * settings.itemsPerPage + settings.itemsPerPage)) {
                        $.each(entry.values, function (j, day) {
                            var _bar;
                            var from, to, cFrom, cTo, dFrom, dTo, dl;
                            var topEl, top;
                            switch (settings.scale) {
                            case "hours":
                                dFrom = tools.genId(tools.dateDeserialize(day.from), element.scaleStep);
                                from = $(element).find('#dh-' + dFrom);
                                dTo = tools.genId(tools.dateDeserialize(day.to), element.scaleStep);
                                to = $(element).find('#dh-' + dTo);
                                cFrom = from.data("offset");
                                cTo = to.data("offset");
                                dl = Math.floor((cTo - cFrom) / tools.getCellSize()) + 1;
                                _bar = core.createProgressBar(dl, day.label, day.desc, day.customClass, day.dataObj);                               // find row
                                topEl = $(element).find("#rowheader" + i);
                                top = tools.getCellSize() * 5 + 2 + topEl.data("offset");
                                _bar.css({ 'top': top, 'left': Math.floor(cFrom) });
                                datapanel.append(_bar);
                                break;
                            case "weeks":
                                dFrom = tools.dateDeserialize(day.from);
                                dTo = tools.dateDeserialize(day.to);
                                from = $(element).find("#" + dFrom.getWeekId());
                                cFrom = from.data("offset");
                                to = $(element).find("#" + dTo.getWeekId());
                                cTo = to.data("offset");
                                dl = Math.round((cTo - cFrom) / tools.getCellSize()) + 1;
                                _bar = core.createProgressBar(dl, day.label, day.desc, day.customClass, day.dataObj);                                // find row
                                topEl = $(element).find("#rowheader" + i);
                                top = tools.getCellSize() * 3 + 2 + topEl.data("offset");
                                _bar.css({ 'top': top, 'left': Math.floor(cFrom) });
                                datapanel.append(_bar);
                                break;
                            case "months":
                                dFrom = tools.dateDeserialize(day.from);
                                dTo = tools.dateDeserialize(day.to);
                                if (dFrom.getDate() <= 3 && dFrom.getMonth() === 0) {
                                    dFrom.setDate(dFrom.getDate() + 4);
                                }
                                if (dFrom.getDate() <= 3 && dFrom.getMonth() === 0) {
                                    dFrom.setDate(dFrom.getDate() + 4);
                                }
                                if (dTo.getDate() <= 3 && dTo.getMonth() === 0) {
                                    dTo.setDate(dTo.getDate() + 4);
                                }
                                from = $(element).find("#dh-" + tools.genId(dFrom));
                                cFrom = from.data("offset");
                                to = $(element).find("#dh-" + tools.genId(dTo));
                                cTo = to.data("offset");
                                dl = Math.round((cTo - cFrom) / tools.getCellSize()) + 1;
                                _bar = core.createProgressBar(dl, day.label, day.desc, day.customClass, day.dataObj);                               // find row
                                topEl = $(element).find("#rowheader" + i);
                                top = tools.getCellSize() * 2 + 2 + topEl.data("offset");
                                _bar.css({ 'top': top, 'left': Math.floor(cFrom) });
                                datapanel.append(_bar);
                                break;
                            case "days":
                            default:
                                dFrom = tools.genId(tools.dateDeserialize(day.from));
                                dTo = tools.genId(tools.dateDeserialize(day.to));
                                from = $(element).find("#dh-" + dFrom);
                                cFrom = from.data("offset");
                                dl = Math.floor((dTo - dFrom) / UTC_DAY_IN_MS) + 1;
                                _bar = core.createProgressBar(dl, day.label, day.desc, day.customClass, day.dataObj);
                                topEl = $(element).find("#rowheader" + i);
                                top = tools.getCellSize() * 4 + 2 + topEl.data("offset");
                                _bar.css({ 'top': top, 'left': Math.floor(cFrom) });
                                datapanel.append(_bar);
                            }
                            var $l = _bar.find(".fn-label");
                            if ($l && _bar.length) {
                                var gray = invertColor(_bar[0].style.backgroundColor);
                                $l.css("color", gray);
                            } else if ($l) {
                                $l.css("color", "");
                            }
                        });
                    }
                });
            },
            navigateTo: function (element, val) {
                var $rightPanel = $(element).find(".fn-gantt .rightPanel");
                var $dataPanel = $rightPanel.find(".dataPanel");
                var rightPanelWidth = $rightPanel.width();
                var dataPanelWidth = $dataPanel.width();
                var shift = function () {
                  core.repositionLabel(element);
                };
                var maxLeft, curMarg;
                switch (val) {
                case "begin":
                    $dataPanel.animate({ "margin-left": "0px" }, "fast", shift);
                    element.scrollNavigation.panelMargin = 0;
                    break;
                case "end":
                    var mLeft = dataPanelWidth - rightPanelWidth;
                    element.scrollNavigation.panelMargin = mLeft * -1;
                    $dataPanel.animate({ "margin-left": "-" + mLeft }, "fast", shift);
                    break;
                case "now":
                    if (!element.scrollNavigation.canScroll || !$dataPanel.find(".today").length) {
                        return false;
                    }
                    maxLeft = (dataPanelWidth - rightPanelWidth) * -1;
                    curMarg = $dataPanel.css("margin-left").replace("px", "");
                    val = $dataPanel.find(".today").offset().left - $dataPanel.offset().left;
                    val *= -1;
                    if (val > 0) {
                        val = 0;
                    } else if (val < maxLeft) {
                        val = maxLeft;
                    }
                    $dataPanel.animate({ "margin-left": val }, "fast", shift);
                    element.scrollNavigation.panelMargin = val;
                    break;
                default:
                    maxLeft = (dataPanelWidth - rightPanelWidth) * -1;
                    curMarg = $dataPanel.css("margin-left").replace("px", "");
                    val = parseInt(curMarg, 10) + val;
                    if (val <= 0 && val >= maxLeft) {
                        $dataPanel.animate({ "margin-left": val }, "fast", shift);
                    }
                    element.scrollNavigation.panelMargin = val;
                }
                core.synchronizeScroller(element);
            },
            navigatePage: function (element, val) {
                if ((element.pageNum + val) >= 0 &&
                    (element.pageNum + val) < Math.ceil(element.rowsNum / settings.itemsPerPage)) {
                    core.waitToggle(element, function () {
                        element.pageNum += val;
                        element.hPosition = $(".fn-gantt .dataPanel").css("margin-left").replace("px", "");
                        element.scaleOldWidth = false;
                        core.init(element);
                    });
                }
            },
            zoomInOut: function (element, val) {
                core.waitToggle(element, function () {
                    var zoomIn = (val < 0);
                    var scaleSt = element.scaleStep + val * 3;
                    scaleSt = scaleSt <= 1 ? 1 : scaleSt === 4 ? 3 : scaleSt;
                    var scale = settings.scale;
                    var headerRows = element.headerRows;
                    if (settings.scale === "hours" && scaleSt >= 13) {
                        scale = "days";
                        headerRows = 4;
                        scaleSt = 13;
                    } else if (settings.scale === "days" && zoomIn) {
                        scale = "hours";
                        headerRows = 5;
                        scaleSt = 12;
                    } else if (settings.scale === "days" && !zoomIn) {
                        scale = "weeks";
                        headerRows = 3;
                        scaleSt = 13;
                    } else if (settings.scale === "weeks" && !zoomIn) {
                        scale = "months";
                        headerRows = 2;
                        scaleSt = 14;
                    } else if (settings.scale === "weeks" && zoomIn) {
                        scale = "days";
                        headerRows = 4;
                        scaleSt = 13;
                    } else if (settings.scale === "months" && zoomIn) {
                        scale = "weeks";
                        headerRows = 3;
                        scaleSt = 13;
                    }
                    if ((zoomIn && $.inArray(scale, scales) < $.inArray(settings.minScale, scales)) ||
                        (!zoomIn && $.inArray(scale, scales) > $.inArray(settings.maxScale, scales))) {
                        core.init(element);
                        return;
                    }
                    element.scaleStep = scaleSt;
                    settings.scale = scale;
                    element.headerRows = headerRows;
                    var $rightPanel = $(element).find(".fn-gantt .rightPanel");
                    var $dataPanel = $rightPanel.find(".dataPanel");
                    element.hPosition = $dataPanel.css("margin-left").replace("px", "");
                    element.scaleOldWidth = ($dataPanel.width() - $rightPanel.width());
                    if (settings.useCookie) {
                        $.cookie(settings.cookieKey + "CurrentScale", settings.scale);
                        $.cookie(settings.cookieKey + "ScrollPos", null);
                    }
                    core.init(element);
                });
            },
            mouseScroll: function (element, e) {
                var $dataPanel = $(element).find(".fn-gantt .dataPanel");
                $dataPanel.css("cursor", "move");
                var bPos = $dataPanel.offset();
                var mPos = element.scrollNavigation.mouseX === null ? e.pageX : element.scrollNavigation.mouseX;
                var delta = e.pageX - mPos;
                element.scrollNavigation.mouseX = e.pageX;
                core.scrollPanel(element, delta);
                clearTimeout(element.scrollNavigation.repositionDelay);
                element.scrollNavigation.repositionDelay = setTimeout(core.repositionLabel, 50, element);
            },
            wheelScroll: function (element, e) {
                e.preventDefault();
                var delta = ( 'detail' in e ? e.detail :
                              'wheelDelta' in e.originalEvent ? - 1/120 * e.originalEvent.wheelDelta :
                              e.originalEvent.deltaY ? e.originalEvent.deltaY / Math.abs(e.originalEvent.deltaY) :
                              e.originalEvent.detail );
                core.scrollPanel(element, -50 * delta);
                clearTimeout(element.scrollNavigation.repositionDelay);
                element.scrollNavigation.repositionDelay = setTimeout(core.repositionLabel, 50, element);
            },
            sliderScroll: function (element, e) {
                var $sliderBar = $(element).find(".nav-slider-bar");
                var $sliderBarBtn = $sliderBar.find(".nav-slider-button");
                var $rightPanel = $(element).find(".fn-gantt .rightPanel");
                var $dataPanel = $rightPanel.find(".dataPanel");
                var bPos = $sliderBar.offset();
                var bWidth = $sliderBar.width();
                var wButton = $sliderBarBtn.width();
                var pos, mLeft;
                if ((e.pageX >= bPos.left) && (e.pageX <= bPos.left + bWidth)) {
                    pos = e.pageX - bPos.left;
                    pos = pos - wButton / 2;
                    $sliderBarBtn.css("left", pos);
                    mLeft = $dataPanel.width() - $rightPanel.width();
           	        var pPos = pos * mLeft / bWidth * -1;
                    if (pPos >= 0) {
                        $dataPanel.css("margin-left", "0px");
                        element.scrollNavigation.panelMargin = 0;
                    } else if (pos >= bWidth - (wButton * 1)) {
                        $dataPanel.css("margin-left", mLeft * -1);
                        element.scrollNavigation.panelMargin = mLeft * -1;
                    } else {
                        $dataPanel.css("margin-left", pPos);
                        element.scrollNavigation.panelMargin = pPos;
                    }
                    clearTimeout(element.scrollNavigation.repositionDelay);
                    element.scrollNavigation.repositionDelay = setTimeout(core.repositionLabel, 5, element);
                }
            },
            scrollPanel: function (element, delta) {
                if (!element.scrollNavigation.canScroll) {
                    return false;
                }
                var _panelMargin = parseInt(element.scrollNavigation.panelMargin, 10) + delta;
                if (_panelMargin > 0) {
                    element.scrollNavigation.panelMargin = 0;
                    $(element).find(".fn-gantt .dataPanel").css("margin-left", element.scrollNavigation.panelMargin);
                } else if (_panelMargin < element.scrollNavigation.panelMaxPos * -1) {
                    element.scrollNavigation.panelMargin = element.scrollNavigation.panelMaxPos * -1;
                    $(element).find(".fn-gantt .dataPanel").css("margin-left", element.scrollNavigation.panelMargin);
                } else {
                    element.scrollNavigation.panelMargin = _panelMargin;
                    $(element).find(".fn-gantt .dataPanel").css("margin-left", element.scrollNavigation.panelMargin);
                }
                core.synchronizeScroller(element);
            },
            synchronizeScroller: function (element) {
                if (settings.navigate !== "scroll") { return; }
                var $rightPanel = $(element).find(".fn-gantt .rightPanel");
                var $dataPanel = $rightPanel.find(".dataPanel");
                var $sliderBar = $(element).find(".nav-slider-bar");
                var $sliderBtn = $sliderBar.find(".nav-slider-button");
                var bWidth = $sliderBar.width();
                var wButton = $sliderBtn.width();
                var mLeft = $dataPanel.width() - $rightPanel.width();
                var hPos = $dataPanel.css("margin-left") || 0;
                if (hPos) {
                    hPos = hPos.replace("px", "");
                }
                var pos = hPos * bWidth / mLeft - $sliderBtn.width() * 0.25;
                pos = pos > 0 ? 0 : (pos * -1 >= bWidth - (wButton * 0.75)) ? (bWidth - (wButton * 1.25)) * -1 : pos;
                $sliderBtn.css("left", pos * -1);
            },
            repositionLabel: function (element) {
                setTimeout(function () {
                    var $dataPanel;
                    if (!element) {
                        $dataPanel = $(".fn-gantt .rightPanel .dataPanel");
                    } else {
                        var $rightPanel = $(element).find(".fn-gantt .rightPanel");
                        $dataPanel = $rightPanel.find(".dataPanel");
                    }
                    if (settings.useCookie) {
                        $.cookie(settings.cookieKey + "ScrollPos", $dataPanel.css("margin-left").replace("px", ""));
                    }
                }, 500);
            },
            waitToggle: function (element, showCallback) {
                if ( $.isFunction(showCallback) ) {
                    var $elt = $(element);
                    var eo = $elt.offset();
                    var ew = $elt.outerWidth();
                    var eh = $elt.outerHeight();
                    if (!element.loader) {
                        element.loader = $('<div class="fn-gantt-loader">' +
                        '<div class="fn-gantt-loader-spinner"><span>' + settings.waitText + '</span></div></div>');
                    }
                    $elt.append(element.loader);
                    setTimeout(showCallback, 500);
                } else if (element.loader) {
                  element.loader.detach();
                }
            }
        };
        var tools = {
            getMaxDate: function (element) {
                var maxDate = null;
                $.each(element.data, function (i, entry) {
                    $.each(entry.values, function (i, date) {
                        maxDate = maxDate < tools.dateDeserialize(date.to) ? tools.dateDeserialize(date.to) : maxDate;
                    });
                });
                maxDate = maxDate || new Date();
                var bd;
                switch (settings.scale) {
                case "hours":
                    maxDate.setHours(Math.ceil((maxDate.getHours()) / element.scaleStep) * element.scaleStep);
                    maxDate.setHours(maxDate.getHours() + element.scaleStep * 3);
                    break;
                case "weeks":
                    bd = new Date(maxDate.getTime());
                    bd = new Date(bd.setDate(bd.getDate() + 3 * 7));
                    var md = Math.floor(bd.getDate() / 7) * 7;
                    maxDate = new Date(bd.getFullYear(), bd.getMonth(), md === 0 ? 4 : md - 3);
                    break;
                case "months":
                    bd = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
                    bd.setMonth(bd.getMonth() + 2);
                    maxDate = new Date(bd.getFullYear(), bd.getMonth(), 1);
                    break;
                case "days":
                default:
                    maxDate.setHours(0);
                    maxDate.setDate(maxDate.getDate() + 3);
                }
                return maxDate;
            },
            getMinDate: function (element) {
                var minDate = null;
                $.each(element.data, function (i, entry) {
                    $.each(entry.values, function (i, date) {
                        minDate = minDate > tools.dateDeserialize(date.from) ||
                            minDate === null ? tools.dateDeserialize(date.from) : minDate;
                    });
                });
                minDate = minDate || new Date();
                switch (settings.scale) {
                case "hours":
                    minDate.setHours(Math.floor((minDate.getHours()) / element.scaleStep) * element.scaleStep);
                    minDate.setHours(minDate.getHours() - element.scaleStep * 3);
                    break;
                case "weeks":
                    var bd = new Date(minDate.getTime());
                    bd = new Date(bd.setDate(bd.getDate() - 3 * 7));
                    var md = Math.floor(bd.getDate() / 7) * 7;
                    minDate = new Date(bd.getFullYear(), bd.getMonth(), md === 0 ? 4 : md - 3);
                    break;
                case "months":
                    minDate.setHours(0, 0, 0, 0);
                    minDate.setDate(1);
                    minDate.setMonth(minDate.getMonth() - 3);
                    break;
                case "days":
                default:
                    minDate.setHours(0, 0, 0, 0);
                    minDate.setDate(minDate.getDate() - 3);
                }
                return minDate;
            },
            parseDateRange: function (from, to) {
                var current = new Date(from.getTime());
                var ret = [];
                var i = 0;
                do {
                    ret[i++] = new Date(current.getTime());
                    current.setDate(current.getDate() + 1);
                } while (current <= to);
                return ret;
            },
            parseTimeRange: function (from, to, scaleStep) {
                var current = new Date(from);
                var end = new Date(to);
                current.setHours(0, 0, 0, 0);
                end.setMilliseconds(0);
                end.setSeconds(0);
                if (end.getMinutes() > 0 || end.getHours() > 0) {
                    end.setMinutes(0);
                    end.setHours(0);
                    end.setTime(end.getTime() + UTC_DAY_IN_MS);
                }
                var ret = [];
                var i = 0;
                for(;;) {
                    var dayStartTime = new Date(current);
                    dayStartTime.setHours(Math.floor((current.getHours()) / scaleStep) * scaleStep);
                    if (ret[i] && dayStartTime.getDay() !== ret[i].getDay()) {
                        dayStartTime.setHours(0);
                    }
                    ret[i] = dayStartTime;
                    if (current > to)  { break; }
                    current = ktkGetNextDate(dayStartTime, scaleStep);
                    i++;
                }
                return ret;
            },
            parseWeeksRange: function (from, to) {
                var current = from.getDayForWeek();
                var ret = [];
                var i = 0;
                do {
                    ret[i++] = current.getDayForWeek();
                    current.setDate(current.getDate() + 7);
                } while (current <= to);
                return ret;
            },
            parseMonthsRange: function (from, to) {
                var current = new Date(from);
                var end = new Date(to);
                var ret = [];
                var i = 0;
                do {
                    ret[i++] = new Date(current.getFullYear(), current.getMonth(), 1);
                    current.setMonth(current.getMonth() + 1);
                } while (current <= to);
                return ret;
            },
            dateDeserialize: function (date) {
                if (typeof date === "string") {
                    date = date.replace(/\/Date\((.*)\)\//, "$1");
                    date = $.isNumeric(date) ? parseInt(date, 10) : $.trim(date);
                }
                return new Date( date );
            },
            genId: function (t) {
                if ( $.isNumeric(t) ) {
                    t = new Date(t);
                }
                switch (settings.scale) {
                case "hours":
                    var hour = t.getHours();
                    if (arguments.length >= 2) {
                        hour = (Math.floor(t.getHours() / arguments[1]) * arguments[1]);
                    }
                    return (new Date(t.getFullYear(), t.getMonth(), t.getDate(), hour)).getTime();
                case "weeks":
                    var y = t.getFullYear();
                    var w = t.getWeekOfYear();
                    var m = t.getMonth();
                    if (m === 11 && w === 1) {
                        y++;
                    } else if (!m && w > 51) {
                        y--;
                    }
                    return y + "-" + w;
                case "months":
                    return t.getFullYear() + "-" + t.getMonth();
                case "days":
                default:
                    return (new Date(t.getFullYear(), t.getMonth(), t.getDate())).getTime();
                }
            },
            _datesToDays: function ( dates ) {
                var dayMap = {};
                for (var i = 0, len = dates.length, day; i < len; i++) {
                    day = tools.dateDeserialize( dates[i] );
                    dayMap[ day.setHours(0, 0, 0, 0) ] = true;
                }
                return dayMap;
            },
            isHoliday: (function() { 
                if (!settings.holidays || !settings.holidays.length) {
                  return function () { return false; };
                }
                var holidays = false;
                return function(date) {
                    if (!holidays) {
                      holidays = tools._datesToDays( settings.holidays );
                    }
                    return !!holidays[
                      $.isNumeric(date) ?
                      date :
                      ( new Date(date.getFullYear(), date.getMonth(), date.getDate()) ).getTime()
                    ];
                };
            })(),
            getCellSize: function () {
                if (typeof tools._getCellSize === "undefined") {
                    var measure = $('<div style="display: none; position: absolute;" class="fn-gantt"><div class="row"></div></div>');
                    $("body").append(measure);
                    tools._getCellSize = measure.find(".row").height();
                    measure.empty().remove();
                }
                return tools._getCellSize;
            },
            getPageHeight: function (element) {
                return element.pageNum + 1 === element.pageCount ? element.rowsOnLastPage * tools.getCellSize() : settings.itemsPerPage * tools.getCellSize();
            },
            getProgressBarMargin: function () {
                if (typeof tools._getProgressBarMargin === "undefined") {
                    var measure = $('<div style="display: none; position: absolute;"><div class="fn-gantt"><div class="rightPanel"><div class="dataPanel"><div class="row day"><div class="bar"></div></div></div></div></div></div>');
                    var bar = measure.find(".fn-gantt .rightPanel .day .bar");
                    $("body").append(measure);
                    tools._getProgressBarMargin = parseInt(bar.css("margin-left").replace("px", ""), 10);
                    tools._getProgressBarMargin += parseInt(bar.css("margin-right").replace("px", ""), 10);
                    measure.empty().remove();
                }
                return tools._getProgressBarMargin;
            }
        };
        this.each(function () {
            this.data = null;  
            this.pageNum = 0;   
            this.pageCount = 0;    
            this.rowsOnLastPage = 0; 
            this.rowsNum = 0;      
            this.hPosition = 0;      
            this.dateStart = null;
            this.dateEnd = null;
            this.scrollClicked = false;
            this.scaleOldWidth = null;
            this.headerRows = null;
            if (settings.useCookie) {
                var sc = $.cookie(settings.cookieKey + "CurrentScale");
                if (sc) {
                    settings.scale = sc;
                } else {
                    $.cookie(settings.cookieKey + "CurrentScale", settings.scale);
                }
            }
            switch (settings.scale) {
            case "hours":
                this.headerRows = 5;
                this.scaleStep = 1;
                break;
            case "weeks":
                this.headerRows = 3;
                this.scaleStep = 13;
                break;
            case "months":
                this.headerRows = 2;
                this.scaleStep = 14;
                break;
            case "days":
            default:
                this.headerRows = 4;
                this.scaleStep = 13;
            }
            this.scrollNavigation = {
                panelMouseDown: false,
                scrollerMouseDown: false,
                mouseX: null,
                panelMargin: 0,
                repositionDelay: 0,
                panelMaxPos: 0,
                canScroll: true
            };
            this.gantt = null;
            this.loader = null;
            core.create(this);
        });
    };
})(jQuery);
