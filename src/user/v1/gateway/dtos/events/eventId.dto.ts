import { EventId } from '@/user/v1/domain/request/request.eventId';

export class EventIdDto {
  private constructor(private eventId: ReturnType<EventId['valueOf']>) {}

  static fromString(eventId: string): EventIdDto {
    return new EventIdDto(eventId);
  }

  to(): EventId {
    return new EventId(this.eventId);
  }

  getEventId(): string {
    return this.eventId;
  }
}
