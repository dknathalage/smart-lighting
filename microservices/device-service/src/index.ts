import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import os from "os";

import typeDefs from "./typedefs";
import resolvers from "./resolvers";

const port = process.env.PORT || 4000;
const user = process.env.USER_SERVICE || "http://localhost:4000/";

const app = express();

app.use("/graphql", (req, res, next) => {
    if (req.headers.token === undefined)
        return res.send(400).send("no auth token");
    http.request(
        {
            hostname: user,
            method: "GET",
            headers: {
                token: req.headers.token,
            },
        },
        (resp) => {
            console.log(resp.statusMessage);
        }
    );
    next();
});

async function startApolloServer(typeDefs: any, resolvers: any) {
    await mongoose.connect(
        "mongodb+srv://root:toor@sit314.g7vp8.mongodb.net/test?retryWrites=true&w=majority"
    );

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
    console.log(
        `server started at http://127.0.0.1:${port + server.graphqlPath}`
    );
}

startApolloServer(typeDefs, resolvers);

app.get("/", (req, res) => {
    // render the index template
    res.send("device-service active, host: " + os.hostname());
});