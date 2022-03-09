export interface HttpExceptionsResponse {
    statusCode: number;
    message: string;
}

export interface CustomHttpExceptionsResponse extends HttpExceptionsResponse {
    path: string;
    method: string;
    timeStamp: Date;
}