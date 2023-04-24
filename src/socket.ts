import { io } from 'socket.io-client'
import { apiUrl } from './global'

export const socket = io(apiUrl)

socket.on('pong', (data) => {
    console.log(data)
    })