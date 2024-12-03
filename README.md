# Application

Simple gRPC server that creates a todo list which a client application consumes. Tutorial from https://www.youtube.com/watch?v=Yw4rkaTc0f8

## Protocol Buffer

`todo.proto` is used in both `client.js` and `server.js` to generate a `Interface Definition Language`. This is to say it generates 'stubs' on the client (e.g. `client.readTodos(...)`) and lets the server know about these endpoints.

Here both the client and server use `@grpc/grpc-js` and `@grpc/proto-loader` to serialize/deserialize using Protocol Buffers into binary which are then sent across the wire. (Effectively performing the same function as the output of `protoc`)

## Run the application

In a separate terminal run:

```
npm run server
```

In a separate terminal run:

```
npm run client -- itemOne
npm run client -- itemTwo
npm run client -- itemThree
```

Note that running the client will call *all* the methods.

Sample output:

```
received item from server: {"id":1,"text":"itemOne"}
received item from server: {"id":2,"text":"itemTwo"}
received item from server: {"id":3,"text":"itemThree"}
Response from gRPC server upon `createTodo` method: {"id":3,"text":"itemThree"}
Response from gRPC server upon `readTodos` method: {"items":[{"id":1,"text":"itemOne"},{"id":2,"text":"itemTwo"},{"id":3,"text":"itemThree"}]}
server done!
```