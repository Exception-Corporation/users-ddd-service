import nodemailer, { SendMailOptions } from 'nodemailer';
import { IMailer } from '@/shared/domain/mail/mailer.interface';
import config from '@/shared/infrastructure/config';
import { AuthenticationError } from '@/shared/domain/errors/domain-errors/AuthenticationError';

export type options = SendMailOptions;

export class NodeMailer implements IMailer<SendMailOptions> {
  private static instance: IMailer<SendMailOptions> | undefined;

  private constructor() {}

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new NodeMailer();

    return this.instance;
  }

  async send(params: SendMailOptions): Promise<void> {
    try {
      const carrier = nodemailer.createTransport({
        host: config.mailer.nodemailer.host,
        port: config.mailer.nodemailer.port,
        secure: false,
        auth: {
          user: config.mailer.nodemailer.email,
          pass: config.mailer.nodemailer.password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await carrier.sendMail({
        from: '"CRM Admin" <crm@itsystem.com.mx>',
        to: params.to,
        subject: params.subject,
        html: params.html
      });
    } catch (error: any) {
      throw new AuthenticationError(error.toString());
    }
  }
}
