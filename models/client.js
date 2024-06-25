
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Client extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				nom_prenom: { type:Sequelize.STRING   },
				cin: { type:Sequelize.STRING   },
				date_naissance: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				lieu_naissance: { type:Sequelize.STRING   },
				situation_familiale: { type:Sequelize.STRING   },
				adresse: { type:Sequelize.STRING   },
				tel1: { type:Sequelize.STRING   },
				tel2: { type:Sequelize.STRING   },
				tel3: { type:Sequelize.STRING   },
				mail: { type:Sequelize.STRING   },
				etablissement: { type:Sequelize.STRING   },
				cycle_etudes: { type:Sequelize.STRING   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "client",
				modelName: "client",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'date_naissance', 
			'lieu_naissance', 
			'situation_familiale', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'etablissement', 
			'cycle_etudes', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'date_naissance', 
			'lieu_naissance', 
			'situation_familiale', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'etablissement', 
			'cycle_etudes', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'date_naissance', 
			'lieu_naissance', 
			'situation_familiale', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'etablissement', 
			'cycle_etudes', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'date_naissance', 
			'lieu_naissance', 
			'situation_familiale', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'etablissement', 
			'cycle_etudes', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'code', 
			'nom_prenom', 
			'cin', 
			'date_naissance', 
			'lieu_naissance', 
			'situation_familiale', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'mail', 
			'etablissement', 
			'cycle_etudes', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("nom_prenom LIKE :search"), 
			Sequelize.literal("cin LIKE :search"), 
			Sequelize.literal("lieu_naissance LIKE :search"), 
			Sequelize.literal("situation_familiale LIKE :search"), 
			Sequelize.literal("adresse LIKE :search"), 
			Sequelize.literal("tel1 LIKE :search"), 
			Sequelize.literal("tel2 LIKE :search"), 
			Sequelize.literal("tel3 LIKE :search"), 
			Sequelize.literal("mail LIKE :search"), 
			Sequelize.literal("etablissement LIKE :search"), 
			Sequelize.literal("cycle_etudes LIKE :search"),
		];
	}

	
	
}
Client.init();
export default Client;
