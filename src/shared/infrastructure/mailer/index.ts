import {
  NodeMailer,
  options
} from '@/shared/infrastructure/mailer/nodemailer.mailer';
import { IMailer } from '@/shared/domain/mail/mailer.interface';

export const MailerService: IMailer<options> = NodeMailer.getInstance();
