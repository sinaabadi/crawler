import {
  DNSHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
  TerminusEndpoint,
  TerminusModuleOptions,
  TerminusOptionsFactory
} from '@nestjs/terminus'
import {Injectable} from '@nestjs/common'

@Injectable()
export class AppHealthService implements TerminusOptionsFactory {
  constructor(
    private readonly dns: DNSHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {
  }

  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health',
      healthIndicators: [
        async () => this.dns.pingCheck('google', 'https://google.com'),
        async () => this.mongoose.pingCheck('mongo'),
        async () => this.memory.checkHeap('memory', 2000 * 1024 * 1024)
      ],
    }
    return {
      endpoints: [healthEndpoint],
    }
  }
}
