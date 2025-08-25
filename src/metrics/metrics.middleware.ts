import { Request, Response, NextFunction } from 'express';
import * as client from 'prom-client';

export const bookingsCreatedCounter = new client.Counter({
  name: 'bookings_created_total',
  help: 'Total number of bookings created'
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status_code']
});

export function MetricsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/metrics') {
    res.set('Content-Type', client.register.contentType);
    client.register.metrics().then(m => res.end(m));
    return;
  }
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end({ status_code: String(res.statusCode) });
  });
  next();
}
