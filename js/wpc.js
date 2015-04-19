(function($) {
  "use strict";

  $.ajaxSetup({
    type: "GET",
    dataType: "json",
    success: function() {
      $('.gif').remove();
    },
    error: function() {
      $('.gif').attr('class', 'err').html("You need to <a href='" + wpcext.config.exturl + "'>upgrade</a>. Click refresh to " +
          "retry. If problems persist contact me as soon as possible: <a href='mailto:" +
          wpcext.config.email + "'>" + "bahbi@babbi.net</a>");
    }
  });

  var wpcext = {
    config: {
      version: "0.1",
      browser: "chrome",
      email: "bahbi@bahbi.net",
      exturl: ""
    },
    settings: {
      timeFormat: localStorage.timeFormat === "h:MMTT Z" ? "h:MMTT Z" : "H:MM Z",
      dateFormat: localStorage.dateFormat === "d/mm/yyyy" ? "d/mm/yyyy" : "mm/d/yyyy"
    },
    init: function() {
      defineDefaults();
      onLoadAjax();
    }
  };

  // Cache Settings
  var timeFormat = wpcext.settings.timeFormat,
    dateFormat = wpcext.settings.dateFormat;
	
  var setTime = function() {
    $('.push-tt').each(function(){
      var $parentNode = $(this).parent();
      var timestamp = $(this).attr('alt');
      var newDate = new Date(timestamp*1000);
      newDate.setHours(newDate.getHours());
      var fulldate = format(newDate, dateFormat + " " + timeFormat);
      var prevEventTime = $parentNode.attr('data-original-title');
      var newEventTime = prevEventTime + "<br>" + fulldate;
      $parentNode.attr('data-original-title', newEventTime);
    });
  };

  var setUpdatedTime = function() {
    $('.push-tt').each(function(){
      var $parentNode = $(this).parent();
      var timestamp = $(this).attr('alt');
      var newDate = new Date(timestamp*1000);
      newDate.setHours(newDate.getHours());
      var fulldate = format(newDate, dateFormat + " " + timeFormat);
      var prevEventStr = $parentNode.attr('data-original-title');
      var prevEventIndex = prevEventStr.indexOf('<br>');
      var prevEventTime = prevEventStr.substring(0, prevEventIndex);
      var newEventTime = prevEventTime + "<br>" + fulldate;
      $parentNode.attr('data-original-title', newEventTime);
    });
  };

  var defineDefaults = function() {
    // Last Opened Tab
    if (localStorage.lastOpenedTab !== undefined) {
      $('#'+localStorage.lastOpenedTab).tab('show');
    } else {
      $('.menutab:first').tab('show');
    }

    // Time Format
    if ("H:MM Z" === timeFormat)
      $('#twfh').addClass('active');
    else {
      $('#PM').addClass('active');
    }

    // Date Format
    if ("d/mm/yyyy" === dateFormat) {
      $('#dateInt').addClass('active');
    } else {
      $('#dateUS').addClass('active');
    }
  };

  var endPoint = 'watchpeoplecode.com';
  var onLoadAjax = function() {

    // Live streams
    var loadLiveStreams = $.ajax("http://" + endPoint + "/api/v1/streams/live")
    .success(function(res) {
		var streams;
		var sorted = res.data;
		sorted.sort(function(b,a) {
			return a.viewers - b.viewers;
		});
		
		$.each(sorted, function(i){
			streams += 
			"<tr href="+sorted[i].url+
				" data-id="+sorted[i].username+" class='wpcrow streams'"+
				" title="+sorted[i].title+
				
			"</td>"+
			"<td>"
				+sorted[i].title+
			"</td>"+
			"<td class='textRight'>"+sorted[i].viewers+"</td></tr>";			
		});
		console.log(streams);



		$('#tbody_streams').html(streams);
    });
	
	// Upcoming streams
    var loadUpcomingStreams = $.ajax("http://" + endPoint + "/api/v1/streams/upcoming")
    .success(function(res) {
		var upcoming;
		var sorted = res.data;
		sorted.sort(function(b,a) {
			return a.viewers - b.viewers;
		});
		
		$.each(sorted, function(i){
			upcoming += 
			"<tr href="+sorted[i].url+
				" data-id="+sorted[i].username+" class='wpcrow streams'"+
				" title="+sorted[i].title+
				
			"</td>"+
			"<td>"
				+sorted[i].title+
			"</td>"/*+
			"<td class='textRight'>"+sorted[i].viewers+"</td></tr>"*/;			
		});
		console.log(streams);
        $('#tbody_upcoming').html(upcoming);
    });
	
    $.when(loadLiveStreams && loadUpcomingStreams).done(function() {
      
      $('.listload').each(function(i) {

      });
      setTime();
    });

  };

  var update = function() {
    $('.wpcrow, .err').remove();
    $('.listload').html("<tr class='gif'></tr>");
    onLoadAjax();
  };

  // Start Main
  wpcext.init();

  $('.tab-content').on('click', '.wpcrow', function(e){
    e.stopPropagation();
    var url = $(this).attr('href');
    window.open(url + "?source=wpcext");
  });

  $('.menutab').on('shown', function(e) {
    var lastTab = e.target;
    localStorage.lastOpenedTab = $(lastTab).attr('id');
  });

  $('.timeformat').click(function(){
    timeFormat = $(this).attr('alt');
    localStorage.timeFormat = timeFormat;
    setUpdatedTime();
  });

  $('.dateformat').click(function(){
    dateFormat = $(this).attr('alt');
    localStorage.dateFormat = dateFormat;
    setUpdatedTime();
  });


  $('#nav_update').click(function(){
    update();
  });

  $('.permalink').click(function(e){
    var url = $(this).attr("data-link");
    window.open(url);
    e.stopPropagation();
  });



  setTimeout(function() {
    // Focus fix
    $("#nav_dd2").blur();
  }, 200);
})(jQuery);