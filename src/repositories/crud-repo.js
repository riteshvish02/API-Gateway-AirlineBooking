const {Logger} = require("../config")
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data){
       try {
        const response = await this.model.create(data);
        return response;
       } catch (error) {
        Logger.error("something went wrong in crud Repo:create")
        throw error;
       }
    }

    async destroy(data){
        try {
         const response = await this.model.destroy({
            where:{
                id:data
            }
         });
         if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
         return response;
        } catch (error) {
         Logger.error("something went wrong in crud Repo:destroy")
         throw error;
        }
     }

     async get(data){
        try {
         const response = await this.model.findByPk(data);
         if(!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
         }
         return response;
        } catch (error) {
         Logger.error("something went wrong in crud Repo:get")
         throw error;
        }
     }

     async getAll(data){
        try {
         const response = await this.model.findAll();
         return response;
        } catch (error) {
         Logger.error("something went wrong in crud Repo:get")
         throw error;
        }
     }

     async update(id,data){
        try {
         const response = await this.model.update(data,{
            where:{
                id:id
            }
         });
         return response;
        } catch (error) {
         Logger.error("something went wrong in crud Repo:update")
         throw error;
        }
     }
}
module.exports = CrudRepository;