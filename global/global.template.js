import { EMAIL_OTP_EXPIRY_LIMIT } from './global.vars.js';

const email_verification_template = (userRecord) => {
  return {
    to: [{ email: userRecord.email, name: userRecord.name }],
    subject: 'Email Verification - iPrep',
    html: `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Email Template</title>
			</head>
			<body style="margin: 0; padding: 16px; box-sizing: border-box; font-family: Arial, sans-serif">
				<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7FBFE; padding: 20px 10px">
					<tr>
						<td align="center">
							<table width="600" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="center">
										<div style="
											background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2FiPrep-logo.png?alt=media&token=498524af-961e-42be-b31b-6fb94d1e0da5);
											background-position: -1% -1%;
											background-repeat: no-repeat;
											background-size: cover;
											width: 122px;
											height: 48px;
											margin-bottom: 28px;
										"></div>
									</td>
								</tr>
								<tr>
									<table width="400" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.12)">
										<tr>
											<td>
												<tr>
													<td align="center">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Fmail-icon.png?alt=media&token=78cc666b-f78f-4943-9bc1-91de2aa79312);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 48px;
															height: 48px;
															margin-top: 24px;
														"></div>
													</td>
												</tr>
												<tr>
													<td align="center" style="padding: 0 10px">
														<h3 style="margin: 38px 0 0 0; color: #212121; font-size: 20px; font-weight: 600">Verify your email address</h3>
														<p style="color: #666; margin: 26px 0px; text-align: center; font-size: 14px; line-height: 26px">
															The OTP towards validating your Email address is <strong>{{otp}}</strong>. Please note this OTP is valid only for a duration of ${
                                EMAIL_OTP_EXPIRY_LIMIT / 60000
                              } minute.
														</p>
														{{ele}}
													</td>
												</tr>
												<tr>
													<td align="center" style="padding: 0 10px">
														<div style="margin-top: 22px; height: 1px; width: 90%; margin-bottom: 16px; background-color: rgba(222, 222, 222, 0.46)"></div>
														<div style="color: #666; text-align: center; font-size: 14px; line-height: 26px; margin-bottom: 26px">
															<p style="margin: 0">For any assistance : Call us at 18008899710</p>
															<p style="margin: 0">
																Email us at:
																<a href="mailto:support@idreameducation.org" style="color: #0357f9; text-decoration: none">support@idreameducation.org</a>
															</p>
														</div>
													</td>
												</tr>
											</td>
										</tr>
									</table>
								</tr>
								<tr>
									<td align="center" style="padding: 32px 0 50px 0">
										<table cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td align="center" style="padding-right: 12px">
													<a href="https://play.google.com/store/apps/details?id=org.idreameducation.iprepapp&hl=en-IN" style="
														display: inline-flex;
														align-items: center;
														background-color: #5c5a5a;
														padding: 4px 8px;
														border-radius: 6px;
														border: 1px solid #a6a6a6;
														text-decoration: none;
														color: #fff;
													">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Fgoogle-play-icon.png?alt=media&token=e989434e-72a6-43f5-b256-fa13a19c91f3);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 30px;
															height: 30px;
															margin-right: 5px;
															margin-top: 6px;
														"></div>
														<div style="display: inline-block; text-align: left">
															<span style="vertical-align: middle; font-size: 12px">GET IT ON</span><br />
															<span style="display: inline; font-size: 15px; margin: 0; color: #fff">Google Play</span>
														</div>
													</a>
												</td>
												<td align="center">
													<a href="https://apps.apple.com/in/app/iprep-learning-app-for-1-12/id1547212891" style="
														display: inline-flex;
														align-items: center;
														background-color: #5c5a5a;
														padding: 4px 8px;
														border-radius: 6px;
														border: 1px solid #a6a6a6;
														text-decoration: none;
														color: #fff;
													">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Fapple-icon%204.47.24%E2%80%AFPM.png?alt=media&token=7893598d-1487-431a-aa41-d4ac05435e70);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 30px;
															height: 30px;
															margin-right: 5px;
															margin-top: 6px;
														"></div>
														<div style="display: inline-block; text-align: left">
															<span style="vertical-align: middle; font-size: 12px">Download on the</span><br />
															<span style="display: inline; font-size: 15px; margin: 0; color: #fff">App Store</span>
														</div>
													</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td align="center" style="padding: 14px 0px 26px 0px">
										<table cellpadding="0" cellspacing="0" border="0">
											<tr>
												<div style="margin-top: 22px; height: 1px; width: 80%; margin-bottom: 16px; background-color: rgba(222, 222, 222, 0.46)"></div>
												<td align="center">
													<a href="https://www.linkedin.com/company/idream-education/mycompany/verification/" style="text-decoration: none">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Flinkedin-icon.png?alt=media&token=e5d9ece6-ea7c-4d08-80ba-75851e2f7160);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 20px;
															height: 20px;
														"></div>
													</a>
												</td>
												<td align="center" style="padding: 0 34px">
													<a href="https://www.youtube.com/channel/UCAmb6UplGkKtMOkL004BQKw" style="text-decoration: none">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Fyoutube-icon.png?alt=media&token=6b8cfb18-7a83-4d26-befb-94e11df1005f);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 20px;
															height: 20px;
														"></div>
													</a>
												</td>
												<td align="center">
													<a href="https://www.instagram.com/iprepapp/" style="text-decoration: none">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Finstagram-icon.png?alt=media&token=73855903-61ca-420a-9cbd-b2265bbfe4af);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 20px;
															height: 20px;
														"></div>
													</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
			</html>`,
  };
};

