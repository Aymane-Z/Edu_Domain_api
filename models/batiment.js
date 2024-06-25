
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Batiment extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_niveaux: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				nombre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "batiment",
				modelName: "batiment",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('batiment.code AS code'), 
			Sequelize.literal('batiment.type AS type'), 
			Sequelize.literal('batiment.denomination AS denomination'), 
			Sequelize.literal('batiment.description AS description'), 
			Sequelize.literal('batiment.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('batiment.nombre AS nombre'), 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			Sequelize.literal('batiment.id_residence AS id_residence'), 
			Sequelize.literal('batiment.id AS id')
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('batiment.code AS code'), 
			Sequelize.literal('batiment.type AS type'), 
			Sequelize.literal('batiment.denomination AS denomination'), 
			Sequelize.literal('batiment.description AS description'), 
			Sequelize.literal('batiment.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('batiment.nombre AS nombre'), 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			Sequelize.literal('batiment.id_residence AS id_residence'), 
			Sequelize.literal('batiment.id AS id')
		];
	}

	static viewFields() {
		return [
			Sequelize.literal('batiment.code AS code'), 
			Sequelize.literal('batiment.type AS type'), 
			Sequelize.literal('batiment.denomination AS denomination'), 
			Sequelize.literal('batiment.description AS description'), 
			Sequelize.literal('batiment.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('batiment.nombre AS nombre'), 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			Sequelize.literal('batiment.id_residence AS id_residence'), 
			Sequelize.literal('batiment.id AS id')
		];
	}

	static exportViewFields() {
		return [
			Sequelize.literal('batiment.code AS code'), 
			Sequelize.literal('batiment.type AS type'), 
			Sequelize.literal('batiment.denomination AS denomination'), 
			Sequelize.literal('batiment.description AS description'), 
			Sequelize.literal('batiment.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('batiment.nombre AS nombre'), 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			Sequelize.literal('batiment.id_residence AS id_residence'), 
			Sequelize.literal('batiment.id AS id')
		];
	}

	static editFields() {
		return [
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_niveaux', 
			'nombre', 
			'id_residence', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("batiment.code LIKE :search"), 
			Sequelize.literal("batiment.type LIKE :search"), 
			Sequelize.literal("batiment.denomination LIKE :search"), 
			Sequelize.literal("batiment.description LIKE :search"), 
			Sequelize.literal("batimentdetails.id LIKE :search"), 
			Sequelize.literal("batimentdetails.code LIKE :search"), 
			Sequelize.literal("batimentdetails.type LIKE :search"), 
			Sequelize.literal("batimentdetails.denomination LIKE :search"), 
			Sequelize.literal("batimentdetails.description LIKE :search"), 
			Sequelize.literal("batimentdetails.Res_denomination LIKE :search"), 
			Sequelize.literal("batimentdetails.nom_prenom LIKE :search"), 
			Sequelize.literal("batimentdetails.Prop_denomination LIKE :search"), 
			Sequelize.literal("batiment.id LIKE :search"),
		];
	}

	
	
}
Batiment.init();
export default Batiment;
