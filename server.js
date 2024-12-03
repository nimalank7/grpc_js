const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Load up the `todoPackage`
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObj.todoPackage;

// Create a gRPC server
const server = new grpc.Server();

// Let the server know about our functions which are mapped to our service.rpc methods
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
})

// Start up a non-TLS service on localhost:4000
server.bindAsync("localhost:4000", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Starting server at localhost:4000")
    
});

// Hold our todos
const todos = []

// `call` and `callback` are like the request and response objects
function createTodo(call, callback) {
    // Uncomment `console.log(call)` to see what the call object looks like

    /*
    Here we are using JSON to create a `todoItem` but equally we could use `protoc` 
    to compile `todo.proto` to produce JavaScript objects to send instead.
    */
    const todoItem = {
        "id": todos.length + 1,
        // Extract from the call object
        "text": call.request.text
    }
    
    // Add it to our array
    todos.push(todoItem)

    // Send back the todoItem
    callback(null, todoItem)
}

// Send the entire array of `todoItem` back
function readTodos(call, callback) {
    // Here this needs to be a JSON object of `items` as per `repeated TodoItems items`
    callback(null, {
        "items": todos
    })
}

// Instead of sending the entire array back at once we stream it one item at a time
function readTodosStream(call, callback) {
    // Send each `todoItem` one at a time
    todos.forEach(t => call.write(t));
    // Close the stream
    call.end();
}
