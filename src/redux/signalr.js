import config from "../config";
import { eventChannel } from 'redux-saga';
import { delay, select, put, call, take, spawn } from 'redux-saga/effects'
import { chatLogs } from "./actions";
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
    const getEventChannel = connection => eventChannel(emit => {
      const handler = data => { emit(data) }
      connection.on('messageHubListener', handler)
      return () => { connection.off() }
    })

    const channel = yield call(getEventChannel, connection)
    while (true) {
      const data = yield take(channel)
      console.log(data);
      yield put(chatLogs("345a71e7827c40f4b028502e76c1a3b0"))
    }
  }
}

export function* startApp() {
  yield spawn(listenNotifications)
}