/*eslint no-unused-vars: "off" */
/*eslint no-console: "off" */
/*eslint-env es6*/

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

/**
 * @module moodle-atto_videoembed-button
 */
/**
 * Atto text editor NEWTEMPLATE plugin.
 *
 * @namespace M.atto_videoembed
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_videoembed';
var BUTTON_NAME = 'videoembed';
var CONTROLS = {
    PROVIDER: 'videoembed_provider',
    VIDEOID: 'videoembed_videoid',
    PREVIEW: 'videoembed_preview',
    TESTVIDEO: 'videoembed_testbtn',
    HELPBTN: 'videoembed_helpbtn',
    HEIGHT: 'videoembed_height'
};
var LOGNAME = 'atto_videoembed';
var CSS = {
    INPUTSUBMIT: 'atto_media_urlentrysubmit',
    INPUTCANCEL: 'atto_media_urlentrycancel',
    PREVIEW: 'videoembed_previewdiv',
    HELPTEXT: 'videoembed_helptextdiv',
    CONTROLS : {
        PROVIDER: "vidoembed_provider",
        VIDEOID: "videoembed_videoid",
        PREVIEW: 'videoembed_preview',
        TESTVIDEO: 'videoembed_testbtn',
        HELPBTN: 'videoembed_helpbtn',
        HEIGHT: 'videoembed_height'
    },
    IFRAME: 'videoembed_frame'
};
var TEMPLATE = '' +
    '<form class="atto_form">' +
    '<div id="{{elementid}}_{{innerform}}" class="">' +
    '<label for="{{elementid}}_{{CONTROLS.PROVIDER}}">{{get_string "title_provider" component}}</label>&nbsp;' +
    '<select required class="{{CSS.CONTROLS.PROVIDER}}" id="{{elementid}}_{{CONTROLS.PROVIDER}}" ' +
    'name="{{elementid}}_{{CONTROLS.PROVIDER}}" > ' +
    '<option value="" disabled selected hidden>{{get_string "provider_select" component}}</option>' +
    '<option value="youtube">{{get_string "provider_youtube" component}}</option>' +
    '<option value="vimeo">{{get_string "provider_vimeo" component}}</option>' +
    '</select>' +
    '<br />' +
    '<label for="{{elementid}}_{{CONTROLS.VIDEOID}}">{{get_string "title_videoid" component}}&nbsp;' +
    '<a class="{{CSS.CONTROLS.HELPBTN}} btn btn-link"><i class="icon fa fa-question-circle text-info fa-fw"></i></a>' +
    '</label >' +
    '<input required class="{{CSS.CONTROLS.VIDEOID}}" id="{{elementid}}_{{CONTROLS.VIDEOID}}" ' +
    'name="{{elementid}}_{{CONTROLS.VIDEOID}}" value = "{{videoid}}" /> &nbsp;' +
    '<button class="btn {{CSS.CONTROLS.TESTVIDEO}}">{{get_string "testvideo" component}}</button>' +
    '<br /><br/>' +
    '<div class="card {{CSS.HELPTEXT}} " style="display:none; padding: 5px;">' +
    '<p>{{ get_string "info_videoid_p1" component }} ' +
    '<p>{{ get_string "info_videoid_p2" component }} ' +
    '<br><img src="{{youtube_videoid_imgsrc}}" alt="Youtube video id Url">' +
    '<p>{{ get_string "info_videoid_p3" component }} ' +
    '<br><img src="{{vimeo_videoid_imgsrc}}" alt="Vimeo video id Url">' +
    '<p>{{ get_string "info_videoid_p4" component }} ' +
    '</div > ' +
    '<div class="{{CSS.PREVIEW}}" style="height:200px;">' +
    '<iframe class="{{CSS.CONTROLS.PREVIEW}}" id="{{elementid}}_{{CONTROLS.PREVIEW}}" src="" srcdoc="{{iframe_content}}" ' +
    'width="320" height = "180" frameborder = "0" > {{ get_string "preview_content" component }}</iframe >' +
    '</div> ' +
    '<label for="{{elementid}}_{{CONTROLS.HEIGHT}}">{{get_string "videosize" component}}</label>&nbsp;' +
    '<select required class="{{CSS.CONTROLS.HEIGHT}}" id="{{elementid}}_{{CONTROLS.HEIGHT}}" ' +
    'name="{{elementid}}_{{CONTROLS.PROVIDER}}" > ' +
    '<option value="480" >854 x 480</option>' +
    '<option value="360" selected >640 x 360</option>' +
    '<option value="240" >426 x 240</option>' +
    '<option value="144" >256 x 144</option>' +
    '</select>&nbsp;' +
    '<button disabled class="btn btn-default {{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
    '</div>' +
    '</form>';

var IFRAME_TEMPLATE = '' +
    '<html><body><style>' +
    'html,body { margin: 0px; padding: 0px; overflow:hidden} ' +
    'div.container { position: relative; height: 178px; border-color: #DDDDDD; border-width: 1px; ' +
    'border-style: solid; border-radius: 5px;} ' +
    'div.middle{ font-family: Arial, helvetica, sans - serif; position: absolute; top: 50%; width:100%;'+
    'color: #CCCCCC; text-align: center;}</style > ' +
    '<div class="container"><div class="middle">{{{get_string "iframe_placeholder" component}}}</div>' +
    '</body></html>';


Y.namespace('M.atto_videoembed').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * Add event listeners.
     *
     * @method initializer
     */

    initializer: function() {
        var self = this;
        if (this.get('disabled')) {
            return;
        }

        window.addEventListener("message", function(event){ self._handleMedia(event, self);}, false);

        this.addButton({
            icon: 'videoembed',
            iconComponent: COMPONENTNAME,
            buttonName: BUTTON_NAME,
            callback: this._displayDialogue,
            callbackArgs: BUTTON_NAME

        });
    },

    _displayDialogue: function(e, clickedicon) {
        //proper nocookies link to youtube: '//www.youtube-nocookie.com/embed/'+video_id
        //proper donottrack link for vimeo : '//player.vimeo.com/video/'+video_id+'?dnt=1
        e.preventDefault();
        var width = 480;


        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if (dialogue.width !== width + 'px') {
            dialogue.set('width', width + 'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon);

        var bodycontent = Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },


    /**
    * Return the dialogue content for the tool, attaching any required
    * events.
    *
    * @method _getDialogueContent
    * @return {Node} The content to place in the dialogue.
    * @private
    */
    _getFormContent: function (clickedicon) {

        var iframe_template = Y.Handlebars.compile(IFRAME_TEMPLATE),
            iframe_content = iframe_template({
                elementid: this.get('host').get('elementid'),
                component: COMPONENTNAME
            });

        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                CONTROLS: CONTROLS,
                component: COMPONENTNAME,
                videod: this.get('videoid'),
                provider: this.get('provider'),
                iframe_content: iframe_content,
                youtube_videoid_imgsrc: M.util.image_url('youtube-videoid-url', COMPONENTNAME),
                vimeo_videoid_imgsrc: M.util.image_url('vimeo-videoid-url', COMPONENTNAME)
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        this._form.one('.' + CSS.CONTROLS.TESTVIDEO).on('click', this._testVideo, this);
        this._form.one('.' + CSS.CONTROLS.HELPBTN).on('click', this._displayHelp, this);

        return content;
    },
    /**
    * Load the video to see if it is the correct one
    * @method _buildVideoUrl
    * @private
    */
    _buildVideoUrl: function (provider, video_id) {
        var src = null;

        if (video_id) {
            if (provider === 'youtube') {
                src = '//www.youtube-nocookie.com/embed/' + video_id;

            }
            else if (provider == 'vimeo') {
                src = '//player.vimeo.com/video/' + video_id + '?dnt=1';
            }
        }
        return src;
    },

    /**
    * Load the video to see if it is the correct one
    * @method _testVideo
    * @private
    */
    _testVideo: function (e) {
        e.preventDefault();
        var provider = this._form.one('.' + CSS.CONTROLS.PROVIDER).get('value');
        var video_id = this._form.one('.' + CSS.CONTROLS.VIDEOID).get('value');
        this._form.one('.' + CSS.PREVIEW).show();
        this._form.one('.' + CSS.HELPTEXT).hide();
        var src = this._buildVideoUrl(provider, video_id);
        var previewer = this._form.one('.' + CSS.CONTROLS.PREVIEW);
        if (src) {
            previewer.set("src", src);
            previewer.removeAttribute('srcdoc');

            this._form.one('.' + CSS.INPUTSUBMIT).removeAttribute("disabled");
        }
        else {
            var iframe_template = Y.Handlebars.compile(IFRAME_TEMPLATE),
                iframe_content = iframe_template({
                    elementid: this.get('host').get('elementid'),
                    component: COMPONENTNAME
                });
            previewer.set('srcdoc',iframe_content);

            this._form.one('.' + CSS.INPUTSUBMIT).setAttribute("disabled","disabled");
        }
        return false;
    },
    /**
     * Inserts the users input onto the page
     * @method _doInsert
     * @private
     */
    _doInsert: function (e) {
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var provider = this._form.one('.' + CSS.CONTROLS.PROVIDER).get('value');
        var video_id = this._form.one('.' + CSS.CONTROLS.VIDEOID).get('value');
        var src = this._buildVideoUrl(provider, video_id);

        // If no file is there to insert, don't do it.
        if (!src) {
            Y.log('No valid source url', 'warn', LOGNAME);
            return;
        }

        var height = this._form.one('.' + CSS.CONTROLS.HEIGHT).get('value');
        var width = height * (16.0/9.0);

        var iframehtml = '<iframe data-provider="' + provider + '" data-video_id="' + video_id + '" ' +
            'class="' + CSS.IFRAME + '" src = "' + src + '" ' +
            'width="' + width + '" height="' + height +'" frameborder="0" allowfullscreen ></iframe >';

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(iframehtml);
        this.markUpdated();

    },
    _displayHelp: function (e) {
        this._form.one('.' + CSS.PREVIEW).toggleView();
        this._form.one('.' + CSS.HELPTEXT).toggleView();

    }

}, {
    ATTRS: {
        disabled: {
            value: true
        },
        defaultheight: {
            value: 360
            }
    }
});
