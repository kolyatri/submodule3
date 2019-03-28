
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";


export class FreelottoAuth {
  private myCache:any;
  private manager:any;

  contructor(){      
  }
 
  public init(cache:any, manager:any){
    this.myCache = cache;
    this.manager = manager;
    
    return this;
  }

  public verifyUserToken = async (token?:string) => {
    if(!token)
      throw new Error("token not verified");    
    
    let userToken =  this.myCache.get(token); 
    //let userToken =  undefined; 
    
    if ( userToken == undefined ){  
     
      let userTokens = await this.manager
        .query(
          "select * from freelotto.user_token where token = $1",[token]
        );     

      if(userTokens.length > 0){          
        userToken = userTokens[0];
        let expiredTimestamp = new Date(userToken.expired_timestamp).getTime();
        let currentTimestamp = new Date().getTime();

        if(expiredTimestamp > currentTimestamp){
          //console.log("found in DB and inserted into cache");
          let ttl = Math.floor((expiredTimestamp - currentTimestamp)/1000);      

          let obj = { id: userToken.user_id, type: "user"};
          this.myCache.set( token, obj, ttl );
          //console.log("found in DB");
          return {id: userToken.user_id};
        }
        else{
          //console.log("expired");
          //return false;
          throw new Error("token not verified");        
        }               
      }
      else{
        //console.log("no token in DB");
        //return false;
        throw new Error("token not verified");    
    
      }
    }    
    else{      
      if(userToken.type != "user"){ 
        //return false;
        throw new Error("token not verified");
      }
      else {
        //console.log("found in cache");
        return {id: userToken.id};
      }
    }

  }

  public verifyAdminToken = async (token?:string) => {    
    if(!token)
      throw new Error("token not verified");        

    let adminToken =  this.myCache.get(token); 
    //let adminToken = undefined;

    if ( adminToken == undefined ){  
     
      let adminTokens = await this.manager
        .query(
          "select * from freelotto.admin_token where token = $1",[token]
        );     

      if(adminTokens.length > 0){          
        adminToken = adminTokens[0];
        let expiredTimestamp = new Date(adminToken.expired_timestamp).getTime();
        let currentTimestamp = new Date().getTime();

        if(expiredTimestamp > currentTimestamp){
          //console.log("found in DB and inserted into cache");
          let ttl = Math.floor((expiredTimestamp - currentTimestamp)/1000);      

          let obj = { id: adminToken.admin_id, type: "admin"};
          this.myCache.set( token, obj, ttl );

          //console.log("found in DB, token valid");
          //console.log(admin);
          return {id: adminToken.admin_id};
        }
        else{
          //console.log("expired");
          throw new Error("token not verified");    
          //return false;
        }               
      }
      else{
        //console.log("no token in DB");
        //return false;
        throw new Error("token not verified");    
      }
    }    
    else{      
      if(adminToken.type != "admin") {
        //return false;
        throw new Error("token not verified");    
      }
      else {
        //console.log("found admin in cache");
        return {id: adminToken.id};
      }
    }

  }

}

