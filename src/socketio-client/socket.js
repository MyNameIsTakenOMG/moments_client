import io from 'socket.io-client'

const endPoint = process.env.NODE_ENV==='production'?process.env.REACT_APP_ENDPOINT:'http://localhost:8000'
export default io(endPoint)
