import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/demandelogement_list.js';
import exportViewPage from '../exports/demandelogement_view.js';
import mailer from '../helpers/mailer.js';
import config from '../config.js';
import ejs from 'ejs';


const router = Router();




/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['etat_demande'] = "soumise";
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/soumises/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/pending/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/valides/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/effectif/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

/**
 * Route to list demandelogement records
 * @GET /demandelogement/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/rejected/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.DemandeLogement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['etat_demande'] = "en attente%";
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportListFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.DemandeLogement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import DemandeLogement records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /demandelogement/importdata
 */
router.post('/importdata', fileUploadMiddleware('importdata'), async (req, res, next) => {
	if(req.files){	// files uploaded
		var uploadedPaths = req.files.map(function(v) {
			return v.path;
		});
		if(uploadedPaths.length){
			uploadedPaths.forEach(function (fpath){
				let records = [];
				csv.fromPath(fpath, {headers: true, ignoreEmpty: true}).on("data", function(data){
					if(data){
						const modeldata = {
							nom: data['nom'],
							prenom: data['prenom'],
							cin_client: data['cin_client'],
							date_naissance: data['date_naissance'],
							lieu_naissance: data['lieu_naissance'],
							situation_familiale: data['situation_familiale'],
							adresse_client: data['adresse_client'],
							code_postal_client: data['code_postal_client'],
							ville_client: data['ville_client'],
							pays_client: data['pays_client'],
							tel_1_client: data['tel_1_client'],
							tel_2_client: data['tel_2_client'],
							email_client: data['email_client'],
							etablissement: data['etablissement'],
							cycle_etudes: data['cycle_etudes'],
							nom_garant: data['nom_garant'],
							prenom_garant: data['prenom_garant'],
							cin_garant: data['cin_garant'],
							date_naissance_garant: data['date_naissance_garant'],
							lieu_naissance_garant: data['lieu_naissance_garant'],
							situation_familiale_garant: data['situation_familiale_garant'],
							lien_garant_client: data['lien_garant_client'],
							adresse_garant: data['adresse_garant'],
							code_postal_garant: data['code_postal_garant'],
							ville_garant: data['ville_garant'],
							pays_garant: data['pays_garant'],
							tel1_garant: data['tel1_garant'],
							tel2_garant: data['tel2_garant'],
							email_garant: data['email_garant'],
							profession: data['profession'],
							tel_bureau: data['tel_bureau'],
							fax: data['fax'],
							revenus_mensuels: data['revenus_mensuels'],
							id_unite_location: data['id_unite_location'],
							id_residence: data['id_residence'],
							etat_demande: data['etat_demande'],
							code_demande: data['code_demande'],
							id_dossier: data['id_dossier'],
							id_user: data['id_user'],
							id_client: data['id_client'],
							id_garant: data['id_garant'],
							type_chambre: data['type_chambre'],
							binome_souhaite: data['binome_souhaite'],
							cin_binome: data['cin_binome'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							id_type_chambre: data['id_type_chambre']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.DemandeLogement.bulkCreate(records);
						let numRows = affectedRows.length || 0;
						return res.ok(`${numRows} Records Imported`);
					}
					catch(err){
						return res.serverError(err);
					}
				});
			});
		}
	}
	else{
		return res.badRequest("Error uploading file")
	}
});


/**
 * Route to view DemandeLogement record
 * @GET /demandelogement/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.DemandeLogement.exportViewFields();
			let records = await DB.DemandeLogement.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.DemandeLogement.viewFields();
		let record = await DB.DemandeLogement.findOne(query);
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
 * Route to insert DemandeLogement record
 * @POST /demandelogement/add
 */
router.post('/add/', 
	[
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin_client').optional({nullable: true, checkFalsy: true}),
		body('date_naissance').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale').optional({nullable: true, checkFalsy: true}),
		body('adresse_client').optional({nullable: true, checkFalsy: true}),
		body('code_postal_client').optional({nullable: true, checkFalsy: true}),
		body('ville_client').optional({nullable: true, checkFalsy: true}),
		body('pays_client').optional({nullable: true, checkFalsy: true}),
		body('tel_1_client').optional({nullable: true, checkFalsy: true}),
		body('tel_2_client').optional({nullable: true, checkFalsy: true}),
		body('email_client').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('etablissement').optional({nullable: true, checkFalsy: true}),
		body('cycle_etudes').optional({nullable: true, checkFalsy: true}),
		body('nom_garant').optional({nullable: true, checkFalsy: true}),
		body('prenom_garant').optional({nullable: true, checkFalsy: true}),
		body('cin_garant').optional({nullable: true, checkFalsy: true}),
		body('date_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale_garant').optional({nullable: true, checkFalsy: true}),
		body('lien_garant_client').optional({nullable: true, checkFalsy: true}),
		body('adresse_garant').optional({nullable: true, checkFalsy: true}),
		body('code_postal_garant').optional({nullable: true, checkFalsy: true}),
		body('ville_garant').optional({nullable: true, checkFalsy: true}),
		body('pays_garant').optional({nullable: true, checkFalsy: true}),
		body('tel1_garant').optional({nullable: true, checkFalsy: true}),
		body('tel2_garant').optional({nullable: true, checkFalsy: true}),
		body('email_garant').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('profession').optional({nullable: true, checkFalsy: true}),
		body('tel_bureau').optional({nullable: true, checkFalsy: true}),
		body('fax').optional({nullable: true, checkFalsy: true}),
		body('revenus_mensuels').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_type_chambre').optional({nullable: true, checkFalsy: true}),
		body('type_chambre').optional({nullable: true, checkFalsy: true}),
		body('binome_souhaite').optional({nullable: true, checkFalsy: true}),
		body('cin_binome').optional({nullable: true, checkFalsy: true}),
		body('code_demande').optional({nullable: true, checkFalsy: true}),
		body('etat_demande').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_residence').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_dossier').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('id_garant').optional({nullable: true, checkFalsy: true}),
		body('id_user').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save DemandeLogement record
		let record = await DB.DemandeLogement.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  DemandeLogement record for edit
 * @GET /demandelogement/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		let allowedRoles = ["admin", "responsable_residence", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.DemandeLogement.editFields();
		let record = await DB.DemandeLogement.findOne(query);
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
 * Route to update  DemandeLogement record
 * @POST /demandelogement/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin_client').optional({nullable: true, checkFalsy: true}),
		body('date_naissance').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale').optional({nullable: true, checkFalsy: true}),
		body('adresse_client').optional({nullable: true, checkFalsy: true}),
		body('code_postal_client').optional({nullable: true, checkFalsy: true}),
		body('ville_client').optional({nullable: true, checkFalsy: true}),
		body('pays_client').optional({nullable: true, checkFalsy: true}),
		body('tel_1_client').optional({nullable: true, checkFalsy: true}),
		body('tel_2_client').optional({nullable: true, checkFalsy: true}),
		body('email_client').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('etablissement').optional({nullable: true, checkFalsy: true}),
		body('cycle_etudes').optional({nullable: true, checkFalsy: true}),
		body('nom_garant').optional({nullable: true, checkFalsy: true}),
		body('prenom_garant').optional({nullable: true, checkFalsy: true}),
		body('cin_garant').optional({nullable: true, checkFalsy: true}),
		body('date_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale_garant').optional({nullable: true, checkFalsy: true}),
		body('lien_garant_client').optional({nullable: true, checkFalsy: true}),
		body('adresse_garant').optional({nullable: true, checkFalsy: true}),
		body('code_postal_garant').optional({nullable: true, checkFalsy: true}),
		body('ville_garant').optional({nullable: true, checkFalsy: true}),
		body('pays_garant').optional({nullable: true, checkFalsy: true}),
		body('tel1_garant').optional({nullable: true, checkFalsy: true}),
		body('tel2_garant').optional({nullable: true, checkFalsy: true}),
		body('email_garant').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('profession').optional({nullable: true, checkFalsy: true}),
		body('tel_bureau').optional({nullable: true, checkFalsy: true}),
		body('fax').optional({nullable: true, checkFalsy: true}),
		body('revenus_mensuels').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_type_chambre').optional({nullable: true, checkFalsy: true}),
		body('type_chambre').optional({nullable: true, checkFalsy: true}),
		body('binome_souhaite').optional({nullable: true, checkFalsy: true}),
		body('cin_binome').optional({nullable: true, checkFalsy: true}),
		body('code_demande').optional({nullable: true, checkFalsy: true}),
		body('etat_demande').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_residence').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_dossier').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('id_garant').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.DemandeLogement.editFields();
		let record = await DB.DemandeLogement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.DemandeLogement.update(modeldata, {where: where});
		record = await DB.DemandeLogement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});

/**
 * Route to update  DemandeLogement record
 * @POST /demandelogement/edit/{recid}
 */
router.post('/continue/:recid', 
	[
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin_client').optional({nullable: true, checkFalsy: true}),
		body('date_naissance').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale').optional({nullable: true, checkFalsy: true}),
		body('adresse_client').optional({nullable: true, checkFalsy: true}),
		body('code_postal_client').optional({nullable: true, checkFalsy: true}),
		body('ville_client').optional({nullable: true, checkFalsy: true}),
		body('pays_client').optional({nullable: true, checkFalsy: true}),
		body('tel_1_client').optional({nullable: true, checkFalsy: true}),
		body('tel_2_client').optional({nullable: true, checkFalsy: true}),
		body('email_client').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('etablissement').optional({nullable: true, checkFalsy: true}),
		body('cycle_etudes').optional({nullable: true, checkFalsy: true}),
		body('nom_garant').optional({nullable: true, checkFalsy: true}),
		body('prenom_garant').optional({nullable: true, checkFalsy: true}),
		body('cin_garant').optional({nullable: true, checkFalsy: true}),
		body('date_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance_garant').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale_garant').optional({nullable: true, checkFalsy: true}),
		body('lien_garant_client').optional({nullable: true, checkFalsy: true}),
		body('adresse_garant').optional({nullable: true, checkFalsy: true}),
		body('code_postal_garant').optional({nullable: true, checkFalsy: true}),
		body('ville_garant').optional({nullable: true, checkFalsy: true}),
		body('pays_garant').optional({nullable: true, checkFalsy: true}),
		body('tel1_garant').optional({nullable: true, checkFalsy: true}),
		body('tel2_garant').optional({nullable: true, checkFalsy: true}),
		body('email_garant').optional({nullable: true, checkFalsy: true}).isEmail(),
		body('profession').optional({nullable: true, checkFalsy: true}),
		body('tel_bureau').optional({nullable: true, checkFalsy: true}),
		body('fax').optional({nullable: true, checkFalsy: true}),
		body('revenus_mensuels').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_type_chambre').optional({nullable: true, checkFalsy: true}),
		body('type_chambre').optional({nullable: true, checkFalsy: true}),
		body('binome_souhaite').optional({nullable: true, checkFalsy: true}),
		body('cin_binome').optional({nullable: true, checkFalsy: true}),
		body('code_demande').optional({nullable: true, checkFalsy: true}),
		body('etat_demande').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_residence').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_dossier').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('id_garant').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		let allowedRoles = ["admin", "responsable_residence", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.DemandeLogement.editFields();
		let record = await DB.DemandeLogement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.DemandeLogement.update(modeldata, {where: where});
		record = await DB.DemandeLogement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete DemandeLogement record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /demandelogement/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		let allowedRoles = ["admin", "responsable_residence", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.DemandeLogement.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.DemandeLogement.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to view DemandeLogement record
 * @GET /demandelogement/view/{recid}
 */
router.get('/vuedemande/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele", "client_temp"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.DemandeLogement.vuedemandeFields();
		let record = await DB.DemandeLogement.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function getNextRecordId(recid){
	let query = {};
	let where = {};
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
	let keyField = 'id';
	where[keyField] = { [DB.op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await DB.DemandeLogement.findOne(query);
	return (record ? record.id : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'id';
		let allowedRoles = ["admin", "responsable_residence", "client", "hotesse_accueil", "charge_clientele"];
		let userRole = req.userRoleName;
		if(!allowedRoles.includes(userRole)){
			where['id_user'] = req.user.id; //filter only current records
		}
	where[keyField] = { [DB.op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await DB.DemandeLogement.findOne(query);
	return (record ? record.id : null);
}
router.post('/newrentalrequest/:userId', async (req, res) => {
    const userId = req.params.userId;
    const t = await DB.sequelize.transaction();  // Start a transaction

    try {
		// Check if Demande-logement linked with the same user already exists
        const existingDemande = await DB.DemandeLogement.findOne({
            where: {
                id_user: userId,
                etat_demande: 'soumise'
            },
            transaction: t
        });
        if (existingDemande) {
            await t.commit();  // Commit transaction before returning
            return res.json({ success: true, message: 'Existing demande logement found', id: existingDemande.id });
        }
        
        const userRecord = await DB.Usersnode.findByPk(userId, { transaction: t });
        if (!userRecord) {
            await t.rollback();  // Rollback transaction before returning
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if client with the same CIN already exists
        const existingClient = await DB.Client.findOne({
            where: {
                cin: userRecord.cin
            },
            transaction: t
        });
        if (existingClient) {
            await t.commit();  // Commit transaction before returning
            return res.status(409).json({ success: false, message: 'Client with the same CIN already exists', id_client: existingClient.id });
        }

        const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const lastDemande = await DB.DemandeLogement.findOne({
            where: {
                code_demande: {
                    [DB.op.like]: `${datePrefix}%`
                }
            },
            order: [['code_demande', 'DESC']],
            transaction: t
        });
        let number = 1;
        if (lastDemande) {
            const lastNumber = parseInt(lastDemande.code_demande.slice(9));
            number = lastNumber + 1;
        }
        
        const codeClient = `${userRecord.nom}${userRecord.prenom}-${datePrefix}`;
        const newClientData = {
            code: codeClient,
            nom_prenom: `${userRecord.nom} ${userRecord.prenom}`,
            cin: userRecord.cin,
            tel1: userRecord.telephone,
            mail: userRecord.email
        };
        const newClient = await DB.Client.create(newClientData, { transaction: t });

        const codeDemande = `DL-${datePrefix}-${String(number).padStart(3, '0')}`;
        const newDemandeData = {
            code_demande: codeDemande,
            nom: userRecord.nom,
            prenom: userRecord.prenom,
            cin_client: userRecord.cin,
            email_client: userRecord.email,
            tel_1_client: userRecord.telephone,
            id_user: userId,
            pays_client: userRecord.nationalite,
            etat_demande: 'soumise',
            id_client: newClient.id
        };
        const newDemande = await DB.DemandeLogement.create(newDemandeData, { transaction: t });

        await t.commit();  
        res.json({ success: true, message: 'Demande logement created successfully', id: newDemande.id, id_client: newClient.id });
    } catch (error) {
        await t.rollback();  
        console.error("Failed to create demande logement:", error);
        res.status(500).json({ success: false, message: 'Failed to create demande logement' });
    }
});

router.post('/assignunit', async (req, res) => {
    try {
        const { id_demande_logement} = req.body;
        
        let sqltext = `CALL InsertAndUpdateEtatUnite(:id_demande_logement)`;
        let queryParams = {
            id_demande_logement: id_demande_logement
        };
		//console.log('///////////////////////////////////////////////etat :',params[0]);
        let result = await DB.rawQuery(sqltext, { replacements: queryParams });

        res.ok(result);
    } catch (err) {
        console.error('Error executing the stored procedure:', err);
        return res.serverError(err);
    }
});

router.post('/validated/:user_id', async (req,res)=>{
	try {
		//const { user_id} = req.body;
		const user_id = req.params.user_id;
		const query = {}
		const where = {}
		where['id'] = user_id;
		query.raw = true;
		query.where = where;
		let user = await DB.Usersnode.findOne(query);
		if(!user){
			return res.notFound();
		}
		await sendEmailValidation(user.prenom,user.email);
		return res.ok("Email of payment validation has been sent");
	} catch (error) {
		console.error('Error executing the stored procedure:', error);
        return res.serverError(error);
	}
});

async function sendEmailValidation(prenom,useremail){
	let mailtitle = "Payment has been validated";
	let username = prenom;
	let email = useremail;
	let portalLink = config.app.frontendUrl;
	let viewData = {username, portalLink, config};
	let mailbody = await ejs.renderFile("views/pages/index/paymentvalidated.ejs", viewData);
	let mailResult = await mailer.sendMail(email, mailtitle, mailbody);
	if(!mailResult.messageId){
		throw new Error(mailResult.error);
	}
	return true;
}

export default router;
