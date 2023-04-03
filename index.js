const OSC = require('osc-js');
const dgram = require('dgram')

const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })
osc.open() // listening on 'ws://localhost:8080'

const socket = dgram.createSocket('udp4')

osc.on('*', message => {
    console.log(message.args)
    const msg = new OSC.Message(message.address, ...message.args)
    const binary = msg.pack()
    //socket.send(new Buffer(binary), 0, binary.byteLength, 7331, '169.254.235.240')
    socket.send(new Buffer(binary), 0, binary.byteLength, 7331, '127.20.15.5')
});





