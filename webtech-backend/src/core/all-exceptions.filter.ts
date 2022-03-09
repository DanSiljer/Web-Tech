import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { CustomHttpExceptionsResponse, HttpExceptionsResponse } from "./models/http-exceptions-response.interface";
import * as fs from 'fs'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMessage = (errorResponse as HttpExceptionsResponse).message ?? exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Critical Internal Server Error'
        }

        const errorResponse = this.getErrorResponse(status, errorMessage, request);
        const errorLog = this.getErrorLog(errorResponse, request, exception);
        this.writeErrorLogToFile(errorLog);

        response.status(status).json(errorResponse)
    }

    private getErrorResponse = (status: HttpStatus, errorMessage: string, request: Request): CustomHttpExceptionsResponse => ({
        statusCode: status,
        message: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date()
    })

    private getErrorLog = (errorResponse: CustomHttpExceptionsResponse, request: Request, exception: any): string => {
        const { statusCode, message, path, method, timeStamp } = errorResponse;

        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${path}\n\n
            ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
            ${exception instanceof HttpException ? exception.stack : message}\n\n`
        return errorLog;
    }

    private writeErrorLogToFile = (errorLog: string): void => {
        fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
            if (err) throw err;
        });
    };
}