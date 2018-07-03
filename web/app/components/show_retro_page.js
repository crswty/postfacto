/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import { Swipeable } from 'react-touch';

const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');

const RetroColumn = require('./retro_column');
const RetroActionPanel = require('./retro_action_panel');
const RetroWebsocket = require('./retro_websocket');
const RetroFooter = require('./footer');
import { RetroLegalBanner } from './retro_legal_banner';
import RetroHeading from './retro_heading';
import {HotKeys} from 'react-hotkeys';

const EmptyPage = require('./empty_page');
const jQuery = require('jquery');

import { DEFAULT_TOGGLE_STYLE } from '../constants';

class ShowRetroPage extends React.Component {
  static propTypes = {
    retro: types.object,
    retro_archives: types.object,
    retroId: types.string,
    config: types.object.isRequired,
    alert: types.object,
    archives: types.bool.isRequired,
    archiveId: types.string,
    featureFlags: types.object.isRequired,
    dialog: types.shape(
      {
        title: types.string,
        message: types.string,
      }
    ),
  };

  // Component Lifecycle

  constructor(props, context) {
    super(props, context);
    this.moveToNextItemKey= this.moveToNextItemKey.bind(this);
    this.moveToNextItemTouch = this.moveToNextItemTouch.bind(this);
    this.state = {
      isMobile: false,
      currentMobileCategory: 'happy',
      filtered_retro_archive: {}
    };
  }

