import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details: unknown = undefined;

    if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = 'Validation failed';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      details = exception.getZodError().issues;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = 'HTTP_ERROR';

      const payload = exception.getResponse();
      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const p: any = payload;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const m = p.message ?? exception.message;
        message = Array.isArray(m) ? m.join('; ') : String(m);
        details = p;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      details = { name: exception.name };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const url = (req as any).originalUrl ?? req.url;
    const logLine = `${req.method} ${url} -> ${status} ${code}`;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(logLine, (exception as any)?.stack);
    else this.logger.warn(logLine);

    res.status(status).json({
      ok: false,
      error: { code, message, details },
    });
  }
}
