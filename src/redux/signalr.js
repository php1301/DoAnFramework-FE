import config from "../config";
import { eventChannel } from 'redux-saga';
import { delay, select, put, call, take, spawn } from 'redux-saga/effects'
import { chatLogs, getActiveUser, getLastMessage, requestChatHistory, setActiveLists, setConnection, setIsTyping, setSeen } from "./actions";
import * as signalR from "@microsoft/signalr";
function* listenNotifications() {
  const connection = new signalR.HubConnectionBuilder()
    // .withUrl(config.CHATHUB, { accessTokenFactory: () => localStorage.token })
    .withUrl(config.CHATHUB, {
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
    yield call(() => connection.invoke("getConnectionId"))
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
      // console.log(data)
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
        yield put(requestChatHistory())
      }
    }
  }
}

export function* startApp() {
  yield spawn(listenNotifications)
}