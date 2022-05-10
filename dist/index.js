function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRedux = require('react-redux');
var react = require('redux-persist/integration/react');
var sip_js = require('sip.js');
var reduxDevtoolsExtension = require('redux-devtools-extension');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var reduxPersist = require('redux-persist');
var storage = _interopDefault(require('redux-persist/lib/storage'));

var AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED';
var AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED';
var REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED';
var REMOTE_AUDIO_FAIL = 'REMOTE_AUDIO_FAIL';
var LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED';
var SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT';
var SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT';
var AUDIO_SINKID_NOT_ALLOWED = 'AUDIO_SINKID_NOT_ALLOWED';
var getInputAudioDevices = function getInputAudioDevices() {
  var inputArray = [];
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind === 'audioinput') {
        inputArray.push(device);
      }
    });
  });
  return {
    type: AUDIO_INPUT_DEVICES_DETECTED,
    payload: inputArray
  };
};
var getOutputAudioDevices = function getOutputAudioDevices() {
  var outputArray = [];
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind === 'audiooutput') {
        outputArray.push(device);
      }
    });
  });
  return {
    type: AUDIO_OUTPUT_DEVICES_DETECTED,
    payload: outputArray
  };
};

var NEW_SESSION = 'NEW_SESSION';
var NEW_ATTENDED_TRANSFER = 'NEW_ATTENDED_TRANSFER';
var INCOMING_CALL = 'INCOMING_CALL';
var ACCEPT_CALL = 'ACCEPT_CALL';
var DECLINE_CALL = 'DECLINE_CALL';
var SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE';
var CLOSE_SESSION = 'CLOSE_SESSION';
var SIPSESSION_HOLD_REQUEST = 'SIPSESSION_HOLD_REQUEST';
var SIPSESSION_HOLD_FAIL = 'SIPSESSION_HOLD_FAIL';
var SIPSESSION_UNHOLD_REQUEST = 'SIPSESSION_UNHOLD_REQUEST';
var SIPSESSION_ATTENDED_TRANSFER_CANCEL = 'SIPSESSION_ATTENDED_TRANSFER_CANCEL';
var SIPSESSION_ATTENDED_TRANSFER_FAIL = 'SIPSESSION_ATTENDED_TRANSFER_FAIL';
var acceptCall = function acceptCall(session) {
  return {
    type: ACCEPT_CALL,
    payload: session
  };
};
var declineCall = function declineCall(session) {
  return {
    type: DECLINE_CALL,
    payload: session
  };
};
var endCall = function endCall(sessionId) {
  return {
    type: CLOSE_SESSION,
    payload: sessionId
  };
};
var holdCallRequest = function holdCallRequest(session) {
  return function (dispatch) {
    if (!session.sessionDescriptionHandler || session.state !== sip_js.SessionState.Established) {
      return {
        type: SIPSESSION_HOLD_FAIL
      };
    }

    try {
      session.invite({
        sessionDescriptionHandlerModifiers: [session.sessionDescriptionHandler.holdModifier]
      });
      dispatch({
        type: SIPSESSION_HOLD_REQUEST,
        payload: session.id
      });
    } catch (err) {
      dispatch({
        type: SIPSESSION_HOLD_FAIL
      });
    }

    return;
  };
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var NEW_USERAGENT = 'NEW_USERAGENT';
var NEW_ACCOUNT = 'NEW_ACCOUNT';
var setNewAccount = function setNewAccount(account) {
  return {
    type: NEW_ACCOUNT,
    payload: account
  };
};

var SET_CREDENTIALS = 'SET_CREDENTIALS';
var SET_PHONE_CONFIG = 'SET_PHONE_CONFIG';
var SET_APP_CONFIG = 'SET_APP_CONFIG';
var STRICT_MODE_SHOW_CALL_BUTTON = 'STRICT_MODE_SHOW_CALL_BUTTON';
var STRICT_MODE_HIDE_CALL_BUTTON = 'STRICT_MODE_HIDE_CALL_BUTTON';
var SESSIONS_LIMIT_REACHED = 'SESSIONS_LIMIT_REACHED';
var setCredentials = function setCredentials(uri, password) {
  if (uri === void 0) {
    uri = '';
  }

  if (password === void 0) {
    password = '';
  }

  return {
    type: SET_CREDENTIALS,
    payload: {
      uri: uri,
      password: password
    }
  };
};
var setPhoneConfig = function setPhoneConfig(config) {
  return {
    type: SET_PHONE_CONFIG,
    payload: config
  };
};
var setAppConfig = function setAppConfig(config) {
  return {
    type: SET_APP_CONFIG,
    payload: config
  };
};

var holdAll = function holdAll(id) {
  var state = phoneStore.getState();
  var onHolds = state.sipSessions.onHold;
  var sessions = state.sipSessions.sessions;

  for (var _i = 0, _Object$entries = Object.entries(sessions); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
        sessionId = _Object$entries$_i[0],
        session = _Object$entries$_i[1];

    if (onHolds.indexOf(sessionId) < 0 && sessionId !== id) {
      try {
        holdCallRequest(session);
        phoneStore.dispatch({
          type: SIPSESSION_HOLD_REQUEST,
          payload: session.id
        });
        return;
      } catch (err) {
        return;
      }
    }
  }
};

var setRemoteAudio = function setRemoteAudio(session) {
  console.log('setRemoteAudio');
  var state = phoneStore.getState();
  var deviceId = state.device.primaryAudioOutput;
  var mediaElement = document.getElementById(session.id);
  var remoteStream = new MediaStream();
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function (receiver) {
    if (receiver.track.kind === 'audio') {
      remoteStream.addTrack(receiver.track);
    }
  });

  if (mediaElement && typeof mediaElement.sinkId === 'undefined') {
    console.log('safari');
    phoneStore.dispatch({
      type: AUDIO_SINKID_NOT_ALLOWED
    });
    mediaElement.srcObject = remoteStream;
    mediaElement.play();
  } else if (mediaElement && typeof mediaElement.sinkId !== 'undefined') {
    mediaElement.setSinkId(deviceId).then(function () {
      mediaElement.srcObject = remoteStream;
      mediaElement.play();
    });
  } else {
    phoneStore.dispatch({
      type: REMOTE_AUDIO_FAIL
    });
  }

  phoneStore.dispatch({
    type: REMOTE_AUDIO_CONNECTED
  });
};
var setLocalAudio = function setLocalAudio(session) {
  var state = phoneStore.getState();
  var deviceId = state.device.primaryAudioInput;
  session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
    if (sender.track && sender.track.kind === 'audio') {
      var audioDeviceId = deviceId;
      navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: audioDeviceId
        }
      }).then(function (stream) {
        var audioTrack = stream.getAudioTracks();

        if (audioTrack) {
          sender.replaceTrack(audioTrack[0]);
        }
      });
    }
  });
  phoneStore.dispatch({
    type: LOCAL_AUDIO_CONNECTED
  });
};
var cleanupMedia = function cleanupMedia(sessionId) {
  var mediaElement = document.getElementById(sessionId);

  if (mediaElement) {
    mediaElement.srcObject = null;
    mediaElement.pause();
  }
};

