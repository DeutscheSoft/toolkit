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
_TOOLKIT_TOP                         = 0x00000000;
_TOOLKIT_RIGHT                       = 0x00000001;
_TOOLKIT_BOTTOM                      = 0x00000002;
_TOOLKIT_LEFT                        = 0x00000003;
_TOOLKIT_TOP_LEFT                    = 0x00000004;
_TOOLKIT_TOP_RIGHT                   = 0x00000005;
_TOOLKIT_BOTTOM_RIGHT                = 0x00000006;
_TOOLKIT_BOTTOM_LEFT                 = 0x00000007;
_TOOLKIT_CENTER                      = 0x00000008;

// DIRECTIONS
_TOOLKIT_N                           = 0x00000000;
_TOOLKIT_UP                          = 0x00000000;
_TOOLKIT_E                           = 0x00000001;
_TOOLKIT_S                           = 0x00000002;
_TOOLKIT_DOWN                        = 0x00000002;
_TOOLKIT_W                           = 0x00000003;
_TOOLKIT_NW                          = 0x00000004;
_TOOLKIT_NE                          = 0x00000005;
_TOOLKIT_SE                          = 0x00000006;
_TOOLKIT_SW                          = 0x00000007;
_TOOLKIT_C                           = 0x00000008;

_TOOLKIT_HORIZONTAL                  = 0x00010000;
_TOOLKIT_HORIZ                       = 0x00010000;
_TOOLKIT_VERTICAL                    = 0x00010001;
_TOOLKIT_VERT                        = 0x00010001;

_TOOLKIT_X                           = 0x00010000;
_TOOLKIT_Y                           = 0x00010001;

_TOOLKIT_POLAR                       = 0x00010002;

// DRAWING MODES
_TOOLKIT_CIRCULAR                    = 0x00020000;
_TOOLKIT_CIRC                        = 0x00020000;
_TOOLKIT_LINE                        = 0x00020001;
_TOOLKIT_BLOCK                       = 0x00020002;
_TOOLKIT_LINE_HORIZONTAL             = 0x00020003;
_TOOLKIT_LINE_HORIZ                  = 0x00020003;
_TOOLKIT_LINE_VERTICAL               = 0x00020004;
_TOOLKIT_LINE_VERT                   = 0x00020004;
_TOOLKIT_LINE_X                      = 0x00020003;
_TOOLKIT_LINE_Y                      = 0x00020004;
_TOOLKIT_BLOCK_LEFT                  = 0x00020005;
_TOOLKIT_BLOCK_RIGHT                 = 0x00020006;
_TOOLKIT_BLOCK_TOP                   = 0x00020007;
_TOOLKIT_BLOCK_BOTTOM                = 0x00020008;
_TOOLKIT_BLOCK_CENTER                = 0x00020009;

// SVG ELEMENT MODES
_TOOLKIT_OUTLINE                     = 0x00030000;
_TOOLKIT_FILLED                      = 0x00030001;
_TOOLKIT_FULL                        = 0x00030002;

// VALUE MODES
_TOOLKIT_PIXEL                       = 0x00040000;
_TOOLKIT_PX                          = 0x00040000;
_TOOLKIT_PERCENT                     = 0x00040001;
_TOOLKIT_PERC                        = 0x00040001;
_TOOLKIT_COEF                        = 0x00040002;
_TOOLKIT_COEFF                       = 0x00040002;
_TOOLKIT_COEFFICIENT                 = 0x00040002;

// SCALES
_TOOLKIT_FLAT                        = 0x00050000;
_TOOLKIT_LINEAR                      = 0x00050000;
_TOOLKIT_LIN                         = 0x00050000;

_TOOLKIT_DECIBEL                     = 0x00050001;
_TOOLKIT_DB                          = 0x00050001;
_TOOLKIT_LOG2_REVERSE                = 0x00050001;
_TOOLKIT_LOG2                        = 0x00050002;
_TOOLKIT_DB_REVERSE                  = 0x00050002;
_TOOLKIT_DECIBEL_REVERSE             = 0x00050002;

_TOOLKIT_FREQUENCY                   = 0x00050005;
_TOOLKIT_FREQ                        = 0x00050005;
_TOOLKIT_FREQ_REVERSE                = 0x00050006;
_TOOLKIT_FREQUENCY_REVERSE           = 0x00050006;

