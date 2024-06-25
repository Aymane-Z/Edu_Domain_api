
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Facture extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_facture: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "facture",
				modelName: "facture",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'dt_facture', 
			'id_client',
			'id_unite_location',
			'user_id',
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'dt_facture', 
			'id_client',
			'id_unite_location',
			'user_id',
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'dt_facture', 
			'id_client',
			'id_unite_location',
			'user_id', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'dt_facture', 
			'id_client',
			'id_unite_location',
			'user_id', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'code', 
			'dt_facture', 
			'id_client',
			'id_unite_location',
			'user_id', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Facture.init();
export default Facture;