var Tone = require('tone');
var Synth = Tone.PolySynth && new Tone.PolySynth(2, Tone.Synth);
var FMSynth = Tone.PolySynth && new Tone.PolySynth(2, Tone.FMSynth);

var ToneManager = /*#__PURE__*/function () {
  function ToneManager() {}

  var _proto = ToneManager.prototype;

  _proto.playRing = function playRing(type) {
    return;
  };

  _proto.stopAll = function stopAll() {
    return;
  };

  return ToneManager;
}();

var toneManager = new ToneManager();

var SessionStateHandler = function SessionStateHandler(session, ua) {
  var _this = this;

  this.stateChange = function (newState) {
    switch (newState) {
      case sip_js.SessionState.Establishing:
        holdAll(_this.session.id);
        toneManager.playRing('ringback');
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        var myTransport = _this.ua.transport;
        myTransport.on('message', function (message) {
          if (message.includes('BYE ') && message.indexOf('BYE ') === 0) {
            if (_this.session.state === 'Establishing') {
              console.log(message + " session has recieved a BYE message when the session state is establishing");

              _this.session.cancel();

              _this.session.dispose();

              setTimeout(function () {
                phoneStore.dispatch({
                  type: CLOSE_SESSION,
                  payload: _this.session.id
                });
                toneManager.stopAll();
                phoneStore.dispatch({
                  type: STRICT_MODE_SHOW_CALL_BUTTON
                });
              }, 5000);
              return;
            } else {
              return;
            }
          }
        });
        break;

      case sip_js.SessionState.Established:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        toneManager.stopAll();
        setLocalAudio(_this.session);
        setRemoteAudio(_this.session);
        break;

      case sip_js.SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        toneManager.stopAll();
        cleanupMedia(_this.session.id);
        break;

      case sip_js.SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        setTimeout(function () {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: _this.session.id
          });
          toneManager.stopAll();
          phoneStore.dispatch({
            type: STRICT_MODE_SHOW_CALL_BUTTON
          });
        }, 5000);
        break;

      default:
        console.log("Unknown session state change: " + newState);
        break;
    }
  };

  this.session = session;
  this.ua = ua;
};
var getFullNumber = function getFullNumber(number) {
  if (number.length < 10) {
    return number;
  }

  var fullNumber = "+" + phoneStore.getState().sipAccounts.sipAccount._config.defaultCountryCode + number;

  if (number.includes('+') && number.length === 10) {
    fullNumber = "" + number;
  }

  console.log(fullNumber);
  return fullNumber;
};

