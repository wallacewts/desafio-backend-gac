import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const sdk = new NodeSDK({
  serviceName: 'gac-api',
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector:4317',
    compression: CompressionAlgorithm.GZIP,
  }),
  instrumentations: [new HttpInstrumentation(), new TypeormInstrumentation()],
});

process.on('beforeExit', () => {
  void sdk.shutdown();
});

export const initalizeTracing = () => {
  sdk.start();
};
