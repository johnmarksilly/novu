import { Injectable } from '@nestjs/common';
import { ISubscriberJwt } from '@novu/shared';
import { AnalyticsService } from '@novu/application-generic';
import { SubscriberRepository, MemberRepository } from '@novu/dal';

interface IUpdateSubscriberPayload {
  isOnline: boolean;
  lastOnlineAt?: string;
}

@Injectable()
export class SubscriberOnlineService {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private analyticsService: AnalyticsService,
    private memberRepository: MemberRepository
  ) {}

  async handleConnection(subscriber: ISubscriberJwt) {
    const isOnline = true;

    await this.updateOnlineStatus(subscriber, { isOnline });
  }

  private async trackIsOnlineUpdate(updatePayload: IUpdateSubscriberPayload, subscriber: ISubscriberJwt) {
    this.analyticsService.track('Update online flag - [Subscriber]', subscriber.organizationId, {
      _organization: subscriber.organizationId,
      _environment: subscriber.environmentId,
      _subscriber: subscriber._id,
      ...updatePayload,
    });
  }

  async handleDisconnection(subscriber: ISubscriberJwt, activeConnections: number) {
    const lastOnlineAt = new Date().toISOString();
    let isOnline = false;
    if (activeConnections > 1) {
      isOnline = true;
    }

    await this.updateOnlineStatus(subscriber, { isOnline, lastOnlineAt });
  }

  private async updateOnlineStatus(subscriber: ISubscriberJwt, updatePayload: IUpdateSubscriberPayload) {
    await this.subscriberRepository.update(
      { _id: subscriber._id, _organizationId: subscriber.organizationId },
      {
        $set: updatePayload,
      }
    );
    this.trackIsOnlineUpdate(updatePayload, subscriber);
  }
}
