import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { USE_CASES } from './usecases';
import { WorkflowsController } from './workflows.controller';
import { MessageTemplateModule } from '../message-template/message-template.module';
import { ChangeModule } from '../change/change.module';
import { AuthModule } from '../auth/auth.module';
import { IntegrationModule } from '../integrations/integrations.module';

@Module({
  imports: [SharedModule, MessageTemplateModule, ChangeModule, AuthModule, IntegrationModule],
  controllers: [WorkflowsController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class WorkflowsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {}
}