var IncomingSessionStateHandler = function IncomingSessionStateHandler(incomingSession) {
  var _this = this;

  this.stateChange = function (newState) {
    switch (newState) {
      case sip_js.SessionState.Establishing:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        break;

      case sip_js.SessionState.Established:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        holdAll(_this.incomingSession.id);
        setLocalAudio(_this.incomingSession);
        setRemoteAudio(_this.incomingSession);
        break;

      case sip_js.SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        cleanupMedia(_this.incomingSession.id);
        break;

      case sip_js.SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        setTimeout(function () {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: _this.incomingSession.id
          });
        }, 5000);
        break;

      default:
        console.log("Unknown session state change: " + newState);
        break;
    }
  };

  this.incomingSession = incomingSession;
};

var SIPAccount = /*#__PURE__*/function () {
  function SIPAccount(sipConfig, sipCredentials) {
    var _this = this;

    this._config = sipConfig;
    this._credentials = sipCredentials;
    var uri = sip_js.UserAgent.makeURI('sip:' + sipCredentials.sipuri);

    if (!uri) {
      throw new Error('Failed to create URI');
    }

    var transportOptions = {
      server: sipConfig.websocket
    };
    var userAgentOptions = {
      autoStart: false,
      autoStop: true,
      noAnswerTimeout: sipConfig.noAnswerTimeout || 30,
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
      authorizationPassword: sipCredentials.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions: transportOptions,
      uri: uri,
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: {
            deviceId: 'default'
          },
          video: false
        },
        alwaysAcquireMediaFirst: true,
        iceCheckingTimeout: 500
      }
    };
    var registererOptions = {
      expires: 300,
      logConfiguration: process.env.NODE_ENV !== 'production'
    };
    this._userAgent = new sip_js.UserAgent(userAgentOptions);
    this._registerer = new sip_js.Registerer(this._userAgent, registererOptions);
    this.setupDelegate();

    this._userAgent.start().then(function () {
      _this._registerer.register();

      _this.setupRegistererListener();

      phoneStore.dispatch({
        type: NEW_USERAGENT,
        payload: _this._userAgent
      });
    });
  }

  var _proto = SIPAccount.prototype;

  _proto.setupDelegate = function setupDelegate() {
    this._userAgent.delegate = {
      onInvite: function onInvite(invitation) {
        var incomingSession = invitation;
        incomingSession.delegate = {
          onRefer: function onRefer(referral) {
            console.log(referral);
          }
        };
        phoneStore.dispatch({
          type: INCOMING_CALL,
          payload: incomingSession
        });
        var stateHandler = new IncomingSessionStateHandler(incomingSession);
        incomingSession.stateChange.addListener(stateHandler.stateChange);
      }
    };
  };

  _proto.setupRegistererListener = function setupRegistererListener() {
    this._registerer.stateChange.addListener(function (newState) {
      switch (newState) {
        case sip_js.RegistererState.Initial:
          console.log('The user registration has initialized  ');
          break;

        case sip_js.RegistererState.Registered:
          console.log('The user is registered ');
          break;

        case sip_js.RegistererState.Unregistered:
          console.log('The user is unregistered ');
          break;

        case sip_js.RegistererState.Terminated:
          console.log('The user is terminated ');
          break;
      }
    });
  };

  _proto.makeCall = function makeCall(number) {
    var state = phoneStore.getState();
    var sessionsLimit = state.config.phoneConfig.sessionsLimit;
    var sessionsActiveObject = state.sipSessions.sessions;
    var strictMode = state.config.appConfig.mode;
    var attendedTransfersActive = state.sipSessions.attendedTransfers.length;
    var sessionsActive = Object.keys(sessionsActiveObject).length;
    var sessionDiff = sessionsActive - attendedTransfersActive;

    if (sessionDiff >= sessionsLimit) {
      phoneStore.dispatch({
        type: SESSIONS_LIMIT_REACHED
      });
    } else {
      var target = sip_js.UserAgent.makeURI("sip:" + getFullNumber(number) + "@" + this._credentials.sipuri.split('@')[1] + ";user=phone");

      if (strictMode === 'strict') {
        phoneStore.dispatch({
          type: STRICT_MODE_HIDE_CALL_BUTTON
        });
      }

      if (target) {
        console.log("Calling " + number);
        var inviter = new sip_js.Inviter(this._userAgent, target);
        var outgoingSession = inviter;
        outgoingSession.delegate = {
          onRefer: function onRefer(referral) {
            console.log('Referred: ' + referral);
          }
        };
        phoneStore.dispatch({
          type: NEW_SESSION,
          payload: outgoingSession
        });
        var stateHandler = new SessionStateHandler(outgoingSession, this._userAgent);
        outgoingSession.stateChange.addListener(stateHandler.stateChange);
        outgoingSession.invite().then(function () {
          console.log('Invite sent!');
        })["catch"](function (error) {
          console.log(error);
        });
      } else {
        console.log("Failed to establish outgoing call session to " + number);
      }
    }
  };

  _proto.listener = function listener() {};

  return SIPAccount;
}();

