import { Mail, MailPrimitive } from '@/user/v1/domain/mail/mail.entity';

export class MailDto {
  private constructor(private eventId: MailPrimitive) {}

  static fromJson(eventId: MailPrimitive): MailDto {
    return new MailDto(eventId);
  }

  to(): Mail {
    return Mail.fromPrimitive(this.eventId);
  }

  getEventId(): MailPrimitive {
    return this.eventId;
  }
}