// FILTERS
_TOOLKIT_PARAMETRIC                  = 0x00060000;
_TOOLKIT_PARAM                       = 0x00060000;
_TOOLKIT_PEAK                        = 0x00060000;
_TOOLKIT_NOTCH                       = 0x00060001;
_TOOLKIT_LOWSHELF                    = 0x00060002;
_TOOLKIT_LOSHELF                     = 0x00060002;
_TOOLKIT_HIGHSHELF                   = 0x00060003;
_TOOLKIT_HISHELF                     = 0x00060003;
_TOOLKIT_LOWPASS_1                   = 0x00060004;
_TOOLKIT_LOWPASS_2                   = 0x00060005;
_TOOLKIT_LOWPASS_3                   = 0x00060006;
_TOOLKIT_LOWPASS_4                   = 0x00060007;
_TOOLKIT_LOPASS_1                    = 0x00060004;
_TOOLKIT_LOPASS_2                    = 0x00060005;
_TOOLKIT_LOPASS_3                    = 0x00060006;
_TOOLKIT_LOPASS_4                    = 0x00060007;
_TOOLKIT_LP1                         = 0x00060004;
_TOOLKIT_LP2                         = 0x00060005;
_TOOLKIT_LP3                         = 0x00060006;
_TOOLKIT_LP4                         = 0x00060007;
_TOOLKIT_HIGHPASS_1                  = 0x00060008;
_TOOLKIT_HIGHPASS_2                  = 0x00060009;
_TOOLKIT_HIGHPASS_3                  = 0x0006000a;
_TOOLKIT_HIGHPASS_4                  = 0x0006000b;
_TOOLKIT_HIPASS_1                    = 0x00060008;
_TOOLKIT_HIPASS_2                    = 0x00060009;
_TOOLKIT_HIPASS_3                    = 0x0006000a;
_TOOLKIT_HIPASS_4                    = 0x0006000b;
_TOOLKIT_HP1                         = 0x00060008;
_TOOLKIT_HP2                         = 0x00060009;
_TOOLKIT_HP3                         = 0x0006000a;
_TOOLKIT_HP4                         = 0x0006000b;

// CIRULAR POSITIONS
_TOOLKIT_INNER                       = 0x00080000;
_TOOLKIT_OUTER                       = 0x00080001;

// WINDOWS
_TOOLKIT_TITLE                       = 0x00090000;
_TOOLKIT_CLOSE                       = 0x00090001;
_TOOLKIT_MAX                         = 0x00090002;
_TOOLKIT_MAXIMIZE                    = 0x00090002;
_TOOLKIT_MAX_X                       = 0x00090004;
_TOOLKIT_MAX_HORIZ                   = 0x00090004;
_TOOLKIT_MAX_HORIZONTAL              = 0x00090004;
_TOOLKIT_MAXIMIZE_X                  = 0x00090004;
_TOOLKIT_MAXIMIZE_HORIZ              = 0x00090004;
_TOOLKIT_MAXIMIZE_HORIZONTAL         = 0x00090004;
_TOOLKIT_MAX_Y                       = 0x00090003;
_TOOLKIT_MAX_VERT                    = 0x00090003;
_TOOLKIT_MAX_VERTICAL                = 0x00090003;
_TOOLKIT_MAXIMIZE_Y                  = 0x00090003;
_TOOLKIT_MAXIMIZE_VERT               = 0x00090003;
_TOOLKIT_MAXIMIZE_VERTICAL           = 0x00090003;
_TOOLKIT_MINIMIZE                    = 0x00090005;
_TOOLKIT_MIN                         = 0x00090005;
_TOOLKIT_SHRINK                      = 0x00090006;
_TOOLKIT_STATUS                      = 0x000a0000;
_TOOLKIT_RESIZE                      = 0x000a0001;
_TOOLKIT_ICON                        = 0x000a0002;

// UPDATE POLICY
_TOOLKIT_CONTINUOUS                  = 0x000b0000;
_TOOLKIT_ALWAYS                      = 0x000b0000;
_TOOLKIT_CONTINUOUSLY                = 0x000b0000;
_TOOLKIT_COMPLETE                    = 0x000b0001;
_TOOLKIT_FINISHED                    = 0x000b0001;
_TOOLKIT_DONE                        = 0x000b0001;

// ELEMENTS
_TOOLKIT_ICON                        = 0x000c0000;
_TOOLKIT_LABEL                       = 0x000c0001;

// DYNAMICS
_TOOLKIT_COMPRESSOR                  = 0x000d0000;
_TOOLKIT_UPWARD_COMPRESSOR           = 0x000d0000;
_TOOLKIT_UPWARD_COMP                 = 0x000d0000;
_TOOLKIT_COMP                        = 0x000d0000;
_TOOLKIT_UPCOMP                      = 0x000d0000;
_TOOLKIT_LIMITER                     = 0x000d0001;
_TOOLKIT_GATE                        = 0x000d0002;
_TOOLKIT_NOISEGATE                   = 0x000d0002;
_TOOLKIT_EXPANDER                    = 0x000d0003;
_TOOLKIT_EXP                         = 0x000d0003;

// KEYBOARDS
_TOOLKIT_KEYBOARD_MAIN               = 0x000e0000;
_TOOLKIT_KEYBOARD_NUMPAD             = 0x000e0001;
_TOOLKIT_KEYBOARD_MIDI               = 0x000e0002;


// LANGUAGES
_TOOLKIT_LANGUAGE_ENGLISH            = 0x000f0000;
_TOOLKIT_LANGUAGE_GERMAN             = 0x000f0001;

// KEYBOARD TEXT BUFFER TYPES
_TOOLKIT_TEXT_INPUT                  = 0x00100000;
_TOOLKIT_TEXT_AREA                   = 0x00100001;
