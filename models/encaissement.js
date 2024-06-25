
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Encaissement extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				date: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				montant: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				observation: { type:Sequelize.STRING   },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_facture: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   },
				status: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "encaissement",
				modelName: "encaissement",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'status', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'status', 
			'id'
		];
	}

	static viewFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'id', 
			'status'
		];
	}
	static lastFields() {
		return [
			'date', 
			'montant', 
			'observation',
			'id_client', 
			'user_id', 
			'id_facture', 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'id', 
			'status'
		];
	}

	static exportViewFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'id', 
			'status'
		];
	}

	static editFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			'id_client', 
			'user_id', 
			'id_facture', 
			'id_unite_location', 
			'id', 
			'status'
		];
	}

	static paiementFields() {
		return [
			'date', 
			'montant', 
			'observation', 
			'id_client', 
			'user_id', 
			'id_facture', 
			'id_unite_location', 
			'id', 
			'status'
		];
	}

	static fraisreservationFields() {
		return [
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id'), 
			Sequelize.literal('encaissement.status AS status')
		];
	}

	static exportFraisreservationFields() {
		return [
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id'), 
			Sequelize.literal('encaissement.status AS status')
		];
	}

	static externesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	static exportExternesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	static nonvalidesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	static exportNonvalidesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	static validesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	static exportValidesFields() {
		return [
			Sequelize.literal('encaissement.status AS status'), 
			Sequelize.literal("encaissementdetails.recu AS encaissementdetails_recu"), 
			Sequelize.literal('encaissement.montant AS montant'), 
			Sequelize.literal('encaissement.observation AS observation'), 
			Sequelize.literal('encaissement.id_client AS id_client'), 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			Sequelize.literal('encaissement.user_id AS user_id'), 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			Sequelize.literal('encaissement.id_facture AS id_facture'), 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			Sequelize.literal('encaissement.id_unite_location AS id_unite_location'), 
			Sequelize.literal("encaissementdetails.banque AS encaissementdetails_banque"), 
			Sequelize.literal("encaissementdetails.reference AS encaissementdetails_reference"), 
			Sequelize.literal("encaissementdetails.nom AS encaissementdetails_nom"), 
			Sequelize.literal("encaissementdetails.prenom AS encaissementdetails_prenom"), 
			Sequelize.literal('encaissement.date AS date'), 
			Sequelize.literal('encaissement.date_updated AS date_updated'), 
			Sequelize.literal('encaissement.date_created AS date_created'), 
			Sequelize.literal('encaissement.id AS id')
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Encaissement.init();
export default Encaissement;
