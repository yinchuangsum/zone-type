import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      status: mockStatus,
    };

    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2025-01-01T00:00:00.000Z');
  });

  function createMockHost(response: Partial<Response>) {
    return {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as Parameters<HttpExceptionFilter['catch']>[1];
  }

  it('should handle HttpException with string message', () => {
    const exception = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
    const host = createMockHost(mockResponse);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Custom error',
      timestamp: '2025-01-01T00:00:00.000Z',
    });
  });

  it('should handle HttpException with object message (validation errors)', () => {
    const exception = new HttpException(
      {
        statusCode: 400,
        message: ['email must be an email', 'password must be longer than 8 characters'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
    const host = createMockHost(mockResponse);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'email must be an email, password must be longer than 8 characters',
      timestamp: '2025-01-01T00:00:00.000Z',
    });
  });

  it('should handle HttpException with single string message in object', () => {
    const exception = new HttpException(
      { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
    const host = createMockHost(mockResponse);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 401,
      message: 'Invalid credentials',
      timestamp: '2025-01-01T00:00:00.000Z',
    });
  });

  it('should handle unknown errors as 500 Internal Server Error', () => {
    const exception = new Error('Something went wrong');
    const host = createMockHost(mockResponse);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: '2025-01-01T00:00:00.000Z',
    });
  });
});