var SipWrapper = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(SipWrapper, _React$Component);

  function SipWrapper() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = SipWrapper.prototype;

  _proto.componentDidMount = function componentDidMount() {
    console.log('mounted');

    if (this.props.sipCredentials.password) {
      this.initializeSip();
    }
  };

  _proto.initializeSip = function initializeSip() {
    var account = new SIPAccount(this.props.sipConfig, this.props.sipCredentials);
    this.props.setNewAccount(account);
    this.props.setPhoneConfig(this.props.phoneConfig);
    this.props.setAppConfig(this.props.appConfig);
  };

  _proto.render = function render() {
    return React.createElement(React.Fragment, null, this.props.children);
  };

  return SipWrapper;
}(React.Component);

var mapStateToProps = function mapStateToProps() {
  return {};
};

var actions = {
  setNewAccount: setNewAccount,
  setPhoneConfig: setPhoneConfig,
  setCredentials: setCredentials,
  setAppConfig: setAppConfig
};
var SipWrapper$1 = reactRedux.connect(mapStateToProps, actions)(SipWrapper);

var sipSessions = function sipSessions(state, action) {
  var _extends2, _extends3, _extends4;

  if (state === void 0) {
    state = {
      sessions: {},
      incomingCalls: [],
      stateChanged: 0,
      onHold: [],
      attendedTransfers: []
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call');
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends2 = {}, _extends2[payload.id] = payload, _extends2)),
        incomingCalls: [].concat(state.incomingCalls, [payload.id])
      });

    case NEW_SESSION:
      console.log('New session added');
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends3 = {}, _extends3[payload.id] = payload, _extends3))
      });

    case NEW_ATTENDED_TRANSFER:
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends4 = {}, _extends4[payload.id] = payload, _extends4)),
        attendedTransfers: [].concat(state.attendedTransfers, [payload.id])
      });

    case SIPSESSION_ATTENDED_TRANSFER_CANCEL:
    case SIPSESSION_ATTENDED_TRANSFER_FAIL:
      {
        var newAttendedTransfers = [].concat(state.attendedTransfers).filter(function (id) {
          return id !== payload.id;
        });
        return _extends(_extends({}, state), {}, {
          attendedTransfers: newAttendedTransfers
        });
      }

    case ACCEPT_CALL:
      {
        var acceptedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload.id;
        });
        return _extends(_extends({}, state), {}, {
          incomingCalls: acceptedIncoming
        });
      }

    case DECLINE_CALL:
      {
        var declinedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload.id;
        });

        var declinedSessions = _extends({}, state.sessions);

        delete declinedSessions[payload.id];
        return _extends(_extends({}, state), {}, {
          incomingCalls: declinedIncoming,
          sessions: declinedSessions
        });
      }

    case SIPSESSION_STATECHANGE:
      {
        return _extends(_extends({}, state), {}, {
          stateChanged: state.stateChanged + 1
        });
      }

    case CLOSE_SESSION:
      {
        var closedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload;
        });

        var newSessions = _extends({}, state.sessions);

        delete newSessions[payload];
        var endHold = [].concat(state.onHold).filter(function (id) {
          return id !== payload;
        });
        return _extends(_extends({}, state), {}, {
          sessions: newSessions,
          incomingCalls: closedIncoming,
          onHold: endHold
        });
      }

    case SIPSESSION_HOLD_REQUEST:
      {
        return _extends(_extends({}, state), {}, {
          onHold: [].concat(state.onHold, [payload])
        });
      }

    case SIPSESSION_UNHOLD_REQUEST:
      {
        var newHold = [].concat(state.onHold).filter(function (id) {
          return id !== payload;
        });
        return _extends(_extends({}, state), {}, {
          onHold: newHold
        });
      }

    default:
      return state;
  }
};

