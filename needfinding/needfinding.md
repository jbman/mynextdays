# NeedFinding

## Planned observations and questions
I observed the activity of placing reminders for important dates (e.g. due dates or appointments) and using this entries.
To observe this activity, I asked people to do the following task:

_“Please show my how you place a due date. Let's say you have to finish and submit a document at the lend of next week.”_

I gave them the advice to use whatever they recently used to do this tasks (e.g. phone, private calendar, calendar software).

Additionally I asked the following interview questions:

_"Is there a difference if you have to finish the document in 3 month? Would you do it the same way?"_
_"Is there a difference when it is a private appointment with a friend?"_
_"How does your method help you to get the details, e.g. the exact date, time and topic of the date?"_
_"Can you remember the last time you have forgot a date using this method?"_

The activity relates to the brief "Time", because a time representation is needed to compute and enter or write down the exact point in time which should be reminded. The individuals interact with this representation by computing a point in time (end of next week) and persist a representation of this point, either in reality (using a pen) or virtual (using a software). What method they choose, has a great impact on the representations they are forced to use. Paper calenders for example, do only dictate where to put your entry. Compared with a note on a paper, they might give you easier “Findeability” in return. Software calenders additionally force you to  enter the date by using a representation they understand. In return a software normally offers "Reminder" and "Search" functionality.

## Goals, needs and tasks
The observations should result in a list of goals, needs and tasks:

### Goals

* Don’t forget an important date
* Having a place where to look up a date and its details
* Private and business appointments and deadlines at one place

## Needs

* Only very few information needs to be stored. Most of the information is remembered by the person which writes/enters the date. Software calendars offer to much irrelevant input fields. Examples: Not all dates need a "start" and "end" time and some doesn't need a hour but a day only.
* When additional information should be stored together with a date (e.g. “place” or which group you will meet), this can be also managed with “tags” instead of a several predefined input fields. You enter your date like you would do on a paper “Bowling dev-tem 12.10.2012 18:00” and each word will become a tag. So you can browse your dates by tag. Dates and times needs some fuzyness (e.g. automatic tags), so that you can e.g. browse for tag “calendar-week-41” and find the date above.
* Sometimes dates needs extra input so for additional functionality (such as “Use remember functionality or not”, “private or not”). This functionality could as well be “tag-driven”, e.g. just add a “private” tag
* Get an overview on upcoming dates
* The next days or date need to be visible, regardless of a week or month “wrap”. Structuring of time in weeks and month is arbitrary: an important date next day might stay “invisible”, because it is on the calenders next page.
* Be remembered of an important date (at the right time!)
* No annyoing defaults which doesn’t meet the users needs. Idea: A remember function which takes into account who far the user is away from the target place.
* Dates need to be blended together with the dates of other people (Examples: “Family planner”, “Calendar overlay” with a software)
* Dates must be “at hand”: If you see them each day you wont miss them
* The time until a date is reached can be mapped to a physical distance: The next dates need to be “nearer” at you than the ones which aren’t relevant yet

### Tasks

* “Revisiting” dates written down before and assessing their importance or relevance for right now
* Relative times (“Friday next week”) have to be converted to the exact date. A calendar helps with this task.
* Conversion by the computer is an other solution to get an exact date form a relative one (very rare, not established yet)
* Write down date information: Input flexibility varies from “full flexibility” (Post-it note) to “exact format” (most software). We got very used to use one search input field, but it is very uncommon to have one data input field which supports a variety of formats (e.g. “date time topic”, “topic date, “topic relative-time”).
* Specific settings as “private” have to be set explicitly by the user. The value could as well be “pre-set” as “private” if you enter a time which is before or after your normal work time
