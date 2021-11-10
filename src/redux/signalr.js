import config from "../config";
import { eventChannel } from 'redux-saga';
import { delay, select, put, call, take, spawn } from 'redux-saga/effects'
import { callHistory, chatLogs, getActiveUser, getDetailsCallHistory, getLastMessage, joinVideoCall, requestChatHistory, setActiveLists, setConnection, setIncomingCallUrl, setIsTyping, setSeen, toggleCallModal, updateHubConnection } from "./actions";
import * as signalR from "@microsoft/signalr";
function* listenNotifications() {
  const hubLinkUrl = localStorage.getItem("hubApi")
  const connection = new signalR.HubConnectionBuilder()
    // .withUrl(config.CHATHUB, { accessTokenFactory: () => localStorage.token })
    .withUrl(hubLinkUrl || config.CHATHUB, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build()

  console.log(connection)
  let attempt = 0
  let connected = false
  while (attempt < 10 && !connected) {
    attempt++
    connected = true
    try {
      yield call(() => connection.start())
      console.info('SignalR: successfully connected')
    } catch (err) {
      console.info(`SignalR: attempt ${attempt}: failed to connect`)
      yield delay(1000)
      connected = false
    }
  }

  if (connected) {
    yield put(setConnection(connection));
    const connectionId = yield call(() => connection.invoke("getConnectionId"))
    yield put(updateHubConnection(connectionId))
    const Code = localStorage.getItem("authUser");
    yield call(() => connection.invoke("AddToConnected", Code))
    yield call(() => connection.invoke("NotIsTyping", "", "", Code, ""));
    // const test = yield call(() => connection.invoke("IsTyping", ))
    const getEventChannel = connection => eventChannel(emit => {
      const handler = data => { emit(data) }
      connection.on('messageHubListener', handler)
      connection.on('IsTyping', handler)
      connection.on('MessageSeen', handler)
      connection.on('GetActiveFriends', handler)
      connection.on('callHubListener', handler)
      connection.on('SyncSignal', handler)
      return () => { connection.off() }
    })
    const getIsTyping = connection => eventChannel(emit => {
      const handler = data => { emit(data) }
      return () => { connection.off() }
    })

    const channel = yield call(getEventChannel, connection)
    // const channelIsTyping = yield call(getIsTyping, connection)
    while (true) {
      const data = yield take(channel)
      // const data = yield take(channelIsTyping)
      if (data?.type === "messageSeens") {
        yield put(setSeen(data));
      }
      else {
        if (data?.type !== "GetActiveList") {
          if (data?.text !== "sent")
            yield put(setIsTyping(data))
          const active_user = yield select(getActiveUser);
          const lastMessage = yield select(getLastMessage);
          if ((active_user?.Code || active_user?.UserCode) === data?.groupCode) {
            yield put(chatLogs(active_user?.Code || active_user?.UserCode, null, false))
          }
          if (!lastMessage?.Id) {
            yield put(chatLogs(data?.groupCode, null, true))
          }
          if (data?.type === "sync") {
            yield put(chatLogs(active_user?.Code || active_user?.UserCode, null, false))
            if (!lastMessage?.Id) {
              yield put(chatLogs(data?.groupCode, null, true))
            }
          }
          // else {
          //   yield put(chatLogs(data?.groupCode || active_user.Code, null, false))
          // }
          // if (active_user.IsGroup)
          //   yield put(chatLogs(active_user.Code))
          // else {
          //   yield put(chatLogs(null, active_user.Code))
          // }
        }
        else {
          if (data?.active)
            yield put(setActiveLists(data))
        }
        if (data?.type === "IncomingCall") {
          console.log(data)
          if (window.confirm("Có cuộc gọi đến")) {
            yield put(joinVideoCall(data?.url))
            yield put(setIncomingCallUrl(data?.url));
            yield put(toggleCallModal());
          }
          else {
            const state = yield select();
            const activeCallLog = state?.Call?.activeCallLog
            if (activeCallLog) {
              put(getDetailsCallHistory(activeCallLog.Code))
            }
            yield put(callHistory())
          }
        }
        else {
          yield put(requestChatHistory())
        }
      }
    }
  }
}

export function* startApp() {
  yield spawn(listenNotifications)
}