var sipAccounts = function sipAccounts(state, action) {
  if (state === void 0) {
    state = {
      sipAccount: null,
      userAgent: null,
      status: ''
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case NEW_ACCOUNT:
      return _extends(_extends({}, state), {}, {
        sipAccount: action.payload
      });

    case NEW_USERAGENT:
      return _extends(_extends({}, state), {}, {
        userAgent: payload
      });

    default:
      return state;
  }
};

var device = function device(state, action) {
  if (state === void 0) {
    state = {
      audioInput: [],
      audioOutput: [],
      primaryAudioOutput: 'default',
      primaryAudioInput: 'default',
      sinkId: true
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case AUDIO_INPUT_DEVICES_DETECTED:
      return _extends(_extends({}, state), {}, {
        audioInput: payload
      });

    case AUDIO_OUTPUT_DEVICES_DETECTED:
      return _extends(_extends({}, state), {}, {
        audioOutput: payload
      });

    case SET_PRIMARY_OUTPUT:
      return _extends(_extends({}, state), {}, {
        primaryAudioOutput: payload
      });

    case SET_PRIMARY_INPUT:
      return _extends(_extends({}, state), {}, {
        primaryAudioInput: payload
      });

    case AUDIO_SINKID_NOT_ALLOWED:
      return _extends(_extends({}, state), {}, {
        sinkId: false
      });

    default:
      return state;
  }
};

var config = function config(state, action) {
  if (state === void 0) {
    state = {
      uri: '',
      password: '',
      phoneConfig: {},
      appConfig: {
        mode: '',
        started: false,
        appSize: ''
      }
    };
  }

  switch (action.type) {
    case SET_PHONE_CONFIG:
      return _extends(_extends({}, state), {}, {
        phoneConfig: action.payload
      });

    case SET_CREDENTIALS:
      return _extends(_extends({}, state), {}, {
        uri: action.payload.uri,
        password: action.payload.password
      });

    case SET_APP_CONFIG:
      return _extends(_extends({}, state), {}, {
        appConfig: action.payload
      });

    case STRICT_MODE_SHOW_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return _extends(_extends({}, state), {}, {
          appConfig: _extends(_extends({}, state.appConfig), {}, {
            mode: 'strict',
            started: true
          })
        });
      }

      return state;

    case STRICT_MODE_HIDE_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return _extends(_extends({}, state), {}, {
          appConfig: _extends(_extends({}, state.appConfig), {}, {
            mode: 'strict',
            started: false
          })
        });
      }

      return state;

    default:
      return state;
  }
};

