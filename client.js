const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Parse the argument
const text = process.argv[2]

// Load up the todoPackage from `todo.proto`
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObj.todoPackage;

// Create an insecure client that sends request to localhost:4000
const client = new todoPackage.Todo("localhost:4000", grpc.credentials.createInsecure())

/*
Here the client has various 'stubs' that are generated from `todo.proto` that it can call which 
makes the request to the endpoint on the gRPC server.
*/


/*
Here we are using JSON to create a `todoItem` but equally we could use `protoc` 
to compile `todo.proto` to produce JavaScript objects to send instead.

`npm run client -- walkdog` will set `text = walkdog`
*/
client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("Response from gRPC server upon `createTodo` method: " + JSON.stringify(response))

})

// Here we use {} as `readTodos` has `void`
client.readTodos({}, (err, response) => {
    console.log("Response from gRPC server upon `readTodos` method: " + JSON.stringify(response))
})

// No callback function needed as we aren't expecting something back but we do get a call object
const call = client.readTodosStream();

// Server now sends you data
call.on("data", item => {
    console.log("received item from server: " + JSON.stringify(item))
})

// Once server ends
call.on("end", e => console.log("server done!"))
