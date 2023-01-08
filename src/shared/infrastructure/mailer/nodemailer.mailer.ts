import { injectable } from '@container';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { IMailer } from '@/shared/domain/mail/mailer.interface';
import config from '@/shared/infrastructure/config';
import { InternalError } from '@/shared/domain/errors/domain-errors/InternalError';

export type options = SendMailOptions;

@injectable()
export class NodeMailer implements IMailer<SendMailOptions> {
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
      throw new InternalError(error.toString());
    }
  }
}
