
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Equipement extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING   },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				dt_acquisition: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				valeur: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				etat_physique: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				id_famille_equipement: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "equipement",
				modelName: "equipement",
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'dt_acquisition', 
			'valeur', 
			'etat_physique', 
			'observation', 
			Sequelize.literal('`famille_equipement`.`code` AS `familleequipement_code`'), 
			'id_famille_equipement', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'dt_acquisition', 
			'valeur', 
			'etat_physique', 
			'observation', 
			Sequelize.literal('`famille_equipement`.`code` AS `familleequipement_code`'), 
			'id_famille_equipement', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'description', 
			'dt_acquisition', 
			'valeur', 
			'etat_physique', 
			'observation', 
			Sequelize.literal('`famille_equipement`.`code` AS `familleequipement_code`'), 
			'id_famille_equipement', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'description', 
			'dt_acquisition', 
			'valeur', 
			'etat_physique', 
			'observation', 
			Sequelize.literal('`famille_equipement`.`code` AS `familleequipement_code`'), 
			'id_famille_equipement', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location'
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'dt_acquisition', 
			'valeur', 
			'etat_physique', 
			'observation', 
			'id_famille_equipement', 
			'id_unite_location', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("etat_physique LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Equipement.init();
export default Equipement;
