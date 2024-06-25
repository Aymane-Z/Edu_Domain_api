import { Router } from 'express';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import { body } from 'express-validator';
import config from '../config.js';
import utils from '../helpers/utils.js';
import mailer from '../helpers/mailer.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();


/**
 * Route to login user using credential
 * @POST /auth/login
 */
router.post('/login', [
		body('username').trim().not().isEmpty(),
		body('password').not().isEmpty(),
	], validateFormData, async (req, res, next) => {
	try{
		let { username, password } = req.body;
		
		let user = await DB.Usersnode.findOne({where: {[DB.op.or]: {email: username, username: username}}});
		if(!user){
			return res.unauthorized("Username or password not correct");
		}
		if(!utils.passwordVerify(password, user.password)){
			return res.unauthorized("Username or password not correct");
		}
		// Check if user email is verified.
		if( !user.hasVerifiedEmail() ){
			let token = generateUserToken(user);
			let nextpage = `/index/verifyemail?token=${token}`;
			return res.ok({nextpage});
		}
		
		req.writeToAuditLog({ recid: user['id'] });
		let loginData = await getUserLoginData(user);
		return res.ok(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to register new user
 * @POST /auth/register
 */
router.post('/register', 
	[
		body('civilite').optional({nullable: true, checkFalsy: true}),
		body('username').not().isEmpty(),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('nationalite').optional({nullable: true, checkFalsy: true}),
		body('email').not().isEmpty().isEmail(),
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('telephone').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata.password = utils.passwordHash(modeldata.password);
		
		// set default role for user
		const roleId =  await DB.Roles.findValue('role_id', {role_name: 'Client_temp'});
		modeldata['user_role_id'] = roleId;
		modeldata. email_verified_at = null;
		
		// check if username already exist.
		let usernameCount = await DB.Usersnode.count({ where:{ 'username': modeldata.username } });
		if(usernameCount > 0){
			return res.badRequest(`${modeldata.username} already exist.`);
		}
		
		// check if cin already exist.
		let cinCount = await DB.Usersnode.count({ where:{ 'cin': modeldata.cin } });
		if(cinCount > 0){
			return res.badRequest(`${modeldata.cin} already exist.`);
		}
		
		// check if email already exist.
		let emailCount = await DB.Usersnode.count({ where:{ 'email': modeldata.email } });
		if(emailCount > 0){
			return res.badRequest(`${modeldata.email} already exist.`);
		}
		
		const record = await DB.Usersnode.create(modeldata);
		const user = record;
		const recid =  record['id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		await sendEmailVerication(user);
		let token = generateUserToken(user);
		let nextpage = `/index/verifyemail?token=${token}`;
		return res.ok({nextpage});
	}
	catch(err){
		return res.serverError(err);
	}
});




/**
* Verify user account
*/
router.get("/verifyemail", async (req, res) => {
	try{
		let token = req.query.token;
		let userid = getUserIDFromJwt(token)  //get user id from token payload
		let query = {
			where: {"id": userid },
		}
		let user = await DB.Usersnode.findOne(query);
		if(!user){
			return res.badRequest("The email verification link is not valid");
		}
		user.markEmailAsVerified();
		await user.save();
		req.writeToAuditLog({ recid: user['id'] });
		let emailVerifiedPage = `${config.app.frontendUrl}/index/emailverified`;
		return res.redirect(emailVerifiedPage);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
* Resend verify email message to user email 
*/
router.post("/resendverifyemail", async (req, res) => {
	try{
		let token = req.body.token;
		let userid = getUserIDFromJwt(token); //get user id from token payload
		let query = {
			where: {"id": userid },
		}
		let user = await DB.Usersnode.findOne(query);
		if(user.email_verified_at){
			return res.badRequest("Email already verified.");
		}
		await sendEmailVerication(user);
		req.writeToAuditLog({ recid: user['id'] });
		
		return res.ok("Email verification link has been resent");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Send account verification link to user email 
*/
async function sendEmailVerication(user){
	let token = generateUserToken(user);
	let verifylink = `${config.app.url}/api/auth/verifyemail/?token=${token}`;
	let mailtitle = "Email Address Verification";
	let username = user.username;
	let email = user.email;
	let viewData = {username, verifylink, config};
	let mailbody = await ejs.renderFile("views/pages/index/emailverify_template.ejs", viewData);
	let mailResult = await mailer.sendMail(email, mailtitle, mailbody);
	if(!mailResult.messageId){
		throw new Error(mailResult.error);
	}
	return true;
}


/**
 * Route to send password reset link to user email
 * @POST /auth/forgotpassword
 */
router.post('/forgotpassword', [
		body('email').not().isEmpty().isEmail(),
	], validateFormData, async (req, res) => {
	try{
		const modeldata = req.getValidFormData();
		const email = modeldata.email;
		const user = await DB.Usersnode.findOne({where: { 'email': email} });
		if(!user){
			return res.notFound("Email not registered");
		}
		await sendPasswordResetLink(user);
		req.writeToAuditLog({ recid: user['id'] });
		
		return res.ok("We have emailed your password reset link!");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to reset user password
 * @POST /auth/resetpassword
 */
router.post('/resetpassword', [
		body('password').not().isEmpty().custom((val, { req, loc, path }) => {
			if (val !== req.body.confirm_password) {
				throw new Error("Passwords confirmation does not match");
			} else {
				return val;
			}
        }),
	], validateFormData,  async (req, res) => {
	try{
		const token = req.body.token;
		const userid = getUserIDFromJwt(token);
		const password = req.body.password;
		const where = {id: userid }
		const record = await DB.Usersnode.findOne({where: where});
		if(!record){
			return res.notFound("User not found");
		}
		const newPassword = utils.passwordHash(password);
		const modeldata = { password: newPassword }
		await DB.Usersnode.update(modeldata, {where: where});
		req.writeToAuditLog({ recid: record['id'] });
		
		return res.ok("Password changed");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Send password reset link to user email 
*/
async function sendPasswordResetLink(user){
	let token = generateUserToken(user);
	let resetlink = `${config.app.frontendUrl}/index/resetpassword?token=${token}`;
	let username = user.username;
	let email = user.email;
	let mailtitle = 'Password Reset';
	
	
	let viewData = { username, email, resetlink, config };
	let mailbody = await ejs.renderFile("views/pages/index/password_reset_email_template.ejs", viewData);
	
	let mailResult = await mailer.sendMail(email, mailtitle, mailbody);
	if(!mailResult.messageId){
		throw new Error(mailResult.error);
	}
	return true;
}


/**
 * Return user login data
 * generate a signed jwt for the user
 * @param {object} user - current user
 */
async function getUserLoginData(user){
	const expiresIn = config.auth.jwtDuration + 'm' //in minutes;
	const userid = user.id;
	const token = jwt.sign({ sub: userid }, config.auth.apiTokenSecret, { expiresIn });
	return { token }; //return user object and token
}


/**
 * Generate user auth token
 * @param {object} user - current user
 */
function generateUserToken(user){
	const expiresIn = '10m' //in minutes;
	const userid = user.id;
	const token = jwt.sign({ sub: userid }, config.auth.userTokenSecret, { expiresIn });
	return token;
}


/**
 * Get userid from jwt token
 * @param {string} token
 */
function getUserIDFromJwt(token){
	try {
		let decoded = jwt.verify(token, config.auth.userTokenSecret);
		return decoded.sub
	}
	catch (err) {
		throw new Error(err);
	}
}
export default router;
