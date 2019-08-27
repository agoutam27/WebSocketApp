import logger from '../../lib/logger';

const connectionArray = [];
var nextID = Date.now();
var appendToMakeUnique = 1;

class WebSocketController {

    static attachEvents(ws, req) {

        logger.debug(`ws = ${ws} and req origin = ${req.origin}`);
        let userNameAssinged = false;
        connectionArray.push(ws);
        ws.clientID = nextID;

        var msg = {
            type: "id",
            id: ws.clientID
        };
        ws.sendUTF(JSON.stringify(msg));

        ws.on(`message`, msg => {
            if (msg.type !== 'utf8') {
                logger.error(`Unrecognised message = ${msg}`);
                ws.send(JSON.stringify({
                    error: "unrecognised message type",
                    code: 400
                }));
                return;
            }

            var sendToClients = true;
            msg = JSON.parse(message.utf8Data);
            var connect = getConnectionForID(msg.id);

            switch (msg.type) {
                // Public, textual message
                case "message":
                    msg.name = connect.username;
                    msg.text = msg.text.replace(/(<([^>]+)>)/ig, "");
                    break;

                    // Username change
                case "username":
                    var nameChanged = false;
                    var origName = msg.name;

                    // Ensure the name is unique by appending a number to it
                    // if it's not; keep trying that until it works.
                    while (!isUsernameUnique(msg.name)) {
                        msg.name = origName + appendToMakeUnique;
                        appendToMakeUnique++;
                        nameChanged = true;
                    }

                    // If the name had to be changed, we send a "rejectusername"
                    // message back to the user so they know their name has been
                    // altered by the server.
                    if (nameChanged) {
                        var changeMsg = {
                            id: msg.id,
                            type: "rejectusername",
                            name: msg.name
                        };
                        connect.sendUTF(JSON.stringify(changeMsg));
                    }

                    // Set this connection's final username and send out the
                    // updated user list to all users. Yeah, we're sending a full
                    // list instead of just updating. It's horribly inefficient
                    // but this is a demo. Don't do this in a real app.
                    connect.username = msg.name;
                    sendUserListToAll();
                    sendToClients = false; // We already sent the proper responses
                    break;
            }

            if (sendToClients) {
                var msgString = JSON.stringify(msg);
                var i;

                // If the message specifies a target username, only send the
                // message to them. Otherwise, send it to every user.
                if (msg.target && msg.target !== undefined && msg.target.length !== 0) {
                    sendToOneUser(msg.target, msgString);
                } else {
                    for (i = 0; i < connectionArray.length; i++) {
                        connectionArray[i].sendUTF(msgString);
                    }
                }
            }

            if (!userNameAssinged) {
                connectionArray[index].name = msg;
                ws.send({
                    message: "success",
                    code: 201
                });
                return;
            }

            ws.send({
                message: msg,
                code: 200
            });
        });


        ws.on('close', () => {
            logger.info(`Connection has been closed for index ${index}`);
            // First, remove the connection from the list of connections.
            connectionArray = connectionArray.filter(function (el, idx, ar) {
                return el.connected;
            });

            // Now send the updated user list. Again, please don't do this in a
            // real application. Your users won't like you very much.
            sendUserListToAll();
        })

    }

    static isUsernameUnique(name) {
        var isUnique = true;
        var i;

        for (i = 0; i < connectionArray.length; i++) {
            if (connectionArray[i].username === name) {
                isUnique = false;
                break;
            }
        }
        return isUnique;
    }

    static sendToOneUser(target, msgString) {
        var isUnique = true;
        var i;

        for (i = 0; i < connectionArray.length; i++) {
            if (connectionArray[i].username === target) {
                connectionArray[i].sendUTF(msgString);
                break;
            }
        }
    }


    static makeUserListMessage() {
        var userListMsg = {
            type: "userlist",
            users: []
        };
        var i;

        // Add the users to the list

        for (i = 0; i < connectionArray.length; i++) {
            userListMsg.users.push(connectionArray[i].username);
        }

        return userListMsg;
    }


    static sendUserListToAll() {
        var userListMsg = makeUserListMessage();
        var userListMsgStr = JSON.stringify(userListMsg);
        var i;

        for (i = 0; i < connectionArray.length; i++) {
            connectionArray[i].sendUTF(userListMsgStr);
        }
    }


}

export default WebSocketController;