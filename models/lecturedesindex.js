
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class LectureDesIndex extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				date: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				mois_consommation: { type:Sequelize.STRING   },
				index_eau_froid: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				index_eau_chaud: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				index_electricite: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				observation: { type:Sequelize.STRING   },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "lecture_des_index",
				modelName: "lecture_des_index",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'mois_consommation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date', 
			'index_eau_froid', 
			'index_eau_chaud', 
			'index_electricite', 
			'observation', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'mois_consommation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date', 
			'index_eau_froid', 
			'index_eau_chaud', 
			'index_electricite', 
			'observation', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'mois_consommation', 
			'index_eau_froid', 
			'index_eau_chaud', 
			'index_electricite', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'mois_consommation', 
			'index_eau_froid', 
			'index_eau_chaud', 
			'index_electricite', 
			'observation', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'mois_consommation', 
			'index_eau_froid', 
			'index_eau_chaud', 
			'index_electricite', 
			'observation', 
			'id_client', 
			'id_unite_location', 
			'date', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("mois_consommation LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
LectureDesIndex.init();
export default LectureDesIndex;
