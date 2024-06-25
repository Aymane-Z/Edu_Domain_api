
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Chambredetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				id_couloir: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_pavillon: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_batiment: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "chambredetails",
				modelName: "chambredetails",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'type', 
			'description', 
			'observation', 
			'id_couloir', 
			'id_pavillon', 
			'id_batiment', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'type', 
			'description', 
			'observation', 
			'id_couloir', 
			'id_pavillon', 
			'id_batiment', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire'
		];
	}

	static exportViewFields() {
		return [
			
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("observation LIKE :search"),
		];
	}

	
	
}
Chambredetails.init();
export default Chambredetails;
