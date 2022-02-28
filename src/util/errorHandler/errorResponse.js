import {ApolloError} from "apollo-server-express";

export class ErrorResponse extends ApolloError {
    constructor({message, code}) {
        super(message, code);
        Object.defineProperty(this, 'name', { value: 'ErrorResponse' });
    }
}