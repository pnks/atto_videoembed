<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto mod for Lærit.dk
 *
 * @package    atto_videoembed
 * @copyright  2019 Damian Alarcon
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Enable videoembed plugin button in the files group on installation
 *
 * @return void
 */
function xmldb_atto_videoembed_install() {
    $toolbar = get_config('editor_atto', 'toolbar');
    $found = false;
    if (strpos($toolbar, 'files')) {
        $groups = explode("\n", $toolbar);
        foreach ($groups as $i => $group) {
            $parts = explode('=', $group);
            if (trim($parts[0]) == 'files') {
                $groups[$i] = 'files = videoembed, ' . trim($parts[1]);
                $found = true;
            }
        }
    } else if (strpos($toolbar, 'insert')) {
        // Otherwise put it in the other group.
        foreach ($groups as $i => $group) {
            $parts = explode('=', $group);
            if (trim($parts[0]) == 'insert') {
                $groups[$i] = 'insert = videoembed, ' . trim($parts[1]);
                $found = true;
            }
        }
    } else if (strpos($toolbar, 'other')) {
        // Otherwise put it in the other group.
        foreach ($groups as $i => $group) {
            $parts = explode('=', $group);
            if (trim($parts[0]) == 'other') {
                $groups[$i] = 'other = videoembed, ' . trim($parts[1]);
                $found = true;
            }
        }
    }

    // Update config variable if we managed to insert the icon.
    if ($found) {
        $toolbar = implode("\n", $groups);
        set_config('toolbar', $toolbar, 'editor_atto');
    }
}
