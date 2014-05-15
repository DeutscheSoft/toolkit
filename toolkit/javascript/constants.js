 /* toolkit. provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */

_TOOLKIT_VARIABLE                    = -1;
_TOOLKIT_VAR                         = -1;

_TOOLKIT_NONE                        = -2;

// POSITIONS
_TOOLKIT_TOP                         = 0;
_TOOLKIT_RIGHT                       = 1;
_TOOLKIT_BOTTOM                      = 2;
_TOOLKIT_LEFT                        = 3;
_TOOLKIT_TOP_LEFT                    = 4;
_TOOLKIT_TOP_RIGHT                   = 5;
_TOOLKIT_BOTTOM_RIGHT                = 6;
_TOOLKIT_BOTTOM_LEFT                 = 7;
_TOOLKIT_CENTER                      = 8;

// DIRECTIONS
_TOOLKIT_N                           = 0;
_TOOLKIT_UP                          = 0;
_TOOLKIT_E                           = 1;
_TOOLKIT_S                           = 2;
_TOOLKIT_DOWN                        = 2;
_TOOLKIT_W                           = 3;
_TOOLKIT_NW                          = 4;
_TOOLKIT_NE                          = 5;
_TOOLKIT_SE                          = 6;
_TOOLKIT_SW                          = 7;
_TOOLKIT_C                           = 8;

_TOOLKIT_HORIZONTAL                  = 10;
_TOOLKIT_HORIZ                       = 10;
_TOOLKIT_VERTICAL                    = 11;
_TOOLKIT_VERT                        = 11;

_TOOLKIT_X                           = 10;
_TOOLKIT_Y                           = 11;

// DRAWING MODES
_TOOLKIT_CIRCULAR                    = 20;
_TOOLKIT_CIRC                        = 20;
_TOOLKIT_LINE                        = 21;
_TOOLKIT_BLOCK                       = 22;
_TOOLKIT_LINE_HORIZONTAL             = 23;
_TOOLKIT_LINE_HORIZ                  = 23;
_TOOLKIT_LINE_VERTICAL               = 24;
_TOOLKIT_LINE_VERT                   = 24;
_TOOLKIT_LINE_X                      = 23;
_TOOLKIT_LINE_Y                      = 24;
_TOOLKIT_BLOCK_LEFT                  = 25;
_TOOLKIT_BLOCK_RIGHT                 = 26;
_TOOLKIT_BLOCK_TOP                   = 27;
_TOOLKIT_BLOCK_BOTTOM                = 28;
_TOOLKIT_BLOCK_CENTER                = 29;

// SVG ELEMENT MODES
_TOOLKIT_OUTLINE                     = 40;
_TOOLKIT_FILLED                      = 41;
_TOOLKIT_FULL                        = 42;

// VALUE MODES
_TOOLKIT_PIXEL                       = 50;
_TOOLKIT_PX                          = 50;
_TOOLKIT_PERCENT                     = 51;
_TOOLKIT_PERC                        = 51;
_TOOLKIT_COEF                        = 52;
_TOOLKIT_COEFF                       = 52;
_TOOLKIT_COEFFICIENT                 = 52;

// SCALES
_TOOLKIT_FLAT                        = 90;
_TOOLKIT_LINEAR                      = 90;
_TOOLKIT_LIN                         = 90;

_TOOLKIT_DECIBEL                     = 91;
_TOOLKIT_DB                          = 91;
_TOOLKIT_LOG2_REVERSE                = 91;
_TOOLKIT_LOG2                        = 92;
_TOOLKIT_DB_REVERSE                  = 92;
_TOOLKIT_DECIBEL_REVERSE             = 92;

_TOOLKIT_FREQUENCY                   = 95;
_TOOLKIT_FREQ                        = 95;
_TOOLKIT_FREQ_REVERSE                = 96;
_TOOLKIT_FREQUENCY_REVERSE           = 96;

