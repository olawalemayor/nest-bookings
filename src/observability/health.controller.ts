import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@Controller()
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get("/health")
  @HealthCheck()
  check() {
    // Simple liveness; DB/Redis checks can be added with custom indicators
    return this.health.check([]);
  }

  @Get("/metrics")
  metrics() {
    // Filled by MetricsMiddleware (sends content-type and body)
    return "OK";
  }
}
