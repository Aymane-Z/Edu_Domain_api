
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Garant extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				denomination: { type:Sequelize.STRING   },
				gerant: { type:Sequelize.STRING   },
				cin: { type:Sequelize.STRING   },
				adresse: { type:Sequelize.STRING   },
				rc: { type:Sequelize.STRING   },
				patente: { type:Sequelize.STRING   },
				tel1: { type:Sequelize.STRING   },
				tel2: { type:Sequelize.STRING   },
				tel3: { type:Sequelize.STRING   },
				mail: { type:Sequelize.STRING   },
				compte_bancaire: { type:Sequelize.STRING   },
				profession: { type:Sequelize.STRING   },
				revenus_mensuels: { type:Sequelize.STRING   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "garant",
				modelName: "garant",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'cin', 
			'adresse', 
			'rc', 
			'patente', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'compte_bancaire', 
			'profession', 
			'revenus_mensuels', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'cin', 
			'adresse', 
			'rc', 
			'patente', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'compte_bancaire', 
			'profession', 
			'revenus_mensuels', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'cin', 
			'adresse', 
			'rc', 
			'patente', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'compte_bancaire', 
			'profession', 
			'revenus_mensuels', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'gerant', 
			'cin', 
			'adresse', 
			'rc', 
			'patente', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'compte_bancaire', 
			'profession', 
			'revenus_mensuels', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'code', 
			'denomination', 
			'gerant', 
			'cin', 
			'adresse', 
			'rc', 
			'patente', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'compte_bancaire', 
			'profession', 
			'revenus_mensuels', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("gerant LIKE :search"), 
			Sequelize.literal("cin LIKE :search"), 
			Sequelize.literal("adresse LIKE :search"), 
			Sequelize.literal("rc LIKE :search"), 
			Sequelize.literal("patente LIKE :search"), 
			Sequelize.literal("tel1 LIKE :search"), 
			Sequelize.literal("tel2 LIKE :search"), 
			Sequelize.literal("tel3 LIKE :search"), 
			Sequelize.literal("mail LIKE :search"), 
			Sequelize.literal("compte_bancaire LIKE :search"), 
			Sequelize.literal("profession LIKE :search"), 
			Sequelize.literal("revenus_mensuels LIKE :search"),
		];
	}

	
	
}
Garant.init();
export default Garant;