// FILTERS
_TOOLKIT_PARAMETRIC                  = 60;
_TOOLKIT_PARAM                       = 60;
_TOOLKIT_PEAK                        = 60;
_TOOLKIT_NOTCH                       = 61;
_TOOLKIT_LOWSHELF                    = 62;
_TOOLKIT_LOSHELF                     = 62;
_TOOLKIT_HIGHSHELF                   = 63;
_TOOLKIT_HISHELF                     = 63;
_TOOLKIT_LOWPASS_1                   = 64;
_TOOLKIT_LOWPASS_2                   = 65;
_TOOLKIT_LOWPASS_3                   = 66;
_TOOLKIT_LOWPASS_4                   = 67;
_TOOLKIT_LOPASS_1                    = 64;
_TOOLKIT_LOPASS_2                    = 65;
_TOOLKIT_LOPASS_3                    = 66;
_TOOLKIT_LOPASS_4                    = 67;
_TOOLKIT_LP1                         = 64;
_TOOLKIT_LP2                         = 65;
_TOOLKIT_LP3                         = 66;
_TOOLKIT_LP4                         = 67;
_TOOLKIT_HIGHPASS_1                  = 68;
_TOOLKIT_HIGHPASS_2                  = 69;
_TOOLKIT_HIGHPASS_3                  = 70;
_TOOLKIT_HIGHPASS_4                  = 71;
_TOOLKIT_HIPASS_1                    = 68;
_TOOLKIT_HIPASS_2                    = 69;
_TOOLKIT_HIPASS_3                    = 70;
_TOOLKIT_HIPASS_4                    = 71;
_TOOLKIT_HP1                         = 68;
_TOOLKIT_HP2                         = 69;
_TOOLKIT_HP3                         = 70;
_TOOLKIT_HP4                         = 71;

// CIRULAR POSITIONS
_TOOLKIT_INNER                       = 80;
_TOOLKIT_OUTER                       = 81;

// WINDOWS
_TOOLKIT_TITLE                       = 100;
_TOOLKIT_CLOSE                       = 101;
_TOOLKIT_MAXIMIZE                    = 102;
_TOOLKIT_MAXIMIZE_X                  = 103;
_TOOLKIT_MAXIMIZE_VERT               = 103;
_TOOLKIT_MAXIMIZE_VERTICAL           = 103;
_TOOLKIT_MAXIMIZE_Y                  = 104;
_TOOLKIT_MAXIMIZE_HORIZ              = 104;
_TOOLKIT_MAXIMIZE_HORIZONTAL         = 104;
_TOOLKIT_MAX                         = 102;
_TOOLKIT_MAX_X                       = 103;
_TOOLKIT_MAX_VERT                    = 103;
_TOOLKIT_MAX_VERTICAL                = 103;
_TOOLKIT_MAX_Y                       = 104;
_TOOLKIT_MAX_HORIZ                   = 104;
_TOOLKIT_MAX_HORIZONTAL              = 104;
_TOOLKIT_MINIMIZE                    = 105;
_TOOLKIT_MIN                         = 105;
_TOOLKIT_SHRINK                      = 106;
_TOOLKIT_STATUS                      = 110;
_TOOLKIT_RESIZE                      = 111;
_TOOLKIT_ICON                        = 112;

// UPDATE POLICY
_TOOLKIT_CONTINUOUS                  = 120;
_TOOLKIT_ALWAYS                      = 120;
_TOOLKIT_CONTINUOUSLY                = 120;
_TOOLKIT_COMPLETE                    = 121;
_TOOLKIT_FINISHED                    = 121;
_TOOLKIT_DONE                        = 121;

// ELEMENTS
_TOOLKIT_ICON                        = 130;
_TOOLKIT_LABEL                       = 131;

// DYNAMICS
_TOOLKIT_COMPRESSOR                  = 150;
_TOOLKIT_UPWARD_COMPRESSOR           = 150;
_TOOLKIT_UPWARD_COMP                 = 150;
_TOOLKIT_COMP                        = 150;
_TOOLKIT_UPCOMP                      = 150;
_TOOLKIT_LIMITER                     = 151;
_TOOLKIT_GATE                        = 152;
_TOOLKIT_NOISEGATE                   = 152;
_TOOLKIT_EXPANDER                    = 153;
_TOOLKIT_EXP                         = 153;

// KEYBOARDS
_TOOLKIT_KEYBOARD_MAIN               = 160;
_TOOLKIT_KEYBOARD_NUMPAD             = 161;
_TOOLKIT_KEYBOARD_MIDI               = 162;


// LANGUAGES
_TOOLKIT_LANGUAGE_ENGLISH            = 200;
_TOOLKIT_LANGUAGE_GERMAN             = 201;

// KEYBOARD TEXT BUFFER TYPES
_TOOLKIT_TEXT_INPUT                  = 220;
_TOOLKIT_TEXT_AREA                   = 221;
