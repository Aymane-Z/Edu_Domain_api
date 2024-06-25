
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class FamilleUnite extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING   },
				designation: { type:Sequelize.STRING   },
				type: { type:Sequelize.STRING   },
				prix: { type:Sequelize.DOUBLE   },
				photo: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "famille_unite",
				modelName: "famille_unite",
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'prix', 
			'photo', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'prix', 
			'photo', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'prix', 
			'photo'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'prix', 
			'photo'
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'prix', 
			'photo', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
FamilleUnite.init();
export default FamilleUnite;
