import * as nodeMailer from "nodemailer";
import { getEnvironmentVariables } from "../environments/environment";
// import * as SendGrid from "nodemailer-sendgrid-transport";

export class NodeMailer {
  private  static initiateTransport() {
    return nodeMailer.createTransport(
      // SendGrid({
      //   auth: {
      //     api_key: getEnvironmentVariables().sendgrid_api_key
      // })
      {
        service: 'gmail',
        auth:{
          user: getEnvironmentVariables().gmail_auth.user,
          pass:getEnvironmentVariables().gmail_auth.pass
        }
      }
    );
  }

	static sendMail(data: {to: [string], subject: string, html: string}): Promise<any> {
    return NodeMailer.initiateTransport().sendMail({
      // from: getEnvironmentVariables().sendgrid.email_from,
			from: getEnvironmentVariables().gmail_auth.user,
      to: data.to,
      subject: data.subject,
      html: data.html
    });
  }
}
