var myNextDays = function($) {

  var that, userName, calendarName, entries, weekdays, relativeDays, editedEntryButton = null;
  
  weekdays = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  relativeDays = [['today', 0], ['next day', 1], ['tomorrow', 1], ['in two days', 2], ['in three days', 3]];
  that = {};


  that.createCalendar = function() {
    entries = [];
    that.setCalendarName('My Next Days');
    that.setUserName("Guest");
    $('.entry-input').focus();
  }
  
  that.setDemoData = function() {
    that.addEntry('Next friday 17:00: Call Mary and invite her for pizza');
    that.addEntry('Work on HCI Assignment tomorrow');
    that.addEntry('Go swimming monday evening');
    that.addEntry('View HCI video lecture today');
  }

  that.setUserName = function(name) {
    userName = name;
    $('.user-name').text(userName);
  }
      
  that.setCalendarName = function(name) {
    calendarName = name;
    $('.calendar-name').text(name);
  }
  
  that.addEntry = function(input)
  {
    if (editedEntryButton != null) {
      // Remove edited entry
      that.removeEntry(editedEntryButton);
    }
    editedEntryButton = null;
    
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
        if (diff === 0) {
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
    
    entries.push({'timestamp': date, 'date': dateText, 'time':'', 'text': input, 'mostRecent': true });
    
    entries.sort(function(a, b) {
        return a.timestamp.getTime() - b.timestamp.getTime();
    });
    
    // TODO: Remove entries which are in the past? Or put them in an extra hidden container?
    
    that.refresh();
  }
  
  that.removeEntry = function(anchorClicked) {
    var index = anchorClicked.attr('href').substring(1);
    // Update model
    entries.splice(index, 1);
    // Update view
    $('.entry-' + index).fadeOut('slow');
  }
  
  that.editEntry = function(editButton) {
    var textCell, input, doneListener;
    textCell = editButton.parents('.entry-row').find('.entry-text');
    // Fill input field with current value and place cursor at end
    input = $('.entry-input');
    input.val(textCell.text());
    input.focus();
    input[0].selectionStart = input[0].selectionEnd = input.val().length;
    editedEntryButton = editButton;
    that.refreshAddButton();
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
      var trClass = 'entry-row';
      // Highlight entries for today and tomorrow
      if (e.timestamp.getDate() == today.getDate()) {
        trClass += ' entry-today';
      } 
      else if (e.timestamp.getDate() == tomorrow.getDate()) {
        trClass += ' entry-tomorrow'; 
      }
      else if (e.timestamp.getDate() == in2days.getDate()) {
        trClass += ' entry-in2days'; 
      }
      trClass += ' entry-' + i;
      $('.entries-tbody:last').append(
        '<tr class="' + trClass + '"><td>' + e.date + '</td><td>' + e.time + '</td><td class="entry-text">' + e.text + '</td>' +
        '<td><div class="btn-group row-actions">' + 
        '<a class="btn btn-small remove-button" href="#' + i + '"><i class="icon-minus"></i> Remove</a>' + 
        '<a class="btn btn-small edit-button" href="#' + i + '"><i class="icon-pencil"></i> Edit</a>' + 
        '</div></td></tr>');
      
      // Show actions of most recently added row and slowly fade them out
      if (e.mostRecent) {
        e.mostRecent = false;
        that.showRowActions($('.entry-' + i));
        that.hideRowActions($('.entry-' + i), 5000);
      }
    }
    
    that.refreshAddButton();
  };
  
  // Update "Add" Button text if no more in edit mode
  that.refreshAddButton = function() {
    if (editedEntryButton != null) {
      // Switch "Add" button to "Edit Done"
      $('.add-button').html('<i class="icon-ok icon-white"></i> Edit done');
    }
    else {
      $('.add-button').html('<i class="icon-plus icon-white"></i> Add');
    }
  }  
  
  that.refreshCurrentDate = function() {
    var dateTime = new DateTime();
    $(".current-date").text(dateTime.formats.pretty.c);
  };
  setInterval(that.refreshCurrentDate , 250);
  
  // Inline edit an anchor element <a>
  // Callback function gets the new value as argument
  that.inlineEdit = function(element, callback) {
    element.click(that.inlineEditFunction(callback));
  };
    
  // Function to activate inline edit of an element
  // Callback: Function which gets new value as argument when editing is done.
  // If input is empty, the original value is supplied
  that.inlineEditFunction = function(callback) {
    return function() {
      var element, isInput, originalValue;
      element = $(this);
      isInput = element.children().size() > 0;
      if (!isInput) {
        originalValue = element.text();
        element.html('<input id="inlineEditInput" value="' + originalValue + '"></input>');
        var inputField = $('#inlineEditInput');
        inputField.focus();
        inputField.select();
        
        var inputDone = function(submit) {
          var newValue = $('#inlineEditInput').val();
          element.empty();
          element.unbind('click.stopPropagation');
          $('html').unbind('click');
          if (submit && newValue.length > 0) {
            callback(newValue);
          }
          else  {
            // if submit is false supply the original value
            callback(originalValue);
          }
        };

        // Input is done when ENTER is pressed      
        inputField.bind('keyup', function(e) {
          var code = (e.keyCode ? e.keyCode : e.which);
          if(code == 13) { //Enter keycode
            inputDone(true);
          }
          else if(code == 27) { //ESC keycode
            inputDone(false);
          }
        });

        // Prevent listener on "html" from beeing notified with the current click
        event.stopPropagation();
        // Input is done when clicking outside of input field
        $('html').click(function() { inputDone() } );
        element.bind('click.stopPropagation', function(event) {
           event.stopPropagation();
        });
      }
    }
  }


  that.showRowActions = function (rowElement) {
    // Stop possible hide animation and fadeIn
    $(rowElement).find(".row-actions").stop(true, true);
    $(rowElement).find(".row-actions").css('visibility','visible').show();
  };

  that.hideRowActions = function (rowElement, duration) {
    $(rowElement).find(".row-actions").fadeOut(duration, function() { $(this).show().css('visibility','hidden') });
  };

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
    if(value.length < 1)
    {
      value = 'Guest';
    }
    that.setUserName(value);
  });
      
  // Name your calendar
  that.inlineEdit($('.calendar-name'), function(value) {
    if(value.length < 1)
    {
      value = 'Guest';
    }  
    that.setCalendarName(value);
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

  // Show entry actions only when mouse in row  
  $(document).on('mouseenter', '.entry-row', function() {
    that.showRowActions(this);
  });
  $(document).on('mouseleave', '.entry-row', function() {
    that.hideRowActions(this, 'fast');
  });

  // Remove entry when remove button clicked
  $(document).on('click', '.remove-button', function() {
    that.removeEntry($(this));
  });
  
  // Edit entry when edit button clicked
  $(document).on('click', '.edit-button', function() {
    that.editEntry($(this));
  });

  // Initialize
  $('a[rel=popover]').popover({placement: "bottom", trigger: "hover"});
  that.createCalendar();
  
  return that;
  
}(jQuery);


