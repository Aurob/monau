
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const websocketHandler = async request => {
    const upgradeHeader = request.headers.get("Upgrade")
    if (upgradeHeader !== "websocket") {
        return new Response("Expected websocket", { status: 400 })
    }

    const [client, server] = Object.values(new WebSocketPair())
    await handleSession(server)

    return new Response(null, {
        status: 101,
        webSocket: client
    })
}

async function handleRequest(request) {
    const upgradeHeader = request.headers.get("Upgrade")
    if (upgradeHeader !== "websocket") {
        return new Response("Expected websocket", { status: 400 })
    }

    const [client, server] = Object.values(new WebSocketPair())
    await handleSession(server)
    return websocketHandler(request)
}

async function handleMessage(data, websocket) {
    try {
        data = JSON.parse(data);
        let response = '';
        for (let key in data) {
            let value = data[key];
            switch (key) {

                case 'test':
                    websocket.send(JSON.stringify({ msg: 'Hello World!' }));
                    break
                case 'rword':
                    fetch(`https://0b.lol/api/word?n=${value}`)
                        .then(res => res.json())
                        .then(d => {
                            websocket.send(JSON.stringify({ msg: d.result }));
                        })

                    break
                case 'llm':
                    fetch(`https://0b.lol/api/llm?content=${value}`)
                        .then(res => res.json())
                        .then(d => {
                            websocket.send(JSON.stringify({ msg: d.result }));
                        })

                    break

                default:
                    break
            }
        }
    }
    catch (err) {
        websocket.send(JSON.stringify({ msg: err }));
    }

}

async function handleSession(websocket) {
    websocket.accept()

    websocket.addEventListener("message", async ({ data }) => {
        await handleMessage(data, websocket);
    })

    websocket.addEventListener("close", async evt => {
    })
}