var reducers = redux.combineReducers({
  sipAccounts: sipAccounts,
  sipSessions: sipSessions,
  device: device,
  config: config
});

var middleware = [thunk];
var persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['device']
};
var persistedReducer = reduxPersist.persistReducer(persistConfig, reducers);
var defaultStore = redux.createStore(persistedReducer, reduxDevtoolsExtension.composeWithDevTools(redux.applyMiddleware.apply(void 0, middleware)));
var persistor = reduxPersist.persistStore(defaultStore);

var phoneStore = defaultStore;
var SIPContext = React__default.createContext({});

var SIP = function SIP(_ref) {
  var _state$sipAccounts, _state$sipAccounts$si;

  var children = _ref.children;
  var state = reactRedux.useSelector(function (state) {
    return state;
  });
  var makeCall = state === null || state === void 0 ? void 0 : (_state$sipAccounts = state.sipAccounts) === null || _state$sipAccounts === void 0 ? void 0 : (_state$sipAccounts$si = _state$sipAccounts.sipAccount) === null || _state$sipAccounts$si === void 0 ? void 0 : _state$sipAccounts$si.makeCall;
  React.useEffect(function () {
    getInputAudioDevices();
    getOutputAudioDevices();
  }, []);
  return React__default.createElement(SIPContext.Provider, {
    value: {
      state: state,
      makeCall: makeCall,
      acceptCall: acceptCall,
      declineCall: declineCall,
      endCall: endCall
    }
  }, children);
};

var SIPProvider = function SIPProvider(_ref2) {
  var name = _ref2.name,
      phoneConfig = _ref2.phoneConfig,
      sipConfig = _ref2.sipConfig,
      appConfig = _ref2.appConfig,
      sipCredentials = _ref2.sipCredentials,
      _ref2$containerStyle = _ref2.containerStyle,
      containerStyle = _ref2$containerStyle === void 0 ? {} : _ref2$containerStyle,
      children = _ref2.children;
  console.info(name, containerStyle);
  return React__default.createElement(reactRedux.Provider, {
    store: phoneStore
  }, React__default.createElement(react.PersistGate, {
    loading: null,
    persistor: persistor
  }, React__default.createElement(SipWrapper$1, {
    sipConfig: sipConfig,
    sipCredentials: sipCredentials,
    phoneConfig: phoneConfig,
    appConfig: appConfig
  }, React__default.createElement(SIP, null, children), React__default.createElement("audio", {
    id: 'tone',
    autoPlay: true
  }))));
};
var useSip = function useSip() {
  var ctx = React.useContext(SIPContext);
  return ctx;
};

exports.SIPProvider = SIPProvider;
exports.phoneStore = phoneStore;
exports.useSip = useSip;
//# sourceMappingURL=index.js.map
