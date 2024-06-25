import { Router } from 'express';
import DB from '../models/db.js';
import utils from '../helpers/utils.js';

const router = Router();


 /**
 * Route to get id_residence_option_list records
 * @GET /components_data/id_residence_option_list
 */
router.get('/id_residence_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM residence` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_residence_option_list_2 records
 * @GET /components_data/id_residence_option_list_2
 */
router.get('/id_residence_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, denomination as label FROM residence` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_couloir_option_list records
 * @GET /components_data/id_couloir_option_list
 */
router.get('/id_couloir_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, denomination as label FROM couloir` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_type_option_list records
 * @GET /components_data/id_type_option_list
 */
router.get('/id_type_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, type as label FROM famille_unite` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_pavillon_option_list records
 * @GET /components_data/id_pavillon_option_list
 */
router.get('/id_pavillon_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, denomination as label FROM pavillon` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_etage_option_list records
 * @GET /components_data/id_etage_option_list
 */
router.get('/id_etage_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, id as label FROM etage` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_type_chambre_option_list records
 * @GET /components_data/id_type_chambre_option_list
 */
router.get('/id_type_chambre_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value,designation AS label FROM famille_unite` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get binome_souhaite_option_list records
 * @GET /components_data/binome_souhaite_option_list
 */
router.get('/binome_souhaite_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,nom_prenom AS label FROM client` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get cin_binome_option_list records
 * @GET /components_data/cin_binome_option_list
 */
router.get('/cin_binome_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT cin AS value,cin AS label FROM client` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_dossier_option_list records
 * @GET /components_data/id_dossier_option_list
 */
router.get('/id_dossier_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,id AS label FROM dossier_location` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_garant_option_list records
 * @GET /components_data/id_garant_option_list
 */
router.get('/id_garant_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,code AS label FROM garant` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_user_option_list records
 * @GET /components_data/id_user_option_list
 */
router.get('/id_user_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,email AS label FROM usersnode` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_client_option_list records
 * @GET /components_data/id_client_option_list
 */
router.get('/id_client_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, nom_prenom as label FROM client` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_unite_location_option_list records
 * @GET /components_data/id_unite_location_option_list
 */
router.get('/id_unite_location_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, id as label FROM unite_location` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_contrat_option_list records
 * @GET /components_data/id_contrat_option_list
 */
router.get('/id_contrat_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, ref_contrat as label FROM contrat` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get user_id_option_list records
 * @GET /components_data/user_id_option_list
 */
router.get('/user_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, username as label FROM usersnode` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_facture_option_list records
 * @GET /components_data/id_facture_option_list
 */
router.get('/id_facture_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, ref_contrat as label FROM facture` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_unite_location_option_list_2 records
 * @GET /components_data/id_unite_location_option_list_2
 */
router.get('/id_unite_location_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM unite_location` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_famille_equipement_option_list records
 * @GET /components_data/id_famille_equipement_option_list
 */
router.get('/id_famille_equipement_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM famille_equipement` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get etat_option_list records
 * @GET /components_data/etat_option_list
 */
router.get('/etat_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT etat AS value,etat AS label FROM etat_unite` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_facturation_option_list records
 * @GET /components_data/id_facturation_option_list
 */
router.get('/id_facturation_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, dt_facturation as label FROM facturation` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_garant_option_list_2 records
 * @GET /components_data/id_garant_option_list_2
 */
router.get('/id_garant_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, denomination as label FROM garant` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_demande_logement_option_list records
 * @GET /components_data/id_demande_logement_option_list
 */
router.get('/id_demande_logement_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code_demande as label FROM demande_logement` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_facture_option_list_2 records
 * @GET /components_data/id_facture_option_list_2
 */
router.get('/id_facture_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM facture` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_base_tarif_option_list records
 * @GET /components_data/id_base_tarif_option_list
 */
router.get('/id_base_tarif_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM base_tarification` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_batiment_option_list records
 * @GET /components_data/id_batiment_option_list
 */
router.get('/id_batiment_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM batiment` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get role_id_option_list records
 * @GET /components_data/role_id_option_list
 */
router.get('/role_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT role_id AS value,role_name AS label FROM roles` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get permissionsnode_page_name_autofill records
 * @GET /components_data/permissionsnode_page_name_autofill
 */
router.get('/permissionsnode_page_name_autofill', async (req, res) => {
	try{
		let sqltext = `SELECT page_name FROM permissionsnode WHERE page_name=:value` ;
		let queryParams = {};
		queryParams['value'] = req.query.value;
		let records = await DB.rawQueryList(sqltext, queryParams,);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get permissionsnode_action_name_autofill records
 * @GET /components_data/permissionsnode_action_name_autofill
 */
router.get('/permissionsnode_action_name_autofill', async (req, res) => {
	try{
		let sqltext = `SELECT action_name FROM permissionsnode WHERE action_name=:value` ;
		let queryParams = {};
		queryParams['value'] = req.query.value;
		let records = await DB.rawQueryList(sqltext, queryParams,);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get page_name_option_list records
 * @GET /components_data/page_name_option_list
 */
router.get('/page_name_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT page_name AS value,page_name AS label FROM permissionsnode` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get action_name_option_list records
 * @GET /components_data/action_name_option_list
 */
router.get('/action_name_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT action_name AS value,action_name AS label FROM permissionsnode` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_dossierlocation_option_list records
 * @GET /components_data/id_dossierlocation_option_list
 */
router.get('/id_dossierlocation_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, concat('Dossier de Location N°',id) as label FROM dossier_location;` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_responsable_option_list records
 * @GET /components_data/id_responsable_option_list
 */
router.get('/id_responsable_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, nom_prenom as label FROM responsable` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_proprietaire_option_list records
 * @GET /components_data/id_proprietaire_option_list
 */
router.get('/id_proprietaire_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, denomination as label FROM proprietaire` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_chambre_option_list records
 * @GET /components_data/id_chambre_option_list
 */
router.get('/id_chambre_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id as value, code as label FROM chambre` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Usersnode table
 * @GET /components_data/usersnode_username_exist/{fieldvalue}
 */
router.get('/usersnode_username_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Usersnode.count({ where:{ 'username': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Usersnode table
 * @GET /components_data/usersnode_cin_exist/{fieldvalue}
 */
router.get('/usersnode_cin_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Usersnode.count({ where:{ 'cin': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Usersnode table
 * @GET /components_data/usersnode_email_exist/{fieldvalue}
 */
router.get('/usersnode_email_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Usersnode.count({ where:{ 'email': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get user_role_id_option_list records
 * @GET /components_data/user_role_id_option_list
 */
router.get('/user_role_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT role_id AS value, role_name AS label FROM Roles` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_residence_option_list_3 records
 * @GET /components_data/id_residence_option_list_3
 */
router.get('/id_residence_option_list_3', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value,denomination AS label FROM residence` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_residence_option_list_4 records
 * @GET /components_data/id_residence_option_list_4
 */
router.get('/id_residence_option_list_4', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,denomination AS label FROM residence` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_batiment_option_list_2 records
 * @GET /components_data/id_batiment_option_list_2
 */
router.get('/id_batiment_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,denomination AS label FROM batiment ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_pavillon_option_list_2 records
 * @GET /components_data/id_pavillon_option_list_2
 */
router.get('/id_pavillon_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,denomination AS label FROM pavillon ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_couloir_option_list_2 records
 * @GET /components_data/id_couloir_option_list_2
 */
router.get('/id_couloir_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,denomination AS label FROM couloir ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_type_option_list_2 records
 * @GET /components_data/id_type_option_list_2
 */
router.get('/id_type_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,type AS label FROM famille_unite` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_batiment_option_list_3 records
 * @GET /components_data/id_batiment_option_list_3
 */
router.get('/id_batiment_option_list_3', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value,denomination AS label FROM batiment ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_pavillon_option_list_3 records
 * @GET /components_data/id_pavillon_option_list_3
 */
router.get('/id_pavillon_option_list_3', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value,denomination AS label FROM pavillon ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get designation_option_list records
 * @GET /components_data/designation_option_list
 */
router.get('/designation_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT designation AS value,designation AS label FROM base_tarification` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get type_option_list records
 * @GET /components_data/type_option_list
 */
router.get('/type_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT type AS value,type AS label FROM famille_unite` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_responsable_option_list_2 records
 * @GET /components_data/id_responsable_option_list_2
 */
router.get('/id_responsable_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,nom_prenom AS label FROM responsable` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_proprietaire_option_list_2 records
 * @GET /components_data/id_proprietaire_option_list_2
 */
router.get('/id_proprietaire_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,code AS label FROM proprietaire` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_chambre_option_list_2 records
 * @GET /components_data/id_chambre_option_list_2
 */
router.get('/id_chambre_option_list_2', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,code AS label FROM chambre ORDER BY id` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});
 /**
 * Route to get piechart_etatsdesunits records
 * @GET /components_data/piechart_etatsdesunits
 */
 router.get('/piechart_etatsdesunits', async (req, res) => {
    let chartData = { labels: [], datasets: [] };
    try {
        let sqltext = `SELECT COUNT(unitelocationdetails.id) AS count_of_id, etat_unite.etat FROM etat_unite JOIN unitelocationdetails ON etat_unite.id_unitelocation=unitelocationdetails.id WHERE (etat_unite.dt_fin_etat ="0000-00-00" ) OR (etat_unite.dt_fin_etat is NULL ) GROUP BY etat_unite.etat;`;

        let records = await DB.rawQueryList(sqltext);
        chartData['labels'] = records.map(function(v) { return v.etat });

        let backgroundColors = records.map(function(_, index) {
            return utils.randomColor(); 
        });

        let dataset1 = {
            data: records.map(function(v) { return parseFloat(v.count_of_id) }),
            label: "Nombre",
            backgroundColor: backgroundColors,
            borderColor: backgroundColors, 
            borderWidth: "2",
        };

        chartData.datasets.push(dataset1);
        return res.ok(chartData);
    } catch (err) {
        return res.serverError(err);
    }
});

router.get('/occupancy_rate', async (req, res) => {
    
	let chartData = { labels:[], datasets:[] };
	try{
		let sqltext = `SELECT 
        r.id AS residence_id,
        r.denomination AS residence_name,
        COUNT(ul.id) AS total_units,
        SUM(CASE WHEN e.etat = 'Affectée' THEN 1 ELSE 0 END) AS occupied_units
    FROM 
        residence r
    JOIN 
        unitelocationdetails ul ON ul.id_residence = r.id
    LEFT JOIN 
        etat_unite e ON e.id_unitelocation = ul.id AND (e.dt_fin_etat = "0000-00-00" OR e.dt_fin_etat IS NULL)
    GROUP BY 
        r.id;` ;
		
		let records = await DB.rawQueryList(sqltext);
		chartData['labels'] = records.map(function(v){ return v.residence_name });
		let dataset1 = {
			data: records.map(function(v){ return parseFloat(v.total_units) }),
			label: "Nombre d'unités",
			backgroundColor: utils.randomColor(), 
			//borderColor: utils.randomColor(), 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset1);
		let dataset2 = {
			data: records.map(function(v){ return parseFloat(v.occupied_units) }),
			label: "Unités affectées",
			backgroundColor: utils.randomColor(), 
			//borderColor: utils.randomColor(), 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset2);
		return res.ok(chartData) ;
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
