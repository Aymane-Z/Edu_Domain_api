
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Utilisateurs extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				username: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				password: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				email: { type:Sequelize.STRING   },
				photo: { type:Sequelize.STRING   },
				user_role_id: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "utilisateurs",
				modelName: "utilisateurs",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id'
		];
	}

	static editFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("username LIKE :search"), 
			Sequelize.literal("email LIKE :search"), 
			Sequelize.literal("user_role_id LIKE :search"), 
			Sequelize.literal("password LIKE :search"),
		];
	}

	
	
}
Utilisateurs.init();
export default Utilisateurs;
