
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";
import { AnyTxtRecord } from "dns";


export const Greeter = async (manager: any) => { 
  let users = await manager.query("select * from freelotto.users limit 1");
  console.log(users);  
};

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

          return true;
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
       return true;
    }

  }
}