const password_reset_template = (userRecord) => {
  return {
    to: [{ email: userRecord.email, name: userRecord.name }],
    subject: 'Password Reset - iPrep',
    text: `
			  Password Reset <br>
			  You recently requested a password reset for your iPrep account. Please click the link below to reset your password: <br>
			  ${userRecord.reset_link}<br>
			  If you did not request a password reset, please ignore this email. <br>
			  The password reset link will be valid for 30 minutes. Please do not share this link with anyone. <br>

			  This is an automated message, please do not reply. <br>
			  Stay connected! <br>

			  You have received this email as a registered user of iPrep. <br>
			  For more information about how we process data, please see our Privacy policy. <br>

			  <br>
			  In case of any issue, please write to us at <a href="mailto:support@idreameducation.org">support@idreameducation.org</a>.
			  <br><br><br>

			  Thanks & Regards, <br>
			  Team iPrep`,
  };
};

const payment_alert_template = (to, cc, body) => {
  return {
    to,
    cc,
    subject: 'Payment Alert | SuperApp',
    html: `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Email Template</title>
			</head>
			<style>
				td {
					padding: 10px;
				}
			</style>
			<body style="margin: 0; padding: 16px; box-sizing: border-box; font-family: Arial, sans-serif">
				<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7FBFE; padding: 20px 10px">
					<tr>
						<td align="center">
							<table width="600" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="center">
										<div style="
											background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2FiPrep-logo.png?alt=media&token=498524af-961e-42be-b31b-6fb94d1e0da5);
											background-position: -1% -1%;
											background-repeat: no-repeat;
											background-size: cover;
											width: 122px;
											height: 48px;
										"></div>
									</td>
								</tr>
								<tr>
									<table cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.12)">
										<tr>
											<td>
												<tr>
													<td align="center">
														<div style="
															background-image: url(https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/Images%2Fmail-icon.png?alt=media&token=78cc666b-f78f-4943-9bc1-91de2aa79312);
															background-position: -1% -1%;
															background-repeat: no-repeat;
															background-size: cover;
															width: 48px;
															height: 48px;
														"></div>
													</td>
												</tr>
												<tr>
													<td align="center" style="padding: 0 10px">
														<h3 style="margin: 12px 0 0 0; color: #212121; font-size: 20px; font-weight: 600">Payment Alert</h3>

														<div style="margin-top: 22px; height: 1px; width: 90%; margin-bottom: 16px; background-color: rgba(222, 222, 222, 0.46)"></div>
														<div style="color: #666; text-align: center; font-size: 14px; line-height: 26px; margin-bottom: 26px">
															<p style="margin: 0"><strong>Check your <a href="https://dashboard.razorpay.com/app/payments">razorpay</a> account to capture the payment</strong></p>
														</div>
														<div style="margin-top: 22px; height: 1px; width: 90%; margin-bottom: 16px; background-color: rgba(222, 222, 222, 0.46)"></div>

														${body}
													</td>
												</tr>
											</td>
										</tr>
									</table>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
			</html>`,
  };
};

export { email_verification_template, password_reset_template, payment_alert_template };
