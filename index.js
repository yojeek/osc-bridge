const OSC = require('osc-js');
const dgram = require('dgram')

const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })
osc.open() // listening on 'ws://localhost:8080'

const socket = dgram.createSocket('udp4')

/*
osc.on('*', message => {
    console.log(message.args)
    const msg = new OSC.Message(message.address, ...message.args)
    const binary = msg.pack()
    //socket.send(new Buffer(binary), 0, binary.byteLength, 7331, '169.254.235.240')
    socket.send(new Buffer(binary), 0, binary.byteLength, 1234, '127.0.0.1')
});
*/

const sentValuesMap = new Map();
const THRESHOLD = 0.001;

const sendFloatWithThreshold = (address, value) => {
    if (sentValuesMap.has(address) && Math.abs(sentValuesMap.get(address) - value) < THRESHOLD) {
        console.log(`skip ${address} by threshold ${Math.abs(sentValuesMap.get(address) - value)}`)
        return;
    }
    const msg = new OSC.Message(address, value)
    const binary = msg.pack()
    socket.send(new Buffer(binary), 0, binary.byteLength, 1234, 'localhost')
    console.log(`sent ${address}`, value)
    sentValuesMap.set(address, value)
}

osc.on('*', message => {
    //console.log(message.args)
    const [_unused, idx, x, y, name] = message.args
    sendFloatWithThreshold(message.address + '_' + name + '_x', x)
    sendFloatWithThreshold(message.address + '_' + name + '_y', y)
});





