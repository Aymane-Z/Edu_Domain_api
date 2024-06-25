
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Facturation extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				dt_facturation: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   },
				user_id: { type:Sequelize.INTEGER   }
			}, 
			{ 
				sequelize,
				
				tableName: "facturation",
				modelName: "facturation",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'dt_facturation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'user_id'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'dt_facturation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'user_id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'dt_facturation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'user_id'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'dt_facturation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'user_id'
		];
	}

	static editFields() {
		return [
			'dt_facturation', 
			'id_client', 
			'id_unite_location', 
			'id', 
			'user_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Facturation.init();
export default Facturation;
