
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Permissionsnode extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				permission: { type:Sequelize.STRING   },
				page_name: { type:Sequelize.STRING   },
				action_name: { type:Sequelize.STRING   },
				role_id: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "permissionsnode",
				modelName: "permissionsnode",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'role_id', 
			'permission', 
			'page_name', 
			'action_name', 
			'id'
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'role_id', 
			'permission', 
			'page_name', 
			'action_name', 
			'id'
		];
	}

	static viewFields() {
		return [
			'permission', 
			'page_name', 
			'action_name', 
			'role_id', 
			'id'
		];
	}

	static exportViewFields() {
		return [
			'permission', 
			'page_name', 
			'action_name', 
			'role_id', 
			'id'
		];
	}

	static editFields() {
		return [
			'role_id', 
			'page_name', 
			'action_name', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("permission LIKE :search"), 
			Sequelize.literal("page_name LIKE :search"), 
			Sequelize.literal("action_name LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Permissionsnode.init();
export default Permissionsnode;
