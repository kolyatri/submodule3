
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";


export class FreelottoAuth {
  //private currentToken:any;
  private myCache:any;
  private manager:any;

  contructor(){      
  }
 
  public init(cache:any, manager:any){
    this.myCache = cache;
    this.manager = manager;
  }

  public verifyUserToken = async (token:string) => {    
    let user =  this.myCache.get(token); 
    
    if ( user == undefined ){  
     
      let users = await this.manager
        .query(
          "select * from freelotto.user_token where token = $1",[token]
        );     

      if(users.length > 0){          
        let user = users[0];
        let expiredTimestamp = new Date(user.expired_timestamp).getTime();
        let currentTimestamp = new Date().getTime();

        if(expiredTimestamp > currentTimestamp){
          //console.log("found in DB and inserted into cache");
          let ttl = Math.floor((expiredTimestamp - currentTimestamp)/1000);      

          let obj = { id: user.userid, type: "user"};
          this.myCache.set( token, obj, ttl );

          return {id: user.userid};
        }
        else{
          //console.log("expired");
          return false;
        }               
      }
      else{
        //console.log("no token in DB");
        return false;
      }
    }    
    else{      
      if(user.type != "user") 
        return false;

      else 
        return {id: user.userid};
    }

  }

  public verifyAdminToken = async (token:string) => {    
    let admin =  this.myCache.get(token); 
    
    if ( admin == undefined ){  
     
      let admins = await this.manager
      .query(
        "select * from freelotto.admin_token where token = $1",[token]
      );     

      if(admins.length > 0){          
        let admin = admins[0];
        let expiredTimestamp = new Date(admin.expired_timestamp).getTime();
        let currentTimestamp = new Date().getTime();

        if(expiredTimestamp > currentTimestamp){
          //console.log("found in DB and inserted into cache");
          let ttl = Math.floor((expiredTimestamp - currentTimestamp)/1000);      

          let obj = { id: admin.userid, type: "admin"};
          this.myCache.set( token, obj, ttl );

          return {id: admin.userid};
        }
        else{
          //console.log("expired");
          return false;
        }               
      }
      else{
        //console.log("no token in DB");
        return false;
      }
    }    
    else{      
      if(admin.type != "admin") 
        return false;

      else 
        return {id: admin.userid};
    }

  }

}

