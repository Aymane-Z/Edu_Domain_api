
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class EtatUnite extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				etat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				description: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				dt_debut_etat: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_fin_etat: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				ouvert_location: { type:Sequelize.STRING   },
				id_unitelocation: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "etat_unite",
				modelName: "etat_unite",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unitelocation', 
			'etat', 
			'description', 
			'observation', 
			'dt_debut_etat', 
			'dt_fin_etat', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unitelocation', 
			'etat', 
			'description', 
			'observation', 
			'dt_debut_etat', 
			'dt_fin_etat', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static viewFields() {
		return [
			'etat', 
			'description', 
			'observation', 
			'dt_debut_etat', 
			'dt_fin_etat', 
			'id_unitelocation', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static exportViewFields() {
		return [
			'etat', 
			'description', 
			'observation', 
			'dt_debut_etat', 
			'dt_fin_etat', 
			'id_unitelocation', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static editFields() {
		return [
			'id_unitelocation', 
			'etat', 
			'description', 
			'observation', 
			'dt_debut_etat', 
			'dt_fin_etat', 
			'ouvert_location', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("etat LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("ouvert_location LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
EtatUnite.init();
export default EtatUnite;
