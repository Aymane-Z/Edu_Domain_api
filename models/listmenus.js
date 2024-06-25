
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Listmenus extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				id_user: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "listmenus",
				modelName: "listmenus",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static viewFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static editFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static personnelFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportPersonnelFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static patrimoineFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportPatrimoineFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static clientsFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportClientsFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static dossierslocationFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportDossierslocationFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static gestionreclamationsFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportGestionreclamationsFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static demandeslogementFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportDemandeslogementFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static espaceclientFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportEspaceclientFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static gestioncompteursFields() {
		return [
			'id', 
			'id_user'
		];
	}

	static exportGestioncompteursFields() {
		return [
			'id', 
			'id_user'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Listmenus.init();
export default Listmenus;
