var myNextDays = function($, model) {

  var that, userName, calendarName, editedEntryButton = null;
  that = {};
  
  that.createCalendar = function() {
    model.clearEntries();
    that.setCalendarName('My Next Days');
    that.setUserName("Guest");
    $('.entry-input').focus();
  }
  
  that.setDemoData = function() {
    that.addEntry('Next friday 17:00: Call Mary and invite her for pizza');
    that.addEntry('Work on HCI Assignment tomorrow');
    that.addEntry('Go swimming monday evening');
    that.addEntry('View HCI video lecture today');
    that.addEntry('06/12/2012 Santa Claus party');
    that.addEntry('Write Christmas Cards! 18-12');
    that.addEntry('24.12 Christmas');
  }

  that.setUserName = function(name) {
    userName = name;
    $('.user-name').text(userName);
  }
      
  that.setCalendarName = function(name) {
    calendarName = name;
    $('.calendar-name').text(name);
  }
  
  that.addEntry = function(input, pickedDate)
  {
    if (editedEntryButton != null) {
      // Remove edited entry
      that.removeEntry(editedEntryButton);
    }
    editedEntryButton = null;
    
    model.addEntry(input, pickedDate);
    that.refresh();
  }
  
  that.removeEntry = function(anchorClicked) {
    var index = anchorClicked.attr('href').substring(1);
    // Update model
    model.removeEntry(index);
    // Update view
    $('.entry-' + index).fadeOut('slow');
  }
  
  that.editEntry = function(editButton) {
    var dateCell, textCell, input, doneListener;
    dateCell = editButton.parents('.entry-row').find('.date-text');
    textCell = editButton.parents('.entry-row').find('.entry-text');
    // Fill input field with current value and place cursor at end
    input = $('.entry-input');
    input.val(" " + textCell.text());
    $('.datepicker').val(dateCell.text().substring(0,10));
    input[0].selectionStart = input[0].selectionEnd = input.val().length;
    editedEntryButton = editButton;
    that.refreshAddButton();
    input.focus();
  }
   
  // Renders entries
  that.refresh = function()
  {
    var entries = model.entries();
    var createDateString = function(aDate, addDays) {
      if (!aDate) {
        return undefined;
      }
      aDate.setDate(aDate.getDate() + addDays);
      return aDate.getFullYear() + '-' + aDate.getMonth() + '-' + aDate.getDate();
    }
    var today = createDateString(new Date(), 0);
    var tomorrow = createDateString(new Date(), 1);
    var in2days = createDateString(new Date(), 2);
    
    $('.entries-tbody').empty();
    for(var i = 0; i < entries.length; i++)
    {
      var e = entries[i];
      var trClass = 'entry-row';
      // Highlight entries for today and tomorrow
      var eDateString = createDateString(e.timestamp, 0);
      if (eDateString === today) {
        trClass += ' entry-today';
      } 
      else if (eDateString === tomorrow) {
        trClass += ' entry-tomorrow'; 
      }
      else if (eDateString === in2days) {
        trClass += ' entry-in2days'; 
      }
      trClass += ' entry-' + i;
      $('.entries-tbody:last').append(
        '<tr class="' + trClass + '"><td class="date-text">' + e.date + '</td><td>' + e.time + '</td><td class="entry-text">' + e.text + '</td>' +
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
  }

  that.hideRowActions = function (rowElement, duration) {
    $(rowElement).find(".row-actions").fadeOut(duration, function() { $(this).show().css('visibility','hidden') });
  }
  
  that.searchEntries = function() {
    var searchText = $('.search-input').val();
    if (searchText.length == 0) {
       if (model.isSearchActive()) {
        that.closeSearch()
       }
       return;
    }
    $('.search-text').text(searchText);
    model.setSearch(searchText);
    that.refresh();
  }
  
  that.closeSearch = function() {
    $('.search-input').val('');
    model.clearSearch()
    that.refresh();
  }

  that.run = function()
  {
    that.createCalendar();
    that.setDemoData();
    that.refresh();
    that.refreshCurrentDate();
  }
  
  // --- Event handlers ---

  // Create new calendar
  $('.create-calendar').click(function(){
    that.createCalendar();
    that.refresh();
  });

  // Provide your name
  that.inlineEdit($('.user-name'), function(value) {
    that.setUserName(value);
  });
      
  // Name your calendar
  that.inlineEdit($('.calendar-name'), function(value) {
    that.setCalendarName(value);
  });
  
  var executeAdd = function(){
    var input = $('.entry-input').val();
    var pickedDate =  $(".datepicker").datepicker('getDate');
    that.addEntry(input, pickedDate);
    $('.datepicker').val('');
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

  // Search for entries when edit button clicked
  $(document).on('click', '.search-button', function() {
    that.searchEntries();
  });
  
  // Clear search
  $(document).on('click', '.search-close', function() {
    that.closeSearch();
  });
  
  // Search when pressing a key in the search field 
  $('.search-input').bind('keyup', function(e) {
    that.searchEntries();
  });
  
  // Make search input clearable
  $('.clear-search').click(function(){
    that.closeSearch();
  });
  
  // Configure date picker
  $('.datepicker').datepicker({
      dateFormat: "dd.mm.yy",
      buttonText: "Pick a date (if you don't have one in your event) ...",
      showOn: "button",
      buttonImage: "assets/img/calender-icon.png",
      buttonImageOnly: true
  });
    
  // Initialize
  $('a[rel=popover]').popover({placement: "bottom", trigger: "hover"});
  that.createCalendar();
  
  return that;
  
}(jQuery, mnd_model);


