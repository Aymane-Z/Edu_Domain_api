
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class FamilleEquipement extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING   },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "famille_equipement",
				modelName: "famille_equipement",
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'observation', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'observation', 
			'id'
		];
	}

	static viewFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'observation', 
			'id'
		];
	}

	static exportViewFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'observation', 
			'id'
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'observation', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
FamilleEquipement.init();
export default FamilleEquipement;