  componentWillMount() {
    this.fetchRetros(this.props);
    this.initializeArchivesState(this.props);
    this.handleResize();
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.archives !== nextProps.archives) {
      this.fetchRetros(nextProps);
    }
    this.initializeArchivesState(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  // Calculate if mobile

  handleResize() {
    this.setState({isMobile: this.getIsMobile()});
  }

  getIsMobile() {
    return window.innerWidth < 640;
  }

  // Fetch Retro or archive data

  fetchRetros(props) {
    const {retroId, archives, archiveId} = props;
    if (archives) {
      Actions.getRetroArchive({retro_id: retroId, archive_id: archiveId});
    } else {
      Actions.getRetro({id: retroId});
    }
  }

  // Filter archive data
  initializeArchivesState(props) {
    const {retro_archives, archives} = props;
    if (archives) {
      this.setState({filtered_retro_archive: this.filterRetroArchives(retro_archives)});
    }
  }

  filterRetroArchives(retro) {
    let archivesTimestamps = new Set();
    this.getArchivesTimestamps(archivesTimestamps, retro.items);
    this.getArchivesTimestamps(archivesTimestamps, retro.action_items);
    let orderedArchivesTimestamps = Array.from(archivesTimestamps).sort(function (a, b) {
      return new Date(b) - new Date(a);
    });
    if (orderedArchivesTimestamps.length > 0) {
      let filteredRetro = retro;
      filteredRetro.items = this.filterItemByTimestamp(retro.items, orderedArchivesTimestamps[0]);
      filteredRetro.action_items = this.filterItemByTimestamp(retro.action_items, orderedArchivesTimestamps[0]);
      return filteredRetro;
    }
    return retro;
  }

  filterItemByTimestamp(items, timestamp) {
    return jQuery.grep(items, function (item) {
      return item.archived_at === timestamp;
    });
  }

  moveToNextItemKey(event) {
    if(event.target.type === "textarea") {
      return;
    }
    const {retroId} = this.props;
    Actions.nextRetroItem({retro_id: retroId});
  }

  moveToNextItemTouch() {
    const {retroId} = this.props;
    Actions.nextRetroItem({retro_id: retroId});
  }

  getArchivesTimestamps(archivesTimestamps, items) {
    jQuery.each(items, function (_, item) {
      archivesTimestamps.add(item.archived_at);
    });
  }

  // Handle events
  onMobileTabClick(category) {
    this.setState({currentMobileCategory: category});
  }

  onArchivesButtonClicked() {
    const {retroId} = this.props;
    Actions.routeToRetroArchives({retro_id: retroId});
  }

  handleArchiveRetroConfirmation() {

    Actions.archiveRetro({retro: this.props.retro});
    Actions.hideDialog();
  }



    handleArchiveEmailPreferenceChange(e) {
        Actions.toggleSendArchiveEmail({ currentSendArchiveEmail: this.props.retro.send_archive_email });
    };

  renderColumnMobile(retro) {
    const {archives, retroId} = this.props;
    const {currentMobileCategory, isMobile} = this.state;

    if (currentMobileCategory === 'action') {
      return (<RetroActionPanel
        retro={retro}
        retroId={retroId}
        isMobile={isMobile}
        archives={archives}/>);
    }
    return (
      <RetroColumn category={currentMobileCategory}
                   retro={retro}
                   retroId={retroId}
                   archives={archives}
                   isMobile={isMobile}/>
    );
  }

    renderArchiveConfirmationDialog() {

    const title = this.props.dialog ? this.props.dialog.title : '';
    const message = this.props.dialog ? this.props.dialog.message : '';
    const toggle = DEFAULT_TOGGLE_STYLE;

    const archiveButton = (
      <button className="archive-dialog__actions--archive"
              onTouchTap={this.handleArchiveRetroConfirmation.bind(this)}>
        {this.props.retro.send_archive_email && this.props.featureFlags.archiveEmails ? 'Archive & send email' : 'Archive'}
      </button>
    );

    const cancelButton = (
      <button className="archive-dialog__actions--cancel"
              onTouchTap={Actions.hideDialog}>
        Cancel
      </button>
    );

        return (
            <Dialog title={title}
                    actions={[cancelButton, archiveButton]}
                    open={!!this.props.dialog}
                    onRequestClose={Actions.hideDialog}
                    actionsContainerClassName="archive-dialog__actions"
                    contentClassName="archive-dialog">
                <p>{message}</p>
                {
                this.props.featureFlags.archiveEmails ?<p>
                    <label className="label" htmlFor="send_archive_email">Send action items to the team via
                        email?</label>

                    <Toggle
                        id="send_archive_email"
                        name="sendArchiveEmail"
                        label={this.props.retro.send_archive_email ? 'Yes' : 'No'}
                        toggled={this.props.retro.send_archive_email}
                        labelPosition="right"
                        onToggle={this.handleArchiveEmailPreferenceChange.bind(this)}
                        trackStyle={toggle.trackStyle}
                        trackSwitchedStyle={toggle.trackSwitchedStyle}
                        labelStyle={toggle.labelStyle}
                        thumbStyle={toggle.thumbStyle}
                        thumbSwitchedStyle={toggle.thumbSwitchedStyle}
                        iconStyle={toggle.iconStyle}
                    />
                </p>:
                  null
              }
            </Dialog>
        );
    }

  renderMobile(retro) {
    const {config: {websocket_url}, retroId, archives} = this.props;
    return (
      <Swipeable onSwipeLeft={this.moveToNextItemTouch}>
      <span>
                <RetroWebsocket url={websocket_url} retro_id={retroId}/>
        {this.renderArchiveConfirmationDialog()}
        <div className={archives ? 'mobile-display archived' : 'mobile-display'}>

          <RetroLegalBanner retro={retro}/>

          <RetroHeading retro={retro} retroId={retroId} isMobile={this.state.isMobile} archives={archives}/>

          <div className="mobile-tabs">
                        <div className="mobile-tabs-list">
                            <div className="mobile-tab-happy"
                                 onClick={() => this.onMobileTabClick('happy')}>Happy</div>
                            <div className="mobile-tab-meh"
                                 onClick={() => this.onMobileTabClick('meh')}>Meh</div>
                            <div className="mobile-tab-sad"
                                 onClick={() => this.onMobileTabClick('sad')}>Sad</div>
                            <div className="mobile-tab-action"
                                 onClick={() => this.onMobileTabClick('action')}>Action</div>
                        </div>
                    </div>
          {
            this.renderColumnMobile(retro)
          }
          <RetroFooter/>
                </div>
              </span>
            </Swipeable>
            );
  }

    renderDesktop(retro) {
        const {config: {websocket_url}, retroId, archives} = this.props;
        const {isMobile} = this.state;
        let retroContainerClasses = 'full-height full-height-retro';

        if (archives) {
            retroContainerClasses += ' archived';
        }

        const keyMap = {
            'next': 'right'
        };

        const keyHandlers = {
            'next': this.moveToNextItemKey
        };

        return (
            <HotKeys keyMap={keyMap} handlers={keyHandlers}>
                <span>
                  <RetroWebsocket url={websocket_url} retro_id={retroId}/>
                    {this.renderArchiveConfirmationDialog()}
                    <div className={retroContainerClasses}>

                    <RetroLegalBanner retro={retro}/>

                    <RetroHeading retro={retro} retroId={retroId} isMobile={this.state.isMobile} archives={archives}
                                  showVideoButton={!archives}/>
                    <div className="retro-item-list">
                      <RetroColumn category="happy"
                                   retro={retro}
                                   retroId={retroId}
                                   archives={archives}
                                   isMobile={isMobile}/>
                      <RetroColumn category="meh"
                                   retro={retro}
                                   retroId={retroId}
                                   archives={archives}
                                   isMobile={isMobile}/>
                      <RetroColumn category="sad"
                                   retro={retro}
                                   retroId={retroId}
                                   archives={archives}
                                   isMobile={isMobile}/>
                    </div>
                    <RetroActionPanel
                        retro={retro}
                        retroId={retroId}
                        isMobile={isMobile}
                        archives={archives}/>
                    <RetroFooter/>
                  </div>
                </span>
            </HotKeys>
        );
    }

  render() {
    const {retro, archives} = this.props;
    const {isMobile, filtered_retro_archive} = this.state;
    let retro_object = archives ? filtered_retro_archive : retro;
    if (!(retro_object && retro_object.id)) {
      return (<EmptyPage/>);
    }
    if (isMobile) {
      return this.renderMobile(retro_object);
    }
    return this.renderDesktop(retro_object);
  }
}

module.exports = ShowRetroPage;

