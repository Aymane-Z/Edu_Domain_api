
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Couloirdetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_entrees: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_mise_service: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_pavillon: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_batiment: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "couloirdetails",
				modelName: "couloirdetails",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_pavillon', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire', 
			'id_batiment'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_pavillon', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire', 
			'id_batiment'
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
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("description LIKE :search"),
		];
	}

	
	
}
Couloirdetails.init();
export default Couloirdetails;
