// Module for "My Next Days model"
var mnd_model = (function() {

  var that, entries, filterText, weekdays, relativeDays, datePattern;
  
  weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  relativeDays = [['today', 0], ['next day', 1], ['tomorrow', 1], ['in two days', 2], ['in three days', 3]];
  datePatterns = [
    [
      // Recognizes: dd-mm-yyyy or dd-mm (. or / can be used instead of -)
      /[^\d]*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.]?(\d{4})?.*/, 
      function(g) {
        if (g.length < 4) {
          return;
        }
        // console.debug(g);
        var year = (g[3] ? g[3] : (new Date()).getFullYear());
        var dateString = year + '-' + g[2] + '-' + g[1];
        // console.debug(dateString);
        return new Date(dateString);      
    }]
  ];

  that = {};
  entries = [];
  filterText = undefined;
  
  that.clearEntries = function() {
    entries = [];
  }
  
  that.entries = function() {
    if (filterText) {
      var foundEntries = [];
      for (var i=0; i<entries.length; i++) {
        if (entries[i].text.toLowerCase().indexOf(filterText.toLowerCase()) >= 0) {
          foundEntries.push(entries[i]);
        }
      }
      return foundEntries;
    }
    else {
      return entries;
    }
  }
  
  that.addEntry = function(input) {
    var date, dateText, time, note;
    note = input;
    dateText = "";
    
    // Sort "now" to top
    if (!date && note.toLowerCase().indexOf('now') > -1) {
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
    // Find absolute dates with specified patterns
    for(var i=0; i < datePatterns.length; i++) {
      var recognizedDate, pattern, matches, regexp, createDateFunction;
      pattern = datePatterns[i];
      regexp = pattern[0];
      createDateFunction = pattern[1];
      var matches = input.match(regexp);
      if (matches) {
        recognizedDate = createDateFunction(matches);
        if (recognizedDate) {
          date = recognizedDate;
        }
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
  }
  
  that.removeEntry = function(index) {
    entries.splice(index, 1);
  }
  
  that.setSearch = function(searchText) {
    filterText = searchText;
  }
    
  that.clearSearch = function() {
    filterText = undefined;
  }

  that.isSearchActive = function() {
    return !(filterText === undefined) ;
  }
  
  return that;
}());

