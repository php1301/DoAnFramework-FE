import config from "../config";
import { eventChannel } from 'redux-saga';
import { delay, select, put, call, take, spawn } from 'redux-saga/effects'
import { chatLogs, getActiveUser, requestChatHistory, setConnection, setIsTyping } from "./actions";
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
    const connectionId = yield call(() => connection.invoke("getConnectionId"))
    console.log(connectionId)
    // const test = yield call(() => connection.invoke("IsTyping", ))
    const getEventChannel = connection => eventChannel(emit => {
      const handler = data => { emit(data) }
      connection.on('messageHubListener', handler)
      connection.on('IsTyping', handler)
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
      console.log(data)
      if (data.text !== "sent")
        yield put(setIsTyping(data))
      const active_user = yield select(getActiveUser);
      yield put(chatLogs(active_user.Code))
      // if (active_user.IsGroup)
      //   yield put(chatLogs(active_user.Code))
      // else {
      //   yield put(chatLogs(null, active_user.Code))
      // }
      yield put(requestChatHistory())
    }
  }
}

export function* startApp() {
  yield spawn(listenNotifications)
}