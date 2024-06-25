
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Pavillondetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_niveaux: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				nombre_entrees: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_mise_service: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_batiment: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				b_denomination: { type:Sequelize.STRING   },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				r_denomination: { type:Sequelize.STRING   },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				p_denomination: { type:Sequelize.STRING   },
				nom_prenom: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "pavillondetails",
				modelName: "pavillondetails",
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
			'nombre_niveaux', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_batiment', 
			Sequelize.literal('B_denomination AS b_denomination'), 
			'id_residence', 
			Sequelize.literal('R_denomination AS r_denomination'), 
			'id_responsable', 
			'id_proprietaire', 
			Sequelize.literal('P_denomination AS p_denomination'), 
			'nom_prenom'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_niveaux', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_batiment', 
			Sequelize.literal('B_denomination AS b_denomination'), 
			'id_residence', 
			Sequelize.literal('R_denomination AS r_denomination'), 
			'id_responsable', 
			'id_proprietaire', 
			Sequelize.literal('P_denomination AS p_denomination'), 
			'nom_prenom'
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
			Sequelize.literal("B_denomination LIKE :search"), 
			Sequelize.literal("R_denomination LIKE :search"), 
			Sequelize.literal("P_denomination LIKE :search"), 
			Sequelize.literal("nom_prenom LIKE :search"),
		];
	}

	
	
}
Pavillondetails.init();
export default Pavillondetails;
