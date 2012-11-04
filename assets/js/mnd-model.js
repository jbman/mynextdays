// Module for "My Next Days model"
var mnd_model = (function() {

  var that, entries, weekdays, relativeDays,
  weekdays = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  relativeDays = [['today', 0], ['next day', 1], ['tomorrow', 1], ['in two days', 2], ['in three days', 3]];
  that = {};
  entries = [];
  
  that.clearEntries = function() {
    entries = [];
  }
  
  that.entries = function() {
    return entries;
  }
  
  that.addEntry = function(input) {
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
  }
  
  that.removeEntry = function(index) {
    entries.splice(index, 1);
  }
  
  return that;
}());

