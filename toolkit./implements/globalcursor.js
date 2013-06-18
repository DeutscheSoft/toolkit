/*******************************************************************************
 * toolkit. by Junger
 * 
 * This toolkit provides different widgets, implements and modules for building
 * audio based applications in webbrowsers.
 * 
 * Concept and realization by Markus Schmidt <schmidt@boomshop.net> for:
 * 
 * Jünger Audio GmbH
 * Justus-von-Liebig-Straße 7
 * 12489 Berlin · Germany
 * Tel: +49 30 67 77 21 0
 * http://junger-audio.com
 * info@junger-audio.com
 * 
 * toolkit. relies on mootools: http://mootools.net/
 * 
 * There is no license by now - all rights reserved. Hope we can fix this major
 * bug soon.
 ******************************************************************************/
 
GlobalCursor = new Class({
    // GlobalCursor adds global cursor classes to enshure one of the
    // standard cursors (http://www.echoecho.com/csscursors.htm) in
    // the whole application
    Implements: Events,
    global_cursor: function (cursor) {
        $$("html").addClass("toolkit-cursor-" + cursor);
        this.fireEvent("globalcursor", cursor);
    },
    remove_cursor: function (cursor) {
        $$("html").removeClass("toolkit-cursor-" + cursor);
        this.fireEvent("cursorremoved", cursor);
    }
});
