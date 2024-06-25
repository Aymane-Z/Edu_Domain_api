import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/encaissement_list.js';
import exportViewPage from '../exports/encaissement_view.js';
import exportFraisreservationPage from '../exports/encaissement_fraisreservation.js';
import exportExternesPage from '../exports/encaissement_externes.js';
import exportNonvalidesPage from '../exports/encaissement_nonvalides.js';
import exportValidesPage from '../exports/encaissement_valides.js';
import Stripe from 'stripe';
import express from 'express';

const stripe = Stripe('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

const router = Router();


const YOUR_DOMAIN = 'http://localhost:8050/index';

router.post('/create-checkout-session', async (req, res) => {
    const nexturl=req.next;
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
  
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/paymentsuccess?success=true&session_id={CHECKOUT_SESSION_ID}&next=${nexturl}`,
      cancel_url: `${YOUR_DOMAIN}/paymentcancelled?canceled=true`,
    });
  
    res.redirect(303, session.url);
  });
  
  router.post('/create-portal-session', async (req, res) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const { session_id } = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
  
    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = YOUR_DOMAIN;
  
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });
  
    res.redirect(303, portalSession.url);
  });
  
  router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
      let event = request.body;
      // Replace this endpoint secret with your endpoint's unique secret
      // If you are testing with the CLI, find the secret by running 'stripe listen'
      // If you are using an endpoint defined with the API or dashboard, look in your webhook settings 
      // at https://dashboard.stripe.com/webhooks
      const endpointSecret = 'whsec_12345';
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
      }
      let subscription;
      let status;
      // Handle the event
      switch (event.type) {
        case 'customer.subscription.trial_will_end':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription trial ending.
          // handleSubscriptionTrialEnding(subscription);
          break;
        case 'customer.subscription.deleted':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription deleted.
          // handleSubscriptionDeleted(subscriptionDeleted);
          break;
        case 'customer.subscription.created':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription created.
          // handleSubscriptionCreated(subscription);
          break;
        case 'customer.subscription.updated':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription update.
          // handleSubscriptionUpdated(subscription);
          break;
        case 'entitlements.active_entitlement_summary.updated':
          subscription = event.data.object;
          console.log(`Active entitlement summary updated for ${subscription}.`);
          // Then define and call a method to handle active entitlement summary updated
          // handleEntitlementUpdated(subscription);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );




/**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Encaissement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Encaissement.exportListFields();
			let records = await DB.Encaissement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Encaissement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Encaissement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Encaissement records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /encaissement/importdata
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
							date: data['date'],
							montant: data['montant'],
							observation: data['observation'],
							id_client: data['id_client'],
							user_id: data['user_id'],
							id_facture: data['id_facture'],
							id_unite_location: data['id_unite_location'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							status: data['status']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Encaissement.bulkCreate(records);
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
 * Route to view Encaissement record
 * @GET /encaissement/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Encaissement.exportViewFields();
			let records = await DB.Encaissement.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Encaissement.viewFields();
		let record = await DB.Encaissement.findOne(query);
		if(!record){
			return res.notFound();
		}
			record.nextRecordId = await getNextRecordId(recid);
			record.previousRecordId = await getPreviousRecordId(recid);
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Encaissement record
 * @POST /encaissement/add
 */
router.post('/add/', 
	[
		body('date').optional({nullable: true, checkFalsy: true}),
		body('montant').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('id_facture').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Encaissement record
		let record = await DB.Encaissement.create(modeldata);
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
 * Route to get  Encaissement record for edit
 * @GET /encaissement/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Encaissement.editFields();
		let record = await DB.Encaissement.findOne(query);
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
 * Route to update  Encaissement record
 * @POST /encaissement/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('date').optional({nullable: true, checkFalsy: true}),
		body('montant').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('id_facture').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Encaissement.editFields();
		let record = await DB.Encaissement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Encaissement.update(modeldata, {where: where});
		record = await DB.Encaissement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Encaissement record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /encaissement/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Encaissement.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Encaissement.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Encaissement record for edit
 * @GET /encaissement/edit/{recid}
 */
router.get('/paiement/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Encaissement.paiementFields();
		let record = await DB.Encaissement.findOne(query);
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
 * Route to update  Encaissement record
 * @POST /encaissement/edit/{recid}
 */
router.post('/paiement/:recid', 
	[
		body('date').optional({nullable: true, checkFalsy: true}),
		body('montant').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('id_facture').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true, checkFalsy: true}).isNumeric(),
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
		query.attributes = DB.Encaissement.paiementFields();
		let record = await DB.Encaissement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Encaissement.update(modeldata, {where: where});
		record = await DB.Encaissement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
 */
router.get('/fraisreservation/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Encaissementdetails,
			required: true,
			as: 'encaissementdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Encaissement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Encaissement.exportFraisreservationFields();
			let records = await DB.Encaissement.findAll(query);
			return exportFraisreservationPage(records, req, res)
		}
		query.attributes = DB.Encaissement.fraisreservationFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Encaissement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
 */
router.get('/externes/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Encaissementdetails,
			required: true,
			as: 'encaissementdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Encaissement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.id_residence){
			let vals = req.query.id_residence
			queryFilters.push(DB.filterBy("encaissementdetails.id_residence", { [DB.op.in]: vals }))
		}
		if(req.query.designation){
			let vals = req.query.designation
			queryFilters.push(DB.filterBy("encaissementdetails.designation", { [DB.op.in]: vals }))
		}
		if(req.query.banque){
			let vals = req.query.banque
			queryFilters.push(DB.filterBy("encaissementdetails.banque", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Encaissement.exportExternesFields();
			let records = await DB.Encaissement.findAll(query);
			return exportExternesPage(records, req, res)
		}
		query.attributes = DB.Encaissement.externesFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Encaissement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
 */
router.get('/nonvalides/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Encaissementdetails,
			required: true,
			as: 'encaissementdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Encaissement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['status'] = "en attente";
		
		if(req.query.id_residence){
			let vals = req.query.id_residence
			queryFilters.push(DB.filterBy("encaissementdetails.id_residence", { [DB.op.in]: vals }))
		}
		if(req.query.designation){
			let vals = req.query.designation
			queryFilters.push(DB.filterBy("encaissementdetails.designation", { [DB.op.in]: vals }))
		}
		if(req.query.banque){
			let vals = req.query.banque
			queryFilters.push(DB.filterBy("encaissementdetails.banque", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Encaissement.exportNonvalidesFields();
			let records = await DB.Encaissement.findAll(query);
			return exportNonvalidesPage(records, req, res)
		}
		query.attributes = DB.Encaissement.nonvalidesFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Encaissement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
 */
router.get('/valides/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Facture,
			required: true,
			as: 'facture',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Encaissementdetails,
			required: true,
			as: 'encaissementdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Encaissement.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['status'] = "valides";
		
		if(req.query.id_residence){
			let vals = req.query.id_residence
			queryFilters.push(DB.filterBy("encaissementdetails.id_residence", { [DB.op.in]: vals }))
		}
		if(req.query.designation){
			let vals = req.query.designation
			queryFilters.push(DB.filterBy("encaissementdetails.designation", { [DB.op.in]: vals }))
		}
		if(req.query.banque){
			let vals = req.query.banque
			queryFilters.push(DB.filterBy("encaissementdetails.banque", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Encaissement.exportValidesFields();
			let records = await DB.Encaissement.findAll(query);
			return exportValidesPage(records, req, res)
		}
		query.attributes = DB.Encaissement.validesFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Encaissement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});

   /**
 * Route to list encaissement records
 * @GET /encaissement/index/{fieldname}/{fieldvalue}
 */
   router.get('/paiementdetails/recid/:recid', async (req, res) => {  
    try{
        const recid = req.params.recid;
		
        let sqltext = `
            SELECT Encaissement.id AS encaissement_id,
			Encaissement.date AS encaissement_date,
			Encaissement.montant AS encaissement_montant,
			Encaissement.observation AS encaissement_observation,
			Encaissement.id_client AS encaissement_id_client,
			Encaissement.user_id AS encaissement_user_id,
			Encaissement.id_facture AS encaissement_id_facture,
			Encaissement.id_unite_location AS encaissement_id_unite_location,
		
			Unitelocationdetails.id AS unitelocationdetails_id,
			Unitelocationdetails.code AS unitelocationdetails_code,
			Unitelocationdetails.designation AS unitelocationdetails_designation,
			Unitelocationdetails.type AS unitelocationdetails_type,
			Unitelocationdetails.description AS unitelocationdetails_description,
			Unitelocationdetails.etat_physique AS unitelocationdetails_etat_physique,
			Unitelocationdetails.observation AS unitelocationdetails_observation,
			Unitelocationdetails.id_chambre AS unitelocationdetails_id_chambre,
			Unitelocationdetails.id_typechambre AS unitelocationdetails_id_typechambre,
			Unitelocationdetails.id_couloir AS unitelocationdetails_id_couloir,
			Unitelocationdetails.id_pavillon AS unitelocationdetails_id_pavillon,
			Unitelocationdetails.id_batiment AS unitelocationdetails_id_batiment,
			Unitelocationdetails.id_residence AS unitelocationdetails_id_residence,
			Unitelocationdetails.id_responsable AS unitelocationdetails_id_responsable,
			Unitelocationdetails.id_proprietaire AS unitelocationdetails_id_proprietaire,
		
			Facture.id AS facture_id,
			Facture.code AS facture_code,
			Facture.dt_facture AS facture_dt_facture,
			
		
			usersnode.id AS usersnode_id,
			usersnode.username AS usersnode_username,
			usersnode.password AS usersnode_password,
			usersnode.email AS usersnode_email,
			usersnode.photo AS usersnode_photo,
			usersnode.user_role_id AS usersnode_user_role_id,
			usersnode.date_created AS usersnode_date_created,
			usersnode.date_updated AS usersnode_date_updated,
			usersnode.civilite AS usersnode_civilite,
			usersnode.nom AS usersnode_nom,
			usersnode.prenom AS usersnode_prenom,
			usersnode.cin AS usersnode_cin,
			usersnode.nationalite AS usersnode_nationalite,
			usersnode.telephone AS usersnode_telephone,
			usersnode.email_verified_at AS usersnode_email_verified_at,
		
			famille_unite.id AS famille_unite_id,
			famille_unite.code AS famille_unite_code,
			famille_unite.designation AS famille_unite_designation,
			famille_unite.type AS famille_unite_type,
			famille_unite.prix AS famille_unite_prix,
			famille_unite.photo AS famille_unite_photo,
		
			demande_logement.id AS demande_logement_id,
			demande_logement.nom AS demande_logement_nom,
			demande_logement.prenom AS demande_logement_prenom,
			demande_logement.cin_client AS demande_logement_cin_client,
			demande_logement.date_naissance AS demande_logement_date_naissance,
			demande_logement.lieu_naissance AS demande_logement_lieu_naissance,
			demande_logement.situation_familiale AS demande_logement_situation_familiale,
			demande_logement.adresse_client AS demande_logement_adresse_client,
			demande_logement.code_postal_client AS demande_logement_code_postal_client,
			demande_logement.ville_client AS demande_logement_ville_client,
			demande_logement.pays_client AS demande_logement_pays_client,
			demande_logement.tel_1_client AS demande_logement_tel_1_client,
			demande_logement.tel_2_client AS demande_logement_tel_2_client,
			demande_logement.email_client AS demande_logement_email_client,
			demande_logement.etablissement AS demande_logement_etablissement,
			demande_logement.cycle_etudes AS demande_logement_cycle_etudes,
			demande_logement.nom_garant AS demande_logement_nom_garant,
			demande_logement.prenom_garant AS demande_logement_prenom_garant,
			demande_logement.cin_garant AS demande_logement_cin_garant,
			demande_logement.date_naissance_garant AS demande_logement_date_naissance_garant,
			demande_logement.lieu_naissance_garant AS demande_logement_lieu_naissance_garant,
			demande_logement.situation_familiale_garant AS demande_logement_situation_familiale_garant,
			demande_logement.lien_garant_client AS demande_logement_lien_garant_client,
			demande_logement.adresse_garant AS demande_logement_adresse_garant,
			demande_logement.code_postal_garant AS demande_logement_code_postal_garant,
			demande_logement.ville_garant AS demande_logement_ville_garant,
			demande_logement.pays_garant AS demande_logement_pays_garant,
			demande_logement.tel1_garant AS demande_logement_tel1_garant,
			demande_logement.tel2_garant AS demande_logement_tel2_garant,
			demande_logement.email_garant AS demande_logement_email_garant,
			demande_logement.profession AS demande_logement_profession,
			demande_logement.tel_bureau AS demande_logement_tel_bureau,
			demande_logement.fax AS demande_logement_fax,
			demande_logement.revenus_mensuels AS demande_logement_revenus_mensuels,
			demande_logement.id_unite_location AS demande_logement_id_unite_location,
			demande_logement.etat_demande AS demande_logement_etat_demande,
			demande_logement.code_demande AS demande_logement_code_demande,
			demande_logement.id_dossier AS demande_logement_id_dossier,
			demande_logement.id_user AS demande_logement_id_user,
			demande_logement.id_client AS demande_logement_id_client,
			demande_logement.id_garant AS demande_logement_id_garant,
			demande_logement.type_chambre AS demande_logement_type_chambre,
			demande_logement.id_type_chambre AS demande_logement_id_type_chambre,
			demande_logement.binome_souhaite AS demande_logement_binome_souhaite,
			demande_logement.cin_binome AS demande_logement_cin_binome 
            FROM \`encaissement\` AS \`encaissement\`
            INNER JOIN \`unitelocationdetails\` AS \`unitelocationdetails\` ON \`encaissement\`.\`id_unite_location\` = \`unitelocationdetails\`.\`id\`
            INNER JOIN \`facture\` AS \`facture\` ON \`encaissement\`.\`id_facture\` = \`facture\`.\`id\`
            INNER JOIN \`usersnode\` AS \`usersnode\` ON \`encaissement\`.\`user_id\` = \`usersnode\`.\`id\`
            INNER JOIN \`famille_unite\` AS \`famille_unite\` ON \`unitelocationdetails\`.\`id_typechambre\` = \`famille_unite\`.\`id\`
            INNER JOIN \`demande_logement\` AS \`demande_logement\` ON \`usersnode\`.\`id\` = \`demande_logement\`.\`id_user\`
            WHERE \`encaissement\`.\`id\` = :recid;
        `;
        let queryParams = {
            recid: recid // Bind the parameter to avoid SQL injection
        };
		let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let records = await DB.rawQueryList(sqltext, queryParams); // Assuming rawQuery is a method in your DB handling code that can execute raw SQL queries.
        return res.ok(records);
    }
    catch(err) {
        return res.serverError(err);
    }
});




/**
 * Route to update  Encaissement record
 * @POST /encaissement/edit/{recid}
 */
router.post('/paiement/:recid', 
	[
		body('montant').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_facture').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}).isNumeric(),
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
		query.attributes = DB.Encaissement.paiementFields();
		let record = await DB.Encaissement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Encaissement.update(modeldata, {where: where});
		record = await DB.Encaissement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


router.get('/last/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where[DB.op.and] = [
			{ 'user_id': recid },  
			{ 'status': 'en attente' }   
		];
		
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Encaissement.exportViewFields();
			let records = await DB.Encaissement.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Encaissement.lastFields();
		let record = await DB.Encaissement.findOne(query);
		if(!record){
			return res.notFound();
		}
			record.nextRecordId = await getNextRecordId(recid);
			record.previousRecordId = await getPreviousRecordId(recid);
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'id';
	where[keyField] = { [DB.op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await DB.Encaissement.findOne(query);
	return (record ? record.id : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'id';
	where[keyField] = { [DB.op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await DB.Encaissement.findOne(query);
	return (record ? record.id : null);
}
export default router;
