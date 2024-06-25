import { Router } from 'express';
import DB from '../models/db.js';
import exportListPage from '../exports/chambredetails_list.js';
import exportViewPage from '../exports/chambredetails_view.js';


const router = Router();




/**
 * Route to list chambredetails records
 * @GET /chambredetails/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Chambredetails.searchFields();
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
			query.attributes = DB.Chambredetails.exportListFields();
			let records = await DB.Chambredetails.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Chambredetails.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Chambredetails.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
