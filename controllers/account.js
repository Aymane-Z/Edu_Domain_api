import { Router } from 'express';
import { body } from 'express-validator';
import utils from '../helpers/utils.js';
import uploader from '../helpers/uploader.js';
import Rbac from '../helpers/rbac.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
const router = Router();
/**
 * Route to view user account record
 * @GET /account
 */
router.get(['/','/index'], async (req, res) => {
	try{
		let recid = req.user.id;
		let query = {};
		let where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Usersnode.accountviewFields();
		let record = await DB.Usersnode.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
 * Route to get  Usersnode record for edit
 * @GET /usersnode/edit/{recid}
 */
router.get(['/edit'], async (req, res) => {
	try{
		const recid = req.user.id;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Usersnode.accounteditFields();
		let record = await DB.Usersnode.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
 * Route to update  Usersnode record
 * @POST /usersnode/edit/{recid}
 */
router.post(['/edit'], 
	[
		body('username').optional({nullable: true, checkFalsy: true}),
		body('photo').optional({nullable: true, checkFalsy: true}),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
		body('civilite').optional({nullable: true, checkFalsy: true}),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('nationalite').optional({nullable: true, checkFalsy: true}),
		body('telephone').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.user.id;
		let modeldata = req.getValidFormData({ includeOptionals: true });
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Usersnode.accounteditFields();
		let record = await DB.Usersnode.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Usersnode.update(modeldata, {where: where});
		record = await DB.Usersnode.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});
router.get('/currentuserdata', async function (req, res)
{
	const user = req.user;
	const userRole = user.user_role_id;
	const rbac = new Rbac(userRole);
	const pages = await rbac.getUserPages();
	const roles = await rbac.getRoleName();
    return res.ok({ user, pages, roles });
});
/**
 * Route to change user password
 * @POST /account
 */
router.post('/changepassword' , 
	[
		body('oldpassword').not().isEmpty(),
		body('newpassword').not().isEmpty(),
		body('confirmpassword').not().isEmpty().custom((value, {req}) => (value === req.body.newpassword))
	], validateFormData, async function (req, res) {
	try{
		let oldPassword = req.body.oldpassword;
		let newPassword = req.body.newpassword;
		let userId = req.user.id;
		let query = {};
		let where = {
			id: userId,
		};
		query.raw = true;
		query.where = where;
		query.attributes = ['password'];
		let user = await DB.Usersnode.findOne(query);
		let currentPasswordHash = user.password;
		if(!utils.passwordVerify(oldPassword, currentPasswordHash)){
			return res.badRequest("Current password is incorrect");
		}
		let modeldata = {
			password: utils.passwordHash(newPassword)
		}
		await DB.Usersnode.update(modeldata, {where: where});
		return res.ok("Password change completed");
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
