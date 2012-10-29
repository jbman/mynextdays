var myNextDays = function($) {

  var that, userName, calendarName, entries, weekdays, relativeDays;
  
  weekdays = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  relativeDays = [['today', 0], ['next day', 1], ['tomorrow', 1], ['in two days', 2], ['in three days', 3]];
  that = {};
  userName = 'Guest';

  that.createCalendar = function()
  {
    entries = [];
    that.setCalendarName('My Calendar');
  }
  
  that.setDemoData = function()
  {
    that.addEntry('Next friday 17:00: Call Mary and invite her for pizza');
    that.addEntry('Work on HCI Assignment tomorrow');
    that.addEntry('Go swimming monday evening');
    that.addEntry('View HCI video lecture today');
  }

  that.setUserName = function(name)
  {
    userName = name;
    $('.user-name').text(userName);
  }
      
  that.setCalendarName = function(name)
  {
    calendarName = name;
    $('.calendar-name').text(name);
  }
  
  that.addEntry = function(input)
  {
    var date, dateText, time, note;
    note = input;
    dateText = "";
    
    // Sort "now" to top
    if (note.toLowerCase().indexOf('now') > -1) {
      if(entries.length > 0) {
        date = new Date();
        date.setTime(entries[0].timestamp.getTime() - 1);
      }
    }
    // Find relative dates like "tomorrow"
    for(var i=0; i<relativeDays.length; i++) {
      var item = relativeDays[i];
      if (note.toLowerCase().indexOf(item[0]) > -1)
      {
        date = new Date(); 
        date.setDate(date.getDate() + item[1]);
        break;
      }
    }
    // Find weekdays like "friday" (whill be interpreted as "next friday")
    for(var i=0; i<weekdays.length; i++) {
      var w = weekdays[i];
      if (note.toLowerCase().indexOf(w) > -1)
      {
        date = new Date(); 
        var diff = (i - date.getDay() + 7) % 7;
        if (diff == 0) {
          diff = 7;
        }
        date = new Date(); 
        date.setDate(date.getDate() + diff);
        break;
      }
    }
    if (typeof date == 'undefined')
    {
    // No date found yet: Use current date, so that item is sorted on top
      date = new Date();
    }
    else {
        dateText = date.toLocaleDateString();
        // var dateTime = new DateTime(date.getTime());
        // dateText = dateTime.sym.d.yyyy + "-" + dateTime.sym.d.mm + "-" + dateTime.sym.d.dd + ", " + dateTime.day.name;
    }    
    
    entries.push({timestamp: date, "date": dateText, "time":"", "text": input });
    
    entries.sort(function(a, b) {
        return a.timestamp.getTime() - b.timestamp.getTime();
    });
    
    // TODO: Remove entries which are in the past? Or put them in an extra hidden container?
    
    that.refresh();
  }
  
  // Renders entries
  that.refresh = function()
  {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    var in2days = new Date();
    in2days.setDate(today.getDate() + 2);
    
    $('.entries-tbody').empty();
    for(var i=0; i<entries.length; i++)
    {
      var e = entries[i];
      var trClass = '';
      // Highlight entries for today and tomorrow
      if (e.timestamp.getDate() == today.getDate()) {
        trClass = ' class="entry-today"';
      } 
      else if (e.timestamp.getDate() == tomorrow.getDate()) {
        trClass = ' class="entry-tomorrow"'; 
      }
      else if (e.timestamp.getDate() == in2days.getDate()) {
        trClass = ' class="entry-in2days"'; 
      }
      $('.entries-tbody:last').append('<tr' + trClass + '><td>' + e.date + '</td><td>' + e.time + '</td><td>' + e.text + '</td></tr>');
    }
  };
  
  that.refreshCurrentDate = function() {
    var dateTime = new DateTime();
    $(".current-date").text(dateTime.formats.pretty.c);
  }
  setInterval(that.refreshCurrentDate , 250);
  
  // Inline edit an anchor element <a>
  // Callback function gets the new value as argument
  that.inlineEdit = function(element, callback) {
    element.click(function() {
      var isInput = element.children().size() > 0;
      if (!isInput) {

        element.html('<input id="inlineEditInput" value="' + element.text() + '"></input>');
        var inputField = $('#inlineEditInput');
        inputField.select();
        
        var inputDone = function() {
          var newValue = $('#inlineEditInput').val();
          element.empty();
          $('html').unbind('click');
          element.unbind('click.stopPropagation');
          callback(newValue);
        };

        // Input is done when ENTER is pressed      
        inputField.bind('keyup', function(e) {
          var code = (e.keyCode ? e.keyCode : e.which);
          if(code == 13) { //Enter keycode
            inputDone();
          }
        });

        // Prevernt listener on "html" from beeing notified with the current click
        event.stopPropagation();
        // Input is done when clicking outside of input field
        $('html').click(function() { inputDone() } );
        element.bind('click.stopPropagation', function(event) {
           event.stopPropagation();
        });
      }
    });
  }
  
  that.run = function()
  {
    that.createCalendar();
    that.setDemoData();
    that.refresh();
    that.refreshCurrentDate();
  };
  
  // --- Event handlers ---

  // Create new calendar
  $('.create-calendar').click(function(){
    that.createCalendar();
    that.refresh();
  });

  // Provide your name
  that.inlineEdit($('.user-name'), function(value) {
    that.setUserName(value);
    $('.user-name-hint').hide();
  });
      
  // Name your calendar
  that.inlineEdit($('.calendar-name'), function(value) {
    that.setCalendarName(value);
    $('.calendar-name-hint').hide();
  });
  
  var executeAdd = function(){
    var input = $('.entry-input').val();
    that.addEntry(input);
    $('.entry-input').val('');
  };
  
  // Adds an entry when clicking "Add"
  $('.add-button').click(executeAdd);
  // Add entry when pressing enter in input field 
  $('.entry-input').bind('keyup', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { //Enter keycode
      executeAdd();
    }
  });

  return that;
  
}(jQuery);


