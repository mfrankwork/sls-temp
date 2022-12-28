import { main as handler } from './handler';

import type { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import schema from './schema';

describe('Hello Handler', () => {
  it('should pass with mocked post request', async () => {
    const body: FromSchema<typeof schema> = { name: 'Frederic' };
    const event: Partial<APIGatewayEvent> = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };

    const context = {} as Context;
    const callback = null as Callback;

    // Ignore TypeScript compiler error for event, which is of Partial<APIGatewayEvent> type, not matching expected event type for handler
    // @ts-ignore
    const response = await handler(event, context, callback);

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe('Hello Frederic, welcome to the exciting Serverless world!');
    expect(responseBody.event).toMatchObject(event);
    // Extraneous
    expect(response).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello Frederic, welcome to the exciting Serverless world!',
        event: {
          headers: { 'Content-Type': 'application/json' },
          body,
          rawBody: JSON.stringify(body)
        }
      })
    });
    expect(responseBody.event).toMatchObject(
      Object.assign(event, {
        rawBody: JSON.stringify(body)
      })
    );
    expect(response.body).toBe(
      JSON.stringify({
        message: 'Hello Frederic, welcome to the exciting Serverless world!',
        event: {
          headers: { 'Content-Type': 'application/json' },
          body,
          rawBody: JSON.stringify(body)
        }
      })
    );
  });
});
