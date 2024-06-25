
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Usersnode extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				username: { type:Sequelize.STRING   },
				password: { type:Sequelize.STRING   },
				email: { type:Sequelize.STRING   },
				photo: { type:Sequelize.STRING   },
				user_role_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   },
				civilite: { type:Sequelize.STRING   },
				nom: { type:Sequelize.STRING   },
				prenom: { type:Sequelize.STRING   },
				cin: { type:Sequelize.STRING   },
				nationalite: { type:Sequelize.STRING   },
				telephone: { type:Sequelize.STRING   },
				email_verified_at: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "usersnode",
				modelName: "usersnode",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'username', 
			'email', 
			'photo', 
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'user_role_id', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'date_created', 
			'date_updated', 
			'email_verified_at', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'username', 
			'email', 
			'photo', 
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'user_role_id', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'date_created', 
			'date_updated', 
			'email_verified_at', 
			'id'
		];
	}

	static viewFields() {
		return [
			'username', 
			'email', 
			'photo', 
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'user_role_id', 
			'date_created', 
			'date_updated', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'email_verified_at', 
			'id'
		];
	}

	static exportViewFields() {
		return [
			'username', 
			'email', 
			'photo', 
			Sequelize.literal('`roles`.`role_name` AS `roles_role_name`'), 
			'user_role_id', 
			'date_created', 
			'date_updated', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'email_verified_at', 
			'id'
		];
	}

	static accounteditFields() {
		return [
			'username', 
			'photo', 
			'user_role_id', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'id'
		];
	}

	static accountviewFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id', 
			'date_created', 
			'date_updated', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'email_verified_at'
		];
	}

	static exportAccountviewFields() {
		return [
			'id', 
			'username', 
			'email', 
			'photo', 
			'user_role_id', 
			'date_created', 
			'date_updated', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone', 
			'email_verified_at'
		];
	}

	static editFields() {
		return [
			'id', 
			'username', 
			'photo', 
			'user_role_id', 
			'civilite', 
			'nom', 
			'prenom', 
			'cin', 
			'nationalite', 
			'telephone'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("username LIKE :search"), 
			Sequelize.literal("email LIKE :search"), 
			Sequelize.literal("civilite LIKE :search"), 
			Sequelize.literal("nom LIKE :search"), 
			Sequelize.literal("prenom LIKE :search"), 
			Sequelize.literal("cin LIKE :search"), 
			Sequelize.literal("nationalite LIKE :search"), 
			Sequelize.literal("telephone LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	hasVerifiedEmail(){
		if(this.email_verified_at){
			return true
		}
		return false;
	}
	markEmailAsVerified(){
		this.email_verified_at = new Date();
	}
	
}
Usersnode.init();
export default Usersnode;
