
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Proprietaire extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				denomination: { type:Sequelize.STRING   },
				gerant: { type:Sequelize.STRING   },
				rc: { type:Sequelize.STRING   },
				patente: { type:Sequelize.STRING   },
				adresse: { type:Sequelize.STRING   },
				tel1: { type:Sequelize.STRING   },
				tel2: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "proprietaire",
				modelName: "proprietaire",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'rc', 
			'patente', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'rc', 
			'patente', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'rc', 
			'patente', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'rc', 
			'patente', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static editFields() {
		return [
			'code', 
			'denomination', 
			'gerant', 
			'rc', 
			'patente', 
			'adresse', 
			'tel1', 
			'tel2', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("gerant LIKE :search"), 
			Sequelize.literal("rc LIKE :search"), 
			Sequelize.literal("patente LIKE :search"), 
			Sequelize.literal("adresse LIKE :search"), 
			Sequelize.literal("tel1 LIKE :search"), 
			Sequelize.literal("tel2 LIKE :search"),
		];
	}

	
	
}
Proprietaire.init();
export default Proprietaire;
