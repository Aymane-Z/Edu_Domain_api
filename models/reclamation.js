
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Reclamation extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_dossierlocation: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				status: { type:Sequelize.STRING   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   },
				date_resolue: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "reclamation",
				modelName: "reclamation",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'type', 
			'description', 
			'status', 
			'date_created', 
			'date_updated', 
			'date_resolue'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'type', 
			'description', 
			'status', 
			'date_created', 
			'date_updated', 
			'date_resolue'
		];
	}

	static editFields() {
		return [
			'id_client', 
			'id_unite_location', 
			'id_dossierlocation', 
			'user_id', 
			'type', 
			'description', 
			'status', 
			'date_resolue', 
			'id'
		];
	}

	static traitementFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	static exportTraitementFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	static resolueFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	static exportResolueFields() {
		return [
			'status', 
			'type', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id_dossierlocation', 
			Sequelize.literal('`usersnode`.`email` AS `usersnode_email`'), 
			'user_id', 
			'description', 
			'date_created', 
			'date_updated', 
			'date_resolue', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("status LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Reclamation.init();
export default Reclamation;
