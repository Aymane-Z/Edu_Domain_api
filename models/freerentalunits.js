
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Freerentalunits extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				typeunit: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				description: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				etat_physique: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				observation: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				etat: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_typech: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				prix: { type:Sequelize.DOUBLE  ,defaultValue: Sequelize.literal('DEFAULT') },
				photo: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				categoriechambre: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "freerentalunits",
				modelName: "freerentalunits",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'typeunit', 
			'description', 
			'etat_physique', 
			'observation', 
			'etat', 
			'type', 
			'prix', 
			'photo', 
			'categoriechambre'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'typeunit', 
			'description', 
			'etat_physique', 
			'observation', 
			'etat', 
			'type', 
			'prix', 
			'photo', 
			'categoriechambre'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("typeunit LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("etat_physique LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("etat LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("categoriechambre LIKE :search"),
		];
	}

	
	
}
Freerentalunits.init();
export default Freerentalunits;
