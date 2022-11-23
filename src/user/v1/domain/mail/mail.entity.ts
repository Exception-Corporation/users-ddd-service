import { Entity } from '@/shared/domain/class/entity';
import { MailHtml } from '@/user/v1/domain/mail/value-objects/mail.html';
import { MailSubject } from '@/user/v1/domain/mail/value-objects/mail.subject';
import { MailTo } from '@/user/v1/domain/mail/value-objects/mail.to';

export type MailPrimitive = ReturnType<Mail['toPrimitives']>;

export class Mail extends Entity {
  constructor(
    private to: MailTo,
    private subject: MailSubject,
    private html: MailHtml
  ) {
    super();
  }

  static fromPrimitive({
    to,
    subject,
    html
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    return new Mail(
      new MailTo(to),
      new MailSubject(subject),
      new MailHtml(html)
    );
  }

  toPrimitives() {
    return {
      to: this.to.valueOf(),
      subject: this.subject.valueOf(),
      html: this.html.valueOf()
    };
  }

  getTo() {
    return this.to;
  }

  getSubject() {
    return this.subject;
  }

  getHtml() {
    return this.html;
  }